export interface ShadowAiTool {
  id: string
  name: string
  category: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  riskScore: number
  dataRisk: string
  domains: string[]
  vendor: string
}

export const SHADOW_AI_TOOLS: ShadowAiTool[] = [
  { id: '1', name: 'ChatGPT', category: 'Conversational AI', riskLevel: 'CRITICAL', riskScore: 95, dataRisk: 'Sends prompts+data to OpenAI', domains: ['chat.openai.com', 'openai.com'], vendor: 'OpenAI' },
  { id: '2', name: 'GitHub Copilot', category: 'Code Assistant', riskLevel: 'HIGH', riskScore: 80, dataRisk: 'Sends code to GitHub/OpenAI', domains: ['copilot.github.com', 'github.com'], vendor: 'GitHub' },
  { id: '3', name: 'Grammarly', category: 'Writing Assistant', riskLevel: 'HIGH', riskScore: 75, dataRisk: 'Reads all text typed by user', domains: ['grammarly.com', 'app.grammarly.com'], vendor: 'Grammarly' },
  { id: '4', name: 'Notion AI', category: 'Productivity AI', riskLevel: 'HIGH', riskScore: 78, dataRisk: 'Accesses all Notion workspace data', domains: ['notion.so', 'www.notion.so'], vendor: 'Notion' },
  { id: '5', name: 'Midjourney', category: 'Image Generation', riskLevel: 'MEDIUM', riskScore: 55, dataRisk: 'Prompts sent to Discord/Midjourney', domains: ['midjourney.com', 'discord.com'], vendor: 'Midjourney' },
  { id: '6', name: 'Otter.ai', category: 'Meeting Transcription', riskLevel: 'CRITICAL', riskScore: 90, dataRisk: 'Records and transcribes all meetings', domains: ['otter.ai', 'app.otter.ai'], vendor: 'Otter.ai' },
  { id: '7', name: 'Fireflies.ai', category: 'Meeting Transcription', riskLevel: 'CRITICAL', riskScore: 92, dataRisk: 'Records meetings and stores transcripts', domains: ['fireflies.ai', 'app.fireflies.ai'], vendor: 'Fireflies' },
  { id: '8', name: 'Zapier AI', category: 'Workflow Automation', riskLevel: 'HIGH', riskScore: 82, dataRisk: 'Accesses data across all connected apps', domains: ['zapier.com', 'hooks.zapier.com'], vendor: 'Zapier' },
  { id: '9', name: 'Cursor', category: 'Code Assistant', riskLevel: 'HIGH', riskScore: 79, dataRisk: 'Sends full codebase to AI models', domains: ['cursor.sh', 'www.cursor.com'], vendor: 'Anysphere' },
  { id: '10', name: 'Claude', category: 'Conversational AI', riskLevel: 'CRITICAL', riskScore: 93, dataRisk: 'Sends prompts+data to Anthropic', domains: ['claude.ai', 'anthropic.com'], vendor: 'Anthropic' },
  { id: '11', name: 'Gemini', category: 'Conversational AI', riskLevel: 'CRITICAL', riskScore: 91, dataRisk: 'Sends prompts+data to Google', domains: ['gemini.google.com', 'bard.google.com'], vendor: 'Google' },
  { id: '12', name: 'Copilot (Microsoft)', category: 'Conversational AI', riskLevel: 'CRITICAL', riskScore: 90, dataRisk: 'Sends prompts+data to Microsoft', domains: ['copilot.microsoft.com', 'bing.com'], vendor: 'Microsoft' },
  { id: '13', name: 'Perplexity AI', category: 'Search AI', riskLevel: 'HIGH', riskScore: 77, dataRisk: 'Sends queries to external AI search', domains: ['perplexity.ai', 'www.perplexity.ai'], vendor: 'Perplexity' },
  { id: '14', name: 'Jasper AI', category: 'Content Generation', riskLevel: 'HIGH', riskScore: 76, dataRisk: 'Sends content drafts to Jasper servers', domains: ['jasper.ai', 'app.jasper.ai'], vendor: 'Jasper' },
  { id: '15', name: 'Copy.ai', category: 'Content Generation', riskLevel: 'MEDIUM', riskScore: 65, dataRisk: 'Sends prompts to Copy.ai servers', domains: ['copy.ai', 'app.copy.ai'], vendor: 'Copy.ai' },
  { id: '16', name: 'Writesonic', category: 'Content Generation', riskLevel: 'MEDIUM', riskScore: 63, dataRisk: 'Sends content to Writesonic servers', domains: ['writesonic.com', 'app.writesonic.com'], vendor: 'Writesonic' },
  { id: '17', name: 'Runway ML', category: 'Video Generation', riskLevel: 'HIGH', riskScore: 80, dataRisk: 'Uploads video/images to Runway servers', domains: ['runwayml.com', 'app.runwayml.com'], vendor: 'Runway' },
  { id: '18', name: 'ElevenLabs', category: 'Voice Generation', riskLevel: 'HIGH', riskScore: 78, dataRisk: 'Sends voice data to ElevenLabs', domains: ['elevenlabs.io', 'api.elevenlabs.io'], vendor: 'ElevenLabs' },
  { id: '19', name: 'Synthesia', category: 'Video Generation', riskLevel: 'HIGH', riskScore: 77, dataRisk: 'Uploads content to Synthesia servers', domains: ['synthesia.io', 'app.synthesia.io'], vendor: 'Synthesia' },
  { id: '20', name: 'HeyGen', category: 'Video Generation', riskLevel: 'MEDIUM', riskScore: 68, dataRisk: 'Sends video scripts to HeyGen', domains: ['heygen.com', 'app.heygen.com'], vendor: 'HeyGen' },
  { id: '21', name: 'Loom AI', category: 'Video Communication', riskLevel: 'MEDIUM', riskScore: 60, dataRisk: 'Processes video content with AI', domains: ['loom.com', 'www.loom.com'], vendor: 'Loom' },
  { id: '22', name: 'Zoom AI Companion', category: 'Meeting AI', riskLevel: 'HIGH', riskScore: 82, dataRisk: 'Processes all Zoom meeting content', domains: ['zoom.us', 'app.zoom.us'], vendor: 'Zoom' },
  { id: '23', name: 'Microsoft Copilot 365', category: 'Productivity AI', riskLevel: 'CRITICAL', riskScore: 94, dataRisk: 'Accesses all M365 data+emails+docs', domains: ['office.com', 'microsoft365.com'], vendor: 'Microsoft' },
  { id: '24', name: 'Google Workspace AI', category: 'Productivity AI', riskLevel: 'CRITICAL', riskScore: 93, dataRisk: 'Accesses all Google Workspace data', domains: ['workspace.google.com', 'docs.google.com'], vendor: 'Google' },
  { id: '25', name: 'Slack AI', category: 'Team Communication AI', riskLevel: 'HIGH', riskScore: 85, dataRisk: 'Processes all Slack messages', domains: ['slack.com', 'app.slack.com'], vendor: 'Salesforce' },
  { id: '26', name: 'Intercom AI', category: 'Customer Support AI', riskLevel: 'HIGH', riskScore: 80, dataRisk: 'Accesses all customer conversations', domains: ['intercom.com', 'app.intercom.com'], vendor: 'Intercom' },
  { id: '27', name: 'Zendesk AI', category: 'Customer Support AI', riskLevel: 'HIGH', riskScore: 79, dataRisk: 'Accesses all support ticket data', domains: ['zendesk.com', 'app.zendesk.com'], vendor: 'Zendesk' },
  { id: '28', name: 'Salesforce Einstein', category: 'CRM AI', riskLevel: 'CRITICAL', riskScore: 91, dataRisk: 'Accesses all CRM and customer data', domains: ['salesforce.com', 'einstein.salesforce.com'], vendor: 'Salesforce' },
  { id: '29', name: 'HubSpot AI', category: 'CRM AI', riskLevel: 'HIGH', riskScore: 83, dataRisk: 'Accesses all marketing+CRM data', domains: ['hubspot.com', 'app.hubspot.com'], vendor: 'HubSpot' },
  { id: '30', name: 'Linear AI', category: 'Project Management AI', riskLevel: 'MEDIUM', riskScore: 62, dataRisk: 'Accesses project and issue data', domains: ['linear.app', 'api.linear.app'], vendor: 'Linear' },
  { id: '31', name: 'Jira AI', category: 'Project Management AI', riskLevel: 'MEDIUM', riskScore: 65, dataRisk: 'Accesses all project management data', domains: ['atlassian.com', 'jira.atlassian.com'], vendor: 'Atlassian' },
  { id: '32', name: 'Confluence AI', category: 'Knowledge Base AI', riskLevel: 'HIGH', riskScore: 76, dataRisk: 'Accesses all company wiki content', domains: ['atlassian.com', 'confluence.atlassian.com'], vendor: 'Atlassian' },
  { id: '33', name: 'Airtable AI', category: 'Database AI', riskLevel: 'HIGH', riskScore: 74, dataRisk: 'Accesses all Airtable base data', domains: ['airtable.com', 'api.airtable.com'], vendor: 'Airtable' },
  { id: '34', name: 'Codeium', category: 'Code Assistant', riskLevel: 'HIGH', riskScore: 77, dataRisk: 'Sends code to Codeium servers', domains: ['codeium.com', 'api.codeium.com'], vendor: 'Codeium' },
  { id: '35', name: 'Tabnine', category: 'Code Assistant', riskLevel: 'MEDIUM', riskScore: 66, dataRisk: 'Sends code snippets to Tabnine', domains: ['tabnine.com', 'api.tabnine.com'], vendor: 'Tabnine' },
  { id: '36', name: 'Amazon CodeWhisperer', category: 'Code Assistant', riskLevel: 'HIGH', riskScore: 78, dataRisk: 'Sends code to AWS servers', domains: ['aws.amazon.com', 'codewhisperer.amazonaws.com'], vendor: 'Amazon' },
  { id: '37', name: 'Replit AI', category: 'Code Assistant', riskLevel: 'HIGH', riskScore: 80, dataRisk: 'Full codebase sent to Replit servers', domains: ['replit.com', 'repl.it'], vendor: 'Replit' },
  { id: '38', name: 'v0 by Vercel', category: 'UI Generation', riskLevel: 'MEDIUM', riskScore: 64, dataRisk: 'Sends UI prompts to Vercel AI', domains: ['v0.dev', 'vercel.com'], vendor: 'Vercel' },
  { id: '39', name: 'Bolt.new', category: 'Full Stack AI', riskLevel: 'HIGH', riskScore: 81, dataRisk: 'Sends full project to StackBlitz AI', domains: ['bolt.new', 'stackblitz.com'], vendor: 'StackBlitz' },
  { id: '40', name: 'Lovable', category: 'Full Stack AI', riskLevel: 'HIGH', riskScore: 79, dataRisk: 'Sends full project to Lovable servers', domains: ['lovable.dev', 'gptengineer.app'], vendor: 'Lovable' },
  { id: '41', name: 'Devin', category: 'Autonomous Coding AI', riskLevel: 'CRITICAL', riskScore: 96, dataRisk: 'Autonomous agent with full system access', domains: ['devin.ai', 'app.devin.ai'], vendor: 'Cognition' },
  { id: '42', name: 'AutoGPT', category: 'Autonomous AI', riskLevel: 'CRITICAL', riskScore: 97, dataRisk: 'Autonomous agent executes arbitrary tasks', domains: ['agpt.co', 'auto-gpt.ai'], vendor: 'Significant Gravitas' },
  { id: '43', name: 'CrewAI', category: 'Multi-Agent AI', riskLevel: 'CRITICAL', riskScore: 95, dataRisk: 'Orchestrates multiple autonomous agents', domains: ['crewai.com', 'app.crewai.com'], vendor: 'CrewAI' },
  { id: '44', name: 'LangChain', category: 'AI Framework', riskLevel: 'HIGH', riskScore: 83, dataRisk: 'Connects AI to external tools and data', domains: ['langchain.com', 'api.langchain.com'], vendor: 'LangChain' },
  { id: '45', name: 'Pinecone', category: 'Vector Database', riskLevel: 'MEDIUM', riskScore: 67, dataRisk: 'Stores and retrieves sensitive embeddings', domains: ['pinecone.io', 'api.pinecone.io'], vendor: 'Pinecone' },
  { id: '46', name: 'Character.AI', category: 'Conversational AI', riskLevel: 'HIGH', riskScore: 76, dataRisk: 'Sends all chat data to Character.AI', domains: ['character.ai', 'beta.character.ai'], vendor: 'Character.AI' },
  { id: '47', name: 'Pi AI', category: 'Conversational AI', riskLevel: 'MEDIUM', riskScore: 65, dataRisk: 'Sends personal conversations to Inflection', domains: ['pi.ai', 'heypi.com'], vendor: 'Inflection AI' },
  { id: '48', name: 'Poe', category: 'AI Aggregator', riskLevel: 'HIGH', riskScore: 80, dataRisk: 'Routes prompts through multiple AI models', domains: ['poe.com', 'quoracdn.net'], vendor: 'Quora' },
  { id: '49', name: 'You.com', category: 'Search AI', riskLevel: 'MEDIUM', riskScore: 62, dataRisk: 'Sends search queries to You.com AI', domains: ['you.com', 'api.you.com'], vendor: 'You.com' },
  { id: '50', name: 'Wordtune', category: 'Writing Assistant', riskLevel: 'MEDIUM', riskScore: 60, dataRisk: 'Sends text to Wordtune servers', domains: ['wordtune.com', 'app.wordtune.com'], vendor: 'AI21 Labs' }
]

