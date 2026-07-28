import './CategoryDisplayOption.css';
import React from 'react';
import { useState } from 'react';
import { ProductAttributeResultType, ProductCategoryAttributeType } from 'src/api/models';
import { uniqueId } from 'lodash';
import Input from 'src/components/Input';
import styled from 'styled-components';
import SelectBoxComponent from 'src/components/SelectBoxComponent/SelectBoxComponent';

interface IDisplayOptionRow extends ProductCategoryAttributeType {
  index: number;
  attributeList: ProductAttributeResultType[];
  onChangeTitle: (value: string) => void;
  onChangeName: (value: string) => void;
  onShowProduct: (value: number) => void;
  onShowProductSerial: (value: number) => void;
  onShowProductSerialDetail: (value: number) => void;
}

const DisplayOptionRow :  React.FC<IDisplayOptionRow> = (props) => {
  const {
    index,
    attributeList,
    onChangeTitle,
    onChangeName,
    isShowProduct,
    onShowProduct,
    isShowProductSerial,
    onShowProductSerial,
    isShowProductSerialDetail,
    onShowProductSerialDetail
  } = props;

  const [attributeTitle, setAttributeTitle] = useState(props.attributeTitle);
  const [attributeName, setAttributeName] = useState(props.attributeName);const [focusInput, setFocusInput] = useState(null);

  return (
    <tr key={uniqueId()} className={`${index % 2 == 0 ? 'even-row' : 'odd-row'}`}>
      <td>
        <StyledInput>
          <Input
            
            width='140px'
            require={true}
            disabled={false}
            value={attributeTitle}
            onChange={(value) => {
              setAttributeTitle(value);
              //onChangeTitle(value);
            }}
          />
        </StyledInput>
      </td>
      <td> 
        <StyledInput>
          <SelectBoxComponent
            width='fit-content'
            onChange={(value) => {
              setAttributeName(value);
              onChangeName(value);
            }}
            isDisable={false}
            placeholder={'Chọn loại sản phẩm'}
            
            value={attributeName}
            data={attributeList}
            valueType={'attributeName'}
            titleType={'attributeTitle'}
          />
        </StyledInput>
      </td>
      <td>
        <div style={{textAlign: 'center'}}>
          <input type="checkbox" disabled={false} checked={isShowProduct == 1} onChange={() => {
            onShowProduct(isShowProduct == 1? 0 : 1);
          }}/>
        </div>
      </td>
      <td>
        <div style={{textAlign: 'center'}}>
          <input type="checkbox" disabled={false} checked={isShowProductSerial == 1} onChange={() => {
              onShowProductSerial(isShowProductSerial == 1? 0 : 1);
          }}/>
        </div>
      </td>
      <td>  
        <div style={{textAlign: 'center'}}>
          <input type="checkbox" disabled={false} checked={isShowProductSerialDetail == 1} onChange={() => {
              onShowProductSerialDetail(isShowProductSerialDetail == 1? 0 : 1);
          }}/>
        </div>
      </td>
      <td>
      <div style={{textAlign: 'center', color: '#f13838'}}>
          <span className="material-icons">delete</span>
        </div>
      </td>
    </tr>
  )

}



export default DisplayOptionRow;

const StyledInput = styled.div`
  background: white;
  border-radius: 5px;
`;