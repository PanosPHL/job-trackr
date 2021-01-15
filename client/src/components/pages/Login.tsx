import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { useQuery, gql } from '@apollo/client';

const OAUTH_KEYS = gql`
  query GetOAuthKeys {
    allOauthKeys {
      githubClientId
      githubClientSecret
    }
  }
`;
const Login: React.FC<unknown> = () => {
  const { loading, error, data } = useQuery(OAUTH_KEYS);
  console.log(data);
  return (
    <Container>
      <Paper></Paper>
    </Container>
  );
};

export default Login;
