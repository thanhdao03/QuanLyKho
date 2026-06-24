import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { NavItem } from "./component/NavItem";
import { formatDate, stockLevel } from "./common/FunctionCommon";
import { PageHeader } from "./component/PageHeader";
import { StockMovementPage } from "./component/StockMovementPage";
import { StockBar } from "./component/StockBar";
import { Toast } from "./component/Toast";
import { DashboardPage } from "./component/DashboardPage";

const CATEGORIES = ["Văn phòng phẩm", "Thiết bị điện tử", "Đồ gia dụng", "Nguyên vật liệu"];

const INITIAL_PRODUCTS = [
  { id: "SKU-0101", name: "Giấy A4 Double A 70gsm", category: "Văn phòng phẩm", unit: "ream", stock: 142, minStock: 50 },
  { id: "SKU-0102", name: "Bút bi Thiên Long TL-027", category: "Văn phòng phẩm", unit: "hộp", stock: 18, minStock: 30 },
  { id: "SKU-0103", name: "Ghim kẹp giấy số 3", category: "Văn phòng phẩm", unit: "hộp", stock: 76, minStock: 20 },
  { id: "SKU-0204", name: "Bàn phím cơ Logitech K120", category: "Thiết bị điện tử", unit: "cái", stock: 9, minStock: 10 },
  { id: "SKU-0205", name: "Chuột không dây Dell MS116", category: "Thiết bị điện tử", unit: "cái", stock: 54, minStock: 15 },
  { id: "SKU-0206", name: "Cáp HDMI 2m", category: "Thiết bị điện tử", unit: "cái", stock: 31, minStock: 20 },
  { id: "SKU-0307", name: "Bình lọc nước Karofi", category: "Đồ gia dụng", unit: "cái", stock: 4, minStock: 5 },
  { id: "SKU-0308", name: "Quạt để bàn Asia", category: "Đồ gia dụng", unit: "cái", stock: 22, minStock: 10 },
  { id: "SKU-0409", name: "Tấm nhựa PVC 3mm", category: "Nguyên vật liệu", unit: "tấm", stock: 65, minStock: 25 },
  { id: "SKU-0410", name: "Ốc vít M4x12", category: "Nguyên vật liệu", unit: "túi", stock: 12, minStock: 40 },
];

const INITIAL_HISTORY = [
  { id: 1, type: "IN", date: "2026-06-15", productId: "SKU-0101", productName: "Giấy A4 Double A 70gsm", qty: 100, note: "Nhập từ NCC Double A", actor: "Hệ thống (demo)" },
  { id: 2, type: "OUT", date: "2026-06-16", productId: "SKU-0102", productName: "Bút bi Thiên Long TL-027", qty: 12, note: "Xuất cho phòng Kinh doanh", actor: "Hệ thống (demo)" },
  { id: 3, type: "IN", date: "2026-06-17", productId: "SKU-0205", productName: "Chuột không dây Dell MS116", qty: 40, note: "Nhập từ NCC Dell VN", actor: "Hệ thống (demo)" },
  { id: 4, type: "OUT", date: "2026-06-18", productId: "SKU-0307", productName: "Bình lọc nước Karofi", qty: 3, note: "Xuất lắp đặt văn phòng mới", actor: "Hệ thống (demo)" },
  { id: 5, type: "OUT", date: "2026-06-19", productId: "SKU-0410", productName: "Ốc vít M4x12", qty: 28, note: "Xuất cho dây chuyền sản xuất A", actor: "Hệ thống (demo)" },
  { id: 6, type: "IN", date: "2026-06-20", productId: "SKU-0409", productName: "Tấm nhựa PVC 3mm", qty: 30, note: "Nhập từ NCC Việt Á", actor: "Hệ thống (demo)" },
  { id: 7, type: "IN", date: "2026-06-21", productId: "SKU-0206", productName: "Cáp HDMI 2m", qty: 20, note: "Nhập từ NCC FPT Trading", actor: "Hệ thống (demo)" },
  { id: 8, type: "OUT", date: "2026-06-22", productId: "SKU-0308", productName: "Quạt để bàn Asia", qty: 8, note: "Xuất cho chi nhánh Đà Nẵng", actor: "Hệ thống (demo)" },
];

let nextHistoryId = INITIAL_HISTORY.length + 1;


export const LEVEL_STYLES = {
  empty: { bar: "#C4622D", text: "#C4622D", label: "Hết hàng" },
  low: { bar: "#C4622D", text: "#C4622D", label: "Dưới mức tối thiểu" },
  watch: { bar: "#B8923E", text: "#8A6D2F", label: "Cận mức tối thiểu" },
  ok: { bar: "#2F6E4F", text: "#2F6E4F", label: "Ổn định" },
};

