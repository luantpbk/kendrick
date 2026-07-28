import React, { useState } from 'react';
import { ProductCategoryAttributeType } from 'src/api/models';
import './AddProductInput.css';

interface IAddProductInput {
  data: ProductCategoryAttributeType;
  isDisable: boolean;
  onAddInput: (...args: any[]) => any;
  value?: any;
}

const AddProductInput: React.FC<IAddProductInput> = (props) => {
  //State
  const [focusInput, setFocusInput] = useState(null);
  const [value, setValue] = useState(props.value[props.data.attributeName]);

  return (
    <div className="add-product-child">
      <div
        className={`product_detail_input ${focusInput == 1 ? 'focus-input' : ''} ${
          value ? 'validate-input' : ''
        }`}
      >
        <div className="product_detail_input-title">{props.data.attributeTitle}</div>
        <input
          type="text"
          value={value}
          onChange={(event) => {
            props.onAddInput(props.data.attributeName, event.target.value);
            setValue(event.target.value);
          }}
          onFocus={() => {
            setFocusInput(1);
          }}
          onBlur={() => {
            setFocusInput(null);
          }}
          autoFocus={focusInput == 1}
          disabled={props.isDisable}
        />
      </div>
    </div>
  );

};

export default AddProductInput;
