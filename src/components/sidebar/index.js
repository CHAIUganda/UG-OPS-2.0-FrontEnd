import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import HR from './hr';
import Procurement from './procurement';
import Finance from './finance';
import './sidebar.css';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

function Sidebar(props) {
  const { token } = props;
  const [hrToggle, setHrToggle] = useState(false);
  const [procurementToggle, setProcurementToggle] = useState(false);
  const [financeToggle, setFinanceToggle] = useState(false);

  const handleHrToggle = (event) => {
    event.preventDefault();
    setHrToggle(!hrToggle);
    setProcurementToggle(false);
    setFinanceToggle(false);
  };

  const handleProcurementToggle = (event) => {
    event.preventDefault();
    setProcurementToggle(!procurementToggle);
    setHrToggle(false);
    setFinanceToggle(false);
  };

  const handleFinanceToggle = (event) => {
    event.preventDefault();
    setFinanceToggle(!financeToggle);
    setProcurementToggle(false);
    setHrToggle(false);
  };

  return (
    <div className="setSideBarInline sidebgColor col-3 ml-3 position-fixed">
      <div className="row">
        <div className="col-12">
          <div className={`${token ? '' : 'sidebarContainer'}`}>
            <h3 className="text-center">Human Resource</h3>
            <div className="navContainer">
              <HR toggle={hrToggle} onClick={handleHrToggle} />
            </div>
            <div>
              <Procurement
                toggle={procurementToggle}
                onClick={handleProcurementToggle}
              />
            </div>
            <div>
              <Finance toggle={financeToggle} onClick={handleFinanceToggle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  token: PropTypes.string
};

export default connect(mapStateToProps)(Sidebar);