function ProductsPage({ products }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");

  const filtered = products.filter((p) => {
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === "Tất cả" || p.category === category;
    return matchQuery && matchCat;
  });

  return (
    <div>
      <PageHeader title="Danh mục sản phẩm" subtitle="Toàn bộ mã hàng đang được quản lý trong kho." />

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#8A8780" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc mã SKU..."
            style={{
              width: "100%",
              padding: "9px 12px 9px 36px",
              borderRadius: "4px",
              border: "1px solid #E3E0D8",
              fontSize: "13px",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              boxSizing: "border-box",
            }}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "9px 12px",
            borderRadius: "4px",
            border: "1px solid #E3E0D8",
            fontSize: "13px",
            background: "#FFFFFF",
            color: "#1C1C1A",
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
          }}
        >
          <option>Tất cả</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E3E0D8", borderRadius: "4px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#F4F2EC", borderBottom: "1px solid #E3E0D8" }}>
              {["Mã SKU", "Tên sản phẩm", "Danh mục", "Đơn vị", "Tồn kho", "Trạng thái"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "11.5px", fontWeight: 600, color: "#6B6862", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => {
              const level = stockLevel(p);
              const style = LEVEL_STYLES[level];
              return (
                <tr key={p.id} style={{ borderBottom: idx === filtered.length - 1 ? "none" : "1px solid #EDEAE2" }}>
                  <td style={{ padding: "12px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#1C1C1A" }}>{p.id}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1C1C1A" }}>{p.name}</td>
                  <td style={{ padding: "12px 16px", color: "#6B6862" }}>{p.category}</td>
                  <td style={{ padding: "12px 16px", color: "#6B6862" }}>{p.unit}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <StockBar product={p} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: style.text, background: `${style.bar}1A`, padding: "3px 9px", borderRadius: "10px" }}>
                      {style.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "28px 16px", textAlign: "center", color: "#8A8780", fontSize: "13px" }}>
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HistoryPage({ history }) {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? history : history.filter((h) => h.type === filter);
  const sorted = [...filtered].sort((a, b) => b.id - a.id);

  return (
    <div>
      <PageHeader title="Lịch sử biến động" subtitle="Toàn bộ lượt nhập/xuất kho đã được ghi nhận — phục vụ đối soát." />

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { key: "ALL", label: "Tất cả" },
          { key: "IN", label: "Nhập kho" },
          { key: "OUT", label: "Xuất kho" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "7px 14px",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: filter === f.key ? "#1C1C1A" : "#E3E0D8",
              background: filter === f.key ? "#1C1C1A" : "#FFFFFF",
              color: filter === f.key ? "#FAFAF8" : "#6B6862",
              fontSize: "12.5px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#E3E0D8", border: "1px solid #E3E0D8", borderRadius: "4px", overflow: "hidden" }}>
        {sorted.map((h) => (
          <div key={h.id} style={{ background: "#FFFFFF", padding: "13px 16px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: h.type === "IN" ? "#2F6E4F14" : "#8B5FBF14",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {h.type === "IN" ? <TrendingUp size={14} color="#2F6E4F" /> : <TrendingDown size={14} color="#8B5FBF" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1A" }}>
                {h.productName} <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#8A8780", fontWeight: 400 }}>{h.productId}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#8A8780", marginTop: "2px" }}>{h.note}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: h.type === "IN" ? "#2F6E4F" : "#8B5FBF" }}>
                {h.type === "IN" ? "+" : "−"}
                {h.qty}
              </div>
              <div style={{ fontSize: "11px", color: "#8A8780", marginTop: "2px" }}>{formatDate(h.date)}</div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <div style={{ background: "#FFFFFF", padding: "28px 16px", textAlign: "center", color: "#8A8780", fontSize: "13px" }}>Chưa có biến động nào.</div>}
      </div>
    </div>
  );
}

export default function WarehouseApp() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const lowStockCount = products.filter((p) => stockLevel(p) === "low" || stockLevel(p) === "empty").length;

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleMovement(type) {
    return ({ productId, qty, note, date }) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: type === "IN" ? p.stock + qty : p.stock - qty } : p))
      );

      setHistory((prev) => [
        ...prev,
        {
          id: nextHistoryId++,
          type,
          date,
          productId,
          productName: product.name,
          qty,
          note,
          actor: "Bạn (demo)",
        },
      ]);

      showToast(
        type === "IN"
          ? `Đã nhập ${qty} ${product.unit} ${product.name} vào kho.`
          : `Đã xuất ${qty} ${product.unit} ${product.name} khỏi kho.`,
        "success"
      );
    };
  }

  const navItems = [
    { key: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { key: "products", label: "Sản phẩm", icon: Package },
    { key: "stock-in", label: "Nhập kho", icon: ArrowDownToLine },
    { key: "stock-out", label: "Xuất kho", icon: ArrowUpFromLine },
    { key: "history", label: "Lịch sử", icon: History },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100%", background: "#FAFAF8", fontFamily: "'Inter', sans-serif", color: "#1C1C1A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus { outline: 2px solid #1C1C1A22; border-color: #1C1C1A !important; }
        button:focus-visible { outline: 2px solid #1C1C1A; outline-offset: 1px; }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ width: "220px", borderRight: "1px solid #E3E0D8", padding: "20px 12px", display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
        <div style={{ padding: "6px 14px 18px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.01em" }}>KHO VẬN</div>
          <div style={{ fontSize: "11px", color: "#8A8780", marginTop: "2px" }}>Demo quản lý kho</div>
        </div>
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={page === item.key}
            onClick={() => setPage(item.key)}
            badge={item.key === "dashboard" && lowStockCount > 0 ? lowStockCount : null}
          />
        ))}
        <div style={{ marginTop: "auto", padding: "12px 14px", fontSize: "11px", color: "#B0AEA6", borderTop: "1px solid #EDEAE2", paddingTop: "14px" }}>
          Dữ liệu mock — phục vụ demo, không lưu trữ thật.
        </div>
      </div>

      <div style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        {page === "dashboard" && <DashboardPage products={products} history={history} />}
        {page === "products" && <ProductsPage products={products} />}
        {page === "stock-in" && <StockMovementPage mode="IN" products={products} onSubmit={handleMovement("IN")} />}
        {page === "stock-out" && <StockMovementPage mode="OUT" products={products} onSubmit={handleMovement("OUT")} />}
        {page === "history" && <HistoryPage history={history} />}
      </div>
    </div>
  );
}