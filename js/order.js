// ============================================
// 顧客點餐頁邏輯
// ============================================

document.getElementById("storeName").textContent = STORE_NAME;
document.getElementById("storeNotice").textContent = STORE_NOTICE;

const cart = {}; // { itemId: { item, qty } }

function renderTabs() {
  const tabsEl = document.getElementById("categoryTabs");
  tabsEl.innerHTML = "";
  MENU_CATEGORIES.forEach((cat, idx) => {
    const btn = document.createElement("button");
    btn.textContent = cat.name;
    if (idx === 0) btn.classList.add("active");
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-tabs button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`cat-${cat.id}`).scrollIntoView({ behavior: "smooth", block: "start" });
    });
    tabsEl.appendChild(btn);
  });
}

function renderMenu() {
  const container = document.getElementById("menuContainer");
  container.innerHTML = "";
  MENU_CATEGORIES.forEach((cat) => {
    const block = document.createElement("div");
    block.className = "category-block";
    block.id = `cat-${cat.id}`;
    block.innerHTML = `<h2>${cat.name}</h2>`;

    cat.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "menu-item";
      row.innerHTML = `
        <div class="menu-item-info">
          <h3>${item.name}</h3>
          ${item.desc ? `<p>${item.desc}</p>` : ""}
          <span class="price">$${item.price}</span>
        </div>
        <div class="qty-control">
          <button data-action="minus" data-id="${item.id}" aria-label="減少">−</button>
          <span id="qty-${item.id}">0</span>
          <button data-action="plus" data-id="${item.id}" aria-label="增加">+</button>
        </div>
      `;
      block.appendChild(row);
    });
    container.appendChild(block);
  });

  container.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      changeQty(id, action === "plus" ? 1 : -1);
    });
  });
}

function findItemById(id) {
  for (const cat of MENU_CATEGORIES) {
    const found = cat.items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}

function changeQty(id, delta) {
  const item = findItemById(id);
  if (!item) return;
  const current = cart[id]?.qty || 0;
  const next = Math.max(0, current + delta);
  if (next === 0) {
    delete cart[id];
  } else {
    cart[id] = { item, qty: next };
  }
  document.getElementById(`qty-${id}`).textContent = next;
  renderTicket();
}

function renderTicket() {
  const lines = Object.values(cart);
  const linesEl = document.getElementById("ticketLines");
  const countEl = document.getElementById("ticketCount");
  const totalEl = document.getElementById("ticketTotal");
  const submitBtn = document.getElementById("submitBtn");
  const mobileBar = document.getElementById("mobileTicketBar");
  const mobileBarText = document.getElementById("mobileBarText");

  if (lines.length === 0) {
    linesEl.innerHTML = `<p class="ticket-empty">尚未選擇餐點</p>`;
    countEl.textContent = "0 項";
    totalEl.textContent = "$0";
    submitBtn.disabled = true;
    mobileBar.classList.remove("show");
    return;
  }

  let total = 0;
  let count = 0;
  linesEl.innerHTML = lines
    .map(({ item, qty }) => {
      total += item.price * qty;
      count += qty;
      return `<div class="ticket-line"><span class="name">${item.name} x${qty}</span><span>$${item.price * qty}</span></div>`;
    })
    .join("");

  countEl.textContent = `${count} 項`;
  totalEl.textContent = `$${total}`;
  submitBtn.disabled = false;

  mobileBar.classList.add("show");
  mobileBarText.textContent = `${count} 項 · $${total}`;
}

// ---- 手機版點餐單開合 ----
const ticketPanel = document.getElementById("ticketPanel");
document.getElementById("mobileBarOpen").addEventListener("click", () => ticketPanel.classList.add("open"));
document.getElementById("ticketCloseBtn").addEventListener("click", () => ticketPanel.classList.remove("open"));

// ---- 產生訂單編號(每日重置,A01, A02 ... A99, B01...) ----
async function getNextOrderNumber() {
  const today = new Date().toISOString().slice(0, 10);
  const counterRef = db.collection("meta").doc("dailyCounter");

  return db.runTransaction(async (tx) => {
    const doc = await tx.get(counterRef);
    let count = 1;
    if (doc.exists && doc.data().date === today) {
      count = doc.data().count + 1;
    }
    tx.set(counterRef, { date: today, count });

    const letterIndex = Math.floor((count - 1) / 99);
    const numberInLetter = ((count - 1) % 99) + 1;
    const letter = String.fromCharCode(65 + letterIndex); // A, B, C...
    return `${letter}-${String(numberInLetter).padStart(2, "0")}`;
  });
}

// ---- 送出訂單 ----
document.getElementById("submitBtn").addEventListener("click", async () => {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "送出中...";

  try {
    const orderNumber = await getNextOrderNumber();
    const items = Object.values(cart).map(({ item, qty }) => ({
      name: item.name,
      price: item.price,
      qty,
    }));
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const note = document.getElementById("orderNote").value.trim();

    await db.collection("orders").add({
      orderNumber,
      items,
      total,
      note,
      status: "pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    document.getElementById("orderNumberDisplay").textContent = orderNumber;
    document.getElementById("stampOverlay").classList.add("show");

    // 清空購物車
    Object.keys(cart).forEach((id) => delete cart[id]);
    document.querySelectorAll('[id^="qty-"]').forEach((el) => (el.textContent = "0"));
    document.getElementById("orderNote").value = "";
    renderTicket();
    ticketPanel.classList.remove("open");
  } catch (err) {
    console.error(err);
    alert("送出失敗,請檢查網路連線,或聯絡店家。\n(店家:請確認 firebase-init.js 設定是否正確)");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "送出訂單";
  }
});

document.getElementById("stampCloseBtn").addEventListener("click", () => {
  document.getElementById("stampOverlay").classList.remove("show");
});

renderTabs();
renderMenu();
renderTicket();
