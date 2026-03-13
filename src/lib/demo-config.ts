// Demo mode configuration - edit these to customize your presentation shortcuts
// NOTE: Keep video labels ≤ 52 characters to avoid overflow in the DemoModal (sm:max-w-md)

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
    label: "Tim Minchin - UWA Address",
    url: "https://www.youtube.com/watch?v=yoEezZD71sc",
  },
  {
    label: "Lex Fridman - Aravind Srinivas (Perplexity CEO)",
    url: "https://www.youtube.com/watch?v=e-gwvmhyU7A",
  },
  {
    label: "Lex Fridman - Andrej Karpathy",
    url: "https://www.youtube.com/watch?v=cdiD-9MMpb0",
  },
  {
    label: "3Blue1Brown - But what is a neural network?",
    url: "https://www.youtube.com/watch?v=aircAruvnKk",
  },
  {
    label: "3Blue1Brown - Gradient descent, how neural...",
    url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
  },
  {
    label: "3Blue1Brown - But what is a GPT?",
    url: "https://www.youtube.com/watch?v=wjZofJX0v4M",
  },
  {
    label: "Andrej Karpathy - Intro to Large Language Models",
    url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
  },
  {
    label: "Andrej Karpathy - Let's build GPT: from scra...",
    url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
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
    label: "Technical Concepts",
    question: "What technical concepts or tools are mentioned?",
  },
  {
    label: "Timestamps",
    question: "What are the most important moments to watch?",
  },
  {
    label: "Compare Neurons",
    question: "Compare how both videos explain what a neuron does",
  },
  {
    label: "Compare",
    question: "Compare what the selected videos say about this topic",
  },
  {
    label: "Metadata",
    question: "Give me info on the videos",
  },
];
