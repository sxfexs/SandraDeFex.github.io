const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const carouselControllers = new WeakMap();

function initHeroMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer || typeof L === 'undefined') return;

  const map = L.map(mapContainer, {
    center: [5.0, -74.5],
    zoom: 5,
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    dragging: false,
    tap: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  const highlight = L.circle([4.710989, -74.072092], {
    radius: 180000,
    color: '#0b3d91',
    weight: 2,
    fillColor: '#3f7ae0',
    fillOpacity: 0.15,
  });

  highlight.addTo(map);

  const markers = [
    { coords: [4.141, -73.629], label: 'Yopal · Mapeo participativo' },
    { coords: [6.251, -75.564], label: 'Energía solar · Antioquia' },
    { coords: [7.125, -73.119], label: 'Chatbot geoespacial · AMB' },
  ];

  markers.forEach(({ coords, label }) => {
    L.circleMarker(coords, {
      radius: 6,
      weight: 1,
      color: '#0b3d91',
      fillColor: '#f59e0b',
      fillOpacity: 0.9,
    })
      .addTo(map)
      .bindTooltip(label, { direction: 'top' });
  });
}

function initCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

class CarouselController {
  constructor(element) {
    this.element = element;
    this.slides = Array.from(element.querySelectorAll('.carousel-slide'));
    if (!this.slides.length) return;

    this.prevButton = element.querySelector('[data-carousel="prev"]');
    this.nextButton = element.querySelector('[data-carousel="next"]');
    this.dotsContainer = element.querySelector('.carousel-dots');
    this.autoplayId = undefined;
    this.activeIndex = 0;

    this.renderDots();
    this.attachEvents();
    this.updateSlides();
    this.updateAutoplayPreferences();
  }

  parseDelay() {
    const delay = parseInt(this.element.dataset.autoplay, 10);
    return Number.isNaN(delay) ? 0 : delay;
  }

  updateAutoplayPreferences() {
    this.autoplayDelay = this.parseDelay();
    this.shouldAutoplay = this.autoplayDelay > 0 && !prefersReducedMotion.matches;
    this.stopAutoplay();
    if (this.shouldAutoplay) {
      this.startAutoplay();
    }
  }

  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    this.dots = this.slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ver diapositiva ${index + 1}`);
      dot.addEventListener('click', () => {
        this.goToSlide(index);
        this.restartAutoplay();
      });
      this.dotsContainer.appendChild(dot);
      return dot;
    });
  }

  attachEvents() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.goToSlide(this.activeIndex - 1);
        this.restartAutoplay();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.goToSlide(this.activeIndex + 1);
        this.restartAutoplay();
      });
    }

    this.element.addEventListener('mouseenter', () => this.stopAutoplay());
    this.element.addEventListener('mouseleave', () => this.startAutoplay());
  }

  updateSlides() {
    this.slides.forEach((slide, index) => {
      const isActive = index === this.activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    if (this.dots) {
      this.dots.forEach((dot, index) => {
        dot.setAttribute('aria-current', index === this.activeIndex ? 'true' : 'false');
      });
    }
  }

  goToSlide(index) {
    const total = this.slides.length;
    this.activeIndex = (index + total) % total;
    this.updateSlides();
  }

  nextSlide() {
    this.goToSlide(this.activeIndex + 1);
  }

  startAutoplay() {
    if (!this.shouldAutoplay) return;
    this.stopAutoplay();
    this.autoplayId = setInterval(() => this.nextSlide(), this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = undefined;
    }
  }

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

function initCarousels() {
  document.querySelectorAll('.carousel').forEach((carousel) => {
    if (!carouselControllers.has(carousel)) {
      const controller = new CarouselController(carousel);
      carouselControllers.set(carousel, controller);
    } else {
      const controller = carouselControllers.get(carousel);
      if (controller) {
        controller.updateAutoplayPreferences();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroMap();
  initCurrentYear();
  initCarousels();
});

prefersReducedMotion.addEventListener('change', () => {
  initCarousels();
});
