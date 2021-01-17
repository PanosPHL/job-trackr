import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { useQuery, gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import OauthPopup from 'react-oauth-popup';
import Cookie from 'js-cookie';
import AuthContext from '../../contexts/AuthContext';

const OAUTH_KEYS = gql`
  query GetOAuthKeys {
    allOauthKeys {
      githubClientId
    }
  }
`;

const Login: React.FC<unknown> = () => {
  const [OAuthCode, setOAuthCode] = useState('');
  const [site, setSite] = useState('');

  const { loading, error, data } = useQuery(OAUTH_KEYS);
  const value = useContext(AuthContext);

  const history = useHistory();

  const githubOnCode = useCallback((code: string = '', params: any) => {
    setOAuthCode(code);
  }, []);

  const loginUser = async () => {
    let res;
    if (site === 'GitHub') {
      res = await fetch(`/api/graphql/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookie.get('csrftoken') || '',
        },
        body: JSON.stringify({
          query: `
        mutation {
            loginGithubUser(code: "${OAuthCode}") {
              id
              site
              firstName
              lastName
              email
              avatar
            }
        }
        `,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        await value?.setUser(data.data.loginGithubUser);
        history.push('/');
      }
    }
  };

  useEffect(() => {
    loginUser();
  }, [OAuthCode]);

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
          onCode={githubOnCode}
          onClose={() => console.log('closed')}
          height={600}
          width={600}
          title=""
        >
          <Button onClick={() => setSite('GitHub')}>GitHub</Button>
        </OauthPopup>
      </Paper>
    </Container>
  );
};

export default Login;
