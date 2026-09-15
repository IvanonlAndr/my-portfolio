# Frontend Engineering Case Studies

A collection of case studies based on work completed as a Frontend Engineer Intern, covering real architecture and engineering decisions across authentication, data synchronization, and pagination. Each folder contains a full write-up plus a working, reimplemented code sample — original proprietary code and internal file structure have been intentionally left out; see each README for details.

## Case Studies

- **[Sign-Up Flow - Guest Authentication & Recovery](./Sign-Up%20Flow%20-%20Guest%20Authentication%20%26%20Recovery)** — Sign-up, login, and password recovery flow, with a controller-hook pattern separating validation and network logic from presentation.
- **[Course Starring - Apollo Cache Synchronization](./Course%20Starring%20-%20Apollo%20Cache%20Synchronization)** — Manual Apollo cache updates (`cache.modify`) to keep starred/bookmarked state in sync across the UI without a refetch.
- **[Global Auth Link - Automatic Token Injection](./Global%20Auth%20Link%20-%20Automatic%20Token%20Injection)** — A custom Apollo Link middleware that automatically attaches auth tokens to every outgoing GraphQL request.
- **[Hybrid Feed Pagination - Infinite Scroll + Explicit Paging](./Hybrid%20Feed%20Pagination%20-%20Infinite%20Scroll%20%2B%20Explicit%20Paging)** — A feed that combines Intersection Observer-driven infinite scroll with explicit page-based navigation for search results.

## Tech Stack
React, TypeScript, GraphQL (Apollo Client), Material-UI (MUI), React Router
