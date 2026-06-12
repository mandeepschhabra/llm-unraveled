interface InfoTooltipProps {
  text: string
  children: React.ReactNode
}
const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, children }) => {
  return (
    <div className="info-tooltip">
      {children}
      <span>{text}</span>
    </div>
  );
};

export default InfoTooltip;
