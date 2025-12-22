// Smooth scroll para los enlaces del navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animación al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a las secciones
document.querySelectorAll('.service-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ============================================
// CARRUSEL INFINITO DE TESTIMONIOS
// ============================================
const track = document.querySelector('.testimonials-track');
const indicatorsContainer = document.querySelector('.carousel-indicators');
const originalCards = Array.from(document.querySelectorAll('.testimonial-card'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentSlide = 0;
let autoPlayInterval;
let isTransitioning = false;
let isPaused = false; // Nueva variable para controlar pausa

const totalOriginalSlides = originalCards.length; // 10 cards
const cardWidth = 340;
const gap = 50;
const slidesToShow = 3; // Cuántas cards se ven a la vez

// CLONAR las primeras 3 cards al final para el efecto infinito
originalCards.slice(0, slidesToShow).forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
});

// Actualizar referencia a todas las cards (originales + clonadas)
const allCards = document.querySelectorAll('.testimonial-card');

// GENERAR indicadores dinámicamente (solo 8 para las 10 cards)
const maxSlide = totalOriginalSlides - slidesToShow + 1; // 10 - 3 + 1 = 8
for (let i = 0; i < maxSlide; i++) {
    const indicator = document.createElement('span');
    indicator.className = 'indicator';
    if (i === 0) indicator.classList.add('active');
    indicator.setAttribute('data-slide', i);
    indicatorsContainer.appendChild(indicator);
}

const indicators = document.querySelectorAll('.indicator');

// Función para cambiar de slide
function goToSlide(slideIndex, instant = false) {
    if (isTransitioning && !instant) return;
    
    isTransitioning = true;
    currentSlide = slideIndex;
    
    const offset = currentSlide * (cardWidth + gap);
    
    if (instant) {
        track.style.transition = 'none';
    } else {
        track.style.transition = 'transform 0.8s ease-in-out';
    }
    
    track.style.transform = `translateX(-${offset}px)`;
    
    // Actualizar indicadores (solo si está dentro del rango de indicadores)
    if (currentSlide < maxSlide) {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    } else {
        // Cuando está en las cards clonadas, mostrar el primer indicador
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === 0);
        });
    }
    
    setTimeout(() => {
        isTransitioning = false;
    }, 800);
}

// Función para avanzar
function nextSlide() {
    if (isPaused) return; // No avanzar si está pausado
    
    currentSlide++;
    goToSlide(currentSlide);
    
    if (currentSlide >= totalOriginalSlides) {
        setTimeout(() => {
            currentSlide = 0;
            goToSlide(0, true);
        }, 850);
    }
}
// Función para retroceder
function prevSlide() {
    if (currentSlide === 0) {
        currentSlide = totalOriginalSlides;
        goToSlide(currentSlide, true);
        setTimeout(() => {
            currentSlide--;
            goToSlide(currentSlide);
        }, 50);
    } else {
        currentSlide--;
        goToSlide(currentSlide);
    }
}

// Auto-play del carrusel
function autoPlay() {
    if (!isPaused) {
        nextSlide();
    }
}
// Iniciar auto-play
function startAutoPlay() {
    stopAutoPlay(); // Limpiar intervalo anterior
    autoPlayInterval = setInterval(autoPlay, 5000); // 5 segundos (más lento)
}

// Detener auto-play
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Pausar (mantener intervalo pero no avanzar)
function pause() {
    isPaused = true;
}

// Reanudar
function resume() {
    isPaused = false;
}

// EVENTOS DE LAS FLECHAS
prevBtn.addEventListener('click', () => {
    stopAutoPlay();
    prevSlide();
    setTimeout(resume, 1000); // Reanudar después de 1 segundo
});
nextBtn.addEventListener('click', () => {
    stopAutoPlay();
    nextSlide();
    setTimeout(resume, 1000); // Reanudar después de 1 segundo
});

// Click en indicadores
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        pause();
        goToSlide(index);
        setTimeout(resume, 1000);
    });
});

// Pausar cuando se hace hover sobre cualquier card
allCards.forEach(card => {
    card.addEventListener('mouseenter', pause);
    card.addEventListener('mouseleave', resume);
});

// Pausar cuando se hace hover sobre las flechas
prevBtn.addEventListener('mouseenter', pause);
prevBtn.addEventListener('mouseleave', resume);
nextBtn.addEventListener('mouseenter', pause);
nextBtn.addEventListener('mouseleave', resume);

// Pausar cuando se hace hover sobre toda la sección de testimonios
const testimonialsSection = document.querySelector('.testimonials-carousel');
testimonialsSection.addEventListener('mouseenter', pause);
testimonialsSection.addEventListener('mouseleave', resume);


// Iniciar el carrusel
startAutoPlay();