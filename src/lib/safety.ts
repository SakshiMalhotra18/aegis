export interface SafetyResult {
  riskScore: number
  flagged: boolean
  flagReason: string | null
  detectedPatterns: string[]
}

const PATTERNS: Array<{ name: string; score: number; regex: RegExp }> = [
  {
    name: 'ignore_instructions',
    score: 35,
    regex: /ignore\s+(all\s+)?(previous|prior|above|system)\s+instructions?/i,
  },
  {
    name: 'jailbreak_attempt',
    score: 40,
    regex: /\b(jailbreak|dan mode|developer mode|unrestricted mode|bypass\s+safety)\b/i,
  },
  {
    name: 'role_hijack',
    score: 30,
    regex: /\byou are now\b|\bact as\s+(an?\s+)?(unrestricted|evil|unfiltered|jailbroken)/i,
  },
  {
    name: 'instruction_override',
    score: 35,
    regex: /disregard\s+(your\s+)?(guidelines|rules|instructions|training|constraints)/i,
  },
  {
    name: 'prompt_leak',
    score: 25,
    regex: /\b(reveal|show|print|output|repeat)\s+(your\s+)?(system\s+prompt|instructions|prompt)/i,
  },
  {
    name: 'token_smuggling',
    score: 30,
    regex: /\[INST\]|\[\/INST\]|<\|system\|>|<\|user\|>|\{\{.*?\}\}/i,
  },
  {
    name: 'api_key_in_prompt',
    score: 45,
    regex: /\b(sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z\-_]{35}|AKIA[0-9A-Z]{16})\b/,
  },
  {
    name: 'ssn_pattern',
    score: 50,
    regex: /\b\d{3}-\d{2}-\d{4}\b/,
  },
  {
    name: 'credit_card_pattern',
    score: 50,
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b/,
  },
  {
    name: 'password_in_prompt',
    score: 40,
    regex: /\b(password|passwd|secret|credentials?)\s*[:=]\s*\S+/i,
  },
  {
    name: 'exfiltration_attempt',
    score: 45,
    regex: /\b(send|transmit|exfiltrate|upload|post)\s+(all\s+)?(data|files?|documents?|secrets?)\s+(to|at)\s+https?:\/\//i,
  },
  {
    name: 'social_engineering',
    score: 25,
    regex: /\b(pretend|simulate|roleplay|imagine)\s+(you\s+)?(have\s+no\s+)?(restrictions?|limits?|filters?|safety)/i,
  },
  {
    name: 'urgency_manipulation',
    score: 15,
    regex: /\b(emergency|urgent|critical|immediately)\b.{0,50}\b(override|bypass|ignore|disable)\b/i,
  },
]

const FLAG_REASONS: Record<string, string> = {
  ignore_instructions: 'Prompt injection: instruction override attempt',
  jailbreak_attempt: 'Jailbreak attempt detected',
  role_hijack: 'Role hijacking attempt detected',
  instruction_override: 'Guideline bypass attempt detected',
  prompt_leak: 'System prompt extraction attempt',
  token_smuggling: 'Token smuggling / template injection detected',
  api_key_in_prompt: 'API key or credential detected in prompt',
  ssn_pattern: 'SSN pattern detected — potential PII exposure',
  credit_card_pattern: 'Credit card number detected — potential PCI violation',
  password_in_prompt: 'Password or secret detected in prompt',
  exfiltration_attempt: 'Data exfiltration attempt detected',
  social_engineering: 'Social engineering / safety bypass attempt',
  urgency_manipulation: 'Urgency-based manipulation detected',
}

export function analyzePrompt(prompt: string): SafetyResult {
  const detected = PATTERNS.filter((p) => p.regex.test(prompt))

  let riskScore = 0
  detected.forEach((p, index) => {
    riskScore += index < 2 ? p.score : Math.floor(p.score * 0.5)
  })
  riskScore = Math.min(100, riskScore)

  const flagged = riskScore >= 60
  const detectedPatterns = detected.map((p) => p.name)

  let flagReason: string | null = null
  if (detected.length > 0) {
    const top = detected.reduce((a, b) => (a.score > b.score ? a : b))
    flagReason = FLAG_REASONS[top.name] ?? 'Suspicious pattern detected'
  }

  return { riskScore, flagged, flagReason, detectedPatterns }
}