export function findToolsByNames(names: string[]): ShadowAiTool[] {
  const normalizedNames = names.map(n => n.toLowerCase().trim())
  return SHADOW_AI_TOOLS.filter(tool => normalizedNames.includes(tool.name.toLowerCase().trim()))
}

export function findToolsByDomains(domains: string[]): ShadowAiTool[] {
  const normalizedDomains = domains.map(d => d.toLowerCase().trim())
  const matchedTools = SHADOW_AI_TOOLS.filter(tool => 
    tool.domains.some(domain => normalizedDomains.includes(domain.toLowerCase()))
  )
  return Array.from(new Set(matchedTools))
}

export function calculateOverallRisk(tools: ShadowAiTool[]): {
  score: number
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
} {
  let criticalCount = 0
  let highCount = 0
  let mediumCount = 0
  let lowCount = 0
  let totalScore = 0

  for (const tool of tools) {
    if (tool.riskLevel === 'CRITICAL') criticalCount++
    else if (tool.riskLevel === 'HIGH') highCount++
    else if (tool.riskLevel === 'MEDIUM') mediumCount++
    else if (tool.riskLevel === 'LOW') lowCount++
    totalScore += tool.riskScore
  }

  const score = tools.length > 0 ? Math.round(totalScore / tools.length) : 0
  let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
  if (score >= 80) level = 'CRITICAL'
  else if (score >= 60) level = 'HIGH'
  else if (score >= 40) level = 'MEDIUM'
  else level = 'LOW'

  return {
    score,
    level,
    criticalCount,
    highCount,
    mediumCount,
    lowCount
  }
}
