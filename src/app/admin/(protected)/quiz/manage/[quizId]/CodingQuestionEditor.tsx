'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { CodingQuestion, TestCase, Quiz } from '@/lib/types';
import Link from 'next/link';

/* ─── Loading ────────────────────────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="flex items-center gap-2 text-charcoal-400 text-sm font-medium">
        <svg className="animate-spin text-brand-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Loading editor…
      </div>
    </div>
  );
}

const LANGUAGES = [
  { id: 'python3', name: 'Python 3' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'c', name: 'C' },
];

/* ─── Delete modal ───────────────────────────────────────────────────────── */
function DeleteCodingQuestionModal({
  question, onCancel, onConfirm, deleting,
}: {
  question: CodingQuestion; onCancel: () => void; onConfirm: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-charcoal-950/50 backdrop-blur-sm" onClick={() => !deleting && onCancel()} />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-red-600" />
        <div className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" className="text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-charcoal-900 text-lg text-center mb-2">Delete Question?</h3>
          <p className="text-charcoal-500 text-sm text-center leading-relaxed mb-5 line-clamp-2 px-2">
            "{question.title}"
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={onCancel} disabled={deleting}
              className="flex-1 py-2.5 rounded-2xl font-display font-semibold text-sm bg-warm-100 text-charcoal-600 hover:bg-warm-200 border border-warm-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm} disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl font-display font-semibold text-sm bg-red-600 hover:bg-red-700 text-white transition-all duration-200 disabled:opacity-50 active:scale-[0.97]"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit modal ─────────────────────────────────────────────────────────── */
function EditCodingQuestionModal({
  question, onCancel, onSave, saving,
}: {
  question: CodingQuestion;
  onCancel: () => void;
  onSave: (updated: Partial<CodingQuestion>) => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(question.title);
  const [desc, setDesc] = useState(question.description);
  const [langOptions, setLangOptions] = useState(question.language_options || ['python3', 'javascript', 'c']);
  const [timeLimit, setTimeLimit] = useState(question.time_limit_seconds);
  const [err, setErr] = useState('');

  const handleSave = () => {
    if (!title.trim() || !desc.trim()) { setErr('Title and Description are required.'); return; }
    setErr('');
    onSave({
      title,
      description: desc,
      language_options: langOptions,
      time_limit_seconds: timeLimit,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-charcoal-950/50 backdrop-blur-sm" onClick={() => !saving && onCancel()} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />

        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-charcoal-900 text-lg">Edit Coding Problem</h3>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-warm-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Error */}
          {err && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4 text-xs text-red-700 font-medium animate-fade-down">
              {err}
            </div>
          )}

          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-display font-semibold text-xs text-charcoal-600 uppercase tracking-wider">
                Title
              </label>
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl font-body text-sm text-charcoal-900 bg-white border-2 border-warm-300 focus:border-brand-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-display font-semibold text-xs text-charcoal-600 uppercase tracking-wider">
                Description (Markdown supported)
              </label>
              <textarea
                rows={5} value={desc} onChange={e => setDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl font-body text-sm text-charcoal-900 bg-white border-2 border-warm-300 focus:border-brand-400 focus:outline-none font-mono"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="font-display font-semibold text-xs text-charcoal-600 uppercase tracking-wider">
                  Languages (not editable yet)
                </label>
                <div className="w-full px-4 py-3 rounded-2xl font-body text-sm text-charcoal-500 bg-warm-50 border-2 border-warm-200">
                  {langOptions.join(', ')}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="font-display font-semibold text-xs text-charcoal-600 uppercase tracking-wider">
                  Time Limit (sec)
                </label>
                <input
                  type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl font-body text-sm text-charcoal-900 bg-white border-2 border-warm-300 focus:border-brand-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 mt-6">
            <button
              onClick={onCancel} disabled={saving}
              className="flex-1 py-2.5 rounded-2xl font-display font-semibold text-sm bg-warm-100 text-charcoal-600 hover:bg-warm-200 border border-warm-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl font-display font-semibold text-sm bg-brand-600 hover:bg-brand-700 text-white transition-all duration-200 disabled:opacity-50 active:scale-[0.97]"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Manage Test Cases Modal ────────────────────────────────────────────── */
function ManageTestCasesModal({
  question, onCancel,
}: {
  question: CodingQuestion;
  onCancel: () => void;
}) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);

  // Form for new test case
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchTestCases = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('test_cases').select('*').eq('question_id', question.id).order('created_at');
    if (data) setTestCases(data);
    setLoading(false);
  }, [question.id]);

  useEffect(() => { fetchTestCases(); }, [fetchTestCases]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !expectedOutput.trim()) return;
    setAdding(true);
    const { error } = await supabase.from('test_cases').insert([{
      question_id: question.id,
      input,
      expected_output: expectedOutput,
      is_public: isPublic
    }]);
    if (error) alert('Error: ' + error.message);
    else {
      setInput(''); setExpectedOutput(''); setIsPublic(true);
      fetchTestCases();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test case?')) return;
    await supabase.from('test_cases').delete().eq('id', id);
    fetchTestCases();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-charcoal-950/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />

        <div className="p-6 flex items-center justify-between border-b border-warm-200">
          <div>
            <h3 className="font-display font-bold text-charcoal-900 text-lg">Test Cases</h3>
            <p className="text-charcoal-500 text-sm">{question.title}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-warm-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
          {/* List */}
          <div className="flex-1 space-y-4">
            <h4 className="font-display font-bold text-sm text-charcoal-900 uppercase tracking-wider">Existing Test Cases</h4>
            {loading ? (
              <div className="text-sm text-charcoal-400">Loading...</div>
            ) : testCases.length === 0 ? (
              <div className="text-sm text-charcoal-400 p-4 border border-dashed border-warm-300 rounded-2xl text-center">No test cases added yet.</div>
            ) : (
              <div className="space-y-3">
                {testCases.map((tc, idx) => (
                  <div key={tc.id} className="p-4 border border-warm-200 rounded-2xl relative bg-warm-50">
                    <button onClick={() => handleDelete(tc.id)} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                    </button>
                    <div className="text-xs font-display font-bold text-charcoal-500 mb-2 uppercase">Test Case {idx + 1} {!tc.is_public && <span className="ml-2 text-amber-600 bg-amber-100 px-2 py-0.5 rounded">Hidden</span>}</div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-charcoal-400 font-bold uppercase mb-1">Input</div>
                        <pre className="text-xs bg-charcoal-900 text-white p-2 rounded-lg overflow-x-auto font-mono">{tc.input}</pre>
                      </div>
                      <div>
                        <div className="text-[10px] text-charcoal-400 font-bold uppercase mb-1">Expected Output</div>
                        <pre className="text-xs bg-charcoal-900 text-white p-2 rounded-lg overflow-x-auto font-mono">{tc.expected_output}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add form */}
          <div className="w-full md:w-1/3 bg-white border border-warm-200 p-5 rounded-2xl shadow-sm h-fit">
            <h4 className="font-display font-bold text-sm text-charcoal-900 uppercase tracking-wider mb-4">Add New</h4>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-charcoal-600 uppercase mb-1 block">Input (stdin/args)</label>
                <textarea
                  required rows={3} value={input} onChange={e => setInput(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-warm-300 rounded-xl focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-charcoal-600 uppercase mb-1 block">Expected Output (stdout)</label>
                <textarea
                  required rows={3} value={expectedOutput} onChange={e => setExpectedOutput(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-warm-300 rounded-xl focus:border-brand-500 focus:outline-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!isPublic} onChange={e => setIsPublic(!e.target.checked)} className="w-4 h-4 text-brand-600 rounded" />
                <span className="text-sm font-medium text-charcoal-700">Hidden Test Case</span>
              </label>
              <button type="submit" disabled={adding} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 rounded-xl text-sm disabled:opacity-50">
                {adding ? 'Adding...' : 'Add Test Case'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Question card ──────────────────────────────────────────────────────── */
function CodingQuestionCard({
  question, index, onEdit, onDelete, onManageTestCases,
}: {
  question: CodingQuestion; index: number;
  onEdit: (q: CodingQuestion) => void;
  onDelete: (q: CodingQuestion) => void;
  onManageTestCases: (q: CodingQuestion) => void;
}) {
  return (
    <div
      className="bg-white border border-warm-200 rounded-2xl shadow-xs hover:shadow-sm hover:border-warm-300 transition-all duration-200 overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-3 p-5 pb-4">
        <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-brand-100 text-brand-700 font-display font-bold text-xs flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-charcoal-900 text-base leading-snug truncate">
            {question.title}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-warm-100 text-charcoal-600 rounded-lg">{question.language_options?.join(', ')}</span>
            <span className="text-xs text-charcoal-400 font-medium">{question.time_limit_seconds}s limit</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-warm-100 bg-warm-50/60">
        <button
          onClick={() => onManageTestCases(question)}
          className="inline-flex items-center gap-1.5 text-xs font-display font-semibold px-3.5 py-1.5 rounded-xl bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors shadow-sm"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 3v5h5" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
          Manage Test Cases
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(question)}
            className="inline-flex items-center gap-1.5 text-xs font-display font-semibold px-3 py-1.5 rounded-xl bg-white text-charcoal-600 hover:bg-warm-100 border border-warm-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(question)}
            className="inline-flex items-center gap-1.5 text-xs font-display font-semibold px-3 py-1.5 rounded-xl bg-white text-red-500 hover:bg-red-50 hover:text-red-600 border border-warm-200 hover:border-red-200 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export function CodingQuestionEditor({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  /* Add form state */
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);

  /* Edit modal */
  const [editingQ, setEditingQ] = useState<CodingQuestion | null>(null);
  const [savingQ, setSavingQ] = useState(false);

  /* Delete modal */
  const [deletingQ, setDeletingQ] = useState<CodingQuestion | null>(null);
  const [deletingQQ, setDeletingQQ] = useState(false);

  /* Test cases modal */
  const [managingQ, setManagingQ] = useState<CodingQuestion | null>(null);

  const fetchData = useCallback(async () => {
    const [{ data: quizData }, { data: qData }] = await Promise.all([
      supabase.from('quizzes').select('*').eq('id', quizId).single(),
      supabase.from('coding_questions').select('*').eq('quiz_id', quizId).order('created_at', { ascending: true }),
    ]);
    if (quizData) setQuiz(quizData);
    if (qData) setQuestions(qData);
    setLoading(false);
  }, [quizId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) { alert('Please provide Title and Description.'); return; }
    setSubmitting(true);

    const { error } = await supabase.from('coding_questions').insert([{
      quiz_id: quizId,
      title,
      description: desc,
      language_options: ['python3', 'javascript', 'c'], // Default all for now
      time_limit_seconds: timeLimit,
    }]);

    if (!error) {
      setTitle(''); setDesc('');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2500);
      await fetchData();
    } else {
      alert('Error: ' + error.message);
    }
    setSubmitting(false);
  };

  const handleEditSave = async (updated: Partial<CodingQuestion>) => {
    if (!editingQ) return;
    setSavingQ(true);
    const { error } = await supabase.from('coding_questions').update(updated).eq('id', editingQ.id);
    if (error) alert('Error: ' + error.message);
    else { setEditingQ(null); await fetchData(); }
    setSavingQ(false);
  };

  const handleDeleteQuestion = async () => {
    if (!deletingQ) return;
    setDeletingQQ(true);
    await supabase.from('test_cases').delete().eq('question_id', deletingQ.id);
    const { error } = await supabase.from('coding_questions').delete().eq('id', deletingQ.id);
    if (error) alert('Error: ' + error.message);
    else { setDeletingQ(null); await fetchData(); }
    setDeletingQQ(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-7 animate-fade-up">

      {/* Header */}
      <div>
        <Link href="/admin/quiz/manage" className="inline-flex items-center gap-1.5 text-sm font-display font-semibold text-charcoal-500 hover:text-brand-600 mb-3 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          Back to Manage Quizzes
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-charcoal-900 text-2xl sm:text-3xl tracking-tight">
              {quiz?.title ?? 'Coding Questions'}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {quiz?.domain && (
                <span className="inline-flex items-center gap-1 text-xs font-display font-semibold bg-warm-100 border border-warm-200 text-charcoal-500 px-2.5 py-1 rounded-pill">
                  {quiz.domain}
                </span>
              )}
              <span className="text-charcoal-400 text-xs">·</span>
              <span className="text-charcoal-500 text-xs font-medium">{questions.length} question{questions.length !== 1 ? 's' : ''} added</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-white border border-warm-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
            </div>
            <h2 className="font-display font-bold text-charcoal-900 text-base">Add Coding Problem</h2>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-2xl px-4 py-3 mb-5 animate-fade-down">
              Problem added successfully!
            </div>
          )}

          <form onSubmit={handleAddQuestion} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-display font-semibold text-xs text-charcoal-600 uppercase tracking-wider">Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Two Sum" className="w-full px-4 py-3 rounded-2xl font-body text-sm text-charcoal-900 placeholder:text-charcoal-400 border-2 border-warm-300 focus:border-brand-400 focus:outline-none" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-display font-semibold text-xs text-charcoal-600 uppercase tracking-wider">Description (Markdown)</label>
              <textarea required rows={4} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Explain the problem..." className="w-full px-4 py-3 rounded-2xl font-body text-sm text-charcoal-900 placeholder:text-charcoal-400 border-2 border-warm-300 focus:border-brand-400 focus:outline-none font-mono" />
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="font-display font-semibold text-xs text-charcoal-600 uppercase tracking-wider">Time Limit (sec)</label>
              <input type="number" min="5" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl font-body text-sm text-charcoal-900 border-2 border-warm-300 focus:border-brand-400 focus:outline-none" />
            </div>

            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-display font-semibold text-sm px-6 py-3 rounded-2xl shadow-brand-sm transition-all">
              {submitting ? 'Adding...' : 'Add Problem'}
            </button>
          </form>
        </div>
      </div>

      {/* List */}
      <div>
        <h2 className="font-display font-bold text-charcoal-900 text-base mb-4">Problems added</h2>
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center bg-white border border-warm-200 border-dashed rounded-3xl">
            <p className="font-display font-bold text-charcoal-600 text-sm mb-1">No coding problems yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {questions.map((q, idx) => (
              <CodingQuestionCard key={q.id} question={q} index={idx} onEdit={setEditingQ} onDelete={setDeletingQ} onManageTestCases={setManagingQ} />
            ))}
          </div>
        )}
      </div>

      {editingQ && <EditCodingQuestionModal question={editingQ} onCancel={() => setEditingQ(null)} onSave={handleEditSave} saving={savingQ} />}
      {deletingQ && <DeleteCodingQuestionModal question={deletingQ} onCancel={() => setDeletingQ(null)} onConfirm={handleDeleteQuestion} deleting={deletingQQ} />}
      {managingQ && <ManageTestCasesModal question={managingQ} onCancel={() => setManagingQ(null)} />}
    </div>
  );
}
