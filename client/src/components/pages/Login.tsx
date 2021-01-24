import React, { useState, useCallback, useEffect, useContext } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useQuery, gql, useMutation } from '@apollo/client';
import AuthContext from '../../contexts/AuthContext';
import SiteContext from '../../contexts/SiteContext';
import { createAuthButtonProps } from '../../constants/Login';
import OAuthButton from '../buttons/OAuthButton';
import svg from '../../assets/job-trackr-placeholder.svg';
import Image from '../misc/Image';

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '400px',
    minHeight: '525px',
    padding: theme.spacing(3, 5),
    [theme.breakpoints.down('sm')]: {
      width: '275px',
      minHeight: '455px',
    },
  },
  image: {
    width: '80px',
    height: '80px',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '190px',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    display: 'flex',
    width: '100%',
    height: '235px',
    marginTop: '50px',
    flexDirection: 'column',
    alignItems: 'center',
  },
  oAuthButton: {
    height: '72px',
    fontSize: '1.2rem',
    width: '320px',
    [theme.breakpoints.down('sm')]: {
      width: '275px',
    },
  },
}));

const Login: React.FC<LoginProps> = () => {
  const [OAuthCode, setOAuthCode] = useState('');
  const [site, setSite] = useState('');

  const providerValue = {
    site,
    setSite,
  };

  const classes = useStyles();

  const {
    card,
    root,
    image,
    headerContainer,
    buttonContainer,
    oAuthButton,
  } = classes;

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
  }, [OAuthCode, site]);

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
      <Container className={root}>
        <Paper className={card}>
          <div className={headerContainer}>
            <Image src={svg} className={image} />
            <Typography variant="h3">Job Trackr</Typography>
            <Typography variant="subtitle1">
              Record your application process
            </Typography>
          </div>
          <hr />
          <div className={buttonContainer}>
            {createAuthButtonProps(
              githubClientId,
              googleClientId,
              linkedInClientId
            ).map((authButtonProp, i) => {
              const { url, title, site } = authButtonProp;
              return (
                <OAuthButton
                  key={`oauth-button-${i + 1}`}
                  url={url}
                  onCode={onCode}
                  onClose={() => console.log('closed')}
                  height={600}
                  width={600}
                  title={title}
                  site={site}
                  className={oAuthButton}
                />
              );
            })}
          </div>
        </Paper>
      </Container>
    </SiteContext.Provider>
  );
};

export default Login;
