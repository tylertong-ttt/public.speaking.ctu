const DATA = {
  part1: [
    {id:"p1-1", name:"Ánh Dương", title:"The Power of Personal Experience in Presentations", tags:["Personal knowledge","Practical experience","Research + presentation"], summary:"Do not strip a speech of its human side. Start by checking what you already know, then use outside information as the foundation and personal experience as the “spice”.", steps:["Start with a real experience","Avoid dry statistics only","Combine research + personal insight"]},
    {id:"p1-2", name:"Mai Thảo", title:"The Balance Between Outside Information and Personal Touch", tags:["Outside information","Personal experience","Balance"], summary:"Facts and research support an idea; personal experience adds color and human interest. The goal is not to choose one—it is to balance both.", steps:["Ask what research is needed","Support ideas with facts","Make facts relatable"]},
    {id:"p1-3", name:"Tú Quyên", title:"Textbook Example & Final Takeaway", tags:["Facts & figures","Color","Human interest"], summary:"A textbook example shows how research about U.S. National Parks became more meaningful when combined with firsthand experience at Great Smoky Mountains National Park.", steps:["Use facts & figures","Add lived details","Make the idea vivid"]},
  ],
  library: [
    {id:"p1-4", name:"Tấn Nhất", title:"Librarians & The Catalogue", tags:["Librarians","The catalogue","Call number"], summary:"Do not wander blindly through the library. Ask the librarian, use the catalogue, find the call number, and go straight to the relevant shelf.", steps:["Ask the expert","Search the catalogue","Use the call number"]},
    {id:"p1-5", name:"Ánh Thư", title:"Databases & Reference Works", tags:["Abstract","Full article","Databases"], summary:"An abstract is only a summary. For stronger research, consult the full article and use library databases and reference works to filter and deepen information.", steps:["Never rely on abstract alone","Open the full article","Use databases + references"]},
  ],
  internet: [
    {id:"p2-1", name:"DQ", title:"Search Smarter, Not Harder", tags:["Search strategy","Specific keywords","Right source"], summary:"Broad searches create noise. Make the query specific, then choose the source type for the purpose: News for recent information, Books for detailed background.", steps:["Avoid broad searches","Add specific keywords","Pick source for purpose"]},
    {id:"p2-2", name:"Thanh Thuyền", title:"Specialized Research Resources", tags:["Government websites","Official information","Wikipedia"], summary:"Government resources can provide official data. Wikipedia is useful as a starting point, but its references should be checked and followed to stronger primary sources.", steps:["Use official resources","Use Wikipedia for overview","Follow the references"]},
    {id:"p2-3", name:"Yen Khoa", title:"Evaluating Internet Documents", tags:["Authorship","Sponsorship","Recency"], summary:"Finding a page is not the same as finding a trustworthy source. Check who wrote it, who is responsible for it, and how recent the information is.", steps:["Who wrote it?","Who supports it?","How recent is it?"]},
  ],
  interview: [
    {id:"p4-1", name:"Như Mộng + H’Thảo", title:"Three Steps to Participate in an Interview", tags:["Purpose","Person","Arrange","Record","Questions","On time","Listen","Notes","Review","Transcribe"], summary:"An effective interview has three phases: prepare with a clear purpose and questions; conduct it professionally and on time; then review, transcribe and organize information accurately.", steps:["Before: purpose + person + questions","During: listen + record responsibly","After: review + transcribe + organize"]},
  ],
  tips: [
    {id:"p5-1", name:"Dương Quỳnh", title:"Tips to Make Research Easier", tags:["Start early","Preliminary bibliography","Sources"], summary:"Starting early creates room for problems and thinking. Keep a preliminary bibliography so useful books, articles and documents are not lost while researching.", steps:["Start early","Collect possible sources","Narrow the list later"]},
    {id:"p5-2", name:"Thế Thuận", title:"Messy Notes = Fluffy Speeches", tags:["Topic tag","Source","Fact / quote"], summary:"Clean notes make clean speeches. Use a simple three-part layout, keep one idea per note, and clearly separate your own thoughts from an author's exact words.", steps:["Topic tag + source + fact","One idea, one note","Mark quotations clearly"]},
    {id:"p5-3", name:"Phi Vân", title:"Think about Your Materials as You Research", tags:["Imagine","Allow","Change"], summary:"Research is not only about finding evidence for what you already believe. New information can complicate, challenge or change the first idea.", steps:["Start with an assumption","Let evidence challenge it","Refine the conclusion"]},
  ]
};

