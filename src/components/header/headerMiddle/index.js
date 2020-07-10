import React from 'react';
// import { Link } from 'react-router-dom';
import { IoIosPeople } from 'react-icons/io';
// import { GiTakeMyMoney } from 'react-icons/gi';
// import { FaFileInvoiceDollar } from 'react-icons/fa';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as sideBarActions from '../../../redux/actions/sideBarActions';
import SubItem from './subItem';
import './headerMiddle.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection
};

const mapStateToProps = () => ({ });

function HeaderMiddle({ changeSection, loginButton }) {
  const handleClick = (section) => {
    changeSection(section);
  };

  if (loginButton) {
    return (
      <div className="middleHeader">
        Ug Ops
      </div>
    );
  }

  return (
    <div className="middleHeader">
      <span onClick={() => handleClick('Human Resource')}>
        <SubItem
          link="/hr/HRHome"
          IcontoSet={IoIosPeople}
          textToSet="Human Resource"
        />
      </span>
      {/* <span onClick={() => handleClick('Procurement')}>
        <SubItem
          link="/"
          IcontoSet={GiTakeMyMoney}
          textToSet="Procurement"
        />
      </span>

      <span onClick={() => handleClick('Finance')}>
        <SubItem
          link="/"
          IcontoSet={FaFileInvoiceDollar}
          textToSet="Finance"
        />
      </span> */}
    </div>
  );
}

HeaderMiddle.propTypes = {
  changeSection: PropTypes.func,
  loginButton: PropTypes.bool
};

export default connect(mapStateToProps, matchDispatchToProps)(HeaderMiddle);
