// ข้อมูลรายการสินค้าทั้งหมด
const productsData = [
  { id: "aur-car-s", name: "AURA Career (Compass) ไซส์ S", mood: "career", price: 1290, image: "career.jpg", description: "เสริมดวงการงานและความสำเร็จ" },
  { id: "aur-car-l", name: "AURA Career (Compass) ไซส์ L", mood: "career", price: 1890, image: "career.jpg", description: "เสริมดวงการงานและความสำเร็จ" },
  { id: "aur-lov-s", name: "AURA Love (Infinity Heart) ไซส์ S", mood: "love", price: 1290, image: "love.jpg", description: "เสริมเสน่ห์และความรักสมหวัง" },
  { id: "aur-lov-l", name: "AURA Love (Infinity Heart) ไซส์ L", mood: "love", price: 1890, image: "love.jpg", description: "เสริมเสน่ห์และความรักสมหวัง" },
  { id: "aur-wea-s", name: "AURA Wealth (Horseshoe) ไซส์ S", mood: "wealth", price: 1290, image: "wealth.jpg", description: "ดึงดูดโชคลาภและความมั่งคั่ง" },
  { id: "aur-wea-l", name: "AURA Wealth (Horseshoe) ไซส์ L", mood: "wealth", price: 1890, image: "wealth.jpg", description: "ดึงดูดโชคลาภและความมั่งคั่ง" },
  { id: "aur-pea-s", name: "AURA Peace (Crescent Moon) ไซส์ S", mood: "peace", price: 1290, image: "peace.jpg", description: "เสริมความสุขสงบและสุขภาพดี" },
  { id: "aur-pea-l", name: "AURA Peace (Crescent Moon) ไซส์ L", mood: "peace", price: 1890, image: "peace.jpg", description: "เสริมความสุขสงบและสุขภาพดี" }
];

// ลิ้งก์ Google Apps Script สำหรับรับข้อมูลสั่งซื้อ
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAeV1KvF0IOCs9_mkYVWj-bfBeUUg1ZDnvcImRXt-y-ZoX2BAaowQHmt9PK0uBRjSI/exec";

// ฟังก์ชันแสดงรายการสินค้าพร้อมปุ่มสั่งซื้อ
function renderProducts(moodFilter = "all", containerId = "product-grid", limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  let list = moodFilter === "all" ? productsData : productsData.filter(p => p.mood === moodFilter);
  if (limit) list = list.slice(0, limit);

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    const orderUrl = `order.html?item=${encodeURIComponent(product.name)}&price=${product.price}`;

    card.innerHTML = `
      <div class="product-card__image-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-card__image">
      </div>
      <div class="product-card__body">
        <div class="product-card__header">
          <span class="badge-mood badge-mood--${product.mood}">${product.mood.toUpperCase()}</span>
        </div>
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__description">${product.description}</p>
        <div class="product-card__footer">
          <span class="product-card__price">฿${product.price.toLocaleString()}</span>
          <a href="${orderUrl}" class="btn btn-primary">สั่งซื้อสินค้า</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ฟังก์ชันสำหรับปุ่มกรองหมวดหมู่สินค้า
function setupFilterButtons() {
  const buttons = document.querySelectorAll(".btn-filter");
  buttons.forEach(btn => {
    btn.addEventListener("click", function () {
      buttons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      const mood = this.getAttribute("data-mood-filter");
      renderProducts(mood, "product-grid");
    });
  });
}

// ฟังก์ชันจัดการฟอร์มสั่งซื้อและการแสดง Pop-up สั่งซื้อสำเร็จ
function initOrderForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const itemName = urlParams.get('item') || 'ไม่ระบุสินค้า';
  const itemPrice = urlParams.get('price') || '0';

  const displayEl = document.getElementById('displayItem');
  if (displayEl) {
    displayEl.innerText = `${itemName} (฿${Number(itemPrice).toLocaleString()})`;
  }

  const form = document.getElementById('orderForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'กำลังส่งข้อมูล...';
      }

      const formData = {
        name: document.getElementById('customerName').value,
        phone: document.getElementById('contact').value,
        item: itemName,
        price: itemPrice,
        address: document.getElementById('address').value,
        note: document.getElementById('note') ? document.getElementById('note').value : '-'
      };

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(() => {
        // เมื่อส่งเข้า Google Sheets เรียบร้อย ให้แสดง Pop-up Modal
        const modal = document.getElementById('successModal');
        if (modal) {
          modal.style.display = 'flex';
        } else {
          alert('ส่งข้อมูลการสั่งซื้อเรียบร้อยแล้ว! ขอบคุณที่อุดหนุนครับ');
          window.location.href = 'index.html';
        }
      })
      .catch(error => {
        console.error('Error!', error);
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'ยืนยันการสั่งซื้อ';
        }
      });
    });
  }
}
