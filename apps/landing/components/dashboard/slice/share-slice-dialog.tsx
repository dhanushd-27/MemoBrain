"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, cn } from "@repo/ui";
import {
  updateSliceAccessStatus,
  grantSliceAccess,
  revokeSliceAccess,
  getSliceAccessList,
  updateSliceAccessRole,
  type SliceAccessUser,
} from "../../../services/slice.service";
import { TbLoader, TbTrash, TbUser } from "react-icons/tb";
import { motion, AnimatePresence } from "motion/react";
import type { Slice } from "@repo/types";

interface ShareSliceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slice: Slice | null;
}

export function ShareSliceDialog({
  isOpen,
  onClose,
  slice,
}: ShareSliceDialogProps) {
  // State for Access Status
  const [accessStatus, setAccessStatus] = useState<
    "private" | "public" | "specific"
  >("private");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // State for Invite
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"viewer" | "editor">("viewer");
  const [inviting, setInviting] = useState(false);

  // State for User List
  const [accessList, setAccessList] = useState<SliceAccessUser[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [revokingUser, setRevokingUser] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Initialize values when dialog opens
  useEffect(() => {
    if (isOpen && slice) {
      setAccessStatus(slice.accessStatus as "private" | "public" | "specific");
      setError(null);
      if (slice.accessStatus === "specific") {
        fetchAccessList(slice.id);
      }
    }
  }, [isOpen, slice]);

  const fetchAccessList = async (sliceId: string) => {
    setLoadingList(true);
    try {
      const res = await getSliceAccessList(sliceId);
      setAccessList(res.accessList || []);
    } catch (err) {
      console.error("Failed to fetch access list", err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleStatusChange = async (
    status: "private" | "public" | "specific",
  ) => {
    if (!slice) return;
    setUpdatingStatus(true);
    try {
      await updateSliceAccessStatus(slice.id, { accessStatus: status });
      setAccessStatus(status);
      if (status === "specific") {
        fetchAccessList(slice.id);
      }
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Failed to update access status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slice || !inviteEmail) return;

    setInviting(true);
    setError(null);
    try {
      await grantSliceAccess(slice.id, {
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail("");
      // Refresh list
      fetchAccessList(slice.id);
    } catch (err: unknown) {
      console.error("Failed to invite user", err);
      // Try to extract backend error message if available
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to invite user";
      setError(msg);
    } finally {
      setInviting(false);
    }
  };

  const handleRevoke = async (userId: string) => {
    if (!slice) return;
    setRevokingUser(userId);
    try {
      await revokeSliceAccess(slice.id, userId);
      setAccessList((prev) => prev.filter((u) => u.userId !== userId));
    } catch (err) {
      console.error("Failed to revoke access", err);
      setError("Failed to revoke access");
    } finally {
      setRevokingUser(null);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "viewer" | "editor",
  ) => {
    if (!slice) return;
    // Optimistic update
    setAccessList((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, role: newRole } : u)),
    );

    try {
      await updateSliceAccessRole(slice.id, userId, { role: newRole });
    } catch (err) {
      console.error("Failed to update role", err);
      setError("Failed to update role");
      // Revert on failure involves refetching, for simplicity
      fetchAccessList(slice.id);
    }
  };

  if (!isOpen || !slice) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-card/80 bg-surface w-full max-w-lg p-6 rounded-xl shadow-xl pointer-events-auto border flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold font-serif mb-1">
                  Share &quot;{slice.name}&quot;
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage who can see and edit this slice.
                </p>
              </div>

              {/* Access Status Header */}
              <div className="flex bg-muted p-1 rounded-lg">
                {(["private", "public"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    disabled={updatingStatus}
                    className={cn(
                      "flex-1 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                      accessStatus === status
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Specific Access - Invite & List */}
              {accessStatus === "specific" && (
                <div className="flex flex-col gap-6">
                  {/* Invite Form */}
                  <form
                    onSubmit={handleInvite}
                    className="flex gap-2 items-end"
                  >
                    <div className="flex-1">
                      <Input
                        label="Invite by Email"
                        type="email"
                        placeholder="user@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        containerClassName="mb-0"
                        className="bg-background"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-24">
                      <label className="text-xs font-medium ml-1">Role</label>
                      <select
                        value={inviteRole}
                        onChange={(e) =>
                          setInviteRole(e.target.value as "viewer" | "editor")
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                      </select>
                    </div>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={inviting}
                    >
                      {inviting ? (
                        <TbLoader className="animate-spin" />
                      ) : (
                        "Invite"
                      )}
                    </Button>
                  </form>

                  {/* Access List */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      People with access
                    </h3>

                    {loadingList ? (
                      <div className="flex justify-center p-4">
                        <TbLoader className="animate-spin text-muted-foreground" />
                      </div>
                    ) : (accessList?.length || 0) === 0 ? (
                      <div className="text-sm text-muted-foreground italic text-center p-2 border border-dashed rounded-lg">
                        No one else has access yet.
                      </div>
                    ) : (
                      <div className="flex flex-col divide-y border rounded-lg overflow-hidden">
                        {accessList.map((access) => (
                          <div
                            key={access.id}
                            className="flex items-center justify-between p-3 bg-card hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                {access.user.avatarUrl ? (
                                  <img
                                    src={access.user.avatarUrl}
                                    alt={access.user.fullName}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <TbUser />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {access.user.fullName || access.user.email}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {access.user.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={access.role}
                                onChange={(e) =>
                                  handleRoleChange(
                                    access.userId,
                                    e.target.value as "viewer" | "editor",
                                  )
                                }
                                className="h-8 rounded-md border border-input bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                              >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                              </select>
                              <button
                                onClick={() => handleRevoke(access.userId)}
                                disabled={revokingUser === access.userId}
                                className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                                title="Revoke Access"
                              >
                                {revokingUser === access.userId ? (
                                  <TbLoader className="animate-spin" />
                                ) : (
                                  <TbTrash />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {accessStatus === "public" && (
                <div className="flex flex-col gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-lg text-sm border border-blue-100 dark:border-blue-800">
                    <p className="font-semibold mb-1">Public Access</p>
                    <p>
                      Anyone with the link can view this slice. Only you can
                      edit it.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium ml-1 text-muted-foreground">
                      Share Link
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={`${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/${btoa(slice.id)}`}
                        readOnly
                        label=""
                        containerClassName="mb-0 flex-1"
                        className="bg-muted text-muted-foreground"
                      />
                      <Button
                        variant="outlined"
                        onClick={() => {
                          const url = `${window.location.origin}/dashboard/${btoa(slice.id)}`;
                          navigator.clipboard.writeText(url);
                          // Optional: Add a toast or visual feedback here if we had a toast system ready
                          // For now, reliance on button state or just action is fine, or I can add a temporary text change
                        }}
                        className="whitespace-nowrap"
                      >
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-2 border-t">
                <Button variant="outlined" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
