export type QuizType = 'mcq' | 'coding';

export interface Quiz {
  id: string;
  created_at?: string;
  title: string;
  domain: string;
  type?: QuizType;
  active_from: string;
  active_until: string;
  admin_id: string;
}

export interface Question {
  id: string;
  created_at?: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  time_limit_seconds: number;
  image_url?: string | null;
}

export interface Result {
  id?: string;
  created_at?: string;
  quiz_id: string;
  candidate_name: string;
  candidate_email?: string;
  score: number;
  total_questions?: number;
  answers: any;
  tab_switch_count: number;
  resume_data?: string;
  submission_type?: 'coding' | 'mcq';
  code?: string;
  language?: string;
  test_results?: any[];
}

export type CodingLanguage = 'python3' | 'javascript' | 'c';

export const LANGUAGE_META: Record<CodingLanguage, { label: string; defaultCode: string }> = {
  python3: {
    label: 'Python 3',
    defaultCode: '# Write your Python 3 code here\n',
  },
  javascript: {
    label: 'JavaScript',
    defaultCode: '// Write your JavaScript code here\n',
  },
  c: {
    label: 'C',
    defaultCode: '#include <stdio.h>\n\nint main() {\n    // Write your C code here\n    return 0;\n}\n',
  },
};

export interface CodingQuestion {
  id: string;
  quiz_id: string;
  title: string;
  description: string;
  language_options: CodingLanguage[];
  time_limit_seconds: number;
  created_at?: string;
}

export interface TestCase {
  id: string;
  question_id: string;
  input: string;
  expected_output: string;
  is_public: boolean;
}

export interface TestCaseResult {
  test_case_id: string;
  input: string;
  expected_output: string;
  actual_output: string;
  passed: boolean;
  error: string | null;
  time_ms?: number;
  is_public: boolean;
}

export interface ExecuteResponse {
  results: TestCaseResult[];
  passed: number;
  total: number;
  success: boolean;
}

export interface ExecuteRequest {
  language: string;
  code: string;
  mode: 'test' | 'submit';
  test_cases: any[];
}