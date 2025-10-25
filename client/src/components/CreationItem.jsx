import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { gsap } from 'gsap';
import './CreationItem.css';

const CreationItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false);
    const itemRef = useRef(null);
    const contentRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!itemRef.current) return;

        const ctx = gsap.context(() => {
            // Item entrance animation
            gsap.fromTo(itemRef.current,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }
            );

            // Continuous hover animation
            const item = itemRef.current;
            
            const handleMouseEnter = () => {
                gsap.to(item, {
                    y: -5,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            };

            const handleMouseLeave = () => {
                gsap.to(item, {
                    y: 0,
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            };

            item.addEventListener('mouseenter', handleMouseEnter);
            item.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                item.removeEventListener('mouseenter', handleMouseEnter);
                item.removeEventListener('mouseleave', handleMouseLeave);
            };
        }, itemRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!contentRef.current || !expanded) return;

        const ctx = gsap.context(() => {
            // Expand animation
            if (expanded) {
                gsap.fromTo(contentRef.current,
                    {
                        opacity: 0,
                        height: 0
                    },
                    {
                        opacity: 1,
                        height: 'auto',
                        duration: 0.5,
                        ease: "power2.out"
                    }
                );

                // Animate button rotation
                gsap.to(buttonRef.current, {
                    rotation: 180,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                // Collapse animation
                gsap.to(contentRef.current, {
                    opacity: 0,
                    height: 0,
                    duration: 0.3,
                    ease: "power2.in"
                });

                // Animate button rotation back
                gsap.to(buttonRef.current, {
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }, contentRef);

        return () => ctx.revert();
    }, [expanded]);

    const handleClick = () => {
        setExpanded(!expanded);
        
        // Click animation
        gsap.to(itemRef.current, {
            scale: 0.98,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeColor = (type) => {
        const colors = {
            image: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
            article: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
            blog: { bg: '#FEF7CD', border: '#FDE68A', text: '#92400E' },
            resume: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
            default: { bg: '#F3F4F6', border: '#D1D5DB', text: '#374151' }
        };
        return colors[type] || colors.default;
    };

    const typeColors = getTypeColor(item.type);

    return (
        <div 
            ref={itemRef}
            className="creation-item"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            aria-label={`${item.type} creation - ${item.prompt}. Click to ${expanded ? 'collapse' : 'expand'}`}
        >
            {/* Header Section */}
            <div className="creation-header">
                <div className="creation-info">
                    <h3 className="creation-prompt">{item.prompt}</h3>
                    <p className="creation-meta">
                        {item.type} • {formatDate(item.created_at)}
                    </p>
                </div>
                <button 
                    ref={buttonRef}
                    className="type-badge"
                    style={{
                        backgroundColor: typeColors.bg,
                        borderColor: typeColors.border,
                        color: typeColors.text
                    }}
                    aria-label={`Type: ${item.type}`}
                >
                    {item.type}
                    <div className="badge-glow" style={{ backgroundColor: typeColors.text }}></div>
                </button>
            </div>

            {/* Expandable Content */}
            <div 
                ref={contentRef}
                className="creation-content"
                aria-hidden={!expanded}
            >
                {item.type === 'image' ? (
                    <div className="image-content">
                        <img 
                            src={item.content} 
                            alt={`Generated image for: ${item.prompt}`}
                            className="generated-image"
                            loading="lazy"
                        />
                        <div className="image-overlay">
                            <span className="image-label">AI Generated Image</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-content">
                        <div className="content-scroll">
                            <div className="markdown-content">
                                <Markdown>{item.content}</Markdown>
                            </div>
                        </div>
                        <div className="content-footer">
                            <span className="word-count">
                                {item.content.split(' ').length} words
                            </span>
                            <button 
                                className="copy-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(item.content);
                                    // Add copy animation
                                    gsap.to(e.target, {
                                        scale: 1.2,
                                        duration: 0.1,
                                        yoyo: true,
                                        repeat: 1,
                                        ease: "power2.inOut"
                                    });
                                }}
                                aria-label="Copy content to clipboard"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading State */}
            <div className="creation-loading" aria-live="polite">
                Loading content...
            </div>
        </div>
    );
};

export default CreationItem;