'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Quiz } from '@/lib/types';
import { Link2Off, TimerOff, CalendarClock, AlertTriangle } from 'lucide-react';

/* ─── Logo mark ──────────────────────────────────────────────────────────── */
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 14C6 7 12 3 20 2C28 1 42 4 45 14C48 24 44 38 36 44C28 50 14 46 8 38C2 30 6 21 6 14Z" fill="#e8483a" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="-0.5">H</text>
    </svg>
  );
}

/* ─── Skeleton loader ────────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="relative flex flex-col min-h-dvh overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#fafaf9]">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #ccc7c1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-brand-500/10 blur-[96px]" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-brand-300/10 blur-[80px]" />
      </div>

      <header className="flex items-center px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <LogoMark size={36} />
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-charcoal-900 text-lg tracking-tight">HighOnSwift</span>
            <span className="text-[10px] font-medium text-charcoal-400 tracking-wide uppercase">Interview Portal</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white/90 border border-warm-200 rounded-3xl shadow-lg p-8 space-y-5">
          <div className="flex justify-center mb-2">
            <div className="skeleton w-12 h-12 rounded-2xl" />
          </div>
          <div className="skeleton h-7 w-3/4 mx-auto rounded-xl" />
          <div className="skeleton h-4 w-1/2 mx-auto rounded-lg" />
          <div className="space-y-3 pt-2">
            <div className="skeleton h-4 w-1/3 rounded-lg" />
            <div className="skeleton h-12 w-full rounded-xl" />
          </div>
          <div className="skeleton h-12 w-full rounded-2xl" />
          <div className="skeleton h-3 w-2/3 mx-auto rounded-lg" />
        </div>
      </main>
    </div>
  );
}

/* ─── Error / unavailable state ──────────────────────────────────────────── */
function ErrorState({ message }: { message: string }) {
  const isExpired = message.toLowerCase().includes('ended');
  const isEarly = message.toLowerCase().includes('not be active');
  const isNotFound = message.toLowerCase().includes('not found') || message.toLowerCase().includes('invalid');

  const Icon = isNotFound ? Link2Off : isExpired ? TimerOff : isEarly ? CalendarClock : AlertTriangle;
  const title = isNotFound
    ? 'Link not found'
    : isExpired
      ? 'Assessment closed'
      : isEarly
        ? 'Not yet available'
        : 'Access denied';

  return (
    <div className="relative flex flex-col min-h-dvh overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#fafaf9]">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #ccc7c1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-brand-500/10 blur-[96px]" />
      </div>

      <header className="flex items-center px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <LogoMark size={36} />
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-charcoal-900 text-lg tracking-tight">HighOnSwift</span>
            <span className="text-[10px] font-medium text-charcoal-400 tracking-wide uppercase">Interview Portal</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-white/90 border border-warm-200 rounded-3xl shadow-lg p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5 text-red-500">
              <Icon size={32} strokeWidth={2.5} />
            </div>

            <h2 className="font-display font-bold text-charcoal-900 text-xl mb-2">{title}</h2>
            <p className="text-charcoal-500 text-sm leading-relaxed mb-6">{message}</p>

            {/* Help box */}
            <div className="bg-warm-50 border border-warm-200 rounded-2xl p-4 text-left">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8483a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                  </svg>
                </div>
                <p className="text-xs text-charcoal-500 leading-relaxed">
                  If you believe this is an error, please contact the recruiter or HR team for a valid assessment link.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Quiz info chip ─────────────────────────────────────────────────────── */
function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-warm-100 border border-warm-200 text-charcoal-600 text-xs font-semibold font-display px-3 py-1.5 rounded-pill">
      {icon}
      {label}
    </span>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function CandidateEntry() {
  const { quizId } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeData, setResumeData] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [focusedName, setFocusedName] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (error || !data) {
        setError('Quiz not found or invalid link.');
        setLoading(false);
        return;
      }

      const now = new Date().getTime();
      const from = new Date(data.active_from).getTime();
      const until = new Date(data.active_until).getTime();

      if (now < from) {
        setError(`This quiz will not be active until ${new Date(data.active_from).toLocaleString()}`);
      } else if (now > until) {
        setError('This quiz has already ended.');
      } else {
        setQuiz(data);
      }
      setLoading(false);
    };

    fetchQuiz();
  }, [quizId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResumeError(null);
    if (!file) {
      setResumeData(null);
      setResumeName(null);
      return;
    }

    if (file.size > 1024 * 1024) { // 1MB
      setResumeError('Resume file must be less than 1MB');
      e.target.value = ''; // reset
      setResumeData(null);
      setResumeName(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeData(event.target?.result as string);
      setResumeName(file.name);
    };
    reader.onerror = () => {
      setResumeError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || submitting || resumeError) return;
    setSubmitting(true);
    localStorage.setItem(`candidate_name_${quizId}`, name.trim());
    localStorage.setItem(`candidate_email_${quizId}`, email.trim());
    if (resumeData) {
      localStorage.setItem(`candidate_resume_${quizId}`, resumeData);
      localStorage.setItem(`candidate_resume_name_${quizId}`, resumeName || '');
    } else {
      localStorage.removeItem(`candidate_resume_${quizId}`);
      localStorage.removeItem(`candidate_resume_name_${quizId}`);
    }
    router.push(`/quiz/${quizId}/play`);
  };

  /* ── States ── */
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  /* ── Active quiz entry form ── */
  return (
    <div className="relative flex flex-col min-h-dvh overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#fafaf9]" aria-hidden="true">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #ccc7c1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-brand-500/10 blur-[96px]" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-brand-300/10 blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <LogoMark size={36} />
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-charcoal-900 text-lg tracking-tight">HighOnSwift</span>
            <span className="text-[10px] font-medium text-charcoal-400 tracking-wide uppercase">Interview Portal</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md animate-fade-up">

          {/* Card */}
          <div className="bg-white/90 backdrop-blur-sm border border-warm-200 rounded-3xl shadow-lg overflow-hidden">

            {/* Card top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />

            <div className="p-7 sm:p-8">

              {/* Brand badge */}
              <div className="flex justify-center mb-5">
                <span className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-display font-semibold px-3.5 py-1.5 rounded-pill">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-brand" />
                  Assessment Active
                </span>
              </div>

              {/* Quiz title & domain */}
              <div className="text-center mb-6">
                <h1 className="font-display font-extrabold text-charcoal-900 text-2xl sm:text-3xl tracking-tight leading-tight mb-2">
                  {quiz?.title}
                </h1>
                <p className="text-charcoal-400 text-sm font-medium mb-4">
                  by HighOnSwift Recruitment
                </p>

                {/* Info chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  {quiz?.domain && (
                    <InfoChip
                      icon={
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                      }
                      label={quiz.domain}
                    />
                  )}
                  <InfoChip
                    icon={
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    }
                    label="Timed assessment"
                  />
                  <InfoChip
                    icon={
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    }
                    label="One attempt"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-warm-100 my-5" />

              {/* Name form */}
              <form onSubmit={handleStart} className="space-y-5">
                <div>
                  <label
                    htmlFor="candidate-name"
                    className="block font-display font-semibold text-sm text-charcoal-700 mb-2"
                  >
                    Your full name
                  </label>

                  {/* Animated input wrapper */}
                  <div
                    className={`
                      relative flex items-center
                      border-2 rounded-2xl
                      bg-white
                      transition-all duration-200
                      ${focusedName
                        ? 'border-brand-400 shadow-[0_0_0_4px_rgb(232_72_58_/_0.10)]'
                        : 'border-warm-300 hover:border-warm-400'
                      }
                    `}
                  >
                    <div className="absolute left-4 text-charcoal-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <input
                      id="candidate-name"
                      type="text"
                      required
                      autoComplete="name"
                      autoFocus
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedName(true)}
                      onBlur={() => setFocusedName(false)}
                      className="
                        w-full pl-10 pr-4 py-3.5
                        font-body text-[0.9375rem] text-charcoal-900
                        placeholder:text-charcoal-400
                        bg-transparent rounded-2xl
                        focus:outline-none
                      "
                    />
                    {/* Tick when name entered */}
                    {name.trim().length > 1 && (
                      <div className="absolute right-4 text-green-500 animate-scale-in">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="candidate-email"
                    className="block font-display font-semibold text-sm text-charcoal-700 mb-2"
                  >
                    Email address
                  </label>

                  {/* Animated input wrapper */}
                  <div
                    className={`
                      relative flex items-center
                      border-2 rounded-2xl
                      bg-white
                      transition-all duration-200
                      ${focusedEmail
                        ? 'border-brand-400 shadow-[0_0_0_4px_rgb(232_72_58_/_0.10)]'
                        : 'border-warm-300 hover:border-warm-400'
                      }
                    `}
                  >
                    <div className="absolute left-4 text-charcoal-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </div>
                    <input
                      id="candidate-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="priya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedEmail(true)}
                      onBlur={() => setFocusedEmail(false)}
                      className="
                        w-full pl-10 pr-4 py-3.5
                        font-body text-[0.9375rem] text-charcoal-900
                        placeholder:text-charcoal-400
                        bg-transparent rounded-2xl
                        focus:outline-none
                      "
                    />
                    {/* Tick when email entered */}
                    {email.includes('@') && email.includes('.') && (
                      <div className="absolute right-4 text-green-500 animate-scale-in">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resume upload */}
                <div>
                  <label
                    htmlFor="candidate-resume"
                    className="block font-display font-semibold text-sm text-charcoal-700 mb-2"
                  >
                    Upload Resume (Optional) <span className="font-normal text-charcoal-400">— Max 1MB</span>
                  </label>
                  <input
                    id="candidate-resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="
                      block w-full text-sm text-charcoal-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold file:font-display
                      file:bg-brand-50 file:text-brand-700
                      hover:file:bg-brand-100
                      cursor-pointer border border-warm-200 rounded-2xl p-1.5
                      transition-colors duration-200 bg-white
                    "
                  />
                  {resumeError && (
                    <p className="mt-2 text-xs font-medium text-red-500 animate-fade-in flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {resumeError}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!name.trim() || !email.trim() || submitting || !!resumeError}
                  className="
                    w-full flex items-center justify-center gap-2.5
                    bg-brand-600 hover:bg-brand-700
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-600
                    text-white font-display font-semibold text-[0.9375rem]
                    py-3.5 px-5 rounded-2xl
                    shadow-brand-sm hover:shadow-brand-md
                    active:scale-[0.97]
                    transition-all duration-200
                  "
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Starting…
                    </>
                  ) : (
                    <>
                      Begin Assessment
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Warning notice */}
              <div className="mt-5 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                <svg width="14" height="14" className="mt-0.5 flex-shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" /><path d="M12 17h.01" />
                </svg>
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  Do not refresh or switch tabs once the assessment begins. Each candidate gets one attempt only.
                </p>
              </div>

            </div>
          </div>

          {/* Below card — branding */}
          <p className="text-center text-xs text-charcoal-400 mt-5 font-medium">
            Powered by{' '}
            <span className="text-brand-600 font-semibold">HighOnSwift</span>
            {' '}· AI Solutions. Fast. Practical. Business-Ready.
          </p>
        </div>
      </main>
    </div>
  );
}