import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// Collection references
const SUBMISSIONS_COLLECTION = "submissions";
const STAFF_COLLECTION = "staff";
const AUDIT_LOG_COLLECTION = "audit_log";

// ==================== SUBMISSIONS ====================

/**
 * Get all submissions from Firestore
 * @returns {Promise<Array>} Array of submission objects
 */
export async function getAllSubmissions() {
  try {
    const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
    const q = query(submissionsRef, orderBy("submittedAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to ISO string for consistency
      submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || doc.data().submittedAt,
    }));
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw error;
  }
}

/**
 * Get a single submission by ID
 * @param {string} id - Submission ID
 * @returns {Promise<Object|null>} Submission object or null
 */
export async function getSubmissionById(id) {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        submittedAt: data.submittedAt?.toDate?.()?.toISOString() || data.submittedAt,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching submission:", error);
    throw error;
  }
}

/**
 * Add a new submission to Firestore
 * @param {Object} submission - Submission data
 * @returns {Promise<Object>} Created submission with ID
 */
export async function addSubmission(submission) {
  try {
    const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);

    const submissionData = {
      ...submission,
      submittedAt: serverTimestamp(),
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(submissionsRef, submissionData);

    // Log the action
    await logAuditAction("submission_created", {
      submissionId: docRef.id,
      email: submission.email,
    });

    return {
      id: docRef.id,
      ...submission,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
  } catch (error) {
    console.error("Error adding submission:", error);
    throw error;
  }
}

/**
 * Update submission status
 * @param {string} id - Submission ID
 * @param {string} status - New status (pending, reviewed, approved, rejected)
 * @param {string} updatedBy - Email of staff member making the change
 * @returns {Promise<void>}
 */
export async function updateSubmissionStatus(id, status, updatedBy = "system") {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, id);

    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
      lastUpdatedBy: updatedBy,
    });

    // Log the action
    await logAuditAction("status_updated", {
      submissionId: id,
      newStatus: status,
      updatedBy,
    });
  } catch (error) {
    console.error("Error updating submission status:", error);
    throw error;
  }
}

/**
 * Update submission analytics
 * @param {string} id - Submission ID
 * @param {Object} analytics - Analytics data
 * @param {string} updatedBy - Email of staff member making the change
 * @returns {Promise<void>}
 */
export async function updateSubmissionAnalytics(id, analytics, updatedBy = "system") {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, id);

    await updateDoc(docRef, {
      analytics,
      updatedAt: serverTimestamp(),
      lastUpdatedBy: updatedBy,
    });

    // Log the action
    await logAuditAction("analytics_updated", {
      submissionId: id,
      updatedBy,
    });
  } catch (error) {
    console.error("Error updating submission analytics:", error);
    throw error;
  }
}

/**
 * Delete a submission
 * @param {string} id - Submission ID
 * @param {string} deletedBy - Email of staff member deleting
 * @returns {Promise<void>}
 */
export async function deleteSubmission(id, deletedBy = "system") {
  try {
    // Log before deleting
    await logAuditAction("submission_deleted", {
      submissionId: id,
      deletedBy,
    });

    const docRef = doc(db, SUBMISSIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting submission:", error);
    throw error;
  }
}

/**
 * Subscribe to real-time submission updates
 * @param {Function} callback - Function to call with updated submissions
 * @returns {Function} Unsubscribe function
 */
export function subscribeToSubmissions(callback) {
  const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
  const q = query(submissionsRef, orderBy("submittedAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || doc.data().submittedAt,
    }));
    callback(submissions);
  }, (error) => {
    console.error("Error in submissions listener:", error);
  });
}

/**
 * Get submissions by status
 * @param {string} status - Status to filter by
 * @returns {Promise<Array>} Array of submission objects
 */
export async function getSubmissionsByStatus(status) {
  try {
    const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
    const q = query(
      submissionsRef,
      where("status", "==", status),
      orderBy("submittedAt", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || doc.data().submittedAt,
    }));
  } catch (error) {
    console.error("Error fetching submissions by status:", error);
    throw error;
  }
}

// ==================== SYNC UTILITIES ====================

/**
 * Sync local submissions to Firebase (migration utility)
 * @param {Array} localSubmissions - Array of local submissions from localStorage
 * @returns {Promise<number>} Number of submissions synced
 */
export async function syncLocalToFirebase(localSubmissions) {
  try {
    const batch = writeBatch(db);
    let syncCount = 0;

    for (const submission of localSubmissions) {
      // Check if submission already exists by checking for same email and submittedAt
      const existing = await checkSubmissionExists(submission.email, submission.submittedAt);

      if (!existing) {
        const docRef = doc(collection(db, SUBMISSIONS_COLLECTION));
        batch.set(docRef, {
          ...submission,
          id: undefined, // Remove local ID, Firestore will use its own
          syncedFromLocal: true,
          syncedAt: serverTimestamp(),
        });
        syncCount++;
      }
    }

    if (syncCount > 0) {
      await batch.commit();
      console.log(`Synced ${syncCount} submissions to Firebase`);
    }

    return syncCount;
  } catch (error) {
    console.error("Error syncing to Firebase:", error);
    throw error;
  }
}

/**
 * Check if a submission already exists
 * @param {string} email - Email to check
 * @param {string} submittedAt - Submission timestamp
 * @returns {Promise<boolean>} True if exists
 */
async function checkSubmissionExists(email, submittedAt) {
  try {
    const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
    const q = query(
      submissionsRef,
      where("email", "==", email),
      where("submittedAt", "==", submittedAt)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking submission exists:", error);
    return false;
  }
}

// ==================== AUDIT LOG ====================

/**
 * Log an audit action
 * @param {string} action - Action type
 * @param {Object} details - Action details
 * @returns {Promise<void>}
 */
async function logAuditAction(action, details) {
  try {
    const auditRef = collection(db, AUDIT_LOG_COLLECTION);
    await addDoc(auditRef, {
      action,
      details,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging audit action:", error);
    // Don't throw - audit logging shouldn't break main operations
  }
}

// ==================== STAFF ====================

/**
 * Log staff activity
 * @param {string} staffEmail - Staff member email
 * @param {string} activity - Activity description
 * @returns {Promise<void>}
 */
export async function logStaffActivity(staffEmail, activity) {
  try {
    const staffRef = collection(db, STAFF_COLLECTION);
    const q = query(staffRef, where("email", "==", staffEmail));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const staffDoc = snapshot.docs[0];
      await updateDoc(doc(db, STAFF_COLLECTION, staffDoc.id), {
        lastActivity: activity,
        lastActiveAt: serverTimestamp(),
      });
    } else {
      // Create staff record if doesn't exist
      await addDoc(staffRef, {
        email: staffEmail,
        lastActivity: activity,
        lastActiveAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error logging staff activity:", error);
  }
}
