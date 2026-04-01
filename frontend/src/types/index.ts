export interface AIModel {
  id: string;
  name: string;
  org: string;
  lab: string;
  icon: string;
  bg: string;
  desc: string;
  tags: string[];
  badge: string;
  badgeClass: string;
  rating: number;
  reviews: number;
  price: string;
  price_start: number;
  types: string[];
  context: string;
  latency: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelId?: string;
  type?: 'text' | 'voice';
  audioUrl?: string;
  audioDurationMs?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  modelId: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
  isGuest: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  role: 'user' | 'guest';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  sessionId: string | null;
  sessionExpiry: number | null;
}

export interface Lab {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type MarketplaceFilter = 'all' | 'language' | 'vision' | 'code' | 'image' | 'audio' | 'open';

export const CPANEL_DATA: Record<string, string[]> = {
  use_cases: [
    'Help me find the best AI model for my project',
    'I want to build an AI chatbot for my website',
    'Generate realistic images for my marketing campaign',
    'Analyse documents and extract key information',
    'Create AI agents for workflow automation',
    'Add voice and speech recognition to my app',
  ],
  monitor: [
    'Track regulatory changes in my industry',
    'Alert me when a product drops in price',
    'Track my portfolio and alert me on big moves',
    'Watch for job postings at target companies',
    'Monitor a competitor daily for any changes',
    'Set up news alerts for my niche topic',
  ],
  prototype: [
    'Build a quick prototype for my app idea',
    'Create a REST API scaffold for my project',
    'Generate a landing page from my description',
    'Turn my wireframe description into working HTML',
    'Build a chatbot prototype in under 10 minutes',
    'Create a data pipeline prototype with sample code',
  ],
  business: [
    'Write a business plan for my startup idea',
    'Create a go-to-market strategy for my product',
    'Draft a financial projection model for investors',
    'Identify my target market and ideal customer profile',
    'Write an executive summary for my pitch deck',
    'Create a competitive analysis for my industry',
  ],
  create: [
    'Write a blog post about AI trends in my industry',
    'Create social media captions for my product launch',
    'Generate an email newsletter for my audience',
    'Write a product description that converts',
    'Create an infographic script on a complex topic',
    'Draft a script for a 2-minute explainer video',
  ],
  analyze: [
    'Analyse this dataset and summarise key insights',
    'Compare the top AI models by performance and cost',
    'Research the competitive landscape in my market',
    'Summarise recent AI research papers on a topic',
    'Identify trends from my customer feedback data',
    'Build a pros and cons comparison for two options',
  ],
  learn: [
    'Explain how large language models work simply',
    'Teach me prompt engineering from scratch',
    'What is RAG and when should you use it?',
    'Help me understand AI agent architectures',
    'Explain the difference between fine-tuning and RAG',
    'Give me a 5-minute overview of AI safety concepts',
  ],
};

export const QUICK_ACTIONS = {
  navigation: [
    { icon: '🛍', label: 'Browse Marketplace', action: 'marketplace' },
    { icon: '🤖', label: 'Build an Agent', action: 'agent' },
    { icon: '📖', label: 'How to use Guide', action: 'guide' },
    { icon: '📐', label: 'Prompt Engineering', action: 'prompt' },
    { icon: '💰', label: 'View Pricing', action: 'pricing' },
    { icon: '📊', label: 'AI Models Analysis', action: 'send:Give me a detailed analysis and comparison of the top AI models available today' },
  ],
  create: [
    { icon: '🎨', label: 'Create image', action: 'send:Create an image for me' },
    { icon: '🎵', label: 'Generate Audio', action: 'send:Generate audio for me' },
    { icon: '🎬', label: 'Create video', action: 'send:Create a video for me' },
    { icon: '📋', label: 'Create slides', action: 'send:Create a presentation or slides for me' },
    { icon: '📈', label: 'Create Infographs', action: 'send:Create an infographic for me' },
    { icon: '❓', label: 'Create quiz', action: 'send:Create a quiz for me' },
    { icon: '🗂️', label: 'Create Flashcards', action: 'send:Create flashcards for me' },
    { icon: '🧠', label: 'Create Mind map', action: 'send:Create a mind map for me' },
  ],
  analyze: [
    { icon: '📉', label: 'Analyze Data', action: 'send:Help me analyze data' },
    { icon: '✍️', label: 'Write content', action: 'send:Help me write content' },
    { icon: '💻', label: 'Code Generation', action: 'send:Help me with code generation and debugging' },
    { icon: '📄', label: 'Document Analysis', action: 'send:Help me analyse documents and extract key information' },
    { icon: '🌐', label: 'Translate', action: 'send:Help me translate text to another language' },
  ],
};

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸', rtl: false },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'ur', label: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'fr', label: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'es', label: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'zh', label: '中文', flag: '🇨🇳', rtl: false },
  { code: 'ja', label: '日本語', flag: '🇯🇵', rtl: false },
];
