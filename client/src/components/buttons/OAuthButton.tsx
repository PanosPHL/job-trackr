import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import OAuthPopup from 'react-oauth-popup';
import Button from '@material-ui/core/Button';
import Image from '../misc/Image';
import SiteContext from '../../contexts/SiteContext';
import { OAuthButtonData } from '../../constants/Login';

interface OAuthButtonProps extends OAuthButtonData {
  onCode(code: string, params: any): Promise<void>;
  onClose(): void;
  height: number;
  width: number;
  title: string;
  className: string;
  img: string;
}

const useStyles = makeStyles((theme) => ({
  logo: {
    height: '54px',
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      height: '46px',
      marginLeft: theme.spacing(3),
    },
  },
  buttonText: {
    marginLeft: theme.spacing(4),
  },
}));

const OAuthButton: React.FC<OAuthButtonProps> = ({
  url,
  onCode,
  onClose,
  height,
  width,
  title,
  site,
  className,
  img,
}) => {
  const value = useContext(SiteContext);
  const { logo, buttonText } = useStyles();
  return (
    <OAuthPopup
      url={url}
      onCode={onCode}
      onClose={onClose}
      height={height}
      width={width}
      title={title}
    >
      <Button
        fullWidth={true}
        className={className}
        onClick={() => value?.setSite(site)}
      >
        <Image src={img} className={logo} />
        <span className={buttonText}>
          {site === 'Linkedin' ? 'LinkedIn' : site}
        </span>
      </Button>
    </OAuthPopup>
  );
};

export default OAuthButton;
