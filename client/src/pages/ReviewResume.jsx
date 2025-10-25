import React, { useEffect, useState, useRef } from 'react';
import { FileText, ScanSearch, ClipboardCheck, Upload } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { gsap } from 'gsap';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const reviewOptions = [
    { id: 'overall', text: 'Overall Feedback' },
    { id: 'technical', text: 'Technical Skills' },
    { id: 'ats', text: 'ATS Optimization' },
  ];

  const [selectedOption, setSelectedOption] = useState(reviewOptions[0]);
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState('No file selected');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const formRef = useRef(null);
  const outputRef = useRef(null);
  const placeholderRef = useRef(null);
  const contentRef = useRef(null);
  const ctx = useRef(null);

  useEffect(() => {
    ctx.current = gsap.context(() => {
      gsap.fromTo([formRef.current, outputRef.current],
        { opacity: 0, y: 50, scale: 0.98 },
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
      gsap.to(placeholderRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' });
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
      gsap.to(placeholderRef.current, { opacity: 1, duration: 0.3, ease: 'power2.inOut' });
    }
  }, [loading, content]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PDF or DOCX.');
        return;
      }
      setResumeFile(file);
      setFileName(file.name);
      toast.success('Resume loaded!');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      toast.error("Please upload your resume file.");
      return;
    }

    if (e.target) {
      gsap.to(e.target, { 
        scale: 0.97, 
        duration: 0.15, 
        yoyo: true, 
        repeat: 1, 
        ease: 'power2.inOut' 
      });
    }

    try {
      setLoading(true);
      setContent('');
      
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('prompt', `Review this resume with a focus on ${selectedOption.text}.`);
      formData.append('reviewType', selectedOption.id);

      const { data } = await axios.post(
        '/api/ai/resume-review', // ✅ CORRECTED ENDPOINT
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data',
          } 
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success('Resume reviewed successfully!');
      } else {
        toast.error(data.message || "Failed to review resume.");
      }
    } catch (error) {
      console.error('Resume review error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to review resume');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (content && outputRef.current) {
      outputRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [content]);

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
    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 my-4 text-slate-300 italic bg-slate-800/50 py-2 rounded-r" {...props} />,
  };

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-300'>
      <form 
        ref={formRef} 
        onSubmit={onSubmitHandler} 
        className='w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 h-fit'
        style={{ opacity: 0 }}
      >
        <div className='flex items-center gap-3'>
          <FileText className='w-6 text-blue-400' />
          <h1 className='text-xl font-bold text-slate-100'>Resume Review</h1>
        </div>

        <p className='mt-6 text-sm font-semibold text-slate-400'>Upload Resume</p>
        <label 
          htmlFor="resume-upload" 
          className='w-full p-3 px-4 mt-2 flex items-center justify-between outline-none text-sm text-slate-100 placeholder:text-slate-500 rounded-lg bg-slate-700/50 border border-slate-600 cursor-pointer hover:border-blue-500 transition-all'
        >
          <span className='truncate max-w-[200px] sm:max-w-xs text-slate-400 italic'>{fileName}</span>
          <span className='flex-shrink-0 text-xs font-medium text-blue-400 border border-blue-400 rounded-md px-3 py-1 hover:bg-blue-400 hover:text-slate-900 transition-all'>
            <Upload className='w-4 h-4 inline-block mr-1' />
            Browse...
          </span>
        </label>
        <input 
          id="resume-upload"
          type="file" 
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.docx"
        />
        <p className='text-xs text-slate-500 mt-2'>Supports PDF, DOCX • Max 10MB</p>

        <p className='mt-5 text-sm font-semibold text-slate-400'>Review Focus</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {reviewOptions.map((item, index) => (
            <span
              onClick={() => setSelectedOption(item)}
              className={`text-xs px-4 py-2 font-medium border rounded-full cursor-pointer transition-all duration-200 ${
                selectedOption.text === item.text
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
              Reviewing...
            </>
          ) : (
            <>
              <ScanSearch className='w-5' />
              Review My Resume
            </>
          )}
        </button>
      </form>

      <div 
        ref={outputRef}
        className='w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 flex flex-col min-h-[500px] lg:min-h-0 lg:max-h-[calc(100vh-4rem)] overflow-y-auto'
        style={{ opacity: 0 }}
      >
        <div className='flex items-center gap-3 pb-4 border-b border-slate-700'>
          <ClipboardCheck className='w-5 h-5 text-blue-400' />
          <h1 className='text-xl font-bold text-slate-100'>Resume Feedback</h1>
        </div>

        <div 
          ref={placeholderRef} 
          className='flex-1 flex justify-center items-center'
        >
          {!content ? (
            <div className='text-sm flex flex-col items-center gap-5 text-slate-600'>
              <ScanSearch className='w-12 h-12' />
              <p className='text-slate-500 text-center'>Upload your resume and click<br/>"Review My Resume" to get started</p>
            </div>
          ) : null}
        </div>
        
        <div 
          ref={contentRef} 
          className='mt-3 opacity-0 flex-1 resume-review-content'
        >
          {content && (
            <div className='text-slate-300 text-sm leading-relaxed'>
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

export default ReviewResume;