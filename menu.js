
// ========================================
// BON-GOÛT PRO 2026
// ========================================
const NUMERO_WHATSAPP = "243861277878";
const QUANTITE_MAX = 20;

const plats = [
  {
    id: 1,
    nom: "Poulet braisé",
    description: "Poulet grillé, frites croustillantes et sauce maison secrète.",
    prix: 20000,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
    disponible: true,
    tag: "Best-seller"
  },
  {
    id: 2,
    nom: "Poisson grillé",
    description: "Poisson frais du jour, légumes grillés et frites.",
    prix: 18000,
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=800&q=80",
    disponible: true,
    tag: "Frais"
  },
  {
    id: 3,
    nom: "Burger Bon-Goût",
    description: "Bœuf 180g, cheddar, légumes frais, sauce Bon-Goût et frites.",
    prix: 15000,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    disponible: true,
    tag: "Nouveau"
  },
  {
    id: 4,
    nom: "Pizza Margherita",
    description: "Tomate San Marzano, mozzarella di bufala, basilic frais.",
    prix: 18000,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80",
    disponible: true,
    tag: "Populaire"
  },
  {
    id: 5,
    nom: "Jus naturel",
    description: "Ananas, gingembre, menthe — pressé minute, bien frais.",
    prix: 4000,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    disponible: true,
    tag: "Frais"
  }
];

function chargerPanier(){
  try{
    const brut = JSON.parse(localStorage.getItem("bonGoutPanier"));
    if(!Array.isArray(brut)) return [];
    const res=[];
    brut.forEach(el=>{
      const plat = plats.find(p=>p.id===Number(el&&el.id));
      const q = Math.floor(Number(el&&el.quantite));
      if(plat && plat.disponible && q>0){
        res.push({id:plat.id,nom:plat.nom,prix:plat.prix,quantite:Math.min(q,QUANTITE_MAX)});
      }
    });
    return res;
  }catch{ return []; }
}
let panier = chargerPanier();

function sauvegarderPanier(){
  try{ localStorage.setItem("bonGoutPanier", JSON.stringify(panier)); }catch{}
}
function formaterPrix(p){ return p.toLocaleString("fr-FR")+" CDF"; }

function afficherMenu(){
  const container = document.getElementById("menu-container");
  if(!container) return;
  container.innerHTML="";
  plats.forEach(plat=>{
    const art = document.createElement("article");
    art.className="plat";
    art.innerHTML=`
      <div style="position:relative">
        <img class="plat-image" src="${plat.image}" alt="${plat.nom}" loading="lazy">
        <span class="disponibilite" style="position:absolute;top:10px;left:10px">${plat.tag}</span>
      </div>
      <div class="plat-contenu">
        <div class="plat-titre"><h3>${plat.nom}</h3><span class="disponibilite">${plat.disponible?"Disponible":"Indisponible"}</span></div>
        <p class="plat-description">${plat.description}</p>
        <div class="plat-bas"><strong class="plat-prix">${formaterPrix(plat.prix)}</strong><button class="bouton-ajouter" data-id="${plat.id}" ${!plat.disponible?"disabled":""}>Ajouter +</button></div>
      </div>
    `;
    container.appendChild(art);
  });
  container.querySelectorAll(".bouton-ajouter").forEach(b=>b.addEventListener("click",()=>ajouterAuPanier(Number(b.dataset.id))));
}

function ajouterAuPanier(id){
  const plat = plats.find(p=>p.id===id);
  if(!plat||!plat.disponible) return;
  const ex = panier.find(e=>e.id===id);
  if(ex){ ex.quantite=Math.min(ex.quantite+1,QUANTITE_MAX); }
  else{ panier.push({id:plat.id,nom:plat.nom,prix:plat.prix,quantite:1}); }
  sauvegarderPanier(); afficherPanier();
  // petit feedback
  const btn = document.querySelector(`.bouton-ajouter[data-id="${id}"]`);
  if(btn){ const t=btn.textContent; btn.textContent="✓ Ajouté"; setTimeout(()=>btn.textContent=t,900); }
}
function modifierQuantite(id,delta){
  const art=panier.find(e=>e.id===id);
  if(!art) return;
  art.quantite=Math.min(art.quantite+delta,QUANTITE_MAX);
  if(art.quantite<=0) panier=panier.filter(e=>e.id!==id);
  sauvegarderPanier(); afficherPanier();
}
function supprimerDuPanier(id){ panier=panier.filter(e=>e.id!==id); sauvegarderPanier(); afficherPanier(); }

function afficherPanier(){
  const contenu=document.getElementById("panier-contenu");
  const vide=document.getElementById("panier-vide");
  const totalEl=document.getElementById("total");
  const btnCmd=document.getElementById("commander");
  if(!contenu||!vide||!totalEl||!btnCmd) return;
  contenu.innerHTML="";
  if(panier.length===0){ vide.style.display="block"; btnCmd.disabled=true; totalEl.textContent="0 CDF"; return; }
  vide.style.display="none"; btnCmd.disabled=false;
  let total=0;
  panier.forEach(a=>{
    const sub=a.prix*a.quantite; total+=sub;
    const ligne=document.createElement("div");
    ligne.className="panier-ligne";
    ligne.innerHTML=`
      <div class="panier-info"><strong>${a.nom}</strong><span>${formaterPrix(a.prix)} x ${a.quantite}</span></div>
      <div class="panier-actions">
        <button data-action="moins" data-id="${a.id}">−</button><span>${a.quantite}</span><button data-action="plus" data-id="${a.id}">+</button>
        <button class="supprimer" data-action="supprimer" data-id="${a.id}">Supprimer</button>
      </div>
      <strong class="sous-total">${formaterPrix(sub)}</strong>
    `;
    contenu.appendChild(ligne);
  });
  totalEl.textContent=formaterPrix(total);
  contenu.querySelectorAll("button").forEach(b=>{
    const id=Number(b.dataset.id); const act=b.dataset.action;
    b.addEventListener("click",()=>{
      if(act==="plus") modifierQuantite(id,1);
      if(act==="moins") modifierQuantite(id,-1);
      if(act==="supprimer") supprimerDuPanier(id);
    });
  });
}

function commanderSurWhatsApp(){
  if(panier.length===0) return;
  let msg="Bonjour Bon-Goût !%0A%0AJe voudrais commander :%0A";
  let total=0;
  panier.forEach(a=>{
    const sub=a.prix*a.quantite; total+=sub;
    msg+=`%0A- ${a.nom} x${a.quantite} : ${formaterPrix(sub)}`;
  });
  msg+=`%0A%0ATotal : ${formaterPrix(total)}%0A%0ALivraison ou retrait sur place ? (si livraison, mon quartier : ...)%0A%0AMerci !`;
  // BUG FIX: numéro doit être string
  const url = "https://wa.me/"+NUMERO_WHATSAPP+"?text="+encodeURIComponent(decodeURIComponent(msg));
  window.open(url, "_blank");
}

const btnCmd=document.getElementById("commander");
if(btnCmd) btnCmd.addEventListener("click", commanderSurWhatsApp);

afficherMenu();
afficherPanier();
