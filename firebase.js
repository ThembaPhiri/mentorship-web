/* Backend for GitHub Pages: Firebase (free tier). Fill in from Firebase console > Project settings > Your apps > Web app. */
const FIREBASE_CONFIG={apiKey:"AIzaSyCeFcor2Zf76ahoRowRGkbwe9TiWJ_rPPg",authDomain:"it-mentorship.firebaseapp.com",projectId:"it-mentorship",appId:"1:1013022463905:web:d3866dba7a80943e33dde0"};
const COORDINATOR_EMAIL="p.themba3468@gmail.com"; /* the Google account of the coordinator */
if(!window.claude&&FIREBASE_CONFIG.projectId&&window.firebase){
  firebase.initializeApp(FIREBASE_CONFIG);
  const auth=firebase.auth(),fs=firebase.firestore();
  const ready=new Promise(r=>{const u=auth.onAuthStateChanged(x=>{u();r(x)})}).then(x=>x||auth.signInAnonymously().then(c=>c.user));
  window.claude={use:async k=>{
    const u=await ready;
    if(k==='user')return{id:async()=>u.uid,isOwner:async()=>!!COORDINATOR_EMAIL&&u.email===COORDINATOR_EMAIL};
    if(k==='db')return fs;
  }};
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('coordLogin').addEventListener('click',async e=>{e.preventDefault();
      try{await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());location.href='coordinator.html'}catch(_){}});
  });
}

