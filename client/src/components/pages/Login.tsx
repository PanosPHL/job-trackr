import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { useQuery, gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import OauthPopup from 'react-oauth-popup';
import Cookie from 'js-cookie';

const OAUTH_KEYS = gql`
  query GetOAuthKeys {
    allOauthKeys {
      githubClientId
      githubClientSecret
    }
  }
`;

const onCode = async (code: string = '', params: any) => {
  // await fetch(`/api/graphql`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-CSRFToken': Cookie.get('csrftoken') || '',
  //   },
  // });
  console.log(code);
};
const Login: React.FC<unknown> = () => {
  const { loading, error, data } = useQuery(OAUTH_KEYS);
  let githubClientId = '';

  if (data) {
    githubClientId = data.allOauthKeys.githubClientId;
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
