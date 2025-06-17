const style = `
:host {
  --btn-color: linear-gradient(to right, #A7C6C7, #5B7097);
  --btn-color-hover: linear-gradient(to right, #809798, #3c4a65);
}

.product-card {
  position:relative;
  width: 500px;
  height: 300px; 
  color: white;
  background: linear-gradient(to bottom left, #16162C, #1D1F46);
  display: flex;
  align-items: center;
  border: 1.5px #2F66B6 solid;
  border-radius: 12px;
  margin-top: 100px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: 0.5s;
}

.product-card:hover img {
  left: 80%;
  height: 400px;
}

.product-card img {
  height: 300px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); 
  
  transition: 0.5s;
}

.product-info {
  padding: 0px 10px;
  margin: 10px 0px;
  position: relative;
  width: 50%;
  left: 20%;
  padding: 20px 20px 20px 40px;
  opacity: 0;
  transition: 0.5s;
}

.product-card:hover .product-info{
  opacity: 1;
  left: 0;
  transition-delay: 0.5s;
}

.product-name {
  font-size: 16px;
  margin: 0 0 5px 0;
}

.product-price {
  font-size: 14px;
  margin: 0 0 5px 0;
}

.product-des {
  font-size: 12px;
  line-height: 14px;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

button.read-more-btn {
  display: none;
  background: none;
  border: none;
  color: #64B5F6;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  margin-top: 5px;
  position: absolute;
  right: 25px;
  top: 85px;
}

.product-rate {
  margin: 0 0 5px 0;
}

button.add-btn {
  width: 100%;
  color: white;
  background: var(--btn-color);
  border: none;
  border-radius: 20px;
  padding: 10px;
}

button.add-btn:hover {
  background: var(--btn-color-hover);
}

.quantity-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
}

.qty-btn {
  background: #A7C6C7;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.qty-btn:hover {
  background: #809798;
}

.product-quantity {
  min-width: 20px;
  text-align: center;
  font-size: 14px;
}
`;

// 2. 建立 Custom Element
class ProductCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    // 掛樣式
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(style);
    shadow.adoptedStyleSheets = [sheet];

    const template = document.createElement('template');
    template.innerHTML = `
      <div class="product-card">
        <img src="" alt="" />
        <div class="product-info">
          <h2 class="product-name"></h2>
          <p class="product-price"></p>
          <p class="product-des"></p>
          <button class="read-more-btn"></button>
          <div class="product-rate" data-value="0">
          </div>
          <div class="quantity-wrapper">
            <button class="qty-btn minus">-</button>
            <span class="product-quantity">1</span>
            <button class="qty-btn plus">+</button>
          </div>
          <button class="add-btn"></button>
        </div>
      </div>
    `;
    shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.render(); // 把更新畫面的邏輯抽出去
    //數量的加減設定
    const qty = parseInt(this.getAttribute("qty")) || 1;
    const quantityEl = this.shadowRoot.querySelector(".product-quantity");
    const minusBtn = this.shadowRoot.querySelector(".qty-btn.minus");
    const plusBtn = this.shadowRoot.querySelector(".qty-btn.plus");

    quantityEl.textContent = qty;

    minusBtn.addEventListener("click", () => {
      let current = parseInt(quantityEl.textContent);
      if (current > 1) quantityEl.textContent = current - 1;
    });

    plusBtn.addEventListener("click", () => {
      let current = parseInt(quantityEl.textContent);
      quantityEl.textContent = current + 1;
    });
    // 4. 處理自定義事件
    const addBtn = this.shadowRoot.querySelector('.add-btn');
    addBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('add-to-cart', {
        detail: {
          name: this.getAttribute('name'),
          price: this.getAttribute('price'),
          quantity: parseInt(this.shadowRoot.querySelector('.product-quantity').textContent),
        },
        bubbles: true,
        composed: true
      }));
    });
  }

  // 3. 處理屬性變化：定義哪些屬性要被觀察
  static get observedAttributes() {
    return ["img", "name", "price", "des", "rate", "qty"];
  }

  // 會在屬性變動時自動呼叫
  attributeChangedCallback(name, oldValue, newValue) {
    // 如果屬性值真的有變，才重新渲染
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // 渲染畫面
  render() {
    const img = this.getAttribute("img");
    const name = this.getAttribute("name");
    const price = this.getAttribute("price");
    const des = this.getAttribute("des");
    const rate = parseInt(this.getAttribute("rate")) || 0;
    const qty = this.getAttribute("qty") || "1";

    const shadow = this.shadowRoot;
    if (!shadow) return;

    shadow.querySelector("img").src = img || "";
    shadow.querySelector("img").alt = name || "";
    shadow.querySelector(".product-name").textContent = name || "";
    shadow.querySelector(".product-price").textContent = price ? `NT$${price}` : "";
    shadow.querySelector(".product-des").textContent = des || "";
    shadow.querySelector(".product-rate").textContent =
      '⭐️'.repeat(rate) + '☆'.repeat(5 - rate);
    shadow.querySelector(".product-quantity").textContent = qty;
    shadow.querySelector(".add-btn").textContent = "Add to Cart";
    shadow.querySelector(".read-more-btn").textContent = "Read more";

    const desEl = shadow.querySelector('.product-des');
    const readMoreBtn = shadow.querySelector('.read-more-btn');

    requestAnimationFrame(() => {
      const isOverflowing = desEl.scrollHeight > desEl.clientHeight + 1;
      readMoreBtn.style.display = isOverflowing ? 'inline' : 'none';

      if (isOverflowing) {
        readMoreBtn.onclick = () => {
          desEl.style.webkitLineClamp = 'unset';
          desEl.style.overflow = 'visible';
          readMoreBtn.style.display = 'none';
        };
      }
    });
  }
}

customElements.define("product-card", ProductCard);

export default ProductCard;
// module.exports = ProductCard; 