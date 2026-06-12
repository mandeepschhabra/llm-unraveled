interface GradientBallProps {
  x: number
  y: number
  loss: number
}

const GradientBall: React.FC<GradientBallProps> = ({ x, y, loss }) => {
  return (
    <div style={{ position: 'absolute', left: x, top: y, backgroundColor: `hsl(${loss * 360}, 100%, 50%)`, width: 20, height: 20 }} />
  );
};

export default GradientBall;
