/* ──────────────────────────────────────────────────────────────
   SoneSoneMommy POS v2 — Firebase init (Stage 1: Auth + Firestore)
   ──────────────────────────────────────────────────────────────
   Project: sonesonemommy-v2
   ────────────────────────────────────────────────────────────── */
(function () {

  var firebaseConfig = {
    apiKey:            "AIzaSyDXQE_ugV5iNFOwRdmBrm2JsSIsd4xCgTQ",
    authDomain:        "sonesonemommy-v2.firebaseapp.com",
    projectId:         "sonesonemommy-v2",
    storageBucket:     "sonesonemommy-v2.firebasestorage.app",
    messagingSenderId: "834724953198",
    appId:             "1:834724953198:web:9a4d48b68318e667eaba7f"
  };

  // compat SDK (vanilla multi-page app အတွက် အသင့်တော်ဆုံး)။ version ကို လိုရင် ပြောင်းလို့ရ။
  var VER  = "10.13.2";
  var base = "https://www.gstatic.com/firebasejs/" + VER + "/";
  var libs = ["firebase-app-compat.js", "firebase-auth-compat.js", "firebase-firestore-compat.js"];

  function loadSeq(i, done) {
    if (i >= libs.length) return done();
    var s = document.createElement("script");
    s.src = base + libs[i];
    s.onload  = function () { loadSeq(i + 1, done); };
    s.onerror = function () {
      console.error("Firebase SDK load failed:", libs[i]);
      document.dispatchEvent(new Event("fb-error"));
    };
    document.head.appendChild(s);
  }

  loadSeq(0, function () {
    try {
      firebase.initializeApp(firebaseConfig);
      var _db = firebase.firestore();
      // iOS/Safari မှာ Firestore realtime connection (WebChannel) မချိတ်တတ်လို့ long-polling သုံး
      try { _db.settings({ experimentalForceLongPolling: true, merge: true }); } catch (e) { console.warn("[fb] settings:", e); }
      window.fb = {
        auth: firebase.auth(),
        db:   _db,
        login:  function (email, pw) { return window.fb.auth.signInWithEmailAndPassword(email, pw); },
        logout: function () { return window.fb.auth.signOut(); }
      };
      try { window.fb.db.enablePersistence({ synchronizeTabs: true }).catch(function () {}); } catch (e) {}

      document.dispatchEvent(new Event("fb-ready"));
    } catch (e) {
      console.error("[fb] init failed:", e);
      document.dispatchEvent(new Event("fb-error"));
    }
  });

})();
