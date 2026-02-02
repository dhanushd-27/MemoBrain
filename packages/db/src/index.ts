import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index.js";

const db = drizzle(process.env.DATABASE_URL as string, { schema });

export { db, schema };
export * from "./schema/index.js";

// Explicit exports for better TypeScript resolution
export { users, userRelations } from "./schema/user.js";
export { slices, sliceRelations } from "./schema/slice.js";
export { sliceAccess, sliceAccessRelations } from "./schema/sliceAccess.js";
export { memos, memoRelations, memoTypeEnum } from "./schema/memo.js";
export { refreshTokens, refreshTokenRelations } from "./schema/refreshToken.js";
export * from "./types.js";
