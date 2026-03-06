// Real multi-head attention math — no faking.
// Deterministic (seeded PRNG) so the same tokens always produce the same patterns.
// Each head gets its own independent seed → genuinely different attention patterns.

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return h
}

// ---------------------------------------------------------------------------
// Embeddings — rich enough that different tokens are genuinely distinguishable
// ---------------------------------------------------------------------------

function tokenEmbedding(text: string, dim: number): number[] {
  const lower = text.toLowerCase()
  const base = hashString(lower)
  const rng = mulberry32(base)
  const out = new Array(dim)

  // Fill every dimension from the hash-seeded PRNG
  for (let i = 0; i < dim; i++) out[i] = (rng() - 0.5) * 2

  // Overlay character-level structure so similar words share features
  for (let c = 0; c < lower.length; c++) {
    const code = lower.charCodeAt(c) - 96
    for (let d = 0; d < dim; d++) {
      out[d] += 0.3 * Math.sin(code * (d + 1) * 0.7)
    }
  }

  // Length feature
  out[0] += text.length * 0.15

  return out
}

function positionalEncoding(pos: number, dim: number): number[] {
  const pe = new Array(dim)
  for (let i = 0; i < dim; i++) {
    const freq = 1 / Math.pow(10000, Math.floor(i / 2) * 2 / dim)
    pe[i] = i % 2 === 0 ? Math.sin(pos * freq) : Math.cos(pos * freq)
  }
  return pe
}

export function computeEmbeddings(texts: string[], dim: number = 32): number[][] {
  return texts.map((t, pos) => {
    const tok = tokenEmbedding(t, dim)
    const pe = positionalEncoding(pos, dim)
    return tok.map((v, i) => v + pe[i])
  })
}

// ---------------------------------------------------------------------------
// Linear algebra helpers
// ---------------------------------------------------------------------------

function randomMatrix(rows: number, cols: number, rng: () => number, scale: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (rng() - 0.5) * 2 * scale),
  )
}

function matMul(a: number[][], b: number[][]): number[][] {
  const n = a.length
  const d = b.length
  const m = b[0].length
  const out: number[][] = Array.from({ length: n }, () => new Array(m).fill(0))
  for (let i = 0; i < n; i++)
    for (let k = 0; k < d; k++) {
      const aik = a[i][k]
      for (let j = 0; j < m; j++) out[i][j] += aik * b[k][j]
    }
  return out
}

function transpose(m: number[][]): number[][] {
  const r = m.length
  const c = m[0].length
  const out: number[][] = Array.from({ length: c }, () => new Array(r))
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) out[j][i] = m[i][j]
  return out
}

function softmaxRows(mat: number[][]): number[][] {
  return mat.map((row) => {
    const max = Math.max(...row)
    const exps = row.map((v) => Math.exp(v - max))
    const sum = exps.reduce((a, b) => a + b, 0)
    return exps.map((v) => v / sum)
  })
}

// ---------------------------------------------------------------------------
// Scaled dot-product attention
// ---------------------------------------------------------------------------

function scaledDotProduct(
  Q: number[][],
  K: number[][],
  V: number[][],
  causal: boolean,
): { weights: number[][]; output: number[][] } {
  const dk = Q[0].length
  const seq = Q.length
  const scores = matMul(Q, transpose(K))
  const scale = Math.sqrt(dk)

  for (let i = 0; i < seq; i++)
    for (let j = 0; j < seq; j++) {
      scores[i][j] /= scale
      if (causal && j > i) scores[i][j] = -1e9
    }

  const weights = softmaxRows(scores)
  const output = matMul(weights, V)
  return { weights, output }
}

// ---------------------------------------------------------------------------
// Multi-head attention (single layer)
// Each head gets a completely independent seed so patterns genuinely differ.
// ---------------------------------------------------------------------------

export interface LayerResult {
  headWeights: number[][][]
  avgWeights: number[][]
  output: number[][]
}

// Large primes to separate head seeds maximally
const HEAD_PRIMES = [7919, 6271, 4973, 3571, 2753, 1987, 1523, 1109]

export function multiHeadAttention(
  input: number[][],
  layerIndex: number,
  numHeads: number = 4,
  causal: boolean = true,
): LayerResult {
  const dModel = input[0].length
  const dk = Math.floor(dModel / numHeads)
  const seq = input.length

  // Q/K scale high → sharp attention; V scale moderate → stable values
  const qkScale = 1.2
  const vScale = 0.4

  const allW: number[][][] = []
  const allOut: number[][][] = []

  for (let h = 0; h < numHeads; h++) {
    // Independent seed per head per layer
    const headSeed = 42 + layerIndex * 104729 + HEAD_PRIMES[h % HEAD_PRIMES.length]
    const rng = mulberry32(headSeed)

    const Wq = randomMatrix(dModel, dk, rng, qkScale)
    const Wk = randomMatrix(dModel, dk, rng, qkScale)
    const Wv = randomMatrix(dModel, dk, rng, vScale)

    const { weights, output } = scaledDotProduct(
      matMul(input, Wq),
      matMul(input, Wk),
      matMul(input, Wv),
      causal,
    )
    allW.push(weights)
    allOut.push(output)
  }

  const concat: number[][] = Array.from({ length: seq }, (_, i) =>
    allOut.flatMap((o) => o[i]),
  )

  const outRng = mulberry32(99991 + layerIndex * 6577)
  const Wo = randomMatrix(dk * numHeads, dModel, outRng, 0.3)
  const projected = matMul(concat, Wo)

  // Residual connection
  const output = projected.map((row, i) => row.map((v, j) => v + input[i][j]))

  const avgWeights: number[][] = Array.from({ length: seq }, (_, i) =>
    Array.from({ length: seq }, (_, j) => {
      let s = 0
      for (let h = 0; h < numHeads; h++) s += allW[h][i][j]
      return s / numHeads
    }),
  )

  return { headWeights: allW, avgWeights, output }
}

// ---------------------------------------------------------------------------
// Full forward pass (all layers)
// ---------------------------------------------------------------------------

export interface FullAttentionResult {
  layers: LayerResult[]
  embeddings: number[][]
}

export function computeFullAttention(
  tokenTexts: string[],
  numLayers: number = 3,
  numHeads: number = 4,
  dim: number = 32,
  causal: boolean = true,
): FullAttentionResult {
  const embeddings = computeEmbeddings(tokenTexts, dim)
  let current = embeddings
  const layers: LayerResult[] = []

  for (let l = 0; l < numLayers; l++) {
    const result = multiHeadAttention(current, l, numHeads, causal)
    layers.push(result)
    current = result.output
  }

  return { layers, embeddings }
}
