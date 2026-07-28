import React, { useState } from 'react';
import { BusinessType } from 'src/api/models';
import './ChooseBusinessDetail.css';

interface IChooseBusinessDetail {
  onChange: (...args: any[]) => any;
  businessTypeList: BusinessType[];
  businessType: number;
}

const ChooseBusinessDetail: React.FC<IChooseBusinessDetail> = (props) => {
  //State
  const [businessType, setBusinessType] = useState(props.businessType);

  //Component
  const businessTypeOption = () => {
    return props.businessType ? (
      <>
        <select
          value={businessType.toString()}
          className="sim-price-detail-option"
          onChange={(event) => {
            if (Number(event.target.value) != 0) {
              setBusinessType(Number(event.target.value));
            }
            event.preventDefault();
          }}
        >
          <option value={0}>Loại hình kinh doanh</option>
          {props.businessTypeList
            ? props.businessTypeList.map((value) => {
                return <option value={value.businessType}>{value.businessTypeTitle}</option>;
              })
            : null}
        </select>
      </>
    ) : null;
  };

  //useEffect

  //Main
  return (
    <div className="sim-price-calendar-container sim-price">
      {businessTypeOption()}
      <div
        className="choose-detail-btn"
        onClick={() => {
          props.onChange(businessType);
        }}
      >
        Chọn
      </div>
    </div>
  );
};

export default ChooseBusinessDetail;
