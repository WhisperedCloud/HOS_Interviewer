import { ExecuteRequest, ExecuteResponse } from './types';

export function isValidLanguage(lang: string): boolean {
  return ['python3', 'javascript', 'c'].includes(lang);
}

export async function checkExecutionHealth(): Promise<boolean> {
  // TODO: implement actual health check against Judge0/RapidAPI
  return true;
}

export async function runCode(req: ExecuteRequest): Promise<ExecuteResponse> {
  // TODO: implement actual Judge0/RapidAPI execution
  console.log(`Executing ${req.language} code in mode ${req.mode}`);
  
  return {
    results: req.test_cases.map(tc => ({
      test_case_id: tc.id,
      input: tc.input,
      expected_output: tc.expected_output,
      actual_output: tc.expected_output, // Mock pass
      passed: true,
      error: null,
      time_ms: 10,
      is_public: tc.is_public
    })),
    passed: req.test_cases.length,
    total: req.test_cases.length,
    success: true
  };
}
