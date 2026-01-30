## No Specification Changes

This change is a pure architectural refactoring to fix Next.js 15 prerendering issues during Docker builds.

**Rationale**: No functional requirements are being added, modified, or removed. The user-facing behavior remains identical. This is an implementation-level fix that:

- Restructures component files to comply with Next.js 15 prerendering requirements
- Adds Suspense boundaries where required by the framework
- Splits client components from server components

All existing specifications remain valid and unchanged.
