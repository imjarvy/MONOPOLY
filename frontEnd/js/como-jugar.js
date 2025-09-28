// Funcionalidad adicional para la página de Como Jugar
document.addEventListener('DOMContentLoaded', function() {
    
    // Animación de aparición progresiva
    const sections = document.querySelectorAll('.game-section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Efectos de hover mejorados para las tarjetas
    const cards = document.querySelectorAll('.rule-card, .square-type, .strategy-tip');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Efecto parallax mejorado
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        const video = document.querySelector('.background-video');
        
        if (video) {
            video.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Efecto de brillo en el logo
    const logo = document.querySelector('.monopoly-logo');
    if (logo) {
        setInterval(() => {
            logo.style.animation = 'none';
            setTimeout(() => {
                logo.style.animation = 'glow 2s ease-in-out infinite alternate';
            }, 100);
        }, 5000);
    }

    // Navegación suave
    const buttons = document.querySelectorAll('button[onclick]');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            
            // Animación de salida
            document.body.style.opacity = '0.8';
            document.body.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        });
    });

    // Efecto de escritura para el título
    const title = document.querySelector('.main-title');
    if (title) {
        const originalText = title.textContent;
        title.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    title.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            typeWriter();
        }, 500);
    }

    // Partículas animadas de fondo (opcional)
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                animation: float ${Math.random() * 6 + 4}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Crear partículas después de un pequeño delay
    setTimeout(createParticles, 1000);

    // Efecto de sonido hover (opcional - necesitaría archivos de audio)
    const interactiveElements = document.querySelectorAll('button, .rule-card, .square-type, .strategy-tip');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Aquí se podría agregar un efecto de sonido
            this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

});

// CSS adicional para las animaciones
const additionalStyles = `
@keyframes float {
    0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
}

.particles-container {
    overflow: hidden;
}

.animate-in {
    animation: slideInFromBottom 0.8s ease-out forwards;
}

@keyframes slideInFromBottom {
    0% {
        opacity: 0;
        transform: translateY(50px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.game-section:nth-child(even) .animate-in {
    animation: slideInFromLeft 0.8s ease-out forwards;
}

.game-section:nth-child(odd) .animate-in {
    animation: slideInFromRight 0.8s ease-out forwards;
}

@keyframes slideInFromLeft {
    0% {
        opacity: 0;
        transform: translateX(-50px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInFromRight {
    0% {
        opacity: 0;
        transform: translateX(50px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
`;

// Inyectar estilos adicionales
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);

console.log('✅ Página "Cómo Jugar" cargada exitosamente con todas las animaciones!');