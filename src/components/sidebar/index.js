import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import axios from 'axios';

import { BASE_URL } from '../../config';
import HR from './hr';
import Procurement from './procurement';
import './sidebar.css';
import 'react-day-picker/lib/style.css';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  section: state.sideBar.section
});

function Sidebar({ token, section }) {
  const [selectedDates, setSelectedDates] = useState([]);

  const returnCalendar = () => {
    if (!section) {
      return (<div className="sidebarCalendar text-center">
        <h4>Public Holidays</h4>
        <DayPicker
          selectedDays={selectedDates}
          month={new Date()}
          todayButton="Go to Today"
          modifiers={{
            foo: new Date(),
          }}
          // onTodayButtonClick={(day, modifiers) => console.log(day, modifiers)}
        />
      </div>);
    }

    return '';
  };

  useEffect(() => {
    const endPoint = `${BASE_URL}hrApi/getPublicHolidays`;
    axios.defaults.headers.common = { token };
    if (token) {
      axios.get(endPoint)
        .then((res) => {
          const days = [];
          res.data.forEach((day) => {
            days.push(new Date(`${new Date().getFullYear()}, ${day.date.split('/')[1]}, ${day.date.split('/')[0]}`));
          });
          setSelectedDates(days);
        })
        .catch((/* err */) => {
        });
    }
  }, []);

  return (
    <div className="setSideBarInline sidebgColor col-3 ml-3 position-fixed">
      <div className="row">
        <div className="col-12">
          <div className={`${token ? '' : 'sidebarContainer'}`}>
            { returnCalendar() }
            <h3 className="text-center">{ section }</h3>
            {section === 'Human Resource'
              && <div className="navContainer">
                <HR />
              </div>
            }
            {section === 'Procurement'
              && <div className="navContainer">
                <Procurement />
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
