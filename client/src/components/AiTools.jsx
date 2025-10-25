import React, { useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { AiToolsData } from '../assets/assets';
import { ultimateAnimations, gsap, ScrollTrigger } from '../utils/ultimate-animations';
import './AiTools.css';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AiTools = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    const headingRef = useRef(null);
    const subtitleRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Animate heading and subtitle
            ultimateAnimations.createAdvancedTextReveal(headingRef.current, {
                stagger: 0.03
            });

            ultimateAnimations.createAdvancedTextReveal(subtitleRef.current, {
                delay: 0.5,
                stagger: 0.01
            });

            // Advanced card animations with 3D effects
            cardsRef.current.forEach((card, index) => {
                // Initial animation
                gsap.fromTo(card,
                    {
                        opacity: 0,
                        y: 80,
                        rotationX: 15,
                        scale: 0.8
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotationX: 0,
                        scale: 1,
                        duration: 1,
                        delay: index * 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );

                // Add 3D tilt effect to each card
                ultimateAnimations.create3DTiltEffect(card, 8);

                // Hover glow effect
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -10,
                        boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });
            });

            // Section background parallax
            gsap.to(sectionRef.current, {
                backgroundPosition: "50% 100%",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });

        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, []);

    const addToRefs = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    const handleCardClick = (tool) => {
        if (user) {
            navigate(tool.path);
        } else {
            navigate('/sign-up');
        }
    };

    return (
        <section ref={sectionRef} className="ultimate-ai-tools">
            {/* Animated Background */}
            <div className="tools-background"></div>
            
            <div className="tools-container">
                <div className="tools-header">
                    <h2 ref={headingRef} className="tools-title">
                        Powerful AI Tools
                    </h2>
                    <p ref={subtitleRef} className="tools-subtitle">
                        Everything you need to create, enhance, and optimize your content with 
                        cutting-edge AI technology. Transform your workflow with our intelligent suite.
                    </p>
                </div>

                <div className="tools-grid">
                    {AiToolsData.map((tool, index) => (
                        <div
                            key={index}
                            ref={addToRefs}
                            className="tool-card"
                            onClick={() => handleCardClick(tool)}
                        >
                            {/* Card Background Effect */}
                            <div className="card-background"></div>
                            
                            {/* Icon Container */}
                            <div className="icon-container">
                                <div 
                                    className="icon-wrapper"
                                    style={{
                                        background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`
                                    }}
                                >
                                    <tool.Icon className="tool-icon" />
                                </div>
                                <div className="icon-glow"></div>
                            </div>

                            {/* Content */}
                            <div className="card-content">
                                <h3 className="tool-title">{tool.title}</h3>
                                <p className="tool-description">{tool.description}</p>
                            </div>

                            {/* Hover Effect */}
                            <div className="card-hover-effect"></div>
                            
                            {/* Click Indicator */}
                            <div className="click-indicator">
                                <span>Click to explore →</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating decorative elements */}
                <div className="floating-elements">
                    <div className="floating-element el-1"></div>
                    <div className="floating-element el-2"></div>
                    <div className="floating-element el-3"></div>
                </div>
            </div>
        </section>
    );
};

export default AiTools;