/*
  Warnings:

  - You are about to drop the column `share` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `shareUrl` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "share",
DROP COLUMN "shareUrl";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "share" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareUrl" TEXT;
