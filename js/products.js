// HU-01, HU-02, HU-03 y HU-05: administración y búsqueda de productos.
function renderProducts() {
  const products = readData("products");
  const query = document.getElementById("product-search").value.trim().toLowerCase();
  const category = document.getElementById("product-category-filter").value;
  const filtered = products.filter(p => p.name.toLowerCase().includes(query) && (!category || p.categoryId === category));
  document.getElementById("products-table").innerHTML = filtered.length ? filtered.map(p => `
    <tr><td><span class="product-name">${escapeHtml(p.name)}</span><span class="subtext">${escapeHtml(p.description||"")}</span></td>
    <td>${escapeHtml(getCategoryName(p.categoryId))}</td><td>${money(p.price)}</td><td>${p.quantity}</td><td>${p.minStock}</td>
    <td><span class="pill ${p.quantity<=p.minStock?"pill-low":"pill-ok"}">${p.quantity<=p.minStock?"Stock bajo":"Disponible"}</span></td>
    <td><button class="action-btn" data-edit-product="${p.id}">Editar</button><button class="action-btn danger" data-delete-product="${p.id}">Eliminar</button></td></tr>`).join("") : emptyRow(7);
  const filter = document.getElementById("product-category-filter");
  const current = filter.value;
  filter.innerHTML = '<option value="">Todas las categorías</option>' + readData("categories").map(c=>`<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("");
  filter.value = current;
}
function escapeHtml(value) { return String(value??"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function fillProductCategories(selected="") {
  const select = document.getElementById("product-category");
  select.innerHTML = readData("categories").map(c=>`<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("");
  if (selected) select.value = selected;
}
function openProductDialog(id=null) {
  const form = document.getElementById("product-form"); form.reset();
  document.getElementById("product-id").value = "";
  document.getElementById("product-dialog-title").textContent = id ? "Editar producto" : "Nuevo producto";
  fillProductCategories();
  if (id) {
    const p = readData("products").find(x=>x.id===id); if (!p) return;
    document.getElementById("product-id").value=p.id;
    document.getElementById("product-name").value=p.name;
    document.getElementById("product-description").value=p.description||"";
    document.getElementById("product-price").value=p.price;
    document.getElementById("product-quantity").value=p.quantity;
    document.getElementById("product-min").value=p.minStock;
    fillProductCategories(p.categoryId);
  }
  document.getElementById("product-dialog").showModal();
}
function saveProduct(event) {
  event.preventDefault();
  const id=document.getElementById("product-id").value;
  const products=readData("products");
  const item={id:id||makeId(),name:document.getElementById("product-name").value.trim(),description:document.getElementById("product-description").value.trim(),categoryId:document.getElementById("product-category").value,price:Number(document.getElementById("product-price").value),quantity:Number(document.getElementById("product-quantity").value),minStock:Number(document.getElementById("product-min").value)};
  if (!item.name || !item.categoryId || item.price<=0 || item.quantity<0 || item.minStock<0) return showToast("Revisa los datos del producto.");
  if (id) writeData("products",products.map(p=>p.id===id?item:p)); else writeData("products",[...products,item]);
  document.getElementById("product-dialog").close(); renderAll(); showToast(id?"Producto actualizado.":"Producto registrado.");
}
function deleteProduct(id) {
  const movements=readData("movements");
  if (movements.some(m=>m.productId===id)) return showToast("No se puede eliminar: el producto tiene movimientos asociados.");
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
  writeData("products",readData("products").filter(p=>p.id!==id)); renderAll(); showToast("Producto eliminado.");
}
