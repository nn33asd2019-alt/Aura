// ข้อมูลสินค้า AURA JEWELRY
const productsData = [
  {
    "id": "aur-car-s",
    "name": "AURA Career (Compass) ไซส์ S",
    "mood": "career",
    "type": "necklace",
  
    "size": "S (40 cm)",
    "price": 1290,
    "image": "career.jpg",
    "description": "สร้อยเข็มทิศมินิมอล เสริมงานและสติปัญญา"
  },
  {
    "id": "aur-car-l",
    "name": "AURA Career (Compass) ไซส์ L",
    "mood": "career",
    "type": "necklace",
    "size": "L (45 cm)",
    "price": 1890,
    "image": "career.jpg",
    "description": "สร้อยเข็มทิศมินิมอล เสริมงานและสติปัญญา"
  },
  {
    "id": "aur-lov-s",
    "name": "AURA Love (Infinity Heart) ไซส์ S",
    "mood": "love",
    "type": "necklace",
    "size": "S (40 cm)",
    "price": 1290,
    "image": "love.jpg",
    "description": "สร้อยหัวใจอินฟินิตี้ เสริมความรักและเสน่ห์"
  },
  {
    "id": "aur-lov-l",
    "name": "AURA Love (Infinity Heart) ไซส์ L",
    "mood": "love",
    "type": "necklace",
    "size": "L (45 cm)",
    "price": 1890,
    "image": "love.jpg",
    "description": "สร้อยหัวใจอินฟินิตี้ เสริมความรักและเสน่ห์"
  },
  {
    "id": "aur-wea-s",
    "name": "AURA Wealth (Horseshoe) ไซส์ S",
    "mood": "wealth",
    "type": "necklace",
    "size": "S (40 cm)",
    "price": 1290,
    "image": "wealth.jpg",
    "description": "สร้อยเกือกม้า ดึงดูดโชคลาภและการเงิน"
  },
  {
    "id": "aur-wea-l",
    "name": "AURA Wealth (Horseshoe) ไซส์ L",
    "mood": "wealth",
    "type": "necklace",
    "size": "L (45 cm)",
    "price": 1890,
    "image": "wealth.jpg",
    "description": "สร้อยเกือกม้า ดึงดูดโชคลาภและการเงิน"
  },
  {
    "id": "aur-pea-s",
    "name": "AURA Peace (Crescent Moon) ไซส์ S",
    "mood": "peace",
    "type": "necklace",
    "size": "S (40 cm)",
    "price": 1290,
    "image": "peace.jpg",
    "description": "สร้อยพระจันทร์เสี้ยวอเมทิสต์ เสริมความสงบและสุขภาพ"
  },
  {
    "id": "aur-pea-l",
    "name": "AURA Peace (Crescent Moon) ไซส์ L",
    "mood": "peace",
    "type": "necklace",
    "size": "L (45 cm)",
    "price": 1890,
    "image": "peace.jpg",
    "description": "สร้อยพระจันทร์เสี้ยวอเมทิสต์ เสริมความสงบและสุขภาพ"
  }
];

document.addEventListener("DOMContentLoaded", function () {
  const productGrid = document.getElementById("product-grid");

  // ถ้าอยู่ในหน้า product.html
  if (productGrid) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedMood = urlParams.get("mood") || "all";

    renderProducts(selectedMood);
    setupFilterButtons(selectedMood);
  }

  // ถ้าอยู่ในหน้า order.html
  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = urlParams.get("item");
    const priceParam = urlParams.get("price");

    if (itemParam) {
      document.getElementById("items").value = decodeURIComponent(itemParam);
    }
    if (priceParam) {
      document.getElementById("total").value = priceParam;
    }

    // จัดการการส่งฟอร์มสั่งซื้อ
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const scriptURL = "https://script.google.com/macros/s/AKfycbxAeV1KvF0IOCs9_mkYVWj-bfBeUUg1ZDnvcImRXt-y-ZoX2BAaowQHmt9PK0uBRjSI/exec";

      const formData = {
        customerName: document.getElementById("customerName").value,
        contact: document.getElementById("contact").value,
        items: document.getElementById("items").value,
        total: document.getElementById("total").value,
        note: document.getElementById("note").value
      };

      fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(() => {
        window.location.href = "thankyou.html";
      })
      .catch(error => {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        console.error("Error!", error.message);
      });
    });
  }
});

// ฟังก์ชันแสดงรายการสินค้า
function renderProducts(moodFilter) {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  productGrid.innerHTML = "";

  const filteredProducts = moodFilter === "all" 
    ? productsData 
    : productsData.filter(p => p.mood === moodFilter);

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "<p>ไม่พบสินค้าในหมวดหมู่นี้</p>";
    return;
  }

  filteredProducts.forEach(product => {
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
    productGrid.appendChild(card);
  });
}

// ฟังก์ชันปุ่ม Filter
function setupFilterButtons(currentMood) {
  const filterButtons = document.querySelectorAll(".btn-filter");
  
  filterButtons.forEach(btn => {
    const mood = btn.getAttribute("data-mood-filter");
    if (mood === currentMood) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }

    btn.addEventListener("click", function () {
      filterButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      renderProducts(mood);
    });
  });
}

￼
