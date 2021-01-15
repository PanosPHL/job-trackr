import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { useQuery, gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import OauthPopup from 'react-oauth-popup';

const OAUTH_KEYS = gql`
  query GetOAuthKeys {
    allOauthKeys {
      githubClientId
      githubClientSecret
    }
  }
`;

const onCode = (code: any, params: any) => {
  console.log(code, params);
};
const Login: React.FC<unknown> = () => {
  const { loading, error, data } = useQuery(OAUTH_KEYS);
  let githubClientId, githubClientSecret;

  if (data) {
    githubClientId = data.allOauthKeys.githubClientId;
    githubClientSecret = data.allOauthKeys.githubClientSecret;
  }

  return (
    <Container>
      <Paper>
        <OauthPopup
          url={`https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
            githubClientId
          )}`}
          onCode={onCode}
          onClose={() => console.log('closed')}
          height={600}
          width={600}
          title=""
        >
          <Button>GitHub</Button>
        </OauthPopup>
      </Paper>
    </Container>
  );
};

export default Login;
