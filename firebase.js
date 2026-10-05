/* Backend for GitHub Pages: Firebase (free tier). Fill in from Firebase console > Project settings > Your apps > Web app. */
const FIREBASE_CONFIG={apiKey:"AIzaSyCeFcor2Zf76ahoRowRGkbwe9TiWJ_rPPg",authDomain:"it-mentorship.firebaseapp.com",projectId:"it-mentorship",appId:"1:1013022463905:web:d3866dba7a80943e33dde0"};
const COORDINATOR_EMAIL="p.themba3468@gmail.com"; /* the Google account of the coordinator */
if(!window.claude&&FIREBASE_CONFIG.projectId&&window.firebase){
  firebase.initializeApp(FIREBASE_CONFIG);
  const auth=firebase.auth(),fs=firebase.firestore();
  const ready0=new Promise(r=>{const u=auth.onAuthStateChanged(x=>{u();r(x)})}).then(x=>x||auth.signInAnonymously().then(c=>c.user));
  const ready=ready0.then(u=>{window.signedInEmail=u.email||'';return u});
  window.claude={use:async k=>{
    const u=await ready;
    if(k==='user')return{id:async()=>u.uid,isOwner:async()=>!!COORDINATOR_EMAIL&&u.email===COORDINATOR_EMAIL};
    if(k==='db')return fs;
  }};
  document.addEventListener('DOMContentLoaded',()=>{
    const link=document.getElementById('coordLogin');if(!link)return;
    link.addEventListener('click',async e=>{e.preventDefault();
      const p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
      try{await auth.signInWithPopup(p);location.href='coordinator.html'}
      catch(err){
        const c=err&&err.code||'';
        const why={'auth/unauthorized-domain':'This website address is not in Firebase > Authentication > Settings > Authorized domains. Add thembaphiri.github.io.','auth/operation-not-allowed':'Google sign-in is not switched on in Firebase > Authentication > Sign-in method.','auth/popup-blocked':'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.','auth/popup-closed-by-user':'The sign-in window closed before finishing. Allow pop-ups, turn off tracking prevention for this site, or try Chrome.','auth/cancelled-popup-request':'Sign-in was interrupted. Click the link once and wait.'}[c];
        alert('Coordinator sign-in failed.\n\n'+(why||(err&&err.message)||'Unknown error')+(c?'\n\nCode: '+c:''));
      }});
  });
}

