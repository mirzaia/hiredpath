import React, { useState } from 'react';
import { Sparkles, FileText, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateRoadmapSkeleton } from '../services/aiService';
import { useApp } from '../context/AppContext';
const JDInput = () => {
  const [jdText, setJdText] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [localApiKey, setLocalApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorText, setErrorText] = useState('');
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const apiKey = state.apiKey || localApiKey;

  const handleAnalyze = async () => {
    setErrorText('');
    
    if (!apiKey) {
      setErrorText('Please provide a Gemini API Key to use the AI Analyzer.');
      return;
    }
    if (jdText.trim().length < 50) {
      setErrorText('Please paste a more detailed job description (minimum 50 characters).');
      return;
    }
    if (!companyName.trim()) {
      setErrorText('Please provide a Company or Role name to save this plan.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const generatedModules = await generateRoadmapSkeleton(apiKey, jdText);
      const planId = 'plan_' + Math.random().toString(36).substring(2, 9);
      
      // Save key if not standardly saved
      if (!state.apiKey && localApiKey) {
        dispatch({ type: 'SET_API_KEY', key: localApiKey });
      }

      dispatch({ 
        type: 'SAVE_NEW_PLAN', 
        planData: {
          id: planId,
          companyName: companyName.trim(),
          jdText: jdText,
          modules: generatedModules
        }
      });
      // Clear inputs
      setJdText('');
      setCompanyName('');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setErrorText(err.message || 'An error occurred during AI analysis. Please check your token quota and console for details.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Tailor with Job Description</h3>
          <p className="text-sm text-slate-500">Paste a LinkedIn or job post to generate a custom preparation roadmap.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {!state.apiKey && (
          <input
            type="password"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none placeholder:text-slate-400"
            placeholder="Gemini API Key (sk-...)"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
          />
        )}
        <input
          type="text"
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none placeholder:text-slate-400"
          placeholder="Role / Company Name (e.g. Ajaib Sr SDET)"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      <div className="relative group">
        <textarea
          className="w-full min-h-[160px] p-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none resize-none placeholder:text-slate-400"
          placeholder="Paste the LinkedIn job description here... Requirements, responsibilities, etc. (We will filter out the noise automatically)"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
        
        <div className="absolute bottom-4 right-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || jdText.length < 50}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm
              ${isAnalyzing || jdText.length < 50 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md active:scale-95'}
            `}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing JD...
              </>
            ) : (
              <>
                <Sparkles size={16} className={jdText.length >= 50 ? 'text-orange-400' : ''} />
                Generate Tailored Roadmap
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
      
      {errorText && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 animate-in fade-in">
          {errorText}
        </div>
      )}

    </div>
  );
};

export default JDInput;
