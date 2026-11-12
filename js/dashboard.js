// HU-08 y HU-10: resumen, alertas y estadísticas.
function renderDashboard() {
  const products=readData("products"),movements=readData("movements");
  document.getElementById("stat-products").textContent=products.length;
  document.getElementById("stat-units").textContent=products.reduce((s,p)=>s+p.quantity,0);
  document.getElementById("stat-low").textContent=products.filter(p=>p.quantity<=p.minStock).length;
  document.getElementById("stat-movements").textContent=movements.length;
  const recent=movements.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  document.getElementById("recent-movements").innerHTML=recent.length?recent.map(m=>`<tr><td class="product-name">${escapeHtml(m.productName)}</td><td><span class="pill ${m.type==="Entrada"?"pill-in":"pill-out"}">${m.type}</span></td><td>${m.quantity}</td><td>${dateText(m.date)}</td></tr>`).join(""):emptyRow(4,"Aún no hay movimientos registrados.");
}
function renderAlerts() {
  const low=readData("products").filter(p=>p.quantity<=p.minStock);
  document.getElementById("alerts-table").innerHTML=low.length?low.map(p=>`<tr><td class="product-name">${escapeHtml(p.name)}</td><td>${escapeHtml(getCategoryName(p.categoryId))}</td><td>${p.quantity}</td><td>${p.minStock}</td><td><span class="pill pill-low">Reponer producto</span></td></tr>`).join(""):emptyRow(5,"No hay productos con stock bajo.");
}
