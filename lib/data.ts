export const DEMO_VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

export interface SubSection {
  title: string
  timestamp: string
  seconds: number
  summary: string
}

export interface Section {
  title: string
  subsections: SubSection[]
}

export const blueprintData: Section[] = [
  {
    title: "1. Course Introduction & Overview",
    subsections: [
      {
        title: "Course Objectives & Learning Outcomes",
        timestamp: "00:00",
        seconds: 0,
        summary: "Introduces the core objectives of the course and helps students understand the overall learning framework.",
      },
      {
        title: "Syllabus & Grading Criteria",
        timestamp: "02:15",
        seconds: 135,
        summary: "Detailed explanation of grading methods, exam schedules, and assignment requirements.",
      },
    ],
  },
  {
    title: "2. Core Concepts & Foundations",
    subsections: [
      {
        title: "Key Terminology & Definitions",
        timestamp: "05:30",
        seconds: 330,
        summary: "Reviews core terms and concept definitions to establish a foundational knowledge base.",
      },
      {
        title: "Historical Background & Evolution",
        timestamp: "08:45",
        seconds: 525,
        summary: "Traces the origins and evolution of the key concepts.",
      },
      {
        title: "Key Theoretical Models",
        timestamp: "12:00",
        seconds: 720,
        summary: "Introduces the main theoretical frameworks and their application scenarios.",
      },
    ],
  },
  {
    title: "3. Application & Practice",
    subsections: [
      {
        title: "Case Study: Real-World Scenarios",
        timestamp: "16:30",
        seconds: 990,
        summary: "Deepens understanding through real-world case studies.",
      },
      {
        title: "Hands-On Practice Exercises",
        timestamp: "20:00",
        seconds: 1200,
        summary: "Guides students through practical exercises.",
      },
    ],
  },
  {
    title: "4. Advanced Topics & Extensions",
    subsections: [
      {
        title: "Advanced Theory & Boundary Exploration",
        timestamp: "25:00",
        seconds: 1500,
        summary: "Deep dive into advanced theories and their limitations.",
      },
      {
        title: "Interdisciplinary Applications",
        timestamp: "30:00",
        seconds: 1800,
        summary: "Showcases the value of this knowledge applied across other fields.",
      },
    ],
  },
  {
    title: "5. Summary & Review",
    subsections: [
      {
        title: "Key Takeaways Recap",
        timestamp: "35:00",
        seconds: 2100,
        summary: "Connects all core knowledge points from the lecture.",
      },
      {
        title: "Next Lecture Preview",
        timestamp: "38:00",
        seconds: 2280,
        summary: "Previews the next lecture content and provides study direction.",
      },
    ],
  },
]

export interface Flashcard {
  id: number
  question: string
  answer: string
}

export const flashcardsData: Flashcard[] = [
  {
    id: 1,
    question: "What is overfitting in machine learning?",
    answer: "Overfitting occurs when a model performs well on training data but poorly on new data, usually because the model is too complex.",
  },
  {
    id: 2,
    question: "What is the main difference between supervised and unsupervised learning?",
    answer: "Supervised learning uses labeled data to train models, while unsupervised learning uses unlabeled data to discover patterns and structures.",
  },
  {
    id: 3,
    question: "What is the gradient descent algorithm?",
    answer: "Gradient descent is an optimization algorithm that iteratively updates parameters to minimize the loss function, moving in the negative gradient direction at each step.",
  },
  {
    id: 4,
    question: "Explain the bias-variance tradeoff.",
    answer: "The bias-variance tradeoff is the balance between model complexity and generalization ability. High bias leads to underfitting, while high variance leads to overfitting.",
  },
  {
    id: 5,
    question: "What is an activation function in neural networks?",
    answer: "Activation functions introduce non-linear transformations to neural networks, enabling them to learn complex patterns. Common ones include ReLU, Sigmoid, and Tanh.",
  },
]

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  citations?: { text: string; timestamp: string; seconds: number }[]
}

export const initialChatMessages: ChatMessage[] = []

export const mockResponses: { keywords: string[]; response: ChatMessage }[] = [
  {
    keywords: ["overfit", "overfitting"],
    response: {
      id: "r1",
      role: "assistant",
      content:
        "Overfitting occurs when a model performs extremely well on the training set but poorly on the validation set. The professor discussed this topic in detail during the lecture.",
      citations: [
        { text: "Overfitting Definition", timestamp: "12:00", seconds: 720 },
        { text: "Regularization Methods", timestamp: "16:30", seconds: 990 },
      ],
    },
  },
  {
    keywords: ["gradient", "descent"],
    response: {
      id: "r2",
      role: "assistant",
      content:
        "Gradient descent is the core algorithm for optimizing neural networks. The professor explained its working principle through intuitive analogies.",
      citations: [
        { text: "Gradient Descent Principles", timestamp: "08:45", seconds: 525 },
        { text: "Practical Demonstration", timestamp: "20:00", seconds: 1200 },
      ],
    },
  },
]

export const defaultResponse: ChatMessage = {
  id: "default",
  role: "assistant",
  content:
    "That's a great question! Based on the lecture content, the professor discussed related topics across multiple sections. I recommend starting your review from the Core Concepts & Foundations section.",
  citations: [
    { text: "Core Concepts & Foundations", timestamp: "05:30", seconds: 330 },
    { text: "Key Theoretical Models", timestamp: "12:00", seconds: 720 },
  ],
}
