import React, { useState, useCallback, useEffect, useContext } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { useQuery, gql, useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import OauthPopup from 'react-oauth-popup';
import AuthContext from '../../contexts/AuthContext';
import SiteContext from '../../contexts/SiteContext';
import { createAuthButtonProps } from '../../constants/Login';
import OAuthButton from '../buttons/OAuthButton';

interface LoginProps extends RouteComponentProps {}

const OAUTH_KEYS = gql`
  query GetOAuthKeys {
    allOauthKeys {
      githubClientId
      googleClientId
      linkedInClientId
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

  const providerValue = {
    site,
    setSite,
  };

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
    } else if (res.data.loginLinkedinUser) {
      await value?.setUser(res.data.loginLinkedinUser);
    }
    history.push('/');
  };

  useEffect(() => {
    if (OAuthCode && site) {
      loginUserAction();
    }
  }, [OAuthCode]);

  let githubClientId,
    googleClientId,
    linkedInClientId = '';

  if (queryData) {
    githubClientId = queryData.allOauthKeys.githubClientId;
    googleClientId = queryData.allOauthKeys.googleClientId;
    linkedInClientId = queryData.allOauthKeys.linkedInClientId;
  }

  return (
    <SiteContext.Provider value={providerValue}>
      <Container>
        <Paper>
          {createAuthButtonProps(
            githubClientId,
            googleClientId,
            linkedInClientId
          ).map((authButtonProp) => {
            const { url, title, site } = authButtonProp;
            return (
              <OAuthButton
                url={url}
                onCode={onCode}
                onClose={() => console.log('closed')}
                height={600}
                width={600}
                title={title}
                site={site}
              />
            );
          })}
        </Paper>
      </Container>
    </SiteContext.Provider>
  );
};

export default Login;
