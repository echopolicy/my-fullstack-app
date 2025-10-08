// src/mockData/mockPolls.js
const mockPolls = [
  {
    id: "1",
    question: "What’s your favorite programming language?",
    category: "Technology",
    pollType: "single",
    visibilityPublic: true,
    trending: true,
    createdAt: "2025-09-30T10:00:00Z",
    user: {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
    },
  },
  {
    id: "2",
    question: "Which framework do you prefer for frontend?",
    category: "Web Development",
    pollType: "multiple",
    visibilityPublic: false,
    trending: false,
    createdAt: "2025-09-25T15:30:00Z",
    user: {
      id: 2,
      fullName: "Jane Smith",
      email: "jane@example.com",
    },
  },
];

export default mockPolls;
