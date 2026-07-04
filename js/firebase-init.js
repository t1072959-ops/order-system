// ============================================
// Firebase 設定檔
// 請依照 README.md 的步驟,建立一個「免費」的 Firebase 專案
// 然後把專案設定貼在下面的 firebaseConfig 裡
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyDzVEdHCPHbzdRCh-a6UmcWQxWwxkCk2i8",
  authDomain: "store-46293.firebaseapp.com",
  projectId: "store-46293",
  storageBucket: "store-46293.firebasestorage.app",
  messagingSenderId: "581356069497",
  appId: "1:581356069497:web:3b5eccd2128b90cdb46aa8",
};

// 後台登入密碼(簡易保護,不是高安全性,適合內部使用)
const ADMIN_PASSWORD = "0000"; // 請自行修改成你要的密碼

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
