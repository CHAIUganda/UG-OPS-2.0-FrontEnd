import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import HR from './hr';
import './sidebar.css';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  section: state.sideBar.section
});

function Sidebar({ token, section }) {
  return (
    <div className="setSideBarInline sidebgColor col-3 ml-3 position-fixed">
      <div className="row">
        <div className="col-12">
          <div className={`${token ? '' : 'sidebarContainer'}`}>
            <h3 className="text-center">{ section }</h3>
            {section === 'Human Resource'
              && <div className="navContainer">
                <HR />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  token: PropTypes.string,
  section: PropTypes.string
};

export default connect(mapStateToProps)(Sidebar);
