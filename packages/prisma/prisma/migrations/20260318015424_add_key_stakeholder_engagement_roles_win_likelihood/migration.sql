-- AlterTable
ALTER TABLE "EngagementStrategy" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "winLikelihood" INTEGER;

-- AlterTable
ALTER TABLE "ProjectMember" ADD COLUMN "engagementRoles" TEXT;

-- AlterTable
ALTER TABLE "RelationshipIntel" ADD COLUMN "createdBy" TEXT;
ALTER TABLE "RelationshipIntel" ADD COLUMN "deletedAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "linkedinUrl" TEXT,
    "linkedinProfile" TEXT,
    "background" TEXT,
    "photoUrl" TEXT,
    "stakeholderRole" TEXT,
    "sentiment" TEXT,
    "influenceLevel" TEXT,
    "relationshipScore" REAL,
    "engagementStatus" TEXT,
    "engagementStatusNote" TEXT,
    "isKeyStakeholder" BOOLEAN NOT NULL DEFAULT false,
    "ourGoals" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "organizationId" TEXT NOT NULL,
    "departmentId" TEXT,
    "reportsToId" TEXT,
    CONSTRAINT "Contact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contact_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Contact_reportsToId_fkey" FOREIGN KEY ("reportsToId") REFERENCES "Contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Contact" ("background", "createdAt", "deletedAt", "departmentId", "email", "engagementStatus", "engagementStatusNote", "id", "influenceLevel", "linkedinProfile", "linkedinUrl", "name", "organizationId", "phone", "photoUrl", "relationshipScore", "reportsToId", "sentiment", "stakeholderRole", "title", "updatedAt") SELECT "background", "createdAt", "deletedAt", "departmentId", "email", "engagementStatus", "engagementStatusNote", "id", "influenceLevel", "linkedinProfile", "linkedinUrl", "name", "organizationId", "phone", "photoUrl", "relationshipScore", "reportsToId", "sentiment", "stakeholderRole", "title", "updatedAt" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
