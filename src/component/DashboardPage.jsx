import { useMemo } from "react";
import { formatDate, stockLevel } from "../common/FunctionCommon";
import { PageHeader } from "./PageHeader";
import { StatCard } from "./StatCard";
import {
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, BarChart } from "lucide-react";

export function DashboardPage({ products, history }) {
  const totalSKU = products.length;
  const lowStockItems = products.filter(
    (p) => stockLevel(p) === "low" || stockLevel(p) === "empty",
  );
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);

  const last7 = useMemo(() => {
    const map = {};
    history.forEach((h) => {
      if (!map[h.date])
        map[h.date] = { date: h.date, "Nhập kho": 0, "Xuất kho": 0 };
      if (h.type === "IN") map[h.date]["Nhập kho"] += h.qty;
      else map[h.date]["Xuất kho"] += h.qty;
    });
    return Object.values(map)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7)
      .map((d) => ({ ...d, label: formatDate(d.date).slice(0, 5) }));
  }, [history]);

  return (
    <div>
      <PageHeader
        title="Tổng quan kho"
        subtitle="Số liệu tồn kho và biến động nhập/xuất gần đây."
      />

      <div
        style={{
          display: "flex",
          gap: "14px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <StatCard
          label="Tổng số mã hàng (SKU)"
          value={totalSKU}
          sub="Đang theo dõi trong hệ thống"
          accent="#1C1C1A"
        />
        <StatCard
          label="Tổng số lượng tồn"
          value={totalUnits.toLocaleString("vi-VN")}
          sub="Tính trên tất cả danh mục"
          accent="#2F6E4F"
        />
        <StatCard
          label="Cần nhập thêm"
          value={lowStockItems.length}
          sub={
            lowStockItems.length > 0
              ? "Mã hàng dưới mức tối thiểu"
              : "Không có cảnh báo"
          }
          accent="#C4622D"
        />
        <StatCard
          label="Biến động trong kỳ"
          value={history.length}
          sub="Lượt nhập/xuất đã ghi nhận"
          accent="#8B5FBF"
        />
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div
          style={{
            flex: "2 1 420px",
            background: "#FFFFFF",
            border: "1px solid #E3E0D8",
            borderRadius: "4px",
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1C1C1A",
              marginBottom: "4px",
            }}
          >
            Nhập / Xuất theo ngày
          </div>
          <div
            style={{
              fontSize: "11.5px",
              color: "#8A8780",
              marginBottom: "12px",
            }}
          >
            7 lượt biến động gần nhất theo ngày ghi nhận
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last7} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E3E0D8"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6B6862" }}
                axisLine={{ stroke: "#E3E0D8" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6B6862" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  fontSize: "12px",
                  borderRadius: "4px",
                  border: "1px solid #E3E0D8",
                  fontFamily: "Inter, sans-serif",
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Bar
                dataKey="Nhập kho"
                fill="#2F6E4F"
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="Xuất kho"
                fill="#8B5FBF"
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            flex: "1 1 280px",
            background: "#FFFFFF",
            border: "1px solid #E3E0D8",
            borderRadius: "4px",
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1C1C1A",
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <AlertTriangle size={14} color="#C4622D" />
            Cảnh báo tồn kho
          </div>
          <div
            style={{
              fontSize: "11.5px",
              color: "#8A8780",
              marginBottom: "14px",
            }}
          >
            Mã hàng đang ở mức cần nhập thêm
          </div>
          {lowStockItems.length === 0 ? (
            <div
              style={{
                fontSize: "12.5px",
                color: "#8A8780",
                padding: "12px 0",
              }}
            >
              Không có mã hàng nào dưới mức tối thiểu.
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {lowStockItems.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #EDEAE2",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "#1C1C1A",
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: "#8A8780",
                      }}
                    >
                      {p.id}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontWeight: 700,
                      color: "#C4622D",
                    }}
                  >
                    {p.stock}/{p.minStock}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
