# Global Auth Link — Automatic Token Injection

## Project Overview
This case study covers a custom Apollo Link middleware that automatically attaches the logged-in user's auth token to every outgoing GraphQL request, so individual queries and mutations never need to handle authentication headers themselves.

---

## Core Tech Stack & Design Patterns
* **Framework Layer:** React with TypeScript
* **Data & Network Architecture:** GraphQL via Apollo Client
* **Architectural Pattern:** Custom Apollo Link middleware, composed into the client's link chain

---

## System Architecture & Design Choices

### 1. Centralizing Auth at the Network Layer
Rather than passing an auth header manually on every query or mutation, a custom `ApolloLink` intercepts every outgoing operation before it reaches the HTTP transport. It reads the current token from storage and, if present, sets an `authorization` header on the request's context. This means any component or hook making a GraphQL call is automatically authenticated with no extra code required at the call site.

### 2. Link Chain Ordering
Apollo Links execute in the order they're composed. The auth link is placed before the HTTP link in the chain, so the token is attached first, and the request only then continues on to actually being sent over the network.

### 3. Fail-Open on Missing Token
If no token is present (e.g. a logged-out user hitting a public query), the middleware simply skips attaching the header and forwards the request unmodified, rather than blocking the request outright — auth enforcement for protected fields happens server-side.

---

## Engineering Impact & Core Outcomes

| Technical Challenge | Strategic Engineering Solution | Core Engineering Impact |
| :--- | :--- | :--- |
| **Repetitive auth-header boilerplate** | Centralized token attachment into a single Apollo Link middleware. | Every GraphQL call is authenticated automatically, with zero auth-specific code needed in individual queries or components. |
| **Consistent request-level security** | Injected the token at the network layer rather than per-request. | Impossible to accidentally forget the auth header on a new query or mutation, since it's applied globally. |
| **Supporting both authenticated and public requests** | Middleware conditionally attaches the header only when a token exists. | Public/unauthenticated requests continue to work without special-casing logic elsewhere in the app. |

---

```ts
import { ApolloLink, NextLink, Operation } from '@apollo/client';
import { StorageKeys } from './storageKeys';
 
// Reads the current token from storage and attaches it as a bearer token
// on every outgoing GraphQL request, before the request continues down
// the link chain to the actual HTTP transport.
const authLink = new ApolloLink((operation: Operation, forward: NextLink) => {
  const token = localStorage.getItem(StorageKeys.Token);
 
  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    });
  }
 
  return forward(operation);
});
 
export default authLink;

export default authLink;
```
