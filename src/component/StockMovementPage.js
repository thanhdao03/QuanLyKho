import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { useState } from "react";
import { todayISO } from "../common/FunctionCommon";

export function StockMovementPage({ mode, products, onSubmit }) {
    const isIn = mode === "IN";
    const [productId, setProductId] = useState(products[0]?.id || "");
    const [qty, setQty] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState(todayISO());
    const [error, setError] = useState("");

    const selectedProduct = products.find((p) => p.id === productId);

    function handleSubmit(e) {
        e.preventDefault();
        const qtyNum = Number(qty);

        if (!productId) {
            setError("Vui lòng chọn sản phẩm.");
            return;
        }
        if (!qtyNum || qtyNum <= 0) {
            setError("Số lượng phải là số dương lớn hơn 0.");
            return;
        }
        if (!isIn && selectedProduct && qtyNum > selectedProduct.stock) {
            setError(
                `Không thể xuất ${qtyNum} ${selectedProduct.unit} — kho chỉ còn ${selectedProduct.stock} ${selectedProduct.unit}.`
            );
            return;
        }
        if (!note.trim()) {
            setError(isIn ? "Vui lòng ghi rõ nguồn nhập (nhà cung cấp/lý do)." : "Vui lòng ghi rõ lý do xuất kho.");
            return;
        }

        setError("");
        onSubmit({ productId, qty: qtyNum, note: note.trim(), date });
        setQty("");
        setNote("");
    }

    const inputStyle = {
        width: "100%",
        padding: "9px 12px",
        borderRadius: "4px",
        border: "1px solid #E3E0D8",
        fontSize: "13px",
        outline: "none",
        fontFamily: "'Inter', sans-serif",
        boxSizing: "border-box",
        background: "#FFFFFF",
    };
    const labelStyle = { fontSize: "12px", fontWeight: 600, color: "#1C1C1A", marginBottom: "6px", display: "block" };

    return (
        <div>
            <PageHeader
                title={isIn ? "Tạo phiếu nhập kho" : "Tạo phiếu xuất kho"}
                subtitle={
                    isIn
                        ? "Ghi nhận hàng hóa nhập về — số lượng tồn sẽ được cộng tự động."
                        : "Ghi nhận hàng hóa xuất ra — hệ thống sẽ kiểm tra tồn kho trước khi xác nhận."
                }
            />

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <form
                    onSubmit={handleSubmit}
                    style={{ flex: "1 1 380px", background: "#FFFFFF", border: "1px solid #E3E0D8", borderRadius: "4px", padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}
                >
                    <div>
                        <label style={labelStyle}>Sản phẩm</label>
                        <select value={productId} onChange={(e) => setProductId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.id} — {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedProduct && (
                        <div style={{ background: "#F4F2EC", borderRadius: "4px", padding: "10px 12px", fontSize: "12px", color: "#6B6862", display: "flex", justifyContent: "space-between" }}>
                            <span>Tồn kho hiện tại</span>
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#1C1C1A" }}>
                                {selectedProduct.stock} {selectedProduct.unit}
                            </span>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "12px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Số lượng {isIn ? "nhập" : "xuất"}</label>
                            <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Ngày</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>{isIn ? "Nhà cung cấp / Lý do nhập" : "Lý do xuất kho"}</label>
                        <input
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder={isIn ? "VD: Nhập từ NCC Double A" : "VD: Xuất cho phòng Kinh doanh"}
                            style={inputStyle}
                        />
                    </div>

                    {error && (
                        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", background: "#C4622D14", border: "1px solid #C4622D40", borderRadius: "4px", padding: "10px 12px", fontSize: "12.5px", color: "#A14E22" }}>
                            <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            padding: "11px 16px",
                            borderRadius: "4px",
                            border: "none",
                            background: isIn ? "#2F6E4F" : "#8B5FBF",
                            color: "#FAFAF8",
                            fontSize: "13.5px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        {isIn ? <ArrowDownToLine size={15} /> : <ArrowUpFromLine size={15} />}
                        {isIn ? "Xác nhận nhập kho" : "Xác nhận xuất kho"}
                    </button>
                </form>

                <div style={{ flex: "1 1 280px", background: "#F4F2EC", border: "1px solid #E3E0D8", borderRadius: "4px", padding: "20px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1A", marginBottom: "10px" }}>Quy tắc áp dụng</div>
                    <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12.5px", color: "#6B6862", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {isIn ? (
                            <>
                                <li>Số lượng tồn được cộng tự động sau khi xác nhận, không chỉnh sửa trực tiếp.</li>
                                <li>Mỗi phiếu nhập phải có nguồn gốc (nhà cung cấp/lý do) để phục vụ tra soát sau này.</li>
                            </>
                        ) : (
                            <>
                                <li>Không thể xuất vượt quá số lượng tồn hiện có — hệ thống tự kiểm tra trước khi xác nhận.</li>
                                <li>Mỗi phiếu xuất phải ghi rõ lý do để truy vết mục đích sử dụng.</li>
                            </>
                        )}
                        <li>Mọi giao dịch đều được ghi lại trong Lịch sử biến động để đối soát.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}