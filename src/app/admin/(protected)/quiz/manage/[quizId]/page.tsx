'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Quiz } from '@/lib/types';
import { MCQQuestionEditor } from './MCQQuestionEditor';
import { CodingQuestionEditor } from './CodingQuestionEditor';

export default function ManageQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuiz() {
      const { data } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();
      
      if (data) {
        setQuiz(data);
      }
      setLoading(false);
    }
    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex items-center gap-2 text-charcoal-400 text-sm font-medium">
          <svg className="animate-spin text-brand-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Loading quiz…
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-display font-bold text-charcoal-700 text-base mb-1">Quiz not found</p>
      </div>
    );
  }

  if (quiz.type === 'coding') {
    return <CodingQuestionEditor quizId={String(quizId)} />;
  }

  return <MCQQuestionEditor quizId={String(quizId)} />;
}
