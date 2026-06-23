import { LEVEL_STYLES } from "../App";
import { stockLevel } from "../common/FunctionCommon";

export function StockBar({ product }) {
  const level = stockLevel(product);
  const style = LEVEL_STYLES[level];
  const pct = Math.min(
    100,
    Math.round((product.stock / Math.max(product.minStock * 2, 1)) * 100),
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: "140px",
      }}
    >
      <div
        style={{
          flex: 1,
          height: "6px",
          background: "#EDEAE2",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: style.bar,
            borderRadius: "3px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "11px",
          fontFamily: "'IBM Plex Mono', monospace",
          color: style.text,
          fontWeight: 600,
          minWidth: "32px",
          textAlign: "right",
        }}
      >
        {product.stock}
      </span>
    </div>
  );
}
