# @packages/types

TypeScript type definitions generated from database schemas.

## Usage

```typescript
import type { User, NewUser, Slice, Memo, RefreshToken } from 'types';

// Use the types in your application
const user: User = {
  id: '...',
  name: 'John Doe',
  email: 'john@example.com',
  // ...
};
```

## Available Types

### Database Models

- `User` / `NewUser` - User table types
- `Slice` / `NewSlice` - Slice table types
- `SliceAccess` / `NewSliceAccess` - Slice access control types
- `Memo` / `NewMemo` - Memo table types
- `RefreshToken` / `NewRefreshToken` - Refresh token types

### Enums

- `ContentType` - "text" | "url" | "image" | "video" | "file"
- `SliceAccessRole` - "viewer" | "editor"

## Notes

Types are automatically inferred from the database schema using Drizzle ORM's `InferSelectModel` and `InferInsertModel` utilities.
