export function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

export function formatDate(iso) {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
}

export function stockLevel(product) {
    if (product.stock <= 0) return "empty";
    if (product.stock < product.minStock) return "low";
    if (product.stock < product.minStock * 1.5) return "watch";
    return "ok";
}