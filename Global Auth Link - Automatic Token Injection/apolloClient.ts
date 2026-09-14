import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import authLink from './authLink';

const httpLink = new HttpLink({ uri: '/graphql' });

// authLink runs first on every request, attaching the token if present,
// then forwards to httpLink to actually send the request.
export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache()
});
