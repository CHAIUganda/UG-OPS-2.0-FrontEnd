import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import chai from '../../../assets/img/chai.svg';
import './headerLeft.css';

import * as sideBarActions from '../../../redux/actions/sideBarActions';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection
};

const mapStateToProps = () => ({ });

function HeaderLeft({ changeSection }) {
  const handleClick = (section) => {
    changeSection(section);
  };
  return (
    <Link to="/">
      <div className="headerLeft row ml-1">
        <img src={chai} alt="logo" height="50" onClick={() => handleClick(null)}/>
      </div>
    </Link>
  );
}

HeaderLeft.propTypes = {
  changeSection: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(HeaderLeft);
