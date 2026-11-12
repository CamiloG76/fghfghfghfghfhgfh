// HU-04: gestión de categorías.
function renderCategories() {
  const cats=readData("categories"), products=readData("products");
  document.getElementById("categories-table").innerHTML=cats.length?cats.map(c=>`<tr><td class="product-name">${escapeHtml(c.name)}</td><td>${escapeHtml(c.description||"—")}</td><td>${products.filter(p=>p.categoryId===c.id).length}</td><td><button class="action-btn" data-edit-category="${c.id}">Editar</button><button class="action-btn danger" data-delete-category="${c.id}">Eliminar</button></td></tr>`).join(""):emptyRow(4);
}
function openCategoryDialog(id=null) {
  document.getElementById("category-form").reset(); document.getElementById("category-id").value="";
  document.getElementById("category-dialog-title").textContent=id?"Editar categoría":"Nueva categoría";
  if(id){const c=readData("categories").find(x=>x.id===id);if(!c)return;document.getElementById("category-id").value=c.id;document.getElementById("category-name").value=c.name;document.getElementById("category-description").value=c.description||"";}
  document.getElementById("category-dialog").showModal();
}
function saveCategory(event) {
  event.preventDefault(); const id=document.getElementById("category-id").value;
  const cats=readData("categories"), name=document.getElementById("category-name").value.trim();
  if(!name)return showToast("Escribe el nombre de la categoría.");
  if(cats.some(c=>c.name.toLowerCase()===name.toLowerCase()&&c.id!==id))return showToast("Ya existe una categoría con ese nombre.");
  const item={id:id||makeId(),name,description:document.getElementById("category-description").value.trim()};
  writeData("categories",id?cats.map(c=>c.id===id?item:c):[...cats,item]);
  document.getElementById("category-dialog").close();renderAll();showToast(id?"Categoría actualizada.":"Categoría registrada.");
}
function deleteCategory(id) {
  if(readData("products").some(p=>p.categoryId===id))return showToast("No se puede eliminar: tiene productos asociados.");
  if(!confirm("¿Seguro que deseas eliminar esta categoría?"))return;
  writeData("categories",readData("categories").filter(c=>c.id!==id));renderAll();showToast("Categoría eliminada.");
}
