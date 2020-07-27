import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

function Procurement({
  changeActive,
  active,
  // type,
  roles
}) {
  // let procurement;
  let admin;
  // let supervisor;
  // let countryDirector;
  if (roles) {
    // procurement = roles.procurement;
    admin = roles.admin;
    // supervisor = roles.supervisor;
    // countryDirector = roles.countryDirector;
  } else {
    // procurement = false;
    admin = false;
  }

  const handleChangeActive = (toMakeActive) => {
    changeActive(toMakeActive);
  };

  return (
    <div>
      <p className="sidebTopNav">
        {/* <FaPlaneDeparture /> Manage */}
      </p>
      {
        admin
      && <div className='showContent'>
        <span onClick={() => handleChangeActive('CreateProcurement')}>
          <SubItem
            link="/procurement/CreateProcurement"
            textToSet="Create Procurement Request"
            active={active === 'CreateProcurement'}
          />
        </span>
      </div>
      }
    </div>
  );
}

Procurement.propTypes = {
  changeActive: PropTypes.func,
  active: PropTypes.bool,
  type: PropTypes.string,
  roles: PropTypes.object
};

export default connect(mapStateToProps, matchDispatchToProps)(Procurement);
