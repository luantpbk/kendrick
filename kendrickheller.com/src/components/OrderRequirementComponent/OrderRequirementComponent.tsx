import { nanoid } from '@reduxjs/toolkit';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  EnumOrderRequirementProgressStatus,
  OrderRequirementType,
} from 'src/api/models';
import { number2money } from 'src/utils/stringUtils';
import CartItem from '../CartItem/CartItem';
import './OrderRequirementComponent.css';
import { useTranslation } from 'react-i18next';

interface IOrderRequirementComponent {
  data: OrderRequirementType;
}

const OrderRequirementComponent: React.FC<IOrderRequirementComponent> = (props) => {
  //Value
  const { data } = props;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  //State
  const [totalMoney, setTotalMoney] = useState(0);

  useEffect(() => {
    const subTotal = data.orderRequirementDetails.reduce((total, detail) => total += detail?.price ?? 0 * detail?.quantity ?? 0, 0);
    setTotalMoney(subTotal + (data.shipFee ?? 0));
  }, [data.orderRequirementDetails, data.shipFee]);

  //Main
  return (
    <div
      className={`order-requirement-wrapper`}
      onClick={() => {
        const url = `/order-requirement/${data.orderRequirementId}`;
        window.scrollTo(0, 0);
        navigate(url);
      }}
    >
      <div className="od-header">
        <div className="od-header-status">
          <div>{data.receiverFullname}</div>
          {data.progressStatus == EnumOrderRequirementProgressStatus.Unpaid ? (
            <div style={{ color: 'orange' }}>
              <i className="fas fa-spinner"></i>&ensp;
              {t(EnumOrderRequirementProgressStatus[EnumOrderRequirementProgressStatus.Unpaid])}
            </div>
          ) : data.progressStatus == EnumOrderRequirementProgressStatus.Paid ? (
            <div style={{ color: 'blue' }}>
              <i className="fas fa-check-circle"></i>&ensp;
              {t(EnumOrderRequirementProgressStatus[EnumOrderRequirementProgressStatus.Paid])}
            </div>
          ) : data.progressStatus == EnumOrderRequirementProgressStatus.Shipping ? (
            <div style={{ color: 'green' }}>
              <i className="fas fa-shipping-fast"></i>&ensp;
              {t(EnumOrderRequirementProgressStatus[EnumOrderRequirementProgressStatus.Shipping])}
            </div>
          ) : data.progressStatus == EnumOrderRequirementProgressStatus.Done ? (
            <div style={{ color: 'green' }}>
              <i className="fas fa-clipboard-check"></i>&ensp;
              {t(EnumOrderRequirementProgressStatus[EnumOrderRequirementProgressStatus.Done])}
            </div>
          ) : data.progressStatus == EnumOrderRequirementProgressStatus.Error ? (
            <div style={{ color: 'red' }}>
              <i className="fas fa-exclamation"></i>&ensp;
              {t(EnumOrderRequirementProgressStatus[EnumOrderRequirementProgressStatus.Error])}
            </div>
          ) : null}
        </div>
        {data?.orderRequirementDetails?.length > 0 ? data.orderRequirementDetails.map((detail, index) => {
          return (
            <CartItem
              key={`cartitem${index}`}
              cartItem={{
                productId: detail.productId,
                quantity: detail.quantity,
                option: detail.option,
                key: nanoid(),
                price: detail.price
              }}
              product={detail.product}
              isDisable={true}
            />
          );
        }) : null}
      </div>
      <div className="od-bottom">
        {t("Total")}:&ensp;
        <div className="od-prd-child-price">
          {number2money(totalMoney)}
        </div>
      </div>
    </div>
  );
};

export default OrderRequirementComponent;
