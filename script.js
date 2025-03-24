document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
    
    lastScroll = currentScroll;
});

const createParallaxEffect = () => {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const sections = document.querySelectorAll('.resources, .support, .contact');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (heroContent) {
            const rate = scrolled * 0.35;
            heroContent.style.transform = `translateY(${rate}px)`;
            heroContent.style.opacity = 1 - Math.max(0, Math.min(1, scrolled / 500));
        }
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight && rect.bottom >= 0);
            
            if (isVisible) {
                const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const parallaxElements = section.querySelectorAll('h2, .card, .support-content, .contact-form');
                
                parallaxElements.forEach((element, index) => {
                    const delay = index * 100;
                    const translateY = Math.max(0, 50 * (1 - scrollProgress));
                    element.style.transform = `translateY(${translateY}px)`;
                    element.style.opacity = Math.min(1, scrollProgress * 2);
                    element.style.transitionDelay = `${delay}ms`;
                });
            }
        });
    });
};

const addFloatingAnimation = () => {
    const elements = document.querySelectorAll('.card, .support-content, .contact-form');
    
    elements.forEach((element, index) => {
        element.style.animation = `floating ${3 + index * 0.2}s ease-in-out infinite alternate`;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floating {
                0% {
                    transform: translateY(0);
                }
                100% {
                    transform: translateY(-10px);
                }
            }
        `;
        document.head.appendChild(style);
    });
};

const createBackgroundParticles = () => {
    const sections = document.querySelectorAll('.resources, .support, .contact');
    
    sections.forEach(section => {
        const particles = document.createElement('div');
        particles.className = 'background-particles';
        
        const style = document.createElement('style');
        style.textContent = `
            .background-particles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: 0;
            }
            
            .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(148, 163, 184, 0.2);
                border-radius: 50%;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = 15 + Math.random() * 10;
            const delay = Math.random() * -20;
            
            particle.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                animation: moveParticle ${duration}s ${delay}s linear infinite;
            `;
            
            const particleStyle = document.createElement('style');
            particleStyle.textContent = `
                @keyframes moveParticle {
                    0% {
                        transform: translate(0, 0);
                    }
                    33% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                    }
                    66% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                    }
                    100% {
                        transform: translate(0, 0);
                    }
                }
            `;
            document.head.appendChild(particleStyle);
            
            particles.appendChild(particle);
        }
        
        section.insertBefore(particles, section.firstChild);
    });
};

const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    const submitButton = this.querySelector('.submit-button');
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        console.log('Form data:', data);
        submitButton.textContent = 'Message Sent!';
        this.reset();
        
        setTimeout(() => {
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
        }, 3000);
    }, 1500);
});

const cards = document.querySelectorAll('.card');
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
}, observerOptions);

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(card);
    
    const cardNumber = card.querySelector('.card-number');
    if (cardNumber) {
        cardNumber.style.opacity = '0.1';
        card.addEventListener('mouseenter', () => {
            cardNumber.style.opacity = '0.2';
            cardNumber.style.transform = 'translateX(10px)';
        });
        card.addEventListener('mouseleave', () => {
            cardNumber.style.opacity = '0.1';
            cardNumber.style.transform = 'translateX(0)';
        });
    }
});

const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    const menuButton = document.createElement('button');
    menuButton.classList.add('mobile-menu-button');
    menuButton.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-button {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            z-index: 100;
        }
        
        .mobile-menu-button span {
            display: block;
            width: 25px;
            height: 2px;
            background-color: var(--secondary-color);
            margin: 6px 0;
            transition: 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
        }
        
        @media (max-width: 768px) {
            .mobile-menu-button {
                display: block;
            }
            
            .nav-links {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.98);
                padding: 5rem 2rem;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 2rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .nav-links.active {
                display: flex;
                opacity: 1;
            }
            
            .nav-links a {
                font-size: 1.5rem;
                opacity: 0;
                transform: translateY(20px);
            }
            
            .nav-links.active a {
                opacity: 1;
                transform: translateY(0);
                transition: all 0.4s ease;
            }
            
            .nav-links a:nth-child(1) { transition-delay: 0.1s; }
            .nav-links a:nth-child(2) { transition-delay: 0.2s; }
            .nav-links a:nth-child(3) { transition-delay: 0.3s; }
            .nav-links a:nth-child(4) { transition-delay: 0.4s; }
            
            .mobile-menu-button.active span:nth-child(1) {
                transform: rotate(45deg) translate(8px, 7px);
            }
            
            .mobile-menu-button.active span:nth-child(2) {
                opacity: 0;
                transform: translateX(-20px);
            }
            
            .mobile-menu-button.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    
    document.head.appendChild(style);
    navbar.appendChild(menuButton);
    
    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
            menuButton.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuButton.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
};

const addHoverEffectToButtons = () => {
    const buttons = document.querySelectorAll('.cta-button, .secondary-button, .submit-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    createParallaxEffect();
    createMobileMenu();
    addHoverEffectToButtons();
    addFloatingAnimation();
    createBackgroundParticles();
});