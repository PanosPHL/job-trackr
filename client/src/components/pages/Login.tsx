import React, { useState, useCallback, useEffect, useContext } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { useQuery, gql, useMutation } from '@apollo/client';
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

const loginUserCb = (site: string) => {
  return gql`
    mutation LoginUser($code: String!) {
      login${site}User(code: $code) {
        id
              site
              firstName
              lastName
              email
              avatar
      }
    }
  `;
};

const Login: React.FC<LoginProps> = () => {
  const [OAuthCode, setOAuthCode] = useState('');
  const [site, setSite] = useState('');

  const { loading, error, data: queryData } = useQuery(OAUTH_KEYS);
  const [loginUser, { data: mutationData }] = useMutation(loginUserCb(site));
  const value = useContext(AuthContext);

  const history = useHistory();

  const onCode = useCallback(async (code: string = '', params: any) => {
    setOAuthCode(code);
  }, []);

  const loginUserAction = async () => {
    const res = await loginUser({ variables: { code: OAuthCode } });

    if (res.data.loginGithubUser) {
      await value?.setUser(res.data.loginGithubUser);
    } else if (res.data.loginGoogleUser) {
      await value?.setUser(res.data.loginGoogleUser);
    }
    history.push('/');
  };

  useEffect(() => {
    if (OAuthCode && site) {
      loginUserAction();
    }
  }, [OAuthCode]);

  let githubClientId,
    googleClientId = '';

  if (queryData) {
    githubClientId = queryData.allOauthKeys.githubClientId;
    googleClientId = queryData.allOauthKeys.googleClientId;
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
