import { createContext, useContext, useState, useEffect } from "react";

const SubmissionsContext = createContext(null);

// Sample data for demonstration
const SAMPLE_SUBMISSIONS = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    location: "Los Angeles, USA",
    contentTypes: ["lifestyle-vlog", "beauty-fashion"],
    otherContentType: "",
    socialMediaLinks: "YouTube: https://youtube.com/@sarahjstyle\nInstagram: @sarahjstyle\nTikTok: @sarahjstyle",
    followerCount: "125,000",
    analyticsFiles: [],
    submittedAt: "2024-01-10T14:30:00Z",
    status: "pending",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    location: "Toronto, Canada",
    contentTypes: ["food", "lifestyle-vlog"],
    otherContentType: "",
    socialMediaLinks: "YouTube: https://youtube.com/@mikeeats\nInstagram: @mikeeats\nTikTok: @mikeeats",
    followerCount: "500,000",
    analyticsFiles: [],
    submittedAt: "2024-01-11T09:15:00Z",
    status: "reviewed",
  },
  {
    id: "3",
    name: "Emma Williams",
    email: "emma.w@email.com",
    location: "London, UK",
    contentTypes: ["ugc-brand", "beauty-fashion"],
    otherContentType: "",
    socialMediaLinks: "Instagram: @emmawbeauty\nTikTok: @emmawbeauty",
    followerCount: "75,000",
    analyticsFiles: [],
    submittedAt: "2024-01-12T16:45:00Z",
    status: "pending",
  },
  {
    id: "4",
    name: "Carlos Rodriguez",
    email: "carlos.r@email.com",
    location: "Miami, USA",
    contentTypes: ["food", "other"],
    otherContentType: "Restaurant Reviews",
    socialMediaLinks: "YouTube: https://youtube.com/@carlosfoodtours\nInstagram: @carlosfoodtours",
    followerCount: "250,000",
    analyticsFiles: [],
    submittedAt: "2024-01-13T11:20:00Z",
    status: "approved",
  },
  {
    id: "5",
    name: "Aisha Patel",
    email: "aisha.p@email.com",
    location: "Mumbai, India",
    contentTypes: ["lifestyle-vlog", "food"],
    otherContentType: "",
    socialMediaLinks: "YouTube: https://youtube.com/@aishacooks\nInstagram: @aishacooks\nX: @aishacooks",
    followerCount: "180,000",
    analyticsFiles: [],
    submittedAt: "2024-01-14T08:00:00Z",
    status: "pending",
  },
];

export function SubmissionsProvider({ children }) {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    // Load submissions from localStorage or use sample data
    const savedSubmissions = localStorage.getItem("snappy_submissions");
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    } else {
      // Initialize with sample data
      setSubmissions(SAMPLE_SUBMISSIONS);
      localStorage.setItem("snappy_submissions", JSON.stringify(SAMPLE_SUBMISSIONS));
    }
  }, []);

  const addSubmission = (submission) => {
    const newSubmission = {
      ...submission,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    localStorage.setItem("snappy_submissions", JSON.stringify(updated));
    return newSubmission;
  };

  const updateSubmissionStatus = (id, status) => {
    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, status } : sub
    );
    setSubmissions(updated);
    localStorage.setItem("snappy_submissions", JSON.stringify(updated));
  };

  const deleteSubmission = (id) => {
    const updated = submissions.filter((sub) => sub.id !== id);
    setSubmissions(updated);
    localStorage.setItem("snappy_submissions", JSON.stringify(updated));
  };

  return (
    <SubmissionsContext.Provider
      value={{ submissions, addSubmission, updateSubmissionStatus, deleteSubmission }}
    >
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const context = useContext(SubmissionsContext);
  if (!context) {
    throw new Error("useSubmissions must be used within a SubmissionsProvider");
  }
  return context;
}
