/*
  Warnings:

  - A unique constraint covering the columns `[shareUrl]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_shareUrl_key" ON "User"("shareUrl");
