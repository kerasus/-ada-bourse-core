# @ada/bourse-common

Shared TypeScript definitions for ADA bourse customer and admin panels, built with Vite.

## Scripts
- `pnpm build` – build the library (`dist/` with ES + CJS + d.ts)
- `pnpm dev` – watch mode build
- `pnpm clean` – remove `dist`

## Install (consumer projects)
```bash
pnpm add @ada/bourse-common
```

## Usage
```ts
import { UserProfile, ApiResponse } from "@ada/bourse-common";

const user: UserProfile = {
  id: "123",
  fullName: "کاربر نمونه",
  roles: ["customer"],
  isActive: true,
  createdAt: new Date().toISOString()
};

const response: ApiResponse<UserProfile> = { data: user };
```

## Notes
- The package is published as ES modules with a CJS build for compatibility.
- Update `src/types/*` to add shared contracts between panels.

