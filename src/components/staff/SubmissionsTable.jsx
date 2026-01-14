import { useState, useMemo } from "react";
import { useSubmissions } from "@/context/SubmissionsContext";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Download,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CONTENT_TYPE_LABELS = {
  "ugc-brand": "UGC/Brand",
  "lifestyle-vlog": "Lifestyle/Vlog",
  "food": "Food",
  "beauty-fashion": "Beauty/Fashion",
  "other": "Other",
};

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  reviewed: { label: "Reviewed", icon: Eye, color: "text-blue-600 bg-blue-50 border-blue-200" },
  approved: { label: "Approved", icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200" },
  rejected: { label: "Rejected", icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
};

export function SubmissionsTable() {
  const { submissions, updateSubmissionStatus } = useSubmissions();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [sortField, setSortField] = useState("submittedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedSubmissions = useMemo(() => {
    let result = [...submissions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (sub) =>
          sub.name.toLowerCase().includes(query) ||
          sub.email.toLowerCase().includes(query) ||
          sub.location.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((sub) => sub.status === statusFilter);
    }

    // Apply content type filter
    if (contentTypeFilter !== "all") {
      result = result.filter((sub) => sub.contentTypes.includes(contentTypeFilter));
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "submittedAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [submissions, searchQuery, statusFilter, contentTypeFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Location", "Content Types", "Social Media", "Followers", "Status", "Submitted"];
    const rows = filteredAndSortedSubmissions.map((sub) => [
      sub.name,
      sub.email,
      sub.location,
      sub.contentTypes.map((ct) => CONTENT_TYPE_LABELS[ct] || ct).join("; "),
      sub.socialMediaLinks.replace(/\n/g, "; "),
      sub.followerCount,
      sub.status,
      formatDate(sub.submittedAt),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ambassador-submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(statusFilter !== "all" || contentTypeFilter !== "all") && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>

          <Button variant="outline" onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg animate-fade-in">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Content Type</label>
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="ugc-brand">UGC/Brand</option>
              <option value="lifestyle-vlog">Lifestyle/Vlog</option>
              <option value="food">Food</option>
              <option value="beauty-fashion">Beauty/Fashion</option>
              <option value="other">Other</option>
            </select>
          </div>

          {(statusFilter !== "all" || contentTypeFilter !== "all") && (
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("all");
                  setContentTypeFilter("all");
                }}
                className="text-primary hover:text-primary"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedSubmissions.length} of {submissions.length} submissions
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th
                  className="text-left px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-1">
                    Email
                    <SortIcon field="email" />
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("location")}
                >
                  <div className="flex items-center gap-1">
                    Location
                    <SortIcon field="location" />
                  </div>
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Content Types
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("followerCount")}
                >
                  <div className="flex items-center gap-1">
                    Followers
                    <SortIcon field="followerCount" />
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("submittedAt")}
                >
                  <div className="flex items-center gap-1">
                    Submitted
                    <SortIcon field="submittedAt" />
                  </div>
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSubmissions.map((submission, index) => {
                const StatusIcon = STATUS_CONFIG[submission.status]?.icon || Clock;
                return (
                  <tr
                    key={submission.id}
                    className={cn(
                      "border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors",
                      index % 2 === 0 ? "bg-background" : "bg-muted/10"
                    )}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium">{submission.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {submission.email}
                    </td>
                    <td className="px-4 py-3 text-sm">{submission.location}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {submission.contentTypes.map((type) => (
                          <span
                            key={type}
                            className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                          >
                            {CONTENT_TYPE_LABELS[type] || type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {submission.followerCount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border",
                          STATUS_CONFIG[submission.status]?.color
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_CONFIG[submission.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(submission.submittedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedSubmissions.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No submissions found matching your criteria.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onUpdateStatus={updateSubmissionStatus}
        />
      )}
    </div>
  );
}

function SubmissionDetailModal({ submission, onClose, onUpdateStatus }) {
  const StatusIcon = STATUS_CONFIG[submission.status]?.icon || Clock;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Application Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full border",
                STATUS_CONFIG[submission.status]?.color
              )}
            >
              <StatusIcon className="w-4 h-4" />
              {STATUS_CONFIG[submission.status]?.label}
            </span>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={submission.status === "approved" ? "default" : "outline"}
                onClick={() => onUpdateStatus(submission.id, "approved")}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(submission.id, "reviewed")}
              >
                Mark Reviewed
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => onUpdateStatus(submission.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Name</label>
                <p className="font-medium">{submission.name}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <p className="font-medium">{submission.email}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground">Location</label>
                <p className="font-medium">{submission.location}</p>
              </div>
            </div>
          </div>

          {/* Content Types */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Content Types
            </h4>
            <div className="flex flex-wrap gap-2">
              {submission.contentTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
                >
                  {CONTENT_TYPE_LABELS[type] || type}
                </span>
              ))}
            </div>
            {submission.otherContentType && (
              <p className="text-sm text-muted-foreground">
                Other: {submission.otherContentType}
              </p>
            )}
          </div>

          {/* Social Media */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Social Media
            </h4>
            <div className="p-4 bg-muted/50 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-sans">
                {submission.socialMediaLinks}
              </pre>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Total Followers</label>
              <p className="font-bold text-lg">{submission.followerCount}</p>
            </div>
          </div>

          {/* Submitted */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Submitted on{" "}
              {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
