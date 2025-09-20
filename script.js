// Año dinámico en footer
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
});

// Mostrar/ocultar panel flotante al hover del nombre
(function(){
  const brand = document.getElementById("brand");
  const panel = document.getElementById("hoverPanel");
  if(!brand || !panel) return;

  let overBrand = false, overPanel = false;

  const show = () => panel.classList.add("hover-panel--visible");
  const hide = () => panel.classList.remove("hover-panel--visible");

  brand.addEventListener("mouseenter", () => { overBrand = true; show(); });
  brand.addEventListener("mouseleave", () => { overBrand = false; setTimeout(() => { if(!overBrand && !overPanel) hide(); }, 120); });

  panel.addEventListener("mouseenter", () => { overPanel = true; show(); });
  panel.addEventListener("mouseleave", () => { overPanel = false; setTimeout(() => { if(!overBrand && !overPanel) hide(); }, 120); });
})();

// Carruseles con autoplay opcional
(function(){
  const carousels = document.querySelectorAll(".carousel");
  carousels.forEach((c) => {
    const track = c.querySelector(".carousel__track");
    const slides = c.querySelectorAll(".carousel__slide");
    const prev = c.querySelector(".carousel__btn--prev");
    const next = c.querySelector(".carousel__btn--next");
    let index = 0;

    const go = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    prev?.addEventListener("click", () => go(index - 1));
    next?.addEventListener("click", () => go(index + 1));

    const autoplay = c.dataset.autoplay === "true";
    const interval = parseInt(c.dataset.interval || "5000", 10);
    if (autoplay) {
      let timer = setInterval(() => go(index + 1), interval);
      c.addEventListener("mouseenter", () => clearInterval(timer));
      c.addEventListener("mouseleave", () => { timer = setInterval(() => go(index + 1), interval); });
    }
  });
})();
