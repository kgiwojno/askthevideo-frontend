// Demo mode configuration - edit these to customize your presentation shortcuts

export interface DemoVideo {
  label: string;
  url: string;
  description?: string;
}

export interface DemoQuestion {
  label: string;
  question: string;
}

export const DEMO_VIDEOS: DemoVideo[] = [
  {
    label: "Rick Astley - Never Gonna Give You Up",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    label: "Lex Fridman #434 - Aravind Srinivas (Perplexity CEO)",
    url: "https://www.youtube.com/watch?v=e-gwvmhyU7A",
  },
  {
    label: "Broken Link (Test)",
    url: "https://www.youtube.com/watch?v=INVALID12345",
    description: "For testing error handling",
  },
];

export const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    label: "Summary",
    question: "Can you provide a concise summary of the video content?",
  },
  {
    label: "Key Points",
    question: "What are the main key points discussed in this video?",
  },
  {
    label: "Technical Details",
    question: "What technical concepts or tools are mentioned?",
  },
  {
    label: "Timestamps",
    question: "What are the most important moments to watch?",
  },
  {
    label: "Compare",
    question: "Compare what the selected videos say about this topic",
  },
];
