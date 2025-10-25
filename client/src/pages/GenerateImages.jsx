import { Image, Sparkles, Download } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';
import './GenerateImages.css';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyles = ['Realistic', 'Ghibli Style', 'Anime Style', 'Cartoon Style', 'Fantasy Style', '3D Style', 'Portrait Style', 'Watercolor Style'];
  
  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  // GSAP Refs
  const formRef = useRef(null);
  const outputRef = useRef(null);
  const placeholderRef = useRef(null);
  const contentRef = useRef(null);
  const ctx = useRef(null);

  // Initial animations
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

  // Content loading animations
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
      toast.error('Please describe the image you want to generate');
      return;
    }

    // Button animation
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
      
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success('Image generated successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to generate image');
    }
    setLoading(false);
  };

  const downloadImage = async () => {
    if (!content) return;
    
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-300'>
      
      {/* Left Column - Form */}
      <form 
        ref={formRef}
        onSubmit={onSubmitHandler} 
        className='w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 h-fit'
        style={{ opacity: 0 }}
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-purple-400' />
          <h1 className='text-xl font-bold text-slate-100'>AI Image Generator</h1>
        </div>

        {/* Image Description */}
        <p className='mt-6 text-sm font-semibold text-slate-400'>Describe Your Image</p>
        <textarea 
          onChange={(e) => setInput(e.target.value)} 
          value={input} 
          rows={4}  
          className='w-full p-3 px-4 mt-2 outline-none text-sm text-slate-100 placeholder:text-slate-500 rounded-lg bg-slate-700/50 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all resize-none'
          placeholder='Describe what you want to see in the image...' 
          required
        />

        {/* Style Selection */}
        <p className='mt-5 text-sm font-semibold text-slate-400'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {imageStyles.map((item) => (
            <span 
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-2 border rounded-full cursor-pointer transition-all duration-200 ${
                selectedStyle === item 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500 shadow-lg shadow-purple-500/20' 
                  : 'text-slate-400 border-slate-600 hover:border-slate-500 hover:text-slate-300'
              }`} 
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Publish Toggle */}
        <div className='my-6 flex items-center gap-3'>
          <label className='relative cursor-pointer'>
            <input 
              type="checkbox" 
              onChange={(e) => setPublish(e.target.checked)} 
              checked={publish} 
              className='sr-only peer' 
            />
            <div className='w-11 h-6 bg-slate-600 rounded-full peer-checked:bg-purple-500 transition-all duration-200'></div>
            <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5'></span>
          </label>
          <p className='text-sm text-slate-400'>Make this image Public</p>
        </div>
        
        {/* Generate Button */}
        <button 
          disabled={loading}
          className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-3 text-sm font-semibold rounded-lg cursor-pointer shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 hover:scale-[1.02] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:hover:scale-100'
        >
          {loading ? (
            <>
              <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
              Generating...
            </>
          ) : (
            <>
              <Image className='w-5' />
              Generate Image
            </>
          )}
        </button>
      </form>

      {/* Right Column - Output */}
      <div 
        ref={outputRef}
        className='generate-image-output w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 flex flex-col min-h-[500px] lg:min-h-0 lg:max-h-[calc(100vh-4rem)] overflow-y-auto'
        style={{ opacity: 0 }}
      >
        <div className='flex items-center justify-between pb-4 border-b border-slate-700'>
          <div className='flex items-center gap-3'>
            <Image className='w-5 h-5 text-purple-400' />
            <h1 className='text-xl font-bold text-slate-100'>Generated Image</h1>
          </div>
          {content && (
            <button
              onClick={downloadImage}
              className='flex items-center gap-2 px-3 py-2 text-xs text-slate-300 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-200'
            >
              <Download className='w-4 h-4' />
              Download
            </button>
          )}
        </div>

        {/* Placeholder */}
        <div 
          ref={placeholderRef} 
          className='flex-1 flex justify-center items-center'
        >
          <div className='text-sm flex flex-col items-center gap-5 text-slate-600'>
            <Image className='w-12 h-12' />
            <p className='text-slate-500 text-center'>
              Enter a description and click <br />
              "Generate Image" to get started
            </p>
          </div>
        </div>
        
        {/* Generated Image */}
        <div 
          ref={contentRef} 
          className='mt-3 opacity-0 flex-1 flex flex-col'
        >
          {content && (
            <>
              <img 
                src={content} 
                alt="AI Generated" 
                className="w-full h-auto max-h-[500px] object-contain rounded-lg bg-slate-900/50"
              />
              <div className='mt-4 p-3 bg-slate-700/30 rounded-lg'>
                <p className='text-xs text-slate-400 mb-2'>Prompt used:</p>
                <p className='text-sm text-slate-300'>{input} - {selectedStyle}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;