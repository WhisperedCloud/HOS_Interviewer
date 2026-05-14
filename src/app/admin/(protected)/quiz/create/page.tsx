'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { DatePicker } from '@/components/ui/DatePicker';
import { Target, Clock, Link } from 'lucide-react';

/* ─── Tip card ───────────────────────────────────────────────────────────── */
function TipCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0 text-brand-500">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <p className="font-display font-semibold text-charcoal-700 text-sm">{title}</p>
        <p className="text-charcoal-400 text-xs leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({
  id, label, type = 'text', placeholder, value, onChange, hint,
}: {
  id: string; label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display font-semibold text-xs text-charcoal-600 uppercase tracking-wider">
        {label}
      </label>
      <div className={`
        border-2 rounded-2xl bg-white transition-all duration-200
        ${focused
          ? 'border-brand-400 shadow-[0_0_0_3px_rgb(232_72_58_/_0.09)]'
          : 'border-warm-300 hover:border-warm-400'
        }
      `}>
        <input
          id={id} type={type} required
          placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3 text-sm font-body text-charcoal-900 placeholder:text-charcoal-400 bg-transparent rounded-2xl focus:outline-none"
        />
      </div>
      {hint && <p className="text-xs text-charcoal-400">{hint}</p>}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function CreateQuizPage() {
  const router = useRouter();

  const [title,       setTitle]       = useState('');
  const [domain,      setDomain]      = useState('');
  const [activeFrom,  setActiveFrom]  = useState('');
  const [activeUntil, setActiveUntil] = useState('');
  const [creating,    setCreating]    = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/admin/login'); return; }

    const from  = new Date(activeFrom);
    const until = new Date(activeUntil);

    if (until <= from) {
      setError('"Active Until" must be after "Active From".');
      setCreating(false);
      return;
    }

    const { data, error } = await supabase
      .from('quizzes')
      .insert([{
        title,
        domain,
        active_from:  from.toISOString(),
        active_until: until.toISOString(),
        admin_id:     session.user.id,
      }])
      .select();

    if (error || !data) {
      setError(error?.message ?? 'Failed to create quiz.');
      setCreating(false);
    } else {
      // Go straight to question editor for this new quiz
      router.push(`/admin/quiz/manage/${data[0].id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-up">

      {/* ── Page header ── */}
      <div className="mb-7">
        <h1 className="font-display font-extrabold text-charcoal-900 text-2xl sm:text-3xl tracking-tight">
          Create New Quiz
        </h1>
        <p className="text-charcoal-500 text-sm mt-0.5">
          Set up a new assessment — you'll add questions on the next step.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Form ── */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-warm-200 rounded-3xl shadow-sm">
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 rounded-t-3xl" />

            <form onSubmit={handleCreate} className="p-6 sm:p-8 space-y-5">

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 animate-fade-down">
                  <svg width="15" height="15" className="mt-0.5 flex-shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <Field
                id="title" label="Quiz Title"
                placeholder="e.g. SDE-1 Technical Assessment"
                value={title} onChange={setTitle}
                hint="Use a clear, descriptive name the candidate will see."
              />

              <Field
                id="domain" label="Domain / Role"
                placeholder="e.g. Engineering, Marketing, Sales"
                value={domain} onChange={setDomain}
                hint="Helps HR filter and organise quizzes by department."
              />

              {/* Date row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  id="from" label="Active From"
                  value={activeFrom} onChange={setActiveFrom}
                />
                <DatePicker
                  id="until" label="Active Until"
                  value={activeUntil} onChange={setActiveUntil}
                />
              </div>

              {/* Preview window pill */}
              {activeFrom && activeUntil && new Date(activeUntil) > new Date(activeFrom) && (
                <div className="flex items-center gap-2.5 bg-brand-50 border border-brand-100 rounded-2xl px-4 py-3 animate-fade-in">
                  <svg width="13" height="13" className="text-brand-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <p className="text-brand-700 text-xs font-medium">
                    Window: <span className="font-semibold">{new Date(activeFrom).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    {' → '}
                    <span className="font-semibold">{new Date(activeUntil).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              )}

              {/* Submit */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="
                    flex items-center gap-2
                    bg-brand-600 hover:bg-brand-700
                    disabled:opacity-60 disabled:cursor-not-allowed
                    text-white font-display font-semibold text-sm
                    px-6 py-3 rounded-2xl
                    shadow-brand-sm hover:shadow-brand-md
                    active:scale-[0.97] transition-all duration-200
                  "
                >
                  {creating ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Creating…
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Create & Add Questions
                    </>
                  )}
                </button>
                <p className="text-xs text-charcoal-400">
                  You'll be taken to the question editor next.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* ── Tips panel ── */}
        <div className="lg:col-span-1 flex flex-col gap-4">

          {/* Steps */}
          <div className="bg-white border border-warm-200 rounded-3xl shadow-sm p-5">
            <p className="font-display font-bold text-charcoal-800 text-sm mb-4">How it works</p>
            <div className="flex flex-col gap-4">
              {[
                { step: '1', label: 'Fill in quiz details', active: true },
                { step: '2', label: 'Add questions & options' },
                { step: '3', label: 'Share link with candidates' },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3">
                  <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    font-display font-bold text-xs flex-shrink-0
                    ${s.active
                      ? 'bg-brand-600 text-white shadow-brand-sm'
                      : 'bg-warm-100 text-charcoal-400'
                    }
                  `}>
                    {s.step}
                  </span>
                  <span className={`text-sm font-medium ${s.active ? 'text-charcoal-900' : 'text-charcoal-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-warm-50 border border-warm-200 rounded-3xl p-5 flex flex-col gap-4">
            <p className="font-display font-bold text-charcoal-800 text-sm">Tips</p>
            <TipCard icon={Target} title="Be specific with titles" desc="Candidates see the quiz title before starting — make it clear and role-specific." />
            <TipCard icon={Clock} title="Set a realistic window" desc="Allow enough time for all invited candidates to complete the quiz." />
            <TipCard icon={Link} title="Copy link after creating" desc="Share the unique quiz link with candidates via email or recruiter chat." />
          </div>
        </div>
      </div>
    </div>
  );
}