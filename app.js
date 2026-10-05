const SPEC=['Service desk & support','Networking','Cloud (Azure/AWS)','Cybersecurity','Software development','Data & SQL','Systems administration','Other'];
let db=null,uid=null,owner=false,me=null,myMatch=null,members=[],matches={},editing=false,role='mentee',msg='';
const app=document.getElementById('app');
const adminEl=document.getElementById('admin');
function route(){const n=document.getElementById('navCoord');if(n)n.hidden=!owner}
route();
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wa=n=>{let d=String(n||'').replace(/\D/g,'');if(d[0]==='0')d='27'+d.slice(1);return 'https://wa.me/'+d};
const opts=(l,v)=>l.map(x=>`<option${x===v?' selected':''}>${esc(x)}</option>`).join('');
const load=id=>Object.values(matches).filter(m=>m.role==='mentee'&&m.mentorId===id).length;
const pub=m=>({id:m.id,name:m.name,whatsapp:m.whatsapp,spec:m.spec,details:m.details});

function render(){
  if(!db){if(app)app.innerHTML='<h2>Join the program</h2><p class="sub">The sign-up service is not connected yet. Please check back soon.</p>';if(adminEl)adminEl.innerHTML='<p class="sub">The service is not connected yet.</p>';return}
  let h='<h2 style="margin-top:0">Join the program</h2>';
  if(!me||editing)h+=form();else h+=mine();
  if(app)app.innerHTML=h;
  if(adminEl)adminEl.innerHTML=owner?admin():'<p class="sub">This page is for the coordinator only. Use "Coordinator sign in" in the footer.</p>';
}
function form(){
  const m=me||{};role=m.role||role;
  return `<div class="card"><b>${me?'Edit your profile':'Join the program'}</b>
  <label>I want to be a</label><div class="seg"><button class="${role==='mentee'?'':'alt'}" onclick="setRole('mentee')">Mentee</button><button class="${role==='mentor'?'':'alt'}" onclick="setRole('mentor')">Mentor</button></div>
  <label>Full name</label><input id="f_name" value="${esc(m.name)}">
  <label>WhatsApp number</label><input id="f_wa" placeholder="e.g. 078 123 4567" value="${esc(m.whatsapp)}">
  <label>${role==='mentor'?'My specialisation':'Field I want to grow in'}</label><select id="f_spec">${opts(SPEC,m.spec)}</select>
  <label>${role==='mentor'?'Skills and experience I can share':'My goals (certification, portfolio, interview prep…)'}</label><textarea id="f_det">${esc(m.details)}</textarea>
  <label>Availability (days / times)</label><input id="f_av" value="${esc(m.avail)}">
  ${role==='mentor'?`<label>How many mentees can you take?</label><select id="f_cap">${opts(['1','2','3','4','5'],String(m.cap||2))}</select>`:''}
  <div class="chk"><input type="checkbox" id="f_ok"${me?' checked':''}><span>I agree that my name and WhatsApp number are shared only with the person I am matched with.</span></div>
  <div class="row"><button id="saveBtn" onclick="save()">Save</button>${me?'<button class="alt" onclick="editing=false;render()">Cancel</button>':''}</div><div class="err">${esc(msg)}</div></div>`;
}
function setRole(r){role=r;const k=['name','wa','spec','det','av'].map(x=>(document.getElementById('f_'+x)||{}).value);me=Object.assign({},me||{},{role:r,name:k[0],whatsapp:k[1],spec:k[2],details:k[3],avail:k[4]});render()}
async function save(){
  const g=i=>(document.getElementById(i)||{}).value||'';
  const d={role,name:g('f_name').trim(),whatsapp:g('f_wa').trim(),spec:g('f_spec'),details:g('f_det').trim(),avail:g('f_av').trim(),cap:role==='mentor'?+g('f_cap'):0,created:(me&&me.created)||Date.now()};
  if(!d.name||d.whatsapp.replace(/\D/g,'').length<9){msg='Please add your name and a valid WhatsApp number.';render();return}
  if(!document.getElementById('f_ok').checked){msg='Please tick the consent box.';render();return}
  document.getElementById('saveBtn').disabled=true;
  try{await db.doc('members/'+uid).set(d);msg='';editing=false}catch(e){msg='Could not save, please try again.'}
  render();
}
function mine(){
  let h=`<div class="card"><span class="tag">${esc(me.role)}</span><span class="tag">${esc(me.spec)}</span><p style="margin:10px 0 4px"><b>${esc(me.name)}</b></p><p class="mut" style="margin:0">${esc(me.details)}</p><div class="row"><button class="alt" onclick="editing=true;render()">Edit profile</button></div></div>`;
  h+='<h2>Your match</h2>';
  if(!myMatch){h+='<div class="card mut">You are on the list. The coordinator will pair you soon and your match will appear here.</div>';return h}
  const ps=myMatch.role==='mentor'?(myMatch.partners||[]):[myMatch.partner];
  if(!ps.length||!ps[0])return h+'<div class="card mut">No mentees assigned to you yet.</div>';
  ps.forEach(p=>{h+=`<div class="card"><b>${esc(p.name)}</b> <span class="tag">${esc(p.spec)}</span><p class="mut" style="margin:6px 0 10px">${esc(p.details)}</p><a class="btn" target="_blank" rel="noopener" href="${wa(p.whatsapp)}">Chat on WhatsApp</a></div>`});
  return h;
}
function admin(){
  const mentors=members.filter(m=>m.role==='mentor'),mentees=members.filter(m=>m.role==='mentee');
  const waiting=mentees.filter(m=>!(matches[m.id]&&matches[m.id].mentorId));
  let h=`<h2>Coordinator</h2><div class="stats"><div><b>${mentors.length}</b>Mentors</div><div><b>${mentees.length}</b>Mentees</div><div><b>${mentees.length-waiting.length}</b>Matched</div><div><b>${waiting.length}</b>Waiting</div></div>`;
  h+='<h2>Mentees</h2>';
  if(!mentees.length)h+='<div class="card mut">No mentees yet. Share the link in the WhatsApp group.</div>';
  mentees.forEach(m=>{
    const mm=matches[m.id],mt=mm&&mm.mentorId?members.find(x=>x.id===mm.mentorId):null;
    h+=`<div class="card"><b>${esc(m.name)}</b> <span class="tag">${esc(m.spec)}</span><p class="mut" style="margin:6px 0 0">${esc(m.details)}</p>`;
    if(mt)h+=`<div class="row"><span class="ok">Matched with ${esc(mt.name)}</span><button class="alt" onclick="doMatch('${m.id}',null)">Unmatch</button></div>`;
    else{
      const av=mentors.filter(x=>load(x.id)<(x.cap||1)).sort((a,b)=>(b.spec===m.spec)-(a.spec===m.spec));
      h+=av.length?`<div class="row"><select id="s_${m.id}">${av.map(x=>`<option value="${x.id}">${x.spec===m.spec?'★ ':''}${esc(x.name)} · ${esc(x.spec)} (${load(x.id)}/${x.cap||1})</option>`).join('')}</select><button onclick="doMatch('${m.id}',document.getElementById('s_${m.id}').value)">Match</button></div>`:'<p class="mut" style="margin:8px 0 0">No mentor with free capacity yet.</p>';
    }
    h+='</div>';
  });
  h+='<h2>Mentors</h2>';
  mentors.forEach(m=>{h+=`<div class="card"><b>${esc(m.name)}</b> <span class="tag">${esc(m.spec)}</span><span class="tag">${load(m.id)}/${m.cap||1} mentees</span><p class="mut" style="margin:6px 0 0">${esc(m.details)}</p></div>`});
  return h;
}
async function doMatch(menteeId,mentorId){
  const mentee=members.find(x=>x.id===menteeId),old=matches[menteeId]&&matches[menteeId].mentorId;
  try{
    if(mentorId){const mentor=members.find(x=>x.id===mentorId);await db.doc('matches/'+menteeId).set({role:'mentee',mentorId,partner:pub(mentor)});matches[menteeId]={role:'mentee',mentorId}}
    else{await db.doc('matches/'+menteeId).delete();delete matches[menteeId]}
    for(const id of new Set([old,mentorId].filter(Boolean))){
      const ps=members.filter(x=>matches[x.id]&&matches[x.id].role==='mentee'&&matches[x.id].mentorId===id).map(pub);
      await db.doc('matches/'+id).set({role:'mentor',partners:ps});
    }
  }catch(e){alert('Could not update the match, please try again.')}
  render();
}
(async()=>{
  try{
    if(!window.claude)throw 0;
    const user=await claude.use('user');db=await claude.use('db');
    if(!db||!user)throw 0;
    uid=await user.id();owner=await user.isOwner();
  }catch(e){db=null;render();return}
  db.doc('members/'+uid).onSnapshot(s=>{me=s.exists?s.data():null;render()},()=>{});
  db.doc('matches/'+uid).onSnapshot(s=>{myMatch=s.exists?s.data():null;render()},()=>{});
  if(owner){
    db.collection('members').onSnapshot(s=>{members=s.docs.map(d=>Object.assign({id:d.id},d.data()));render()},()=>{});
    db.collection('matches').onSnapshot(s=>{matches={};s.docs.forEach(d=>matches[d.id]=d.data());render()},()=>{});
  }
  route();render();
})();
