import React from 'react';
import ANURAG_LOGO_B64 from './anuragLogoB64';

const AnuragLogo = ({ height = 40, style = {} }) => (
  <img
    src={ANURAG_LOGO_B64}
    alt="Anurag University"
    height={height}
    style={{ display: 'block', objectFit: 'contain', ...style }}
  />
);

export default AnuragLogo;
