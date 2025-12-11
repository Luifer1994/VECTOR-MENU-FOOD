import { ref } from "vue";

/**
 * Composable para animaciones del carrito
 */
export function useCartAnimation() {
  const isAnimating = ref(false);

  /**
   * Crea efecto de onda (ripple) en el botón del carrito
   */
  function createRippleEffect(button) {
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(0, 255, 0, 0.4);
      top: 0;
      left: 0;
      pointer-events: none;
      transform: scale(0);
    `;

    button.style.position = "relative";
    button.appendChild(ripple);

    // Animar onda expandiéndose
    ripple.animate(
      [
        {
          transform: "scale(0)",
          opacity: 1,
        },
        {
          transform: "scale(2.5)",
          opacity: 0,
        },
      ],
      {
        duration: 800,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      }
    ).onfinish = () => ripple.remove();
  }

  /**
   * Anima un producto volando hacia el carrito flotante
   */
  function animateAddToCart(productImage) {
    // Buscar el botón del carrito flotante
    const cartButton = document.querySelector("[data-cart-button]");
    if (!cartButton) return;

    const cartRect = cartButton.getBoundingClientRect();

    // Crear elemento clonado
    const clone = document.createElement("img");
    clone.src =
      productImage || "https://placehold.co/100x100/FF8C00/000000?text=+";
    clone.style.cssText = `
      position: fixed;
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 12px;
      z-index: 9999;
      pointer-events: none;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 10px 30px rgba(255, 140, 0, 0.5);
      border: 2px solid #FF8C00;
    `;
    document.body.appendChild(clone);

    // Calcular posición final
    const finalX = cartRect.left + cartRect.width / 2 - window.innerWidth / 2;
    const finalY = cartRect.top + cartRect.height / 2 - window.innerHeight / 2;

    // Animar hacia el carrito con curva parabólica
    const animation = clone.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
          opacity: 1,
          offset: 0,
        },
        {
          transform: `translate(calc(-50% + ${finalX * 0.5}px), calc(-50% + ${
            finalY * 0.3
          }px)) scale(0.8) rotate(180deg)`,
          opacity: 0.9,
          offset: 0.5,
        },
        {
          transform: `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px)) scale(0.3) rotate(360deg)`,
          opacity: 0.8,
          offset: 1,
        },
      ],
      {
        duration: 700,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }
    );

    // Al terminar la animación
    animation.onfinish = () => {
      clone.remove();

      // Efecto de onda en el botón
      createRippleEffect(cartButton);

      // Rebote del botón del carrito
      cartButton.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.15)" },
          { transform: "scale(0.95)" },
          { transform: "scale(1.05)" },
          { transform: "scale(1)" },
        ],
        {
          duration: 500,
          easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        }
      );
    };
  }

  return {
    isAnimating,
    animateAddToCart,
  };
}
