import React, { useState, useEffect } from 'react';
import {
  OptionType,
} from 'src/api/models';
import SelectBoxComponent from '../SelectBoxComponent/SelectBoxComponent';
import './UpdateStatus.css';

interface IUpdateStatus {
  listStatus: OptionType[];
  postProcess?: (...args: any[]) => void;
  title: string;
}

const UpdateStatus: React.FC<IUpdateStatus> = (props) => {
 
  const {listStatus, postProcess, title} = props;
  const [value, setValue] = useState();
  useEffect(() => {
    if(listStatus && listStatus.length > 0) setValue(listStatus[0].value);
  })
  //Main
  return (
    <div className="update-status-container">
      <div className="update-status-title">{title}</div>
      <div className='update-status-row'>
        <SelectBoxComponent
          width='100%'
          require={true}
          onChange={(value) => {
            setValue(value);
          }}
          isDisable={false}
          placeholder={title}
          value={value}
          data={listStatus}
          valueType={'value'}
          titleType={'title'}
          blockUndefined={true}
        />
      </div>
      <div>
        <button
          className="btn-update-status"
          onClick={postProcess}
        >
          <span className="material-icons btn-content">save</span><label className='btn-content'>LƯU</label>
        </button>
      </div>
    </div>
  );
};



export default UpdateStatus;
