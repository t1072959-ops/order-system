# 線上點餐系統 - 設定教學

完全免費架構:
- 網頁放在 **GitHub Pages**(免費)
- 資料庫 + 即時推送用 **Firebase Firestore**(免費額度,單店家使用完全夠,不需要信用卡)

整套系統只有純 HTML/CSS/JS,沒有伺服器程式,所以沒有「執行時間」或「主機」費用問題。

---

## 一、建立免費 Firebase 專案(5分鐘)

1. 前往 https://console.firebase.google.com/ ,用 Google 帳號登入
2. 點「新增專案」,輸入專案名稱(例如 `my-order-system`),一路下一步建立(不需要信用卡,Spark 免費方案)
3. 建立完成後,進入專案主控台,點左側 **建構 → Firestore Database**
4. 點「建立資料庫」→ 選擇「以測試模式啟動」→ 選擇離你近的地區(如 `asia-east1`)
5. 進入 Firestore 的「規則」分頁,把規則換成下面內容,再按「發布」:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read, write: if true;
    }
    match /meta/{docId} {
      allow read, write: if true;
    }
  }
}
```

> 這個規則是「完全開放」,方便單店家內部使用。之後若想更安全,可以研究 Firebase Authentication,但目前先求有再求好。

6. 回到專案總覽頁(點左上角齒輪 → 專案設定),往下滑到「你的應用程式」,點網頁圖示 `</>` 建立一個網頁應用
7. 建立後會出現一段 `firebaseConfig = {...}` 的設定,把裡面 6 組值複製起來

---

## 二、填入你的專案設定

打開 `js/firebase-init.js`,把剛剛複製的 6 組值貼進對應位置:

```js
const firebaseConfig = {
  apiKey: "AIzaSy....",
  authDomain: "my-order-system.firebaseapp.com",
  projectId: "my-order-system",
  storageBucket: "my-order-system.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

同一個檔案裡也可以修改後台登入密碼:

```js
const ADMIN_PASSWORD = "0000"; // 改成你自己的密碼
```

---

## 三、修改菜單

打開 `js/menu.js`,修改店名、分類、品項、價格即可,格式範例都寫在檔案裡,不需要動其他程式。

---

## 四、放到 GitHub Pages(免費部署)

1. 在 GitHub 建立一個新的 **Public** repository(例如 `order-system`)
2. 把這整個資料夾的檔案上傳上去(可以直接在 GitHub 網頁上「Add file → Upload files」拖曳整個資料夾內容)
3. 進入 repository 的 **Settings → Pages**
4. 「Source」選擇 `Deploy from a branch`,Branch 選擇 `main` / `/(root)`,按 Save
5. 等 1-2 分鐘,GitHub 會給你一個網址,類似:
   `https://你的帳號.github.io/order-system/`

這就是你的點餐系統網址了。

- 顧客點餐頁:`https://你的帳號.github.io/order-system/index.html`
- 店家後台:`https://你的帳號.github.io/order-system/admin.html`

---

## 五、產生 QR Code 貼在店裡

1. 打開後台網址,輸入密碼登入
2. 點右上角「產生點餐 QR Code」按鈕
3. 會跳出 QR Code,截圖或右鍵下載後印出來,貼在桌上或菜單上
4. 客人掃碼就會直接打開點餐頁面

---

## 六、日常使用方式

- **客人**:掃 QR Code → 選餐點數量 → 填備註 → 按「送出訂單」
- **店家**:開著 `admin.html` 後台頁面,新訂單一送出會立即跳出卡片並發出提示音,出餐完成按「完成出餐」即可

---

## 常見問題

**Q: 需要付費嗎?**
Firebase 免費額度(Spark 方案)每天約可處理 5萬次讀取 / 2萬次寫入,單店家一天訂單量遠遠用不完,完全免費且不需要信用卡。GitHub Pages 完全免費。

**Q: 後台密碼安全嗎?**
這是「簡易保護」,適合內部快速使用,密碼是寫在前端程式裡,技術上懂的人可以看到。若之後生意變大想要更嚴謹,可以再升級成 Firebase Authentication 帳號登入。

**Q: 可以多家店一起用嗎?**
目前版本是單店家單菜單設計。如果之後要擴充成多店家,可以在資料庫多加一個「店家 ID」欄位來區分,需要再改一版架構,再麻煩另外提出需求即可。

**Q: 訂單編號怎麼產生的?**
每天從 A-01 開始自動編號,滿 99 筆後自動變成 B-01,每天午夜(依訂單建立時間)重新從 A-01 開始。
