import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const db = drizzle(process.env.DATABASE_URL as string, { schema });

export { db, schema };
export * from "./schema";

// Explicit exports for better TypeScript resolution
export { users, userRelations } from "./schema/user";
export { slices, sliceRelations } from "./schema/slice";
export { sliceAccess, sliceAccessRelations } from "./schema/sliceAccess";
export { memos, memoRelations } from "./schema/memo";
export { refreshTokens, refreshTokenRelations } from "./schema/refreshToken";
