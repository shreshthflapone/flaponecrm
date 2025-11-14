import React from 'react';
import PropTypes from 'prop-types';
import '../components/Card.css';

const Card = ({ children,className }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

Card.propTypes = {
  children: PropTypes.node,
};

export default Card;
