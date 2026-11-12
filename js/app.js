// Navegación e integración de los módulos.
const viewTitles={dashboard:"Panel principal",products:"Productos",categories:"Categorías",movements:"Movimientos",alerts:"Alertas de stock"};
function showView(name) {
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${name}`));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  document.getElementById("page-title").textContent=viewTitles[name]||"StockPro";
}
function renderAll(){renderProducts();renderCategories();renderMovements();renderDashboard();renderAlerts();}
document.addEventListener("DOMContentLoaded",()=>{
  seedData();renderAll();
  document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
  document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.go)));
  document.getElementById("add-product").addEventListener("click",()=>openProductDialog());
  document.getElementById("add-category").addEventListener("click",()=>openCategoryDialog());
  document.getElementById("add-movement").addEventListener("click",openMovementDialog);
  document.getElementById("product-form").addEventListener("submit",saveProduct);
  document.getElementById("category-form").addEventListener("submit",saveCategory);
  document.getElementById("movement-form").addEventListener("submit",saveMovement);
  document.getElementById("product-search").addEventListener("input",renderProducts);
  document.getElementById("product-category-filter").addEventListener("change",renderProducts);
  document.getElementById("movement-product").addEventListener("change",updateMovementHint);
  document.addEventListener("click",e=>{
    const editP=e.target.closest("[data-edit-product]");if(editP)openProductDialog(editP.dataset.editProduct);
    const delP=e.target.closest("[data-delete-product]");if(delP)deleteProduct(delP.dataset.deleteProduct);
    const editC=e.target.closest("[data-edit-category]");if(editC)openCategoryDialog(editC.dataset.editCategory);
    const delC=e.target.closest("[data-delete-category]");if(delC)deleteCategory(delC.dataset.deleteCategory);
    const close=e.target.closest("[data-close]");if(close)document.getElementById(close.dataset.close).close();
  });
});
