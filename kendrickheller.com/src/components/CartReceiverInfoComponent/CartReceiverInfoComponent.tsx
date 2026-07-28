import React from 'react';
import { ReceiverInfoType } from 'src/api/models';
import './CartReceiverInfoComponent.css';

interface ICartReceiverInfoComponent {
  data: ReceiverInfoType;
  checked: boolean;
  checkFunc: () => void;
}

const CartReceiverInfoComponent: React.FC<ICartReceiverInfoComponent> = (props) => {
  //Value
  const data = props.data;

  //Main
  return (
    <div
      className={`receiver-info-wrapper ${props.checked ? 'active' : ''}`}
      onClick={props.checkFunc}
    >
      <div className="receiver-info-row">
        <i className='fas fa-user' /><label>{data.fullname}</label>
      </div>
      <div className="receiver-info-row">
        <i className='fas fa-phone' /><label>{data.phoneNumber}</label>
      </div>
      <div className="receiver-info-row">
        <i className='fas fa-map-marked-alt' />
        <label>
          {data.address1}{data.address2 ? `, ${data.address2}` : ''}{data.address3 ? `, ${data.address3}` : ''}{data.address4 ? `, ${data.address4}` : ''}
        </label>
      </div>
      <div className="receiver-info-row">
        <i className='fab fa-facebook-f' /><label>{data.facebook}</label>
      </div>
    </div>
  );
};

export default CartReceiverInfoComponent;
