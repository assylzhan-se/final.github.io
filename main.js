$(document).ready(function () {
  // Получаем корзину из localStorage или создаем пустую
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // --- Обновление счётчика товаров ---
  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    $("#cart-count").text(total);
  }
  updateCartCount();

  // --- Добавление товара ---
  $(".add-to-cart").click(function () {
    const card = $(this).closest(".product");
    const name = card.find(".product-name").text();
    const price = parseFloat(card.find("p").first().text().replace("$", "")) || 0;
    const image = card.find("img").attr("src");

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1, image });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to your cart!`);
  });

  // --- Подписка на email ---
  $(".subscribe-btn").click(function () {
    const email = $("input[type='email']").val().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(email)) {
      alert("Thank you for subscribing!");
      $("input[type='email']").val("");
    } else {
      alert("Please enter a valid email address.");
    }
  });
});
