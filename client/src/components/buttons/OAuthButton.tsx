import React, { useContext } from 'react';
import OAuthPopup from 'react-oauth-popup';
import Button from '@material-ui/core/Button';
import SiteContext from '../../contexts/SiteContext';
import { OAuthButtonData } from '../../constants/Login';

interface OAuthButtonProps extends OAuthButtonData {
  onCode(code: string, params: any): Promise<void>;
  onClose(): void;
  height: number;
  width: number;
  title: string;
  className: string;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
  url,
  onCode,
  onClose,
  height,
  width,
  title,
  site,
  className,
}) => {
  const value = useContext(SiteContext);
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
        {site === 'Linkedin' ? 'LinkedIn' : site}
      </Button>
    </OAuthPopup>
  );
};

export default OAuthButton;