const STORAGE_KEY = "fact-not-fluff-v1";
let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
let editMode = false;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let activeItem = null;
let activeCard = null;
function currentValue(item,key,fallback){ return state[item.id]?.text?.[key] ?? fallback; }
function makeCard(item, index){
  const node = document.importNode($("#speakerTemplate").content, true);
  const card = node.querySelector(".speaker-card"); card.dataset.id=item.id;
  node.querySelector(".speaker-index").textContent=String(index+1).padStart(2,"0");
  node.querySelector(".speaker-name").textContent=currentValue(item,"speaker-name",item.name);
  const title=node.querySelector(".speaker-title"); title.textContent=currentValue(item,"speaker-title",item.title);
  title.setAttribute("role","button"); title.setAttribute("tabindex","0"); title.setAttribute("aria-label","Open details: "+item.title);
  title.addEventListener("click",()=>openDetail(item,card));
  title.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openDetail(item,card);}});
  node.querySelector(".speaker-summary").textContent=currentValue(item,"speaker-summary",item.summary);
  const tags=state[item.id]?.text?.tags || item.tags;
  tags.forEach(t=>{const el=document.createElement("span");el.className="tag";el.textContent=t;node.querySelector(".speaker-tags").appendChild(el);});
  const steps=state[item.id]?.text?.steps || item.steps;
  ["step1","step2","step3"].forEach((c,i)=>node.querySelector("."+c).textContent=steps[i]||"");
  const saved=state[item.id];
  if(saved?.image){const img=node.querySelector(".speaker-image");img.src=saved.image;img.hidden=false;node.querySelector(".media-placeholder").style.display="none";}
  node.querySelector(".image-input").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>saveImage(item.id,r.result,card);r.readAsDataURL(f);});
  node.querySelector(".remove-image").addEventListener("click",()=>removeImage(item.id,card));
  node.querySelector(".card-edit").addEventListener("click",()=>openDetail(item,card,true));
  return node;
}
function openDetail(item, card, edit=false){
  activeItem=item;activeCard=card;
  const modal=$("#detailModal");
  $("#detailName").textContent=currentValue(item,"speaker-name",item.name);
  $("#detailTitle").textContent=currentValue(item,"speaker-title",item.title);
  $("#detailSummary").textContent=currentValue(item,"speaker-summary",item.summary);
  const img=$("#detailImage"), saved=state[item.id]?.image;
  if(saved){img.src=saved;img.hidden=false;}else{img.hidden=true;img.removeAttribute("src");}
  const tags=$("#detailTags");tags.innerHTML="";(state[item.id]?.text?.tags||item.tags).forEach(t=>{const el=document.createElement("span");el.className="tag";el.textContent=t;tags.appendChild(el);});
  const steps=$("#detailSteps");steps.innerHTML="";(state[item.id]?.text?.steps||item.steps).forEach((t,i)=>{const d=document.createElement("div");const b=document.createElement("b");b.textContent="0"+(i+1);const span=document.createElement("span");span.textContent=t;d.append(b,span);steps.appendChild(d);});
  const txt=state[item.id]?.text||{};$("#editName").value=txt["speaker-name"]??item.name;$("#editTitle").value=txt["speaker-title"]??item.title;$("#editSummary").value=txt["speaker-summary"]??item.summary;
  $("#editTags").value=(txt.tags||item.tags).join(", ");const st=txt.steps||item.steps;
  ["#editStep1","#editStep2","#editStep3"].forEach((sel,i)=>$(sel).value=st[i]||"");
  $("#detailEditor").hidden=!edit;$("#editDetailBtn").hidden=edit;
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");
}
function removeImage(id,card){
  if(!state[id])state[id]={};delete state[id].image;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  if(card){const img=card.querySelector(".speaker-image");img.hidden=true;img.removeAttribute("src");card.querySelector(".media-placeholder").style.display="grid";}
  if(activeItem?.id===id){const img=$("#detailImage");img.hidden=true;img.removeAttribute("src");}
}
$("#editDetailBtn").addEventListener("click",()=>openDetail(activeItem,activeCard,true));
$("#cancelDetailEdit").addEventListener("click",()=>{if(activeItem)openDetail(activeItem,activeCard,false);});
$("#detailImageInput").addEventListener("change",e=>{const f=e.target.files[0];if(!f||!activeItem)return;const r=new FileReader();r.onload=()=>{saveImage(activeItem.id,r.result,activeCard);const im=$("#detailImage");im.src=r.result;im.hidden=false;};r.readAsDataURL(f);});
$("#removeDetailImage").addEventListener("click",()=>{if(activeItem)removeImage(activeItem.id,activeCard);});
$("#detailEditor").addEventListener("submit",e=>{
  e.preventDefault();if(!activeItem)return;state[activeItem.id] ||= {};state[activeItem.id].text ||= {};
  const t=state[activeItem.id].text;t["speaker-name"]=$("#editName").value.trim();t["speaker-title"]=$("#editTitle").value.trim();t["speaker-summary"]=$("#editSummary").value.trim();
  t.tags=$("#editTags").value.split(",").map(x=>x.trim()).filter(Boolean);t.steps=[$("#editStep1").value.trim(),$("#editStep2").value.trim(),$("#editStep3").value.trim()];
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));render();
  const newCard=document.querySelector(`.speaker-card[data-id="${activeItem.id}"]`);openDetail(activeItem,newCard,false);
});

