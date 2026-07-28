import React, { useState } from 'react';
import { ProductAttributeResultType, ProductCategoryAttributeType } from 'src/api/models';
import './DisplayConfigComponent.css';

export interface IDisplayConfigComponent {
  index: number;
  onDeleteDisplayConfigComponent: (...args: any[]) => any;
  onChangeAttribute: (...args: any[]) => any;
  attributeList: ProductAttributeResultType[];
  value: ProductCategoryAttributeType;
  productCategoryId: number;
}

const DisplayConfigComponent: React.FC<IDisplayConfigComponent> = (props) => {
  //State
  const [attributeTitle, setAttributeTitle] = useState(props.value.attributeTitle);
  const [attributeTitleError, setAttributeTitleError] = useState(null);

  const [attributeName, setAttributeName] = useState(props.value.attributeName);
  const [isShowProduct, setIsShowProduct] = useState(props.value.isShowProduct);
  const [isShowProductSerial, setIsShowProductSerial] = useState(
    props.value.isShowProductSerial,
  );
  const [isShowProductSerialDetail, setIsShowProductSerialDetail] = useState(
    props.value.isShowProductSerialDetail,
  );

  const [focusInput, setFocusInput] = useState(null);
  //End of state

  //Function
  const onDelete = () => {
    props.onDeleteDisplayConfigComponent(props.index);
  };

  const validateAttributeTitle = () => {
    let isContinue = true;

    if (!attributeTitle || attributeTitle == '') {
      isContinue = false;
      setAttributeTitleError('Chưa nhập tiêu đề');
    } else setAttributeTitleError(null);

    return isContinue;
  };

  //Component
  //1
  const attributeTitleInput = () => {
    return (
      <div className="mb-2 dis-config-wrapper">
        <div
          className={`add-product-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            attributeTitle ? 'validate-input' : ''
          }`}
        >
          <div className="add-product-order-input-title">Tiêu đề</div>
          <input
            type="text"
            value={attributeTitle}
            onChange={(event) => {
              setAttributeTitle(event.target.value);
              const temp: ProductCategoryAttributeType = {
                productCategoryId: props.productCategoryId,
                attributeTitle: event.target.value,
                attributeName: attributeName,
                isShowProduct: isShowProduct,
                isShowProductSerial: isShowProductSerial,
                isShowProductSerialDetail: isShowProductSerialDetail,
              };
              props.onChangeAttribute(temp, props.index);
            }}
            onFocus={() => {
              setFocusInput(1);
            }}
            onBlur={() => {
              validateAttributeTitle();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{attributeTitleError}</div>
      </div>
    );
  };

  const attributeNameComponent = () => {
    return (
      <div>
        <select
          value={attributeName}
          className="sim-price-detail-option config mt-0"
          onChange={(event) => {
            const temp: ProductCategoryAttributeType = {
              productCategoryId: props.productCategoryId,
              attributeTitle: attributeTitle,
              attributeName: event.target.value,
              isShowProduct: isShowProduct,
              isShowProductSerial: isShowProductSerial,
              isShowProductSerialDetail: isShowProductSerialDetail,
            };
            props.onChangeAttribute(temp, props.index);
            setAttributeName(event.target.value);
            event.preventDefault();
          }}
        >
          <option value={'default'}>Tiêu đề</option>
          {props.attributeList
            ? props.attributeList.map((value) => {
                return <option value={value.attributeName}>{value.attributeTitle}</option>;
              })
            : null}
        </select>
      </div>
    );
  };

  const isShowProductComponent = () => {
    return (
      <div>
        <select
          value={isShowProduct}
          className="sim-price-detail-option config mt-0"
          onChange={(event) => {
            const temp: ProductCategoryAttributeType = {
              productCategoryId: props.productCategoryId,
              attributeTitle: attributeTitle,
              attributeName: attributeName,
              isShowProduct: Number(event.target.value),
              isShowProductSerial: isShowProductSerial,
              isShowProductSerialDetail: isShowProductSerialDetail,
            };
            props.onChangeAttribute(temp, props.index);
            setIsShowProduct(Number(event.target.value));
            event.preventDefault();
          }}
        >
          <option value={0}>Không</option>
          <option value={1}>Có</option>
        </select>
      </div>
    );
  };

  const isShowProductSerialComponent = () => {
    return (
      <div>
        <select
          value={isShowProductSerial}
          className="sim-price-detail-option config mt-0"
          onChange={(event) => {
            const temp: ProductCategoryAttributeType = {
              productCategoryId: props.productCategoryId,
              attributeTitle: attributeTitle,
              attributeName: attributeName,
              isShowProduct: isShowProduct,
              isShowProductSerial: Number(event.target.value),
              isShowProductSerialDetail: isShowProductSerialDetail,
            };
            props.onChangeAttribute(temp, props.index);
            setIsShowProductSerial(Number(event.target.value));
            event.preventDefault();
          }}
        >
          <option value={0}>Không</option>
          <option value={1}>Có</option>
        </select>
      </div>
    );
  };

  const isShowProductSerialDetailComponent = () => {
    return (
      <div>
        <select
          value={isShowProductSerialDetail}
          className="sim-price-detail-option config mt-0"
          onChange={(event) => {
            const temp: ProductCategoryAttributeType = {
              productCategoryId: props.productCategoryId,
              attributeTitle: attributeTitle,
              attributeName: attributeName,
              isShowProduct: isShowProduct,
              isShowProductSerial: isShowProductSerial,
              isShowProductSerialDetail: Number(event.target.value),
            };
            props.onChangeAttribute(temp, props.index);
            setIsShowProductSerialDetail(Number(event.target.value));
            event.preventDefault();
          }}
        >
          <option value={0}>Không</option>
          <option value={1}>Có</option>
        </select>
      </div>
    );
  };
  //End of component

  //Main
  return (
    <tr>
      <td>{attributeTitleInput()}</td>
      <td>{attributeNameComponent()}</td>
      <td>{isShowProductComponent()}</td>
      <td>{isShowProductSerialComponent()}</td>
      <td>{isShowProductSerialDetailComponent()}</td>
      <td>
        <button
          className="dashboard_button_child"
          onClick={() => {
            onDelete();
          }}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default DisplayConfigComponent;
