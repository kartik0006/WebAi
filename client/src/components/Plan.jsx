// Plan.jsx
import React, { useEffect, useRef, useState } from 'react';
import { PricingTable } from '@clerk/clerk-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Plan.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/**
 * Plan
 * - Matches the same hero/testimonial visual language
 * - Entrance animation via ScrollTrigger
 * - Accessible skeleton while PricingTable loads
 */

const Plan = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    const prefersReduced = window?.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced && cardRef.current) {
      gsap.fromTo(cardRef.current, { opacity: 0, y: 60, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
      });
    } else if (cardRef.current) {
      cardRef.current.style.opacity = 1;
    }

    return () => {
      clearTimeout(t);
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="plan-section">
      <div className="plan-inner">
        <header className="plan-header text-center">
          <h2 className="plan-title">Choose Your Plan</h2>
          <p className="plan-sub">Start for free and scale as you grow. Flexible pricing built for creators.</p>
        </header>

        <div ref={cardRef} className="plan-card">
          {loading ? (
            <div className="plan-skeleton" aria-hidden="true">
              <div className="skeleton-line short" />
              <div className="skeleton-block" />
            </div>
          ) : (
            <PricingTable />
          )}
        </div>
      </div>
    </section>
  );
};

export default Plan;
