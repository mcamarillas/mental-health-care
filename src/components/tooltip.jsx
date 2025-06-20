import '../styles/tooltip.css';

function Tooltip({ visible, x, y, label, value }) {
  if (!visible) return null;

  return (
    <div
      className="tooltip"
      style={{
        left: x,
        top: y,
        position: 'absolute',
      }}
    >
      <span className="tooltip-label">{label}</span>
      <span
        className="tooltip-value"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}

export default Tooltip;