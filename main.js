import './style.css';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const citySelect = document.querySelector('#citySelect');
const playerName = document.querySelector('#playerName');
const houseName = document.querySelector('#houseName');
const houseList = document.querySelector('#houseList');
const statusEl = document.querySelector('#status');
const hint = document.querySelector('#hint');

const colors = ['#ff8f70','#ffd166','#8ecae6','#cdb4db','#95d5b2','#f4a261'];
let houses = [];
let selectedHouse = null;
let db = null;
let online = false;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('COLOQUE')) {
    db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    online = true;
  }
} catch (e) { console.warn('Supabase não configurado:', e); }

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(320, Math.floor(rect.width * dpr));
  canvas.height = Math.max(300, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawScene();
}
function roundedRect(x,y,w,h,r,fill,stroke) {
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r);
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke(); }
}
function drawTree(x,y,s=1) {
  ctx.fillStyle='#8b5a2b'; ctx.fillRect(x-3*s,y+8*s,6*s,15*s);
  ctx.fillStyle='#319b62';
  for (const [dx,dy,r] of [[0,0,15],[-9,7,10],[9,7,10]]) {
    ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,r*s,0,Math.PI*2);ctx.fill();
  }
}
function drawHouse(h, index, w, hgt) {
  const x = h.x * w, y = h.y * hgt;
  const scale = h.scale || 1;
  const bw=42*scale,bh=32*scale;
  // shadow
  ctx.fillStyle='rgba(45,66,55,.15)';ctx.beginPath();ctx.ellipse(x,y+bh+8*scale,bw*.7,7*scale,0,0,Math.PI*2);ctx.fill();
  // body
  roundedRect(x-bw/2,y,bw,bh,4,h.color || colors[index%colors.length],'#754b32');
  // roof
  ctx.beginPath();ctx.moveTo(x-bw/2-5*scale,y+3*scale);ctx.lineTo(x,y-18*scale);ctx.lineTo(x+bw/2+5*scale,y+3*scale);ctx.closePath();
  ctx.fillStyle=h.roof || '#b94c3c';ctx.fill();ctx.strokeStyle='#754b32';ctx.lineWidth=2;ctx.stroke();
  // door and windows
  ctx.fillStyle='#7a4932';ctx.fillRect(x-5*scale,y+bh-15*scale,10*scale,15*scale);
  ctx.fillStyle='#dff6ff';ctx.fillRect(x-16*scale,y+9*scale,8*scale,8*scale);ctx.fillRect(x+8*scale,y+9*scale,8*scale,8*scale);
  // name label
  ctx.font=`${Math.max(9,10*scale)}px system-ui`;ctx.textAlign='center';
  const label=(h.owner || 'Jogador').slice(0,15);
  const tw=ctx.measureText(label).width+12;
  roundedRect(x-tw/2,y-37*scale,tw,17*scale,7,'rgba(255,255,255,.93)',selectedHouse===h.id?'#246bce':'#cbd5e1');
  ctx.fillStyle='#263238';ctx.fillText(label,x,y-25*scale);
}
function drawScene() {
  if (!ctx) return;
  const w=canvas.clientWidth || 600, hgt=canvas.clientHeight || 360;
  ctx.clearRect(0,0,w,hgt);
  // sky and grass
  const sky=ctx.createLinearGradient(0,0,0,hgt);sky.addColorStop(0,'#bdeaff');sky.addColorStop(.5,'#d9f7ff');sky.addColorStop(.51,'#8ed58d');sky.addColorStop(1,'#66bd78');
  ctx.fillStyle=sky;ctx.fillRect(0,0,w,hgt);
  // distant hills
  ctx.fillStyle='#7acb85';ctx.beginPath();ctx.moveTo(0,hgt*.48);ctx.quadraticCurveTo(w*.2,hgt*.2,w*.42,hgt*.49);ctx.quadraticCurveTo(w*.72,hgt*.18,w,hgt*.46);ctx.lineTo(w,hgt);ctx.lineTo(0,hgt);ctx.fill();
  // winding road
  ctx.strokeStyle='#d6c9a9';ctx.lineWidth=52;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-20,hgt*.78);ctx.bezierCurveTo(w*.25,hgt*.65,w*.42,hgt*.95,w*.58,hgt*.72);ctx.bezierCurveTo(w*.72,hgt*.55,w*.78,hgt*.72,w+20,hgt*.55);ctx.stroke();
  ctx.strokeStyle='#fff4d3';ctx.lineWidth=3;ctx.setLineDash([12,12]);ctx.stroke();ctx.setLineDash([]);
  // clouds
  for (const [x,y] of [[w*.18,hgt*.12],[w*.7,hgt*.14]]) {
    ctx.fillStyle='rgba(255,255,255,.85)';
    for (const [dx,dy,r] of [[0,0,13],[14,-5,17],[30,1,12]]) {ctx.beginPath();ctx.arc(x+dx,y+dy,r,0,Math.PI*2);ctx.fill();}
  }
  drawTree(w*.09,hgt*.48,.9);drawTree(w*.88,hgt*.4,1);drawTree(w*.93,hgt*.8,.75);drawTree(w*.14,hgt*.88,.7);
  // little pond
  ctx.fillStyle='#59c7e8';ctx.beginPath();ctx.ellipse(w*.77,hgt*.86,34,13,-.15,0,Math.PI*2);ctx.fill();
  const cityHouses=houses.filter(a=>a.city===citySelect.value);
  if (!cityHouses.length) {
    const sample=[
      {id:'sample1',owner:'Ana',x:.31,y:.52,scale:.85,color:'#ffd166',roof:'#bf4f42'},
      {id:'sample2',owner:'João',x:.49,y:.43,scale:1,color:'#ff9f80',roof:'#9f4141'},
      {id:'sample3',owner:'Bia',x:.68,y:.58,scale:.9,color:'#a8dadc',roof:'#6c4b9a'}
    ];
    sample.forEach((house,i)=>drawHouse(house,i,w,hgt));
  } else {
    cityHouses.forEach((house,i)=>drawHouse(house,i,w,hgt));
  }
}
function renderList() {
  houseList.innerHTML='';
  const list=houses.filter(h=>h.city===citySelect.value);
  if (!list.length) {
    houseList.innerHTML='<div class="empty">Ainda não há casas criadas nesta cidade.</div>';
    return;
  }
  list.forEach(h=>{
    const b=document.createElement('button');b.className='house-item';b.textContent=`🏠 ${h.name} — ${h.owner}`;
    b.onclick=()=>{selectedHouse=h.id;drawScene();};
    houseList.appendChild(b);
  });
}
async function loadHouses() {
  if (online && db) {
    try {
      const { data, error } = await db.from('houses').select('*').eq('city',citySelect.value).order('created_at',{ascending:true});
      if (error) throw error;
      houses = [...houses.filter(h=>h.city!==citySelect.value), ...(data||[])];
      statusEl.textContent='Online conectado';
      hint.textContent='Online conectado: as casas salvas no banco podem aparecer para outros jogadores.';
    } catch (e) {
      console.warn(e); statusEl.textContent='Banco não configurado'; 
    }
  }
  renderList();drawScene();
}
document.querySelector('#buildBtn').addEventListener('click', async()=>{
  const owner=playerName.value.trim();
  const name=houseName.value.trim();
  if (!owner || !name) { alert('Digite seu nome e o nome da casa.'); return; }
  if (houses.some(h=>h.city===citySelect.value && h.owner.toLowerCase()===owner.toLowerCase())) {
    alert('Este jogador já tem uma casa nesta cidade.');return;
  }
  const cityHouses=houses.filter(h=>h.city===citySelect.value);
  const house={id:`local-${Date.now()}`,city:citySelect.value,owner,name,x:[.28,.48,.68,.38,.59][cityHouses.length%5],y:[.56,.43,.58,.72,.76][cityHouses.length%5],scale:.9,color:colors[cityHouses.length%colors.length],roof:'#b94c3c'};
  if (online && db) {
    try {
      const {data,error}=await db.from('houses').insert([{city:house.city,owner:house.owner,name:house.name,x:house.x,y:house.y,color:house.color,roof:house.roof}]).select().single();
      if (error) throw error;
      houses.push(data);statusEl.textContent='Casa salva online';
    } catch(e) {
      alert('Não consegui salvar online. Configure a tabela no Supabase e tente novamente.');
      console.error(e);return;
    }
  } else {
    houses.push(house);
  }
  houseName.value='';renderList();drawScene();
});
citySelect.addEventListener('change',loadHouses);
document.querySelector('#homeBtn').addEventListener('click',()=>{
  const owner=playerName.value.trim();
  const h=houses.find(x=>x.city===citySelect.value && x.owner.toLowerCase()===owner.toLowerCase());
  if (h) {selectedHouse=h.id;drawScene();} else alert('Sua casa ainda não foi criada nesta cidade.');
});
canvas.addEventListener('click',e=>{
  const r=canvas.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;
  const cityHouses=houses.filter(a=>a.city===citySelect.value);
  const found=cityHouses.find(h=>Math.abs(h.x*r.width-x)<45 && Math.abs(h.y*r.height-y)<55);
  if(found){selectedHouse=found.id;drawScene();}
});
window.addEventListener('resize',resizeCanvas);
resizeCanvas();
loadHouses();
