import { Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    'General', 'Technology', 'Business', 'Health',
    'Lifestyle', 'Education', 'Travel', 'Food'
  ];

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please enter a keyword or topic');
      return;
    }

    try {
      setLoading(true);
      setContent('');
      
      const prompt = `Generate compelling blog titles for the keyword "${input}" in the ${selectedCategory} category. Provide 5-7 creative, SEO-friendly titles.`;
      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        { prompt },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success('Titles generated successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Blog titles error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to generate titles');
    } finally {
      setLoading(false);
    }
  };

  // Custom Markdown components for better styling
  const MarkdownComponents = {
    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-2 mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mt-4 mb-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-white mt-3 mb-2" {...props} />,
    p: ({node, ...props}) => <p className="text-slate-300 leading-6 mb-3" {...props} />,
    ul: ({node, ...props}) => <ul className="text-slate-300 mb-4 space-y-2 list-disc list-inside" {...props} />,
    ol: ({node, ...props}) => <ol className="text-slate-300 mb-4 space-y-2 list-decimal list-inside" {...props} />,
    li: ({node, ...props}) => <li className="text-slate-300 leading-6" {...props} />,
    strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
    em: ({node, ...props}) => <em className="italic text-slate-200" {...props} />,
  };

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-300'>
      
      {/* Left Column - Form */}
      <form 
        onSubmit={onSubmitHandler} 
        className='w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 h-fit'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-purple-400' />
          <h1 className='text-xl font-bold text-slate-100'>AI Title Generator</h1>
        </div>

        {/* Keyword Input */}
        <p className='mt-6 text-sm font-semibold text-slate-400'>Keyword/Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className='w-full p-3 px-4 mt-2 outline-none text-sm text-slate-100 placeholder:text-slate-500 rounded-lg bg-slate-700/50 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all'
          placeholder='The future of artificial intelligence...'
          required
        />

        {/* Category Selection */}
        <p className='mt-5 text-sm font-semibold text-slate-400'>Category</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-2 border rounded-full cursor-pointer transition-all duration-200 ${
                selectedCategory === item 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500 shadow-lg shadow-purple-500/20' 
                  : 'text-slate-400 border-slate-600 hover:border-slate-500 hover:text-slate-300'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="h-px bg-slate-700 my-6" />

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
              <Hash className='w-5' />
              Generate Titles
            </>
          )}
        </button>
      </form>

      {/* Right Column - Output */}
      <div className='w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 flex flex-col min-h-[500px] lg:min-h-0 lg:max-h-[calc(100vh-4rem)] overflow-y-auto'>
        <div className='flex items-center gap-3 pb-4 border-b border-slate-700'>
          <Hash className='w-5 h-5 text-purple-400' />
          <h1 className='text-xl font-bold text-slate-100'>Generated Titles</h1>
        </div>

        {/* Placeholder */}
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-slate-600'>
              <Hash className='w-12 h-12' />
              <p className='text-slate-500 text-center'>
                Enter a topic and click<br/>
                "Generate Titles" to get started
              </p>
            </div>
          </div>
        ) : (
          /* Generated Content */
          <div className='mt-3 flex-1 text-slate-300 text-sm leading-relaxed'>
            <Markdown components={MarkdownComponents}>
              {content}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;