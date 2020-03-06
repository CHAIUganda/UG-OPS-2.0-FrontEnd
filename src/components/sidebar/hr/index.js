import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MdPerson } from 'react-icons/md';
import { FaPlaneDeparture, FaFileContract, FaLaptopCode } from 'react-icons/fa';

import * as sideBarActions from '../../../redux/actions/sideBarActions';


import SubItem from '../subItem';

const matchDispatchToProps = {
  changeActive: sideBarActions.changeActive
};

const mapStateToProps = (state) => ({
  active: state.sideBar.active,
  type: state.auth.type,
  roles: state.auth.roles
});

function HR({
  changeActive,
  active,
  type,
  roles
}) {
  const { hr, admin } = roles;

  const handleChangeActive = (toMakeActive) => {
    changeActive(toMakeActive);
  };

  return (
    <div>
      <p className="sidebTopNav">
        <FaPlaneDeparture /> Leave
      </p>
      <div className='showContent'>
        <span onClick={() => handleChangeActive('Plan4Leave')}>
          <SubItem
            link="/hr/Plan4Leave"
            textToSet="Plan Leave"
            active={active === 'Plan4Leave'}
          />
        </span>

        <span onClick={() => handleChangeActive('Apply4Leave')}>
          <SubItem
            link="/hr/Apply4Leave"
            textToSet="Apply For Leave"
            active={active === 'Apply4Leave'}
          />
        </span>

        <span onClick={() => handleChangeActive('ManagePublicHolidays')}>
          <SubItem
            link="/hr/ManagePublicHolidays"
            textToSet="Public Holidays"
            active={active === 'ManagePublicHolidays'}
          />
        </span>
      </div>

      <p className="sidebTopNav">
        <FaFileContract /> Contract
      </p>
      <div className='showContent'></div>

      {(type === 'expat' || type === 'tcn' || hr || admin)
        && <>
          <p className="sidebTopNav">
            <FaLaptopCode /> Work Permit
          </p>
          <div className='showContent'></div>
        </>
      }

      <p className="sidebTopNav">
        <MdPerson /> HR Specific
      </p>
      <div className='showContent'>
        <span onClick={() => handleChangeActive('Register')}>
          <SubItem
            link="/hr/Register"
            textToSet="Register Staff"
            active={active === 'Register'}
          />
        </span>
        <span onClick={() => handleChangeActive('ManageProgrammes')}>
          <SubItem
            link="/hr/ManageProgrammes"
            textToSet="Programmes"
            active={active === 'ManageProgrammes'}
          />
        </span>
      </div>
    </div>
  );
}

HR.propTypes = {
  changeActive: PropTypes.func,
  active: PropTypes.bool,
  type: PropTypes.string,
  roles: PropTypes.object
};

export default connect(mapStateToProps, matchDispatchToProps)(HR);
