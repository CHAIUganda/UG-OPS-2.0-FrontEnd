import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GiPayMoney, GiMoneyStack } from 'react-icons/gi';

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
  let operationsLead;
  let financeAdmin;
  // let supervisor;
  // let countryDirector;
  if (roles) {
    // procurement = roles.procurement;
    admin = roles.admin;
    operationsLead = roles.operationsLead;
    financeAdmin = roles.financeAdmin;
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
        <GiPayMoney /> General Duties
      </p>
      {
        (admin || operationsLead)
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

      {
        (admin || financeAdmin)
      && <>
        <p className="sidebTopNav">
          <GiMoneyStack /> Finance Admin
        </p>
        <div className='showContent'>
          <span onClick={() => handleChangeActive('ManagePrograms')}>
            <SubItem
              link="/procurement/ManagePrograms"
              textToSet="Programs"
              active={active === 'ManagePrograms'}
            />
          </span>

          <span onClick={() => handleChangeActive('CreateProgram')}>
            <SubItem
              link="/procurement/CreateProgramComp"
              textToSet="Create New Program"
              active={active === 'CreateProgram'}
            />
          </span>

          <span onClick={() => handleChangeActive('ManageAccountCodes')}>
            <SubItem
              link="/procurement/ManageAccountCodes"
              textToSet="Account Codes"
              active={active === 'ManageAccountCodes'}
            />
          </span>
        </div>
      </>
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
