document.addEventListener("DOMContentLoaded", () => {
    const cartQuantityElement = document.getElementById("cart-quantity");
    const totalPriceElement = document.getElementById("total-price");
    const cartItemsContainer = document.querySelector(".cart-container_cart-items");
    const cartTextElement = document.querySelector(".cart-container_text");
    const cartImageElement = document.querySelector(".cart-container_image");
    const cartTotalElement = document.getElementById("cart-total");

    const modal = document.querySelector(".modal-container");
    const confirmOrderButton = document.querySelector(".cart-total_confirm-order");
    const newOrderButton = document.querySelector(".modal-container_new-order-btn");

    const productContainer = document.querySelector(".product-container_menu-list");

    const cartItems = {};

    fetch('./data/data.json')
        .then(response => response.json())
        .then(products => {

            products.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-container_menu-list_product-card");

                productCard.innerHTML = `
                    <div class="product-container_menu-list_product-card_img-container">
                        <div class="product-container_menu-list_product-card_img-container_img-wrap">
                            <img src="${product.image.desktop}" alt="${product.name}">
                        </div>
                        <button class="add-to-cart"><img src="./assets/images/icon-add-to-cart.svg" alt="add-to-cart">Add to Cart</button>
                    </div>
                    <p class="product-container_menu-list_product-card_category">${product.category}</p>
                    <h3 class="product-container_menu-list_product-card_name">${product.name}</h3>
                    <p class="product-container_menu-list_product-card_price">$${product.price.toFixed(2)}</p>
                `;

                productContainer.appendChild(productCard);
            });


            document.querySelectorAll(".add-to-cart").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const productCard = event.target.closest(".product-container_menu-list_product-card");
                    const productName = productCard.querySelector(".product-container_menu-list_product-card_name").textContent;
                    const product = products.find(item => item.name === productName);
                    const productPrice = product ? product.price : 0;
                    const productImage = product ? product.image.thumbnail : '';

                    if (!cartItems[productName]) {
                        cartItems[productName] = { quantity: 1, price: productPrice, image: productImage };
                    } else {
                        cartItems[productName].quantity++;
                    }
                    updateButton(button, productName);
                    addProductToCart(productName);
                    updateCartCount();
                    updateTotalPrice();
                    toggleCartEmptyState();
                });
            });

            cartItemsContainer.addEventListener("click", (event) => {
                const removeButton = event.target.closest(".cart-item_img");

                if (removeButton) {
                    const productRow = removeButton.closest(".cart-item");
                    const productName = productRow.getAttribute("data-name");

                    if (cartItems[productName]) {
                        delete cartItems[productName];
                        productRow.remove();
                        updateCartCount();
                        updateTotalPrice();
                        toggleCartEmptyState();
                        updateModalCart();
                    }

                    const productCard = [...document.querySelectorAll(".product-container_menu-list_product-card")].find(card => {
                        return card.querySelector(".product-container_menu-list_product-card_name")?.textContent === productName;
                    });

                    if (productCard) {
                        const addToCartButton = productCard.querySelector(".add-to-cart");
                        if (addToCartButton) {
                            resetButton(addToCartButton);
                        }
                    }
                }
            });


            confirmOrderButton.addEventListener("click", () => {
                modal.showModal();
            });

            newOrderButton.addEventListener("click", () => {
                Object.keys(cartItems).forEach(key => delete cartItems[key]);

                cartItemsContainer.innerHTML = "";
                updateCartCount();
                updateTotalPrice();
                toggleCartEmptyState();
                updateModalCart();

                document.querySelectorAll(".add-to-cart").forEach(button => {
                    resetButton(button);
                });

                modal.close();
            });

            modal.addEventListener("click", (event) => {
                if (!event.target.closest(".modal-container_modal-content")) {
                    Object.keys(cartItems).forEach(key => delete cartItems[key]);

                    cartItemsContainer.innerHTML = "";
                    updateCartCount();
                    updateTotalPrice();
                    toggleCartEmptyState();
                    updateModalCart();

                    document.querySelectorAll(".add-to-cart").forEach(button => {
                        resetButton(button);
                    });

                    modal.close();
                }
            });

            document.addEventListener('keydown', (event) => {
                if (modal.open && event.key === "Escape") {
                    Object.keys(cartItems).forEach(key => delete cartItems[key]);

                    cartItemsContainer.innerHTML = "";
                    updateCartCount();
                    updateTotalPrice();
                    toggleCartEmptyState();
                    updateModalCart();

                    document.querySelectorAll(".add-to-cart").forEach(button => {
                        resetButton(button);
                    });

                    modal.close();
                }
            });


            function updateButton(button, productName) {
                button.innerHTML = `
                    <span class="decrease">-</span>
                    <span class="item-count">${cartItems[productName].quantity}</span>
                    <span class="increase">+</span>
                `;

                button.classList.add("active");

                const closestImgContainer = button.closest(".product-container_menu-list_product-card")
                    .querySelector(".product-container_menu-list_product-card_img-container_img-wrap");

                if (closestImgContainer) {
                    closestImgContainer.classList.add("active");
                }

                button.querySelector(".increase").addEventListener("click", (event) => {
                    event.stopPropagation();
                    cartItems[productName].quantity++;
                    updateButton(button, productName);
                    addProductToCart(productName);
                    updateCartCount();
                    updateTotalPrice();
                });

                button.querySelector(".decrease").addEventListener("click", (event) => {
                    event.stopPropagation();
                    if (cartItems[productName].quantity > 1) {
                        cartItems[productName].quantity--;
                        updateButton(button, productName);
                        addProductToCart(productName);
                    } else {
                        delete cartItems[productName];
                        resetButton(button);
                        removeProductFromCart(productName);
                        button.classList.remove("active");
                    }
                    updateCartCount();
                    updateTotalPrice();
                    toggleCartEmptyState();
                });
            }

            function resetButton(button) {
                button.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg" alt="add-to-cart"> Add to Cart`;
                button.classList.remove("active");

                const closestImgContainer = button.closest(".product-container_menu-list_product-card")
                    .querySelector(".product-container_menu-list_product-card_img-container_img-wrap");

                if (closestImgContainer) {
                    closestImgContainer.classList.remove("active");
                }
            }

            function updateCartCount() {
                cartQuantityElement.textContent = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
            }

            function addProductToCart(productName) {
                let productRow = cartItemsContainer.querySelector(`[data-name="${productName}"]`);
                if (!productRow) {
                    productRow = document.createElement("div");
                    productRow.classList.add("cart-item");
                    productRow.setAttribute("data-name", productName);
                    cartItemsContainer.appendChild(productRow);
                }

                productRow.innerHTML = `
                    <div class="cart-item_info">
                        <h4 class="cart-item_name">${productName}</h4>
                        <div class="cart-item_price-container">
                            <p class="cart-item_quantity">${cartItems[productName].quantity}x</p>
                            <p class="cart-item_price">@ $${cartItems[productName].price.toFixed(2)}</p>
                            <p class="cart-item_total">$${(cartItems[productName].quantity * cartItems[productName].price).toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="cart-item_img">
                        <img src="./assets/images/icon-remove-item.svg" alt="remove-item">
                    </div>
                `;

                updateModalCart();
            }

            function removeProductFromCart(productName) {
                const productRow = cartItemsContainer.querySelector(`[data-name="${productName}"]`);
                if (productRow) {
                    productRow.remove();
                }
            }

            function updateTotalPrice() {
                totalPriceElement.textContent = `$${Object.values(cartItems)
                    .reduce((sum, item) => sum + item.quantity * item.price, 0)
                    .toFixed(2)}`;
            }

            function toggleCartEmptyState() {
                if (Object.keys(cartItems).length > 0) {
                    cartTotalElement.style.display = "block";
                    cartTextElement.style.display = "none";
                    cartImageElement.style.display = "none";
                } else {
                    cartTotalElement.style.display = "none";
                    cartTextElement.style.display = "block";
                    cartImageElement.style.display = "block";
                    cartItemsContainer.innerHTML = "";
                }
            }

            function updateModalCart() {
                const modalCartContainer = document.querySelector(".modal-container_order-container");
                modalCartContainer.innerHTML = "";

                Object.keys(cartItems).forEach(productName => {
                    const product = cartItems[productName];

                    const productRow = document.createElement("div");
                    productRow.classList.add("order-item");
                    productRow.setAttribute("data-name", productName);

                    productRow.innerHTML = `
                        <div class="order-item_info">
                            <img class="order-item_image" src="${product.image}" alt="${productName}">
                            <div class="order-item_header-container">
                                <h4 class="order-item_name">${productName}</h4>
                                <div class="order-item_price-container">
                                    <p class="cart-item_quantity">${product.quantity}x</p>
                                    <p class="cart-item_price">@ $${product.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <p class="order-item_total">$${(product.quantity * product.price).toFixed(2)}</p>
                    `;

                    modalCartContainer.appendChild(productRow);
                });

                const modalTotalPrice = document.getElementById("modal-total-price");
                modalTotalPrice.textContent = `$${Object.values(cartItems).reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`;
            }

        })
        .catch(error => console.error("Error loading data.json:", error));
});
