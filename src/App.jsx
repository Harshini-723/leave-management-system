
import React, { useState } from "react";
import "./App.css";

function App() {
  const [casualLeave, setCasualLeave] = useState(10);
  const [medicalLeave, setMedicalLeave] = useState(10);

  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const [leaveRequests, setLeaveRequests] = useState([]);

  const applyLeave = (e) => {
    e.preventDefault();
    setMessage("");

    const requestedDays = Number(days);
    const availableDays =
      leaveType === "Casual Leave" ? casualLeave : medicalLeave;

    if (!reason.trim()) {
      setMessage("Please enter the reason for leave.");
      return;
    }

    if (!Number.isInteger(requestedDays) || requestedDays < 1) {
      setMessage("Please enter a valid number of days.");
      return;
    }

    if (requestedDays > availableDays) {
      setMessage("Insufficient leave balance!");
      return;
    }

    // Reserve the requested days until the manager decides.
    if (leaveType === "Casual Leave") {
      setCasualLeave((previous) => previous - requestedDays);
    } else {
      setMedicalLeave((previous) => previous - requestedDays);
    }

    const newRequest = {
      id: Date.now(),
      type: leaveType,
      days: requestedDays,
      reason: reason.trim(),
      date: new Date().toLocaleDateString("en-IN"),
      status: "Pending Approval",
    };

    setLeaveRequests((previous) => [newRequest, ...previous]);
    setReason("");
    setDays(1);
    setMessage("Leave request submitted successfully!");
  };

  const updateLeaveStatus = (id, newStatus) => {
    const request = leaveRequests.find((leave) => leave.id === id);

    if (!request || request.status !== "Pending Approval") {
      return;
    }

    // If rejected, restore the reserved leave days.
    if (newStatus === "Rejected") {
      if (request.type === "Casual Leave") {
        setCasualLeave((previous) => previous + request.days);
      } else {
        setMedicalLeave((previous) => previous + request.days);
      }
    }

    setLeaveRequests((previous) =>
      previous.map((leave) =>
        leave.id === id ? { ...leave, status: newStatus } : leave
      )
    );
  };

  const totalAvailable = casualLeave + medicalLeave;

  const pendingRequests = leaveRequests.filter(
    (leave) => leave.status === "Pending Approval"
  ).length;

  const approvedRequests = leaveRequests.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const rejectedRequests = leaveRequests.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  return (
    <div className="leave-app">
      <header className="leave-header">
        <div>
          <h1>LeaveEase</h1>
          <p>Employee Leave Management System</p>
        </div>
        <span className="employee-badge">Organization Portal</span>
      </header>

      <main className="leave-container">
        <section className="leave-welcome">
          <div>
            <h2>Leave Dashboard</h2>
            <p>Apply for leave, check your balance, and manage requests.</p>
          </div>
          <span className="today">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </section>

        <section className="leave-balances">
          <div className="balance-card casual">
            <div className="balance-icon">🌴</div>
            <p>Casual Leave Balance</p>
            <h2>{casualLeave} <span>days</span></h2>
            <div className="balance-bar">
              <div style={{ width: `${casualLeave * 10}%` }} />
            </div>
          </div>

          <div className="balance-card medical">
            <div className="balance-icon">🏥</div>
            <p>Medical Leave Balance</p>
            <h2>{medicalLeave} <span>days</span></h2>
            <div className="balance-bar">
              <div style={{ width: `${medicalLeave * 10}%` }} />
            </div>
          </div>

          <div className="balance-card total">
            <div className="balance-icon">📅</div>
            <p>Total Available Leave</p>
            <h2>{totalAvailable} <span>days</span></h2>
            <small>Across both leave types</small>
          </div>
        </section>

        <section className="request-stats">
          <div className="request-stat">
            <span>Awaiting Approval</span>
            <strong>{pendingRequests}</strong>
          </div>
          <div className="request-stat">
            <span>Approved</span>
            <strong>{approvedRequests}</strong>
          </div>
          <div className="request-stat">
            <span>Rejected</span>
            <strong>{rejectedRequests}</strong>
          </div>
        </section>

        <section className="leave-content">
          <div className="leave-panel">
            <h2>Apply for Leave</h2>
            <p className="subtitle">
              Complete the form to submit a leave request.
            </p>

            <form onSubmit={applyLeave}>
              <label htmlFor="leaveType">Leave Type</label>
              <select
                id="leaveType"
                value={leaveType}
                onChange={(e) => {
                  setLeaveType(e.target.value);
                  setMessage("");
                }}
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Medical Leave">Medical Leave</option>
              </select>

              <label htmlFor="days">Number of Days</label>
              <input
                id="days"
                type="number"
                min="1"
                step="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                required
              />

              <label htmlFor="reason">Reason for Leave</label>
              <textarea
                id="reason"
                rows="4"
                placeholder="Enter the reason for your leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />

              <p className="available-note">
                Available balance:{" "}
                {leaveType === "Casual Leave" ? casualLeave : medicalLeave} days
              </p>

              <button type="submit" className="apply-button">
                Submit Leave Request
              </button>

              {message && (
                <p className="form-message" role="status">
                  {message}
                </p>
              )}
            </form>
          </div>

          <div className="leave-panel history-panel">
            <div className="history-heading">
              <div>
                <h2>Leave Requests</h2>
                <p className="subtitle">
                  Review requests and update their status.
                </p>
              </div>
              <span className="request-count">{leaveRequests.length}</span>
            </div>

            {leaveRequests.length === 0 ? (
              <div className="empty-history">
                <span>📋</span>
                <h3>No leave requests yet</h3>
                <p>Your submitted requests will appear here.</p>
              </div>
            ) : (
              <div className="history-list">
                {leaveRequests.map((leave) => (
                  <article className="history-item" key={leave.id}>
                    <div className="history-top">
                      <h3>{leave.type}</h3>
                      <span
                        className={`status-badge ${
                          leave.status === "Approved"
                            ? "approved"
                            : leave.status === "Rejected"
                              ? "rejected"
                              : "pending"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </div>

                    <p className="history-meta">
                      {leave.days} day(s) · Applied on {leave.date}
                    </p>

                    <p className="history-reason">
                      <strong>Reason:</strong> {leave.reason}
                    </p>

                    {leave.status === "Pending Approval" && (
                      <div className="approval-actions">
                        <button
                          type="button"
                          className="approve-button"
                          onClick={() =>
                            updateLeaveStatus(leave.id, "Approved")
                          }
                        >
                          ✓ Approve
                        </button>

                        <button
                          type="button"
                          className="reject-button"
                          onClick={() =>
                            updateLeaveStatus(leave.id, "Rejected")
                          }
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="leave-footer">
          LeaveEase · Employee Leave Management System
        </footer>
      </main>
    </div>
  );
}

export default App;
