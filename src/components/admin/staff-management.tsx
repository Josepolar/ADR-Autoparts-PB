"use client";

import { useEffect, useState } from "react";
import {
  getStaffUsers,
  createStaffUser,
  verifyStaffUser,
  revokeStaffUser,
  deleteStaffUser,
} from "@/server/actions";
import {
  UserCheck,
  UserX,
  UserPlus,
  Trash2,
  Shield,
  ShieldOff,
  X,
  AlertCircle,
} from "lucide-react";
import { Spinner } from "@/components/ui/modern-components";

interface StaffUser {
  id: string;
  name: string | null;
  email: string;
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  createdAt: string;
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    loadStaff();
  }, []);

  // Auto-dismiss success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function loadStaff() {
    setLoading(true);
    try {
      const result = await getStaffUsers();
      if (result.success && result.data) {
        setStaff(result.data as StaffUser[]);
      }
    } catch (err) {
      console.error("Error loading staff:", err);
    }
    setLoading(false);
  }

  function getAdminEmail(): string {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("userEmail") || "";
    }
    return "";
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!newName || !newEmail || !newPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setActionLoading("create");
    try {
      const result = await createStaffUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        adminEmail: getAdminEmail(),
      });
      if (result.success) {
        setSuccess("Staff account created successfully");
        setShowCreateModal(false);
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        await loadStaff();
      } else {
        setError(result.error || "Failed to create staff account");
      }
    } catch (err) {
      setError("Failed to create staff account");
    }
    setActionLoading(null);
  }

  async function handleVerify(staffId: string) {
    setActionLoading(staffId);
    try {
      const result = await verifyStaffUser(staffId, getAdminEmail());
      if (result.success) {
        setSuccess("Staff member verified");
        await loadStaff();
      } else {
        setError(result.error || "Failed to verify staff");
      }
    } catch {
      setError("Failed to verify staff");
    }
    setActionLoading(null);
  }

  async function handleRevoke(staffId: string) {
    setActionLoading(staffId);
    try {
      const result = await revokeStaffUser(staffId, getAdminEmail());
      if (result.success) {
        setSuccess("Staff access revoked");
        await loadStaff();
      } else {
        setError(result.error || "Failed to revoke staff");
      }
    } catch {
      setError("Failed to revoke staff");
    }
    setActionLoading(null);
  }

  async function handleDelete(staffId: string, staffName: string | null) {
    if (!confirm(`Remove ${staffName || "this staff member"}? This cannot be undone.`)) return;
    setActionLoading(staffId);
    try {
      const result = await deleteStaffUser(staffId, getAdminEmail());
      if (result.success) {
        setSuccess("Staff member removed");
        await loadStaff();
      } else {
        setError(result.error || "Failed to remove staff");
      }
    } catch {
      setError("Failed to remove staff");
    }
    setActionLoading(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-500 mt-4 text-sm">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={() => setError("")} className="ml-auto text-red-400/60 hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <UserCheck className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              Staff Management
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Create and manage staff accounts. Only verified staff can sign in.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff
          </button>
        </div>

        {/* Staff stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-[#1e1e28] border border-[#2a2a35] rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-white">{staff.length}</p>
            <p className="text-xs text-gray-500">Total Staff</p>
          </div>
          <div className="bg-[#1e1e28] border border-[#2a2a35] rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-emerald-400">{staff.filter((s) => s.isVerified).length}</p>
            <p className="text-xs text-gray-500">Verified</p>
          </div>
          <div className="bg-[#1e1e28] border border-[#2a2a35] rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-amber-400">{staff.filter((s) => !s.isVerified).length}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
        </div>

        {/* Staff table */}
        {staff.length === 0 ? (
          <div className="text-center py-12">
            <UserX className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No staff accounts yet.</p>
            <p className="text-gray-600 text-xs mt-1">Click &quot;Add Staff&quot; to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-[#2a2a35]">
                  <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Name</th>
                  <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Email</th>
                  <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Verified By</th>
                  <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Joined</th>
                  <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b border-[#2a2a35]/50 hover:bg-[#1e1e28] transition-colors">
                    <td className="py-3.5 text-white font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                          {(member.name || member.email)[0].toUpperCase()}
                        </div>
                        {member.name || "—"}
                      </div>
                    </td>
                    <td className="py-3.5 text-gray-400 text-xs">{member.email}</td>
                    <td className="py-3.5">
                      {member.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-gray-500 text-xs">{member.verifiedBy || "—"}</td>
                    <td className="py-3.5 text-gray-500 text-xs">
                      {new Date(member.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {member.isVerified ? (
                          <button
                            onClick={() => handleRevoke(member.id)}
                            disabled={actionLoading === member.id}
                            title="Revoke access"
                            className="p-1.5 text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <ShieldOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerify(member.id)}
                            disabled={actionLoading === member.id}
                            title="Verify staff"
                            className="p-1.5 text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          disabled={actionLoading === member.id}
                          title="Remove staff"
                          className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-red-400" />
                Add Staff Member
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm"
                  placeholder="Juan Dela Cruz"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm"
                  placeholder="staff@adr-autoparts.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
              </div>

              <p className="text-xs text-gray-500">
                Staff accounts created by admin are automatically verified and can sign in immediately.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-[#1e1e28] border border-[#2a2a35] text-gray-300 rounded-xl text-sm font-medium hover:bg-[#252530] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "create"}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading === "create" ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