function closeDetail(){
 const m=$("#detailModal");m.classList.remove("open");m.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");
}
document.querySelectorAll("[data-close-detail]").forEach(el=>el.addEventListener("click",closeDetail));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDetail();});

function render(){
  [["part1Speakers",DATA.part1],["librarySpeakers",DATA.library],["internetSpeakers",DATA.internet],["interviewSpeakers",DATA.interview],["tipsSpeakers",DATA.tips]].forEach(([id,arr])=>{
    const box=$("#"+id); box.innerHTML="";
    arr.forEach((x,i)=>box.appendChild(makeCard(x,i)));
  });
  syncEditables();
  observeReveals();
}
function saveImage(id, data, card){
  state[id] ||= {};
  state[id].image=data;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  const img=card.querySelector(".speaker-image"); img.src=data; img.hidden=false; card.querySelector(".media-placeholder").style.display="none";
}
function syncEditables(){
  $$(".speaker-name,.speaker-title,.speaker-summary").forEach(el=>{
    el.contentEditable=editMode;
    el.oninput=()=>{ const card=el.closest(".speaker-card"); const id=card.dataset.id; state[id] ||= {}; state[id].text ||= {}; state[id].text[el.className.split(" ")[0]]=el.textContent; localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); };
  });
}
function toggleEdit(on){
  editMode=on; document.body.classList.toggle("editing",on); $("#editPanel").classList.toggle("open",on); $("#editPanel").setAttribute("aria-hidden",String(!on)); syncEditables();
}
function exportData(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="fact-not-fluff-content.json"; a.click(); URL.revokeObjectURL(a.href);
}
$("#importInput").addEventListener("change", e=>{
  const f=e.target.files[0]; if(!f) return; const r=new FileReader();
  r.onload=()=>{ try{ state=JSON.parse(r.result); localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); render(); alert("Imported."); }catch{ alert("Invalid JSON file."); } };
  r.readAsText(f);
});
$("#saveBtn").onclick=()=>{ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); alert("Saved in this browser."); };
$("#exportBtn").onclick=exportData;
$("#resetBtn").onclick=()=>{ if(confirm("Reset all local edits and images?")){state={};localStorage.removeItem(STORAGE_KEY);render();} };
$("#editBtn").onclick=()=>toggleEdit(true);
$("#closeEditBtn").onclick=()=>toggleEdit(false);

const slides = [
  {k:"OPENING",h:"FACT, NOT FLUFF.",p:"Gathering Materials · Chapter 7",t:["30 MINUTES","PUBLIC SPEAKING"]},
  {k:"PART 01",h:"Know your materials.",p:"Personal knowledge + library research.",t:["EXPERIENCE","LIBRARY"]},
  {k:"PART 02",h:"Search smarter.",p:"Specific keywords + the right source + source evaluation.",t:["SEARCH","VERIFY"]},
  {k:"PART 03",h:"Turn research into a speech.",p:"Interview + clean notes + an open mind.",t:["INTERVIEW","NOTES","REFINE"]},
  {k:"FINAL CHECK",h:"Who made it? Who supports it? How recent is it?",p:"If the material does not strengthen the speech, it may be fluff.",t:["KNOW","SEARCH","VERIFY","SHAPE"]}
];
let slide=0;
function showSlide(){
  const s=slides[slide]; $("#presentCounter").textContent=String(slide+1).padStart(2,"0");
  $("#presentContent").innerHTML=`<div class="present-slide"><span class="kicker">${s.k}</span><h2>${s.h}</h2><p>${s.p}</p><div class="present-tags">${s.t.map(x=>`<span>${x}</span>`).join("")}</div></div>`;
}
function openPresent(){slide=0;showSlide();$("#presentOverlay").classList.add("open");$("#presentOverlay").setAttribute("aria-hidden","false")}
function closePresent(){$("#presentOverlay").classList.remove("open");$("#presentOverlay").setAttribute("aria-hidden","true")}
$("#presentBtn").onclick=openPresent; $("#closePresent").onclick=closePresent;
$("#nextSlide").onclick=()=>{slide=Math.min(slides.length-1,slide+1);showSlide()};
$("#prevSlide").onclick=()=>{slide=Math.max(0,slide-1);showSlide()};
document.addEventListener("keydown",e=>{
  if(!$("#presentOverlay").classList.contains("open")) return;
  if(e.key==="ArrowRight"||e.key===" ") {e.preventDefault();$("#nextSlide").click()}
  if(e.key==="ArrowLeft"){e.preventDefault();$("#prevSlide").click()}
  if(e.key==="Escape")closePresent();
});
$("#showFlow").onclick=()=>$("#overview").scrollIntoView({behavior:"smooth"});

function observeReveals(){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});
  $$(".reveal").forEach(el=>io.observe(el));
}
window.addEventListener("scroll",()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  $("#progressBar").style.width=(h?window.scrollY/h*100:0)+"%";
});
render();
