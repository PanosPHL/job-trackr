import React from 'react';

interface ImageProps {
  src: string;
  className: string;
}

const Image: React.FC<ImageProps> = ({ src, className }) => (
  <img src={src} className={className} />
);

export default Image;
