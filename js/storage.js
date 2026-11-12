// Almacenamiento y datos iniciales de StockPro.
const DB_KEYS = { products: "stockpro_products", categories: "stockpro_categories", movements: "stockpro_movements" };
const readData = (key) => JSON.parse(localStorage.getItem(DB_KEYS[key]) || "[]");
const writeData = (key, value) => localStorage.setItem(DB_KEYS[key], JSON.stringify(value));
const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
function seedData() {
  if (!localStorage.getItem(DB_KEYS.categories)) {
    writeData("categories", [
      {id:"cat-cuad",name:"Cuadernos",description:"Cuadernos y libretas"},
      {id:"cat-escr",name:"Escritura",description:"Lápices, lapiceros y marcadores"},
      {id:"cat-arte",name:"Arte y manualidades",description:"Colores, pinturas y materiales"}
    ]);
  }
  if (!localStorage.getItem(DB_KEYS.products)) {
    writeData("products", [
      {id:"p-001",name:"Cuaderno argollado",description:"100 hojas cuadriculadas",categoryId:"cat-cuad",price:8500,quantity:24,minStock:5},
      {id:"p-002",name:"Lapicero azul",description:"Punta media",categoryId:"cat-escr",price:1800,quantity:8,minStock:10},
      {id:"p-003",name:"Caja de colores",description:"12 unidades",categoryId:"cat-arte",price:12500,quantity:15,minStock:4}
    ]);
  }
  if (!localStorage.getItem(DB_KEYS.movements)) writeData("movements", []);
}
function getCategoryName(id) { return readData("categories").find(c => c.id === id)?.name || "Sin categoría"; }
function money(value) { return new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(Number(value)||0); }
function dateText(value) { return new Date(value).toLocaleString("es-CO",{dateStyle:"short",timeStyle:"short"}); }
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function emptyRow(cols, message="No hay registros para mostrar.") { return `<tr><td colspan="${cols}" class="empty">${message}</td></tr>`; }
