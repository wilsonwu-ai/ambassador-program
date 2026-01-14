import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SubmissionsProvider } from "@/context/SubmissionsContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import StaffLogin from "@/pages/StaffLogin";
import StaffDashboard from "@/pages/StaffDashboard";

function App() {
  return (
    <BrowserRouter basename="/ambassador-program">
      <AuthProvider>
        <SubmissionsProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />

            {/* Staff Routes */}
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SubmissionsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
