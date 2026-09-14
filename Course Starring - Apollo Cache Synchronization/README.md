# Course Starring — Apollo Cache Synchronization

## Project Overview
This case study covers a starring/bookmarking feature that lets a user mark a course as "starred" and have that state reflected consistently across every part of the UI where starred courses appear — without an extra network round trip after the mutation completes.

The core engineering challenge was keeping Apollo's normalized cache in sync after a mutation, rather than relying on a full refetch.

---

## Core Tech Stack & Design Patterns
* **Framework Layer:** React with TypeScript
* **Data & Network Architecture:** GraphQL via Apollo Client
* **Architectural Pattern:** Controller hook + manual normalized-cache update (`cache.modify`)

---

## System Architecture & Design Choices

### 1. Why not just refetch?
The simplest way to reflect a new "starred" state is to refetch the user's starred-courses list after the mutation resolves. That works, but it means an extra round trip and a brief loading flicker anywhere that list is rendered. Since Apollo already normalizes entities in its cache, the mutation's `update` function can instead reach directly into the cache and patch the relevant field, so every component reading that field re-renders immediately with no extra request.

### 2. Building and Applying the Cache Reference
Apollo identifies cached entities by a stable reference (`__ref`) built from their `__typename` and `id`. The `update` function resolves the current user's cache reference with `cache.identify`, builds the course's reference directly (since the course may not already be a query result in that exact shape), and appends it into the user's `starredCourses` field via `cache.modify`.

### 3. Guarding Against Duplicate Refs
The field-modifier function checks whether the course reference is already present before appending it, so a duplicate mutation call (e.g. a double click before the button disables) can't insert the same course twice into the cached list.

---

## Engineering Impact & Core Outcomes

| Technical Challenge | Strategic Engineering Solution | Core Engineering Impact |
| :--- | :--- | :--- |
| **Keeping starred state in sync across the UI** | Used Apollo's `cache.modify` to patch the affected field directly in the `update` callback. | Starred state updates everywhere that field is read, with no extra network request. |
| **Risk of duplicate cache entries** | Added an idempotency check inside the field-modifier function. | Prevents the same course being inserted twice if the mutation resolves unexpectedly (e.g. rapid double-clicks). |
| **Loose cache field typing** | Narrowed the field's type from a broad reference/array union down to a single array type based on code review feedback. | Clearer, more predictable typing for future maintainers working with this field. |

---

```tsx
// useStarredCourse.ts — controller hook
import { useMutation, gql } from '@apollo/client';
import type { ApolloCache, Reference } from '@apollo/client';
import { useCurrentUser } from './useCurrentUser';

const STAR_COURSE = gql`
  mutation StarCourse($courseId: ID!) {
    starCourse(courseId: $courseId) {
      id
    }
  }
`;

export function useStarredCourse(courseId: string) {
  const [starCourse, { loading }] = useMutation(STAR_COURSE);
  const { id: userId } = useCurrentUser();

  const toggleStar = async () => {
    await starCourse({
      variables: { courseId },
      update(cache: ApolloCache<unknown>) {
        const userRef = cache.identify({ __typename: 'User', id: userId });
        const courseRef: Reference = { __ref: `Course:${courseId}` };

        cache.modify({
          id: userRef,
          fields: {
            starredCourses(existingRefs: readonly Reference[] = []) {
              const alreadyStarred = existingRefs.some(
                (ref) => ref.__ref === courseRef.__ref
              );
              return alreadyStarred ? existingRefs : [...existingRefs, courseRef];
            }
          }
        });
      }
    });
  };

  return { toggleStar, loading };
}
```
