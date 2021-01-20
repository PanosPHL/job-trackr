import React, { useState, useCallback, useEffect, useContext } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { useQuery, gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import OauthPopup from 'react-oauth-popup';
import Cookie from 'js-cookie';
import AuthContext from '../../contexts/AuthContext';

interface LoginProps extends RouteComponentProps {}

const OAUTH_KEYS = gql`
  query GetOAuthKeys {
    allOauthKeys {
      githubClientId
      googleClientId
    }
  }
`;

const Login: React.FC<LoginProps> = () => {
  const [OAuthCode, setOAuthCode] = useState('');
  const [site, setSite] = useState('');

  const { loading, error, data } = useQuery(OAUTH_KEYS);
  const value = useContext(AuthContext);

  const history = useHistory();

  const onCode = useCallback((code: string = '', params: any) => {
    setOAuthCode(code);
  }, []);

  const loginUser = async () => {
    let res;
    res = await fetch(`/api/graphql/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken') || '',
      },
      body: JSON.stringify({
        query: `
        mutation {
            login${site}User (code: "${OAuthCode}") {
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
      if (data.data.loginGithubUser) {
        await value?.setUser(data.data.loginGithubUser);
      } else if (data.data.loginGoogleUser) {
        await value?.setUser(data.data.loginGoogleUser);
      }
      history.push('/');
    }
  };

  useEffect(() => {
    if (OAuthCode && site) {
      loginUser();
    }
  }, [OAuthCode]);

  let githubClientId,
    googleClientId = '';

  if (data) {
    githubClientId = data.allOauthKeys.githubClientId;
    googleClientId = data.allOauthKeys.googleClientId;
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
          <Button onClick={() => setSite('Github')}>GitHub</Button>
        </OauthPopup>
        <OauthPopup
          url={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
            googleClientId
          )}&redirect_uri=${encodeURIComponent(
            'http://localhost:3000/login'
          )}&response_type=code&scope=profile email`}
          onCode={onCode}
          onClose={() => console.log('closed')}
          height={600}
          width={600}
          title=""
        >
          <Button onClick={() => setSite('Google')}>Google</Button>
        </OauthPopup>
      </Paper>
    </Container>
  );
};

export default Login;
