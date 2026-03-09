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
    label: "Tech Talk",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Sample tech presentation",
  },
  {
    label: "Tutorial",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    description: "Quick tutorial video",
  },
  {
    label: "Conference Keynote",
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    description: "Industry keynote speech",
  },
];

export const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    label: "Key Points",
    question: "What are the main key points discussed in this video?",
  },
  {
    label: "Summary",
    question: "Can you provide a concise summary of the video content?",
  },
  {
    label: "Technical Details",
    question: "What technical concepts or tools are mentioned?",
  },
  {
    label: "Action Items",
    question: "What actionable takeaways can I get from this video?",
  },
  {
    label: "Compare & Contrast",
    question: "How does this compare to other approaches mentioned?",
  },
];
