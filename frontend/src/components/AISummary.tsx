import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Task } from './TaskCard';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface AISummaryProps {
  tasks: Task[];
}

export default function AISummary({ tasks }: AISummaryProps) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await api.get('/ai/summary');
        setSummary(response.data.summary);
      } catch (error) {
        console.error('Failed to fetch AI summary', error);
        setSummary('Unable to generate summary at this time.');
      } finally {
        setLoading(false);
      }
    };

    if (tasks.length > 0) {
        fetchSummary();
    } else {
        setSummary("Create tasks to unlock your AI-powered weekly summary!");
    }
  }, [tasks.length]);

  return (
    <div className="relative rounded-xl shadow-lg p-6 text-white mb-8 overflow-hidden min-h-[200px] flex flex-col justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/ai-bg.png" 
          alt="AI Background" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-indigo-950/70 backdrop-blur-[1px]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="relative w-10 h-10 mr-3 rounded-lg overflow-hidden shadow-md border border-white/20">
            <Image 
              src="/ai-logo.png" 
              alt="AI Logo" 
              fill 
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">Weekly AI Insights</h3>
        </div>

        <div className="prose prose-invert prose-sm max-w-none">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
            </div>
          ) : (
            <div className="text-indigo-50 font-medium leading-relaxed drop-shadow-sm">
                <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
