import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getAllSubmissions,
  addSubmission as addSubmissionToFirebase,
  updateSubmissionStatus as updateStatusInFirebase,
  updateSubmissionAnalytics as updateAnalyticsInFirebase,
  deleteSubmission as deleteFromFirebase,
  subscribeToSubmissions,
  syncLocalToFirebase,
} from "../services/firestoreService";

const SubmissionsContext = createContext(null);

// Sample data for demonstration (used as fallback)
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState("idle"); // idle, syncing, synced, error

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Save to localStorage as backup
  const saveToLocalStorage = useCallback((data) => {
    try {
      localStorage.setItem("snappy_submissions", JSON.stringify(data));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }, []);

  // Load from localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem("snappy_submissions");
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error("Error loading from localStorage:", err);
      return null;
    }
  }, []);

  // Initial load and real-time subscription
  useEffect(() => {
    let unsubscribe = null;

    const initializeData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to sync any local submissions to Firebase first
        const localSubmissions = loadFromLocalStorage();
        if (localSubmissions && localSubmissions.length > 0) {
          setSyncStatus("syncing");
          try {
            await syncLocalToFirebase(localSubmissions);
            setSyncStatus("synced");
          } catch (syncError) {
            console.warn("Could not sync local submissions to Firebase:", syncError);
            setSyncStatus("error");
          }
        }

        // Set up real-time listener for Firebase
        unsubscribe = subscribeToSubmissions((firebaseSubmissions) => {
          if (firebaseSubmissions.length > 0) {
            setSubmissions(firebaseSubmissions);
            saveToLocalStorage(firebaseSubmissions); // Keep localStorage as backup
          } else {
            // No data in Firebase, use local or sample data
            const localData = loadFromLocalStorage();
            if (localData && localData.length > 0) {
              setSubmissions(localData);
            } else {
              setSubmissions(SAMPLE_SUBMISSIONS);
              saveToLocalStorage(SAMPLE_SUBMISSIONS);
            }
          }
          setIsLoading(false);
        });
      } catch (err) {
        console.error("Error initializing submissions:", err);
        setError(err.message);

        // Fallback to localStorage
        const localData = loadFromLocalStorage();
        if (localData && localData.length > 0) {
          setSubmissions(localData);
        } else {
          setSubmissions(SAMPLE_SUBMISSIONS);
          saveToLocalStorage(SAMPLE_SUBMISSIONS);
        }
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loadFromLocalStorage, saveToLocalStorage]);

  // Add submission - saves to both Firebase and localStorage
  const addSubmission = async (submission) => {
    const tempId = Date.now().toString();
    const newSubmission = {
      ...submission,
      id: tempId,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    // Optimistically add to state and localStorage
    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    saveToLocalStorage(updated);

    try {
      // Save to Firebase
      const firebaseSubmission = await addSubmissionToFirebase(submission);

      // Update the submission with Firebase ID
      const finalUpdated = updated.map(sub =>
        sub.id === tempId ? { ...sub, id: firebaseSubmission.id } : sub
      );
      setSubmissions(finalUpdated);
      saveToLocalStorage(finalUpdated);

      return firebaseSubmission;
    } catch (err) {
      console.error("Error saving to Firebase, kept in localStorage:", err);
      // Data is still in localStorage, will sync when online
      return newSubmission;
    }
  };

  // Update submission status
  const updateSubmissionStatus = async (id, status) => {
    // Optimistically update state
    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, status } : sub
    );
    setSubmissions(updated);
    saveToLocalStorage(updated);

    try {
      await updateStatusInFirebase(id, status);
    } catch (err) {
      console.error("Error updating status in Firebase:", err);
      // Data is still in localStorage
    }
  };

  // Update submission analytics
  const updateSubmissionAnalytics = async (id, analytics) => {
    // Optimistically update state
    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, analytics } : sub
    );
    setSubmissions(updated);
    saveToLocalStorage(updated);

    try {
      await updateAnalyticsInFirebase(id, analytics);
    } catch (err) {
      console.error("Error updating analytics in Firebase:", err);
      // Data is still in localStorage
    }
  };

  // Delete submission
  const deleteSubmission = async (id) => {
    // Optimistically remove from state
    const updated = submissions.filter((sub) => sub.id !== id);
    setSubmissions(updated);
    saveToLocalStorage(updated);

    try {
      await deleteFromFirebase(id);
    } catch (err) {
      console.error("Error deleting from Firebase:", err);
      // Already removed from localStorage
    }
  };

  // Manual sync function
  const syncNow = async () => {
    if (!isOnline) {
      return { success: false, message: "No internet connection" };
    }

    setSyncStatus("syncing");
    try {
      const localData = loadFromLocalStorage();
      if (localData && localData.length > 0) {
        const syncedCount = await syncLocalToFirebase(localData);
        setSyncStatus("synced");
        return { success: true, message: `Synced ${syncedCount} submissions` };
      }
      setSyncStatus("synced");
      return { success: true, message: "Nothing to sync" };
    } catch (err) {
      setSyncStatus("error");
      return { success: false, message: err.message };
    }
  };

  return (
    <SubmissionsContext.Provider
      value={{
        submissions,
        addSubmission,
        updateSubmissionStatus,
        updateSubmissionAnalytics,
        deleteSubmission,
        isLoading,
        error,
        isOnline,
        syncStatus,
        syncNow,
      }}
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
