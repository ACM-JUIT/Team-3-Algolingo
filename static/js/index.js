/**
 * Algolingo Landing Page Scripts
 * Premium Retro RPG Visuals & Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
    // 8-bit Console Greeting for developer inspects
    console.log(`
%c
   /\\  |  _   _  | o ._   _   _  
  /--\\ | (_| (_) | | | | (_| (_) 
        _|                _|     
%c=========================================
      8-BIT QUEST INITIATED: v1.0.0
   Ready to conquer the Data Structure Tower?
=========================================`, 
    'color: #cbbeff; font-weight: bold; font-family: monospace; font-size: 14px;', 
    'color: #66df6e; font-family: monospace; font-weight: bold;'
    );

    // Smooth Scrolling for Anchors
    const navLinks = document.querySelectorAll('.nav-links a, .btn-stone');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Instantly scroll or smooth scroll to mimic retro level jump
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Tactile Feedback for buttons (Simulate GBA mechanical clicks)
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            // Subtle click sound or tactile active indicator
            btn.style.transform = 'translate(2px, 2px)';
            btn.style.boxShadow = 'none';
        });

        btn.addEventListener('mouseup', () => {
            btn.style.transform = '';
            btn.style.boxShadow = '';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.boxShadow = '';
        });
    });

    // Retro blinking animation on elements
    const badges = document.querySelectorAll('.level-badge, .cta-badge');
    setInterval(() => {
        badges.forEach(badge => {
            badge.style.opacity = badge.style.opacity === '0.4' ? '1' : '0.4';
        });
    }, 800);

    // Intersection Observer for scroll reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });
});
