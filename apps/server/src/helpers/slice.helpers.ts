import { db, slices, sliceAccess } from "@repo/db";
import { eq, and } from "drizzle-orm";

/**
 * Check if a user can access (view) a slice
 * Returns true if:
 * - User is the owner
 * - Slice is public
 * - Slice is specific and user has access grant
 */
export async function canAccessSlice(
  userId: string,
  sliceId: string,
): Promise<boolean> {
  // Get the slice
  const slice = await db.query.slices.findFirst({
    where: eq(slices.id, sliceId),
  });

  if (!slice) {
    return false;
  }

  // Owner always has access
  if (slice.ownerId === userId) {
    return true;
  }

  // Public slices are accessible to all logged-in users
  if (slice.accessStatus === "public") {
    return true;
  }

  // For specific access, check sliceAccess table
  if (slice.accessStatus === "specific") {
    const access = await db.query.sliceAccess.findFirst({
      where: and(
        eq(sliceAccess.sliceId, sliceId),
        eq(sliceAccess.userId, userId),
      ),
    });

    return !!access;
  }

  // Private slices are only accessible to owner
  return false;
}

/**
 * Check if a user can edit content in a slice (create/update/delete memos)
 * Returns true if:
 * - User is the owner
 * - User has "editor" role in sliceAccess
 */
export async function canEditSlice(
  userId: string,
  sliceId: string,
): Promise<boolean> {
  // Get the slice
  const slice = await db.query.slices.findFirst({
    where: eq(slices.id, sliceId),
  });

  if (!slice) {
    return false;
  }

  // Owner always has edit access
  if (slice.ownerId === userId) {
    return true;
  }

  // Check if user has editor role
  const access = await db.query.sliceAccess.findFirst({
    where: and(
      eq(sliceAccess.sliceId, sliceId),
      eq(sliceAccess.userId, userId),
    ),
  });

  return access?.role === "editor";
}

/**
 * Check if a user can manage a slice (update settings, delete, manage access)
 * Only the owner can manage a slice
 */
export async function canManageSlice(
  userId: string,
  sliceId: string,
): Promise<boolean> {
  const slice = await db.query.slices.findFirst({
    where: eq(slices.id, sliceId),
  });

  if (!slice) {
    return false;
  }

  return slice.ownerId === userId;
}
