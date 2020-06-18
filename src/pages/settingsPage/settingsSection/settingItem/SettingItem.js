import React from 'react';
import PropTypes from 'prop-types';
import Switcher from '../../../../components/switcher/Switcher';
import NumberPicker from '../../../../components/numberPicker/NumberPicker';

import './SettingItem.scss';

const Setting = ({
  settingInfo, settingSectionName, handleChange,
}) => {
  const {
    id, name, value, isChecked, isRequired,
  } = settingInfo;

  const classNameModifier = name.replace(/\s/g, '-').toLowerCase();

  const inputElement = (settingSectionName === 'education')
    ? (
      <NumberPicker
        standardInputValue={value}
        inputId={classNameModifier}
        handleChange={handleChange.handleInputChange}
      />
    )
    : (
      <Switcher
        parrentClassName="settings__section__item"
        switcherId={id}
        isChecked={isChecked}
        isRequired={isRequired}
        onChange={handleChange.handleSwitcherToggle}
      />
    );

  return (
    <div className={`settings__section__item settings__section__item--${classNameModifier}`}>
      <p className="settings__section__item__title">{name}</p>
      {inputElement}
    </div>
  );
};

Setting.propTypes = {
  settingInfo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number,
    isChecked: PropTypes.bool,
    isRequired: PropTypes.bool,
  }).isRequired,
  settingSectionName: PropTypes.string.isRequired,
  handleChange: PropTypes.objectOf(PropTypes.func).isRequired,
};

export default Setting;
