// ============================================
// 店家後台邏輯
// ============================================

document.getElementById("storeNameAdmin").textContent = `${STORE_NAME} · 訂單看板`;

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");

function tryLogin() {
  if (passwordInput.value === ADMIN_PASSWORD) {
    sessionStorage.setItem("admin_ok", "1");
    showDashboard();
  } else {
    loginError.textContent = "密碼錯誤,請再試一次";
    passwordInput.value = "";
  }
}

document.getElementById("loginBtn").addEventListener("click", tryLogin);
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryLogin();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("admin_ok");
  location.reload();
});

function showDashboard() {
  loginScreen.style.display = "none";
  dashboard.style.display = "block";
  startListening();
}

if (sessionStorage.getItem("admin_ok") === "1") {
  showDashboard();
}

// ---- 提示音(不需外部檔案,用 Web Audio 產生一聲提示音) ----
function playPing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    /* 瀏覽器可能需要使用者互動後才能播放音效,忽略錯誤即可 */
  }
}

// ---- 即時監聽訂單 ----
let isFirstLoad = true;
let knownIds = new Set();

function startListening() {
  db.collection("orders")
    .orderBy("createdAt", "desc")
    .limit(60)
    .onSnapshot((snapshot) => {
      const orders = [];
      snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));

      if (!isFirstLoad) {
        const newOnes = orders.filter((o) => !knownIds.has(o.id));
        if (newOnes.length > 0) playPing();
      }
      knownIds = new Set(orders.map((o) => o.id));
      isFirstLoad = false;

      renderOrders(orders);
    }, (err) => {
      console.error(err);
      document.getElementById("orderRail").innerHTML =
        `<p class="empty-state">連線失敗,請確認 firebase-init.js 設定是否正確<br>${err.message}</p>`;
    });
}

function renderOrders(orders) {
  const rail = document.getElementById("orderRail");
  if (orders.length === 0) {
    rail.innerHTML = `<p class="empty-state">目前沒有訂單,等待客人點餐中...</p>`;
    return;
  }

  rail.innerHTML = orders
    .map((order) => {
      const time = order.createdAt?.toDate
        ? order.createdAt.toDate().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })
        : "--:--";
      const itemsHtml = order.items
        .map((i) => `<li><span>${i.name} x${i.qty}</span><span>$${i.price * i.qty}</span></li>`)
        .join("");
      const noteHtml = order.note ? `<div class="note">備註:${order.note}</div>` : "";
      const isDone = order.status === "done";

      return `
        <div class="order-card ${isDone ? "done" : ""}" data-id="${order.id}">
          <div class="order-card-head">
            <span class="num">${order.orderNumber || "--"}</span>
            <span class="time">${time}</span>
          </div>
          <ul>${itemsHtml}</ul>
          ${noteHtml}
          <div class="total">總計 $${order.total}</div>
          <div class="actions">
            ${
              isDone
                ? `<button class="btn-undo" data-action="undo" data-id="${order.id}">取消完成</button>`
                : `<button class="btn-done" data-action="done" data-id="${order.id}">完成出餐</button>`
            }
          </div>
        </div>
      `;
    })
    .join("");

  rail.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const status = btn.dataset.action === "done" ? "done" : "pending";
      db.collection("orders").doc(id).update({ status });
    });
  });
}

// ---- QR Code 產生 ----
document.getElementById("qrBtn").addEventListener("click", () => {
  const url = new URL("index.html", window.location.href).href;
  document.getElementById("qrUrl").textContent = url;
  document.getElementById("qrcode").innerHTML = "";
  new QRCode(document.getElementById("qrcode"), {
    text: url,
    width: 200,
    height: 200,
    colorDark: "#2b2e28",
    colorLight: "#ffffff",
  });
  document.getElementById("qrOverlay").classList.add("show");
});

document.getElementById("qrCloseBtn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("qrOverlay").classList.remove("show");
});
