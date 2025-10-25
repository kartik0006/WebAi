import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

class UltimateAnimations {
  constructor() {
    this.splits = [];
    this.observers = [];
    this.init();
  }

  init() {
    this.setupGlobalConfig();
    this.setupPerformance();
  }

  setupGlobalConfig() {
    gsap.config({
      force3D: true,
      autoSleep: 60,
      nullTargetWarn: false
    });

    ScrollTrigger.config({
      ignoreMobileResize: true,
    });
  }

  setupPerformance() {
    if (typeof window !== 'undefined') {
      gsap.ticker.lagSmoothing(0);
    }
  }

  // Advanced magnetic effect with physics
  createMagneticField(element, strength = 0.4, radius = 100) {
    if (!element) return;

    const onMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (distance < radius) {
        const power = 1 - (distance / radius);
        gsap.to(element, {
          x: distanceX * strength * power,
          y: distanceY * strength * power,
          rotation: distanceX * 0.02 * power,
          duration: 0.8,
          ease: "power3.out"
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      });
    };

    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }

  // Advanced text reveal
  createAdvancedTextReveal(element, options = {}) {
    const {
      delay = 0,
      duration = 1,
      stagger = 0.05,
      ease = "power4.out"
    } = options;

    if (!element) return null;

    // Split text into characters manually
    const text = element.textContent;
    element.innerHTML = text.split('').map(char => 
      `<span class="char" style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    const chars = element.querySelectorAll('.char');
    
    const tl = gsap.timeline();
    tl.from(chars, {
      opacity: 0,
      y: 100,
      rotationX: -90,
      transformOrigin: "0% 50% -50",
      duration,
      stagger,
      ease,
      delay
    });

    return { timeline: tl, chars };
  }

  // 3D parallax system
  create3DParallax(container, layers = []) {
    if (!container) return;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      layers.forEach((layer, index) => {
        const depth = (index + 1) * 0.02;
        const moveX = (x - xc) * depth;
        const moveY = (y - yc) * depth;
        
        gsap.to(layer, {
          x: moveX,
          y: moveY,
          duration: 1,
          ease: "power2.out"
        });
      });
    };

    container.addEventListener('mousemove', onMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', onMouseMove);
    };
  }

  // 3D tilt effect
  create3DTiltEffect(element, intensity = 15) {
    if (!element) return;

    const handleMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const dx = x - xc;
      const dy = y - yc;
      
      const tiltX = (dy / yc) * intensity;
      const tiltY = -(dx / xc) * intensity;
      
      gsap.to(element, {
        rotationX: tiltX,
        rotationY: tiltY,
        transformPerspective: 1000,
        duration: 0.8,
        ease: "power3.out"
      });
    };

    const handleLeave = () => {
      gsap.to(element, {
        rotationX: 0,
        rotationY: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      });
    };

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseleave', handleLeave);

    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseleave', handleLeave);
    };
  }

  // Particle system with physics
  createAdvancedParticles(container, count = 30, options = {}) {
    if (!container) return [];

    const {
      colors = ['#8B5CF6', '#3B82F6', '#EC4899', '#10B981'],
      sizes = [2, 6],
      opacityRange = [0.1, 0.4]
    } = options;

    const particles = [];
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * (sizes[1] - sizes[0]) + sizes[0];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const opacity = Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0];
      
      Object.assign(particle.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: '50%',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: opacity,
        pointerEvents: 'none'
      });
      
      container.appendChild(particle);
      particles.push(particle);

      // Complex floating animation
      gsap.to(particle, {
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        rotation: Math.random() * 360,
        duration: Math.random() * 15 + 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 5
      });
    }

    return particles;
  }

  // Cleanup method
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}

export const ultimateAnimations = new UltimateAnimations();
export { gsap, ScrollTrigger };