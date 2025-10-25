import React, { useEffect, useState, useRef } from 'react';
import { Edit, Sparkles, PenTool } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { gsap } from 'gsap';
import './WriteArticle.css';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: 'Short (500–800 words)' },
    { length: 1200, text: 'Medium (800–1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  // Refs for animations
  const formRef = useRef(null);
  const outputRef = useRef(null);
  const placeholderRef = useRef(null);
  const contentRef = useRef(null);
  const ctx = useRef(null);

  useEffect(() => {
    ctx.current = gsap.context(() => {
      gsap.fromTo([formRef.current, outputRef.current],
        { 
          opacity: 0, 
          y: 50, 
          scale: 0.98 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out'
        }
      );
    });
    return () => ctx.current.revert();
  }, []);

  useEffect(() => {
    if (loading) {
      gsap.to(placeholderRef.current, { 
        opacity: 0, 
        duration: 0.3, 
        ease: 'power2.inOut' 
      });
    } else if (content) {
      gsap.set(contentRef.current, { opacity: 0, y: 20 });
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.1,
        ease: 'power3.out'
      });
    } else {
      gsap.to(placeholderRef.current, { 
        opacity: 1, 
        duration: 0.3, 
        ease: 'power2.inOut' 
      });
    }
  }, [loading, content]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a topic.");
      return;
    }

    gsap.to(e.target, { 
      scale: 0.97, 
      duration: 0.15, 
      yoyo: true, 
      repeat: 1, 
      ease: 'power2.inOut' 
    });

    try {
      setLoading(true);
      setContent('');
      const prompt = `Write a comprehensive, well-structured article about "${input}". The article should be approximately ${selectedLength.length} words and follow proper formatting with headings, paragraphs, and clear structure.`;
      
      const { data } = await axios.post(
        '/api/ai/generate-article',
        { prompt, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success('Article generated successfully!');
      } else {
        toast.error(data.message || "Failed to generate article.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (content && outputRef.current) {
      outputRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [content]);

  // Custom Markdown components for better styling
  const MarkdownComponents = {
    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-6 mb-4 pb-2 border-b border-slate-700" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mt-5 mb-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-white mt-4 mb-2" {...props} />,
    p: ({node, ...props}) => <p className="text-slate-300 leading-7 mb-4 text-[15px]" {...props} />,
    ul: ({node, ...props}) => <ul className="text-slate-300 mb-4 space-y-2 list-disc list-inside" {...props} />,
    ol: ({node, ...props}) => <ol className="text-slate-300 mb-4 space-y-2 list-decimal list-inside" {...props} />,
    li: ({node, ...props}) => <li className="text-slate-300 leading-6" {...props} />,
    strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
    em: ({node, ...props}) => <em className="italic text-slate-200" {...props} />,
    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 my-4 text-slate-300 italic bg-slate-800/50 py-2 rounded-r" {...props} />,
  };

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-300'>
      
      {/* Left Column: Configuration */}
      <form 
        ref={formRef} 
        onSubmit={onSubmitHandler} 
        className='w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 h-fit'
        style={{ opacity: 0 }}
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-blue-400' />
          <h1 className='text-xl font-bold text-slate-100'>Article Generator</h1>
        </div>

        <p className='mt-6 text-sm font-semibold text-slate-400'>Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          className='w-full p-3 px-4 mt-2 outline-none text-sm text-slate-100 placeholder:text-slate-500 rounded-lg bg-slate-700/50 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all'
          placeholder='The future of artificial intelligence...'
          required
        />

        <p className='mt-5 text-sm font-semibold text-slate-400'>Article Length</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-2 font-medium border rounded-full cursor-pointer transition-all duration-200 ${
                selectedLength.text === item.text
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 border-slate-600 bg-transparent hover:bg-slate-700 hover:text-slate-200'
              }`}
              key={index}
            >
              {item.text}
            </span>
          ))}
        </div>

        <div className="h-px bg-slate-700 my-6" />

        <button
          disabled={loading}
          className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 text-sm font-semibold rounded-lg cursor-pointer shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-[1.02] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:hover:scale-100'
        >
          {loading ? (
            <>
              <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
              Generating...
            </>
          ) : (
            <>
              <Edit className='w-5' />
              Generate Article
            </>
          )}
        </button>
      </form>

      {/* Right Column: Generated Article */}
      <div 
        ref={outputRef}
        className='write-article-output w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 flex flex-col min-h-[500px] lg:min-h-0 lg:max-h-[calc(100vh-4rem)] overflow-y-auto'
        style={{ opacity: 0 }}
      >
        <div className='flex items-center gap-3 pb-4 border-b border-slate-700'>
          <PenTool className='w-5 h-5 text-blue-400' />
          <h1 className='text-xl font-bold text-slate-100'>Generated Article</h1>
        </div>

        {/* Placeholder */}
        <div 
          ref={placeholderRef} 
          className='flex-1 flex justify-center items-center'
        >
          <div className='text-sm flex flex-col items-center gap-5 text-slate-600'>
            <Edit className='w-12 h-12' />
            <p className='text-slate-500 text-center'>Enter a topic and click<br/>"Generate Article" to get started</p>
          </div>
        </div>
        
        {/* Content Area */}
        <div 
          ref={contentRef} 
          className='mt-3 opacity-0 flex-1'
        >
          {content && (
            <div className='article-content text-slate-300'>
              <Markdown components={MarkdownComponents}>
                {content}
              </Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;