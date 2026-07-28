import './SimpleParameter.css';
import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import { DataTypeList, EnumDataType, HtmlSimpleParameterType } from 'src/api/models';
import Input from '../Input';
import SelectBoxComponent from '../SelectBoxComponent/SelectBoxComponent';

interface ISimpleParameter {
  simpleParameters: HtmlSimpleParameterType[];
  onChange: (value: HtmlSimpleParameterType[]) => void;
}

const SimpleParameter: React.FC<ISimpleParameter> = (props) => {
  const {simpleParameters, onChange} = props;

  return (
    <div className="simple-param-container">
      <div className="simple-param">
        <div className="simple-param-component title">ParameterName</div>
        <div className="simple-param-component title">Description</div>
        <div className="simple-param-component title">DataType</div>
        <div className="email-template-btn-component title"></div>
      </div>
      {simpleParameters?.map((row: HtmlSimpleParameterType, index: number) => {
        return (
          <div className="simple-param" key={`simple-param-${index}`}>
            <div className="simple-param-component">
              <Input
                require={false}
                disabled={false}
                value={row.parameterName}
                onChange={(value) => {
                  row.parameterName = value;
                  onChange([...simpleParameters]);
                }}
              />
            </div>
            <div className="simple-param-component">
              <Input
                require={false}
                disabled={false}
                value={row.description}
                onChange={(value) => {
                  row.description = value;
                  onChange([...simpleParameters]);
                }}
              />
            </div>
            <div className="simple-param-component">
              <SelectBoxComponent
                require={false}
                onChange={(value) => {
                  row.dataType = value;
                  onChange([...simpleParameters]);
                }}
                isDisable={false}
                value={row.dataType}
                data={DataTypeList}
                valueType={'value'}
                titleType={'title'}
              />
            </div>
            <div
              className="email-template-btn-component title"
              onClick={() => {
                onChange(simpleParameters.filter(r => r != row));
              }}
            >
              <i className="fas fa-trash"></i>
            </div>
          </div>
        );
      })}
      <div className="simple-param">
        <div className="email-template-add-btn" onClick={() => {
          onChange([...simpleParameters, {dataType: EnumDataType.Text, parameterName: undefined, description: undefined}]);
        }}>
          Add
        </div>
      </div>
    </div>
  );
};

export default SimpleParameter;
