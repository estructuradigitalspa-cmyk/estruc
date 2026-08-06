const events = [
  {date:'08 AGO',country:'Chile',city:'Santiago',title:'Power Cup Poomsae',type:'Poomsae',limit:'150 cupos',followers:18},
  {date:'15 AGO',country:'Chile',city:'Los Ángeles',title:'11° Grand Prix Internacional',type:'Kyorugui',limit:'680 cupos',followers:43},
  {date:'15 AGO',country:'Chile',city:'Ovalle',title:'3° Copa del Valle',type:'Kyorugui · Poomsae',limit:'400 cupos',followers:21},
  {date:'22 AGO',country:'Chile',city:'Santiago',title:'Copa Metropolitana 2026',type:'Kyorugui · Poomsae',limit:'250 cupos',followers:28},
  {date:'06 SEP',country:'Argentina',city:'Formosa',title:'Open Internacional Formosa',type:'Kyorugui',limit:'600 cupos',followers:32},
  {date:'19 SEP',country:'Argentina',city:'Río Negro',title:'Río Negro Open 2026',type:'Kyorugui · Poomsae',limit:'1000 cupos',followers:55}
];

const views = [...document.querySelectorAll('.view')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const profileMenu = document.getElementById('profileMenu');
const toast = document.getElementById('toast');

function showView(id){
  const target = document.getElementById(id) || document.getElementById('inicio');
  views.forEach(view => view.classList.toggle('active', view === target));
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  profileMenu.classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  if(location.hash !== `#${id}`) history.pushState(null,'',`#${id}`);
}

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-view]');
  if(trigger){ event.preventDefault(); showView(trigger.dataset.view); }
});

navLinks.forEach(link => link.addEventListener('click', event => {event.preventDefault();showView(link.hash.slice(1));}));
document.getElementById('profileButton').addEventListener('click',()=>profileMenu.classList.toggle('open'));
document.getElementById('menuButton').addEventListener('click',()=>profileMenu.classList.toggle('open'));
document.getElementById('themeButton').addEventListener('click',()=>document.body.classList.toggle('lightless'));

function renderEvents(){
  const query = (document.getElementById('eventSearch')?.value || '').toLowerCase();
  const country = document.getElementById('countryFilter')?.value || 'all';
  const filtered = events.filter(e => (country === 'all' || e.country === country) && `${e.title} ${e.city} ${e.country}`.toLowerCase().includes(query));
  document.getElementById('eventGrid').innerHTML = filtered.map(e => `<article class="event-card"><div class="event-card-cover"><strong>${e.date}</strong><span class="status-pill">ABIERTO</span></div><div class="event-card-body"><small>${e.city.toUpperCase()} · ${e.country.toUpperCase()}</small><h3>${e.title}</h3><p>${e.type} · ${e.limit}</p><div class="card-footer"><span>☆ ${e.followers} siguiendo</span><button class="outline-button" data-view="evento">Ver evento</button></div></div></article>`).join('') || '<div class="empty-state"><h2>No encontramos eventos</h2><p>Prueba con otros filtros.</p></div>';
}
renderEvents();
document.getElementById('eventSearch').addEventListener('input',renderEvents);
document.getElementById('countryFilter').addEventListener('change',renderEvents);

document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click',()=>{
  document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b===button));
  document.querySelectorAll('.tab-panel').forEach(panel=>panel.classList.toggle('active',panel.id===`tab-${button.dataset.tab}`));
}));

document.getElementById('followButton').addEventListener('click',event=>{
  const active = event.currentTarget.classList.toggle('following');
  event.currentTarget.textContent = active ? '★ Siguiendo' : '☆ Seguir evento';
  toast.querySelector('b').textContent = active ? 'Evento seguido' : 'Dejaste de seguir';
  toast.querySelector('small').textContent = active ? 'Te avisaremos cuando haya novedades.' : 'Puedes volver a seguirlo cuando quieras.';
  toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2800);
});

let seconds = 42, running = false, timerId;
document.getElementById('timerButton').addEventListener('click',event=>{
  running = !running; event.currentTarget.textContent = running ? 'Ⅱ Pausar' : '▶ Continuar';
  clearInterval(timerId);
  if(running) timerId = setInterval(()=>{ if(seconds>0) seconds--; else {running=false;clearInterval(timerId);} document.getElementById('fightTimer').textContent=`00:${String(seconds).padStart(2,'0')}`; },1000);
});

function updateClock(){document.getElementById('clock').textContent=new Date().toLocaleTimeString('es-CL',{hour12:false});}
updateClock();setInterval(updateClock,1000);

const counterObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting||entry.target.dataset.done)return;
  entry.target.dataset.done='1';const end=Number(entry.target.dataset.count);let start=0;const step=Math.max(1,Math.floor(end/55));
  const interval=setInterval(()=>{start=Math.min(end,start+step);entry.target.textContent=start.toLocaleString('es-CL')+(end<20?'':'');if(start===end)clearInterval(interval)},22);
}));
document.querySelectorAll('[data-count]').forEach(el=>counterObserver.observe(el));

window.addEventListener('popstate',()=>showView(location.hash.slice(1)||'inicio'));
if(location.hash) showView(location.hash.slice(1));

const products=[{id:1,name:'Peto reversible WT',category:'Protección oficial',price:42990,icon:'🥋',tag:'MÁS VENDIDO'},{id:2,name:'Dobok competición Pro',category:'Uniforme unisex',price:59990,icon:'🥋',tag:'NUEVO'},{id:3,name:'Protector de antebrazo',category:'Protección · Par',price:18990,icon:'🛡️',tag:'WT STYLE'},{id:4,name:'Bolso deportivo 45L',category:'Accesorios',price:34990,icon:'🎒',tag:'EXCLUSIVO'},{id:5,name:'Paleta doble de pateo',category:'Entrenamiento',price:16990,icon:'🎯',tag:'ACADEMIAS'},{id:6,name:'Guantes de combate',category:'Protección',price:22990,icon:'🥊',tag:'STOCK'},{id:7,name:'Botella térmica TKD',category:'Accesorios',price:12990,icon:'🧴',tag:'TKD LIVE'},{id:8,name:'Cinturón bordado',category:'Personalizable',price:14990,icon:'🎗️',tag:'PERSONALIZA'}];
let cart=[];
let currentRole='deportista';
function setRole(role){currentRole=role;document.querySelectorAll('[data-role]').forEach(b=>b.classList.toggle('active',b.dataset.role===role));const profile=document.querySelector('.profile-copy');const routes={deportista:['dashboard','eventos','operacion','ranking','tienda'],profesor:['profesor','eventos','cancha','ranking','tienda'],organizador:['organizador','organizador','operacion','ranking','tienda']}[role];navLinks.forEach((link,index)=>link.setAttribute('href','#'+routes[index]));if(role==='profesor')profile.innerHTML='Carlos Morales<br><small>Profesor / Escuela</small>';else if(role==='organizador')profile.innerHTML='Sebastián<br><small>Organizador</small>';else profile.innerHTML='Sebastián<br><small>Competidor</small>';showView(routes[0])}
document.querySelectorAll('[data-role]').forEach(b=>b.addEventListener('click',()=>setRole(b.dataset.role)));
function money(value){return '$'+value.toLocaleString('es-CL')}
function renderProducts(){document.getElementById('productGrid').innerHTML=products.map(p=>`<article class="product-card"><div class="product-visual"><span>${p.tag}</span>${p.icon}</div><div class="product-copy"><small>${p.category}</small><h3>${p.name}</h3><div><strong>${money(p.price)}</strong><button class="add-cart" data-product="${p.id}" aria-label="Agregar ${p.name}">+</button></div></div></article>`).join('')}
function renderCart(){document.getElementById('cartItems').innerHTML=cart.map(item=>`<div class="cart-item"><span class="cart-item-icon">${item.icon}</span><div><b>${item.name}</b><small>Cantidad 1 · ${money(item.price)}</small></div><button class="remove-item" data-remove="${item.id}">Quitar</button></div>`).join('');const subtotal=cart.reduce((sum,item)=>sum+item.price,0);const shipping=document.querySelector('input[name="delivery"]:checked')?.value==='shipping'?4990:0;document.getElementById('cartCount').textContent=cart.length;document.getElementById('cartSubtotal').textContent=money(subtotal);document.getElementById('deliveryPrice').textContent=shipping?money(shipping):'Gratis';document.getElementById('cartTotal').textContent=money(subtotal+shipping);document.getElementById('cartEmpty').style.display=cart.length?'none':'block';document.getElementById('cartCheckout').style.display=cart.length?'block':'none'}
renderProducts();renderCart();
document.getElementById('productGrid').addEventListener('click',e=>{const b=e.target.closest('[data-product]');if(!b)return;const p=products.find(x=>x.id===Number(b.dataset.product));cart.push(p);renderCart();toast.querySelector('b').textContent='Producto agregado';toast.querySelector('small').textContent=p.name;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2000)});
document.getElementById('cartButton').addEventListener('click',()=>document.getElementById('cartDrawer').classList.add('open'));
document.getElementById('cartItems').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;const i=cart.findIndex(x=>x.id===Number(b.dataset.remove));if(i>=0)cart.splice(i,1);renderCart()});
document.querySelectorAll('input[name="delivery"]').forEach(i=>i.addEventListener('change',renderCart));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).classList.remove('open')));
document.getElementById('checkoutButton').addEventListener('click',()=>{document.getElementById('cartDrawer').classList.remove('open');const shipping=document.querySelector('input[name="delivery"]:checked').value==='shipping'?4990:0;document.getElementById('paymentSummary').innerHTML=cart.map(item=>`<p><span>${item.name}</span><b>${money(item.price)}</b></p>`).join('');document.getElementById('paymentTotal').textContent=money(cart.reduce((sum,item)=>sum+item.price,0)+shipping);document.getElementById('paymentModal').classList.add('open')});
document.getElementById('payButton').addEventListener('click',()=>{document.getElementById('paymentModal').classList.remove('open');cart=[];renderCart();toast.querySelector('b').textContent='Pago simulado exitoso';toast.querySelector('small').textContent='Orden #TL-2026-0842 confirmada.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),4000)});
let registrationStep=1;
function renderRegistrationStep(){document.querySelectorAll('.flow-step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===registrationStep));document.querySelectorAll('.flow-steps span').forEach((s,i)=>s.classList.toggle('active',i+1<=registrationStep));document.getElementById('registrationBack').style.visibility=registrationStep===1?'hidden':'visible';document.getElementById('registrationNext').textContent=registrationStep===4?'Confirmar inscripción':'Continuar'}
document.addEventListener('click',e=>{if(e.target.closest('#registerFighterButton')){registrationStep=1;renderRegistrationStep();document.getElementById('registrationModal').classList.add('open')}});
document.getElementById('registrationNext').addEventListener('click',()=>{if(registrationStep===1){const school=document.getElementById('schoolSelect');if(!school.value){toast.querySelector('b').textContent='Selecciona una escuela';toast.querySelector('small').textContent='Debe estar registrada previamente en el torneo.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000);return}document.getElementById('verifiedSchool').textContent=school.options[school.selectedIndex].text.replace(' · Aprobada','')}if(registrationStep<4){registrationStep++;renderRegistrationStep()}else{document.getElementById('registrationModal').classList.remove('open');toast.querySelector('b').textContent='Inscripción simulada';toast.querySelector('small').textContent='Quedó pendiente de pago y validación.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}});
document.getElementById('registrationBack').addEventListener('click',()=>{if(registrationStep>1){registrationStep--;renderRegistrationStep()}});
document.getElementById('requestSchoolButton').addEventListener('click',()=>{toast.querySelector('b').textContent='Solicitud preparada';toast.querySelector('small').textContent='El organizador debe aprobar la escuela antes de inscribir.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)});


document.getElementById('openSchoolRegistration').addEventListener('click',()=>document.getElementById('schoolRegistrationModal').classList.add('open'));
document.getElementById('submitSchoolRegistration').addEventListener('click',()=>{document.getElementById('schoolRegistrationModal').classList.remove('open');toast.querySelector('b').textContent='Solicitud enviada';toast.querySelector('small').textContent='El organizador revisará y habilitará la escuela.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)});
document.getElementById('teacherRegisterFighter').addEventListener('click',()=>{registrationStep=1;renderRegistrationStep();document.getElementById('schoolSelect').value='hwarang';document.getElementById('registrationModal').classList.add('open')});


document.querySelectorAll('[data-organizer-tab]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-organizer-tab]').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('.organizer-tab-panel').forEach(panel=>panel.classList.toggle('active',panel.id===`organizer-${button.dataset.organizerTab}`))}));
function updatePendingSchools(){document.getElementById('pendingSchoolCount').textContent=document.querySelectorAll('[data-school-request]').length}
document.querySelectorAll('.approve-school').forEach(button=>button.addEventListener('click',()=>{const card=button.closest('[data-school-request]');const name=card.querySelector('h3').textContent;card.remove();updatePendingSchools();toast.querySelector('b').textContent='Escuela aprobada';toast.querySelector('small').textContent=`${name} ya puede inscribir peleadores.`;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}));
document.querySelectorAll('.reject-school').forEach(button=>button.addEventListener('click',()=>{const card=button.closest('[data-school-request]');const name=card.querySelector('h3').textContent;card.remove();updatePendingSchools();toast.querySelector('b').textContent='Solicitud rechazada';toast.querySelector('small').textContent=`Se notificará a ${name}.`;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000)}));
document.getElementById('manualSchoolButton').addEventListener('click',()=>document.getElementById('manualSchoolModal').classList.add('open'));
document.getElementById('confirmManualSchool').addEventListener('click',()=>{document.getElementById('manualSchoolModal').classList.remove('open');toast.querySelector('b').textContent='Escuela ingresada';toast.querySelector('small').textContent='Academia Dragón Rojo recibió acceso al torneo.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)});
