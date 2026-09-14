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
