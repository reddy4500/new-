
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig={
  apiKey:"AIzaSyBQrSN31bs0dqpyZVT_IeGktPEy7rMrqcQ",
  databaseURL:"https://yaswanth-fleet-default-rtdb.firebaseio.com"
};

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);

const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];

function lossAlert(bus){
  let c=0;
  for(const m of MONTHS){
    if(bus[m]&&bus[m].profit<0)c++; else c=0;
    if(c>=3)return true;
  }
  return false;
}

const auditSnap = await get(ref(db,"auditData"));
const dieselSnap = await get(ref(db,"dieselData"));
const audit=auditSnap.val()||{};
const diesel=dieselSnap.val()||{};

const fleet={};
MONTHS.forEach(m=>{
  Object.values(audit[m]||{}).forEach(r=>{
    const b=r.busNumber?.toUpperCase(); if(!b)return;
    if(!fleet[b])fleet[b]={};
    const d=Object.values(diesel[m]?.[b]||{}).reduce((a,v)=>a+v,0);
    const rev=+r.revenue||0;
    const exp=(+r.expense||0)+d;
    fleet[b][m]={profit:rev-exp};
  });
});

const filter=document.getElementById("busFilter");
Object.keys(fleet).forEach(b=>filter.add(new Option(b,b)));
filter.onchange=render;

function render(){
  const b=filter.value;
  const months=Object.keys(fleet[b]);
  const profits=months.map(m=>fleet[b][m].profit);
  if(lossAlert(fleet[b]))document.getElementById("alerts").innerText="⚠ 3 Month Continuous Loss";
  new Chart(document.getElementById("chart"),{
    type:"bar",
    data:{labels:months,datasets:[{label:"Profit",data:profits}]},
    options:{responsive:true}
  });
}
render();
