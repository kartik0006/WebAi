// Testimonial.jsx
import React, { useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ultimateAnimations } from '../utils/ultimate-animations';
import './Testimonial.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/**
 * Testimonial
 * - Uses same gradient/visual language as Hero
 * - Character reveal for heading (via ultimateAnimations)
 * - 3D subtle hover + magnetic effects (safeguarded for touch)
 * - IntersectionObserver / ScrollTrigger friendly and cleaned up
 */

const Testimonial = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const cleanups = useRef([]);

  useEffect(() => {
    const prefersReduced = window?.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Setup scroll/entrance animations inside a context for safe revert
    const ctx = gsap.context(() => {
      if (!prefersReduced && headingRef.current) {
        ultimateAnimations.createAdvancedTextReveal(headingRef.current, { delay: 0.15, stagger: 0.035 });
      } else if (headingRef.current) {
        headingRef.current.style.opacity = 1;
      }

      // subtitle fade
      if (subtitleRef.current && !prefersReduced) {
        gsap.fromTo(subtitleRef.current, { opacity: 0, y: 18 }, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: subtitleRef.current, start: 'top 88%' }
        });
      } else if (subtitleRef.current) {
        subtitleRef.current.style.opacity = 1;
      }

      // Cards
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;

        // Reveal animation
        if (!prefersReduced) {
          gsap.fromTo(card, { opacity: 0, y: 70, scale: 0.96 }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            delay: idx * 0.12,
            ease: 'back.out(1.4)',
            scrollTrigger: { trigger: card, start: 'top 92%' }
          });
        } else {
          card.style.opacity = 1;
          card.style.transform = 'none';
        }

        // Attach hover and magnetic only for non-touch
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouch) {
          const enter = () => gsap.to(card, { y: -12, rotationX: 4, rotationY: 6, scale: 1.02, duration: 0.35, ease: 'power2.out', boxShadow: '0 24px 60px -16px rgba(99,102,241,0.25)' });
          const leave = () => gsap.to(card, { y: 0, rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', boxShadow: '0 10px 25px -6px rgba(0,0,0,0.12)' });

          card.addEventListener('mouseenter', enter);
          card.addEventListener('mouseleave', leave);

          cleanups.current.push(() => {
            card.removeEventListener('mouseenter', enter);
            card.removeEventListener('mouseleave', leave);
          });

          // Magnetic field
          const removeMag = ultimateAnimations.createMagneticField(card, 0.2, 110);
          if (typeof removeMag === 'function') cleanups.current.push(removeMag);
        }
      });

    }, sectionRef);

    return () => {
      // cleanup listeners + gsap context
      cleanups.current.forEach((c) => {
        try { c(); } catch (e) {}
      });
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // helper for refs
  const addCard = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  const testimonials = [
    {
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
      name: 'John Doe',
      title: 'Marketing Director, TechCorp',
      content: 'Quick.ai has revolutionized our content workflow. The quality is outstanding and it saves us hours every week.',
      rating: 5,
    },
    {
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      name: 'Jane Smith',
      title: 'Content Creator',
      content: 'The AI tools help us produce high-quality content faster than ever before.',
      rating: 5,
    },
    {
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
      name: 'David Lee',
      title: 'Writer & Strategist',
      content: 'Quick.ai transformed our process — we deliver better content with less effort.',
      rating: 4,
    },
  ];

  return (
    <section ref={sectionRef} className="testimonial-section">
      <div className="testimonial-inner">
        <header className="testimonial-header">
          <h2 ref={headingRef} className="testimonial-heading">Loved by Creators</h2>
          <p ref={subtitleRef} className="testimonial-sub">Real feedback from creators using Quick.ai to scale their output.</p>
        </header>

        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <article
              key={i}
              ref={addCard}
              className="testimonial-card"
              tabIndex={0}
              aria-label={`Testimonial by ${t.name}`}
            >
              <div className="card-top">
                <div className="rating">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <img key={s} src={s < t.rating ? assets.star_icon : assets.star_dull_icon} alt="" className="star" />
                  ))}
                </div>
              </div>

              <p className="card-body">“{t.content}”</p>

              <footer className="card-meta">
                <img className="author" src={t.image} alt={t.name} />
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-title">{t.title}</div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
