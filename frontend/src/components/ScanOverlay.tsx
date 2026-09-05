const NODES = [
  { top: "22%", left: "26%" },
  { top: "34%", left: "66%" },
  { top: "52%", left: "40%" },
  { top: "68%", left: "70%" },
  { top: "44%", left: "18%" },
  { top: "76%", left: "34%" },
];

// A detection/mapping animation drawn over the photo while the model analyzes it.
export function ScanOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="scan-grid absolute inset-0" />
      <span className="scan-corner left-2 top-2 border-l-2 border-t-2" />
      <span className="scan-corner right-2 top-2 border-r-2 border-t-2" />
      <span className="scan-corner bottom-2 left-2 border-b-2 border-l-2" />
      <span className="scan-corner bottom-2 right-2 border-b-2 border-r-2" />
      <div className="scan-beam" />
      {NODES.map((n, i) => (
        <span
          key={i}
          className="scan-node"
          style={{ top: n.top, left: n.left, animationDelay: `${i * 0.28}s` }}
        />
      ))}
    </div>
  );
}
