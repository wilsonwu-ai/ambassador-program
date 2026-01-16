import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useSubmissions } from "@/context/SubmissionsContext";
import { SubmissionsTable } from "@/components/staff/SubmissionsTable";
import { Button } from "@/components/ui/Button";
import { LogOut, Users, Clock, CheckCircle, XCircle, Cloud, CloudOff, RefreshCw, Loader2 } from "lucide-react";

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const { submissions, isLoading, isOnline, syncStatus, syncNow } = useSubmissions();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/staff/login");
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/ambassador-program/snappy-logo.png"
                alt="Snappy"
                className="w-10 h-10 rounded-xl"
              />
              <div>
                <h1 className="text-lg font-bold">Ambassador Portal</h1>
                <p className="text-xs text-muted-foreground">Staff Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Sync Status Indicator */}
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <div className="flex items-center gap-1.5 text-green-600">
                    <Cloud className="w-4 h-4" />
                    <span className="text-xs hidden sm:inline">Synced</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-yellow-600">
                    <CloudOff className="w-4 h-4" />
                    <span className="text-xs hidden sm:inline">Offline</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={syncNow}
                  disabled={!isOnline || syncStatus === "syncing"}
                  className="h-8 w-8 p-0"
                  title="Sync now"
                >
                  {syncStatus === "syncing" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-background rounded-xl border border-border p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Ambassador Applications</h2>
          <p className="text-muted-foreground">
            Review and manage ambassador program submissions
          </p>
        </div>

        {/* Submissions Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading submissions...</span>
          </div>
        ) : (
          <SubmissionsTable />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border bg-background mt-8">
        <div className="container max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Snappy Ambassador Program Staff Portal
          </p>
        </div>
      </footer>
    </div>
  );
}
