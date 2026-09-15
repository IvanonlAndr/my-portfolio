# Hybrid Feed Pagination — Infinite Scroll + Explicit Paging

## Project Overview
This case study covers a content feed that supports two different pagination models depending on context: **infinite scroll** while browsing the main feed, and **explicit page-by-page navigation** while searching. Both are backed by the same underlying paginated GraphQL data, switched based on whether a search term is active.

---

## Core Tech Stack & Design Patterns
* **Framework Layer:** React with TypeScript
* **Data & Network Architecture:** GraphQL via Apollo Client (lazy queries + `fetchMore`)
* **Architectural Pattern:** Controller hook + custom Intersection Observer hook + `useMemo`-derived state

---

## System Architecture & Design Choices

### 1. Two Pagination Models, One Data Shape
Browsing the main feed and searching are two different use cases with different expectations: a feed benefits from infinite scroll, while search results benefit from being able to jump to a specific page. Rather than building two separate pagination systems, both queries return the same paginated shape (`list` + `totalPages`), and a single `useMemo` picks whichever result set is currently relevant based on whether a search term is present. The rest of the controller and view don't need to know which query is actually active.

### 2. Early-Trigger Infinite Scroll
The infinite scroll trigger isn't attached to the very last item in the list — it's attached a few items before the end. This means the next page starts loading slightly before the user reaches the bottom, avoiding a visible pause or empty gap while the next batch is fetched.

### 3. Reusable Intersection Observer Hook
The scroll-triggering logic is extracted into its own hook (`useInfiniteScrollTrigger`) that takes a ref and a callback, rather than being written inline in the controller. This keeps the Intersection Observer setup/cleanup logic reusable for any other paginated list that might need the same infinite-scroll behavior later.

### 4. Infinite Scroll Is Conditionally Disabled
The scroll trigger's callback checks whether a search is active before calling `fetchMore` — infinite scroll only runs for the main feed. During search, the explicit MUI `Pagination` component takes over instead, since jumping directly to a page makes more sense than scrolling through search results.

---

## Engineering Impact & Core Outcomes

| Technical Challenge | Strategic Engineering Solution | Core Engineering Impact |
| :--- | :--- | :--- |
| **Supporting both infinite scroll and page-based navigation** | Unified both data sources behind one `useMemo`-derived state, switched by whether a search is active. | View and pagination logic stay simple, with no branching required outside the one `useMemo`. |
| **Avoiding a visible loading gap during scroll** | Positioned the scroll trigger a few items before the end of the list instead of at the very last item. | Next page loads proactively, before the user visually reaches the bottom of the list. |
| **Reusability of scroll-triggering logic** | Extracted Intersection Observer setup into a standalone hook. | The same infinite-scroll behavior can be reused on any other paginated list without duplicating observer logic. |

---

```ts
// usePostsController.ts (core logic)
const { totalPages, posts } = useMemo(() => {
  if (search) {
    return {
      totalPages: searchData?.postSearch?.totalPages ?? 0,
      posts: searchData?.postSearch?.list ?? []
    };
  }
  return {
    totalPages: feedData?.posts?.totalPages ?? 0,
    posts: feedData?.posts?.list ?? []
  };
}, [feedData, searchData, search]);

const loadMoreTriggerIndex = posts.length >= 3 ? posts.length - 3 : posts.length - 1;

useInfiniteScrollTrigger(loadMoreTriggerRef, () => {
  if (!search) {
    fetchMore({ variables: { offset: posts.length } });
  }
});
```
