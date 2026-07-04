// ============================================
// Firebase 設定檔
// 請依照 README.md 的步驟,建立一個「免費」的 Firebase 專案
// 然後把專案設定貼在下面的 firebaseConfig 裡
// ============================================

const firebaseConfig = {
  apiKey: "請貼上你的 apiKey",
  authDomain: "請貼上你的 authDomain",
  projectId: "請貼上你的 projectId",
  storageBucket: "請貼上你的 storageBucket",
  messagingSenderId: "請貼上你的 messagingSenderId",
  appId: "請貼上你的 appId",
};

// 後台登入密碼(簡易保護,不是高安全性,適合內部使用)
const ADMIN_PASSWORD = "0000"; // 請自行修改成你要的密碼

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
