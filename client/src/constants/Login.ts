import github from '../assets/github-logo.svg';
import google from '../assets/google-logo.png';
import linkedin from '../assets/linkedin.svg';

export interface OAuthButtonData {
  url: string;
  title: string;
  site: string;
  img: string;
}

export const createAuthButtonProps = (
  githubClientId: string,
  googleClientId: string,
  linkedInClientId: string
) => {
  const buttonProps: ReadonlyArray<OAuthButtonData> = [
    {
      url: `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
        githubClientId
      )}`,
      title: '',
      site: 'Github',
      img: github,
    },
    {
      url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        googleClientId
      )}&redirect_uri=${encodeURIComponent(
        'http://localhost:3000/login'
      )}&response_type=code&scope=profile email`,
      title: '',
      site: 'Google',
      img: google,
    },
    {
      url: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(
        linkedInClientId
      )}&redirect_uri=${encodeURIComponent(
        'http://localhost:3000/login'
      )}&scope=${encodeURIComponent('r_liteprofile r_emailaddress')}`,
      title: '',
      site: 'Linkedin',
      img: linkedin,
    },
  ];

  return buttonProps;
};
