import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookie from 'js-cookie';

const httpLink = createHttpLink({
  uri: '/api/graphql/',
});

const csrfLink = setContext((_, { headers }) => {
  const csrfToken = Cookie.get('csrftoken');

  return {
    headers: {
      ...headers,
      'X-CSRFToken': csrfToken ? csrfToken : '',
    },
  };
});

const client = new ApolloClient({
  link: csrfLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
