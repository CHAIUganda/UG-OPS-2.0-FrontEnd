import React from 'react';
import PropTypes from 'prop-types';
import { GiTakeMyMoney, GiShinyPurse, GiOpenBook } from 'react-icons/gi';
import { FaUserGraduate } from 'react-icons/fa';

import Arrow from '../arrow';
import Icon from '../icon';
import SubItem from '../subItem';

export default function Procurement(props) {
  const { toggle, onClick } = props;
  return (
    <div>
      <p onClick={onClick} className="sidebTopNav">
        <Icon icon={() => <GiTakeMyMoney />} />
        Procurement
        <Arrow toggle={toggle} />
      </p>
      <div
        className={`sidebarDropdownContent ${
          toggle ? 'showContent' : 'dntShowContent'
        }`}
      >
        <SubItem
          link="/procurement/LPOGoodsAndServices"
          IcontoSet={GiShinyPurse}
          textToSet="LPO Goods & Services"
        />

        <SubItem
          link="/procurement/dataCollectorsContractManagement"
          IcontoSet={GiOpenBook}
          textToSet="Data Collectors' Contract"
        />

        <SubItem
          link="/procurement/ConsultantContractManagement"
          IcontoSet={FaUserGraduate}
          textToSet="Consultant's Contract"
        />
      </div>
    </div>
  );
}

Procurement.propTypes = {
  toggle: PropTypes.bool,
  onClick: PropTypes.func
};
