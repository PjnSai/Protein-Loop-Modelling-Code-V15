/* LoginLog.jsx - User Activity Monitoring Dashboard */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API service for log management operations
import * as logApi from "../services/logApi";

// Component imports for modular interface construction
import LogsTableSection from "../components/logs/LogsTableSection";
import SecurityInfoSection from "../components/logs/SecurityInfoSection";
import LogsHeader from "../components/logs/LogsHeader";

import { ConfirmDialog } from "../components/ui";

/* LoginLog Component*/
const LoginLog = () => {
  // Log Data Management
  const [logs, setLogs] = useState([]); // User activity log entries
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  const [totalPages, setTotalPages] = useState(1); // Total pages for navigation
  const [debugInfo, setDebugInfo] = useState(null); // Debug information for development

  // UI State Management
  const [isLoading, setIsLoading] = useState(true); // Loading state for data fetching
  const [error, setError] = useState(null); // Error state for user feedback

  // Log Management Controls
  const [daysToDelete, setDaysToDelete] = useState("all"); // Deletion preference
  const [isDeleting, setIsDeleting] = useState(false); // Deletion operation state

  // Navigation for authentication redirection
  const navigate = useNavigate();

  const [confirmAction, setConfirmAction] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  /* Effect Hook - Log Data Loading */
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); // Fetch again when pagination changes

  /* Fetch Activity Logs from API */
  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await logApi.fetchLogs(currentPage, navigate);

      // Handle authentication redirection
      if (result.redirect) {
        return;
      }

      if (result.success) {
        setLogs(result.logs);
        setTotalPages(result.totalPages);
        setDebugInfo(result.debugInfo);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Fetch logs error:", err);
      setError("Network error: Unable to fetch logs");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner during initial data fetch
  if (isLoading && logs.length === 0) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  /* Ask the user to confirm before deleting logs */
  const deleteLogs = () => {
    setConfirmAction({
      title: "Delete Logs",
      message:
        daysToDelete === "all"
          ? "Are you sure you want to delete ALL login logs? This cannot be undone."
          : `Are you sure you want to delete logs older than ${daysToDelete} days? This cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Keep Logs",
      variant: "danger",
      onConfirm: performDeleteLogs,
    });
  };

  /* Send the delete request (runs only after the user confirms) */
  const performDeleteLogs = async () => {
    setIsDeleting(true);
    setSuccessMessage(null);

    try {
      const result = await logApi.deleteLogs(daysToDelete);

      if (result.success) {
        setSuccessMessage(result.message);
        fetchLogs();
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Delete logs error:", err);
      setError("Network error: Unable to delete logs");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* Page Header with Controls */}
      <LogsHeader
        debugInfo={debugInfo}
        isLoading={isLoading}
        daysToDelete={daysToDelete}
        setDaysToDelete={setDaysToDelete}
        isDeleting={isDeleting}
        onRefresh={fetchLogs}
        onDeleteLogs={deleteLogs}
      />

      {/* Error Alert Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success alert-dismissible" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Development Debug Information */}
      {import.meta.env.DEV && (
        <div className="alert alert-info">
          <small>
            <strong>Debug:</strong> Logs count: {logs.length}, Current page:{" "}
            {currentPage}, Total pages: {totalPages}, Loading:{" "}
            {isLoading.toString()}, Error: {error || "none"}
          </small>
        </div>
      )}

      {/* Activity Logs Table Section */}
      <LogsTableSection
        logs={logs}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onRefresh={fetchLogs}
      />

      {/* Security Information Section */}
      <SecurityInfoSection />
      <ConfirmDialog
        isOpen={!!confirmAction}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={confirmAction?.confirmText}
        cancelText={confirmAction?.cancelText}
        variant={confirmAction?.variant}
        onConfirm={() => {
          confirmAction.onConfirm();
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
};

export default LoginLog;
