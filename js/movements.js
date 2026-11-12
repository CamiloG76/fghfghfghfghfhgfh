// HU-06, HU-07 y HU-09: entradas, salidas e historial.
function renderMovements() {
  const movements=readData("movements").slice().sort((a,b)=>new Date(b.date)-new Date(a.date));
  document.getElementById("movements-table").innerHTML=movements.length?movements.map(m=>`<tr><td class="product-name">${escapeHtml(m.productName)}</td><td><span class="pill ${m.type==="Entrada"?"pill-in":"pill-out"}">${m.type}</span></td><td>${m.quantity}</td><td>${dateText(m.date)}</td></tr>`).join(""):emptyRow(4,"Todavía no se han registrado movimientos.");
}
function openMovementDialog() {
  const products=readData("products");
  if(!products.length)return showToast("Primero debes registrar un producto.");
  document.getElementById("movement-form").reset();
  document.getElementById("movement-product").innerHTML=products.map(p=>`<option value="${p.id}">${escapeHtml(p.name)} (stock: ${p.quantity})</option>`).join("");
  updateMovementHint();document.getElementById("movement-dialog").showModal();
}
function updateMovementHint() {
  const p=readData("products").find(x=>x.id===document.getElementById("movement-product").value);
  document.getElementById("movement-stock-hint").textContent=p?`Existencias actuales: ${p.quantity} unidades.`:"";
}
function saveMovement(event) {
  event.preventDefault();
  const id=document.getElementById("movement-product").value,type=document.getElementById("movement-type").value,qty=Number(document.getElementById("movement-quantity").value);
  const products=readData("products"),p=products.find(x=>x.id===id);
  if(!p||!Number.isInteger(qty)||qty<=0)return showToast("Ingresa una cantidad entera mayor que cero.");
  if(type==="Salida"&&qty>p.quantity)return showToast("Stock insuficiente. No se registró la salida.");
  p.quantity += type==="Entrada"?qty:-qty;
  writeData("products",products);
  const movement={id:makeId(),productId:p.id,productName:p.name,type,quantity:qty,date:new Date().toISOString()};
  writeData("movements",[movement,...readData("movements")]);
  document.getElementById("movement-dialog").close();renderAll();showToast("Movimiento registrado correctamente.");
}
