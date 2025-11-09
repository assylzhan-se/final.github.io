$(document).ready(function() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // === СЧЁТЧИК ТОВАРОВ ===
  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    $("#cart-count").text(total);
  }
  updateCartCount();

  // === ОБНОВЛЕНИЕ КОРЗИНЫ ===
  function updateCart() {
    const $cartContainer = $("#cart-items");
    let subtotal = 0;

    if (cart.length === 0) {
      $cartContainer.html("<p class='text-muted'>Your cart is empty.</p>");
      $("#subtotal").text("$0.00");
      $("#total").text("$0.00");
      $("#shipping-cost").text("Free");
      updateCartCount();
      return;
    }

    $cartContainer.html("");
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      $cartContainer.append(`
        <div class="cart-item d-flex align-items-center justify-content-between border rounded p-2 mb-2">
          <div>
            <h6 class="mb-1">${item.name}</h6>
            <p class="mb-1 text-muted">$${item.price.toFixed(2)} × ${item.quantity}</p>
          </div>
          <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">Remove</button>
        </div>
      `);
    });

    const deliveryOption = $('input[name="deliveryOption"]:checked').val();
    const deliveryCost = (deliveryOption === "delivery") ? 5 : 0;
    const total = subtotal + deliveryCost;

    $("#subtotal").text(`$${subtotal.toFixed(2)}`);
    $("#total").text(`$${total.toFixed(2)}`);
    $("#shipping-cost").text(deliveryCost === 0 ? "Free" : `$${deliveryCost.toFixed(2)}`);
    updateCartCount();
  }

  // === УДАЛЕНИЕ ТОВАРА ===
  $(document).on("click", ".remove-item", function() {
    const index = $(this).data("index");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    updateCartCount();
  });

  // === ПРОМОКОД ===
  $("#apply-promo").click(function() {
    const code = $("#promo-input").val().trim();
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let deliveryOption = $('input[name="deliveryOption"]:checked').val();
    let deliveryCost = (deliveryOption === "delivery") ? 5 : 0;
    let total = subtotal + deliveryCost;

    if (code.toUpperCase() === "DISCOUNT10") {
      total *= 0.9;
      alert("Promo applied! 10% discount.");
    } else if (code !== "") {
      alert("Invalid promo code.");
    }

    $("#total").text(`$${total.toFixed(2)}`);
  });

  // === ИЗМЕНЕНИЕ ДОСТАВКИ ===
  $(document).on("change", 'input[name="deliveryOption"]', function() {
    const val = $(this).val();
    if (val === "delivery") {
      $("#address-block").show();
    } else {
      $("#address-block").hide();
      $("#delivery-address").val("");
    }
    updateCart();
  });

  // === ИНИЦИАЛИЗАЦИЯ ===
  updateCart();
});
