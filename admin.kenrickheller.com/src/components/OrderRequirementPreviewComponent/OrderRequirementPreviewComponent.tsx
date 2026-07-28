import React, { useState, useEffect } from 'react';
import { OrderRequirementDetailsItemType } from 'src/api/models';
import useModal from 'src/hooks/useModal';

import { useAddPopup } from 'src/state/application/hooks';
import './OrderRequirementPreviewComponent.css';
import FullSizeImage from '../FullSizeImage/FullSizeImage';
import { number2money } from 'src/utils/numberUtils';

interface IProductOrderPreviewComponent {
  isAdmin: boolean;
  isDisable: boolean;
  detail: OrderRequirementDetailsItemType;
  onMinusQuantity: () => void;
  onChangeQuantity: (quantity: number) => void;
  onChangeExtraAmount: (extraAmount: number) => void;
  onPlusQuantity: () => void;
  onDelete: () => void;
  onChangePrice: (price: number) => void;
  currentSoldQuantity: number;
}

const OrderRequirementPreviewComponent: React.FC<IProductOrderPreviewComponent> = (props) => {
  const {
    isAdmin,
    isDisable,
    detail,
    onMinusQuantity,
    onChangeQuantity,
    onPlusQuantity,
    onChangeExtraAmount,
    onDelete,
    onChangePrice,
    currentSoldQuantity,
  } = props;

  const addPopup = useAddPopup();

  const fullsizeModal = useModal(FullSizeImage, undefined, false);

  //Main
  return (
    <div className={`od-requirement-pre-container`}>
      <img
        className="od-pre-img"
        src={detail.product?.avatar}
        alt="avatar"
        onClick={() => {
          fullsizeModal.handlePresent({
            images: detail.product?.images,
            index: 0,
            hidden: fullsizeModal.handleDismiss,
          });
        }}
      />
      <div className="od-requirement-pre-content">
        <div>
          <b>{detail.product?.productName}</b>
        </div>
        <div className="od-requirement-pre-action">
          <div className="od-requirement-pre-quantity">
            <div className="od-requirement-pre-change-quantity">
              <span
                className="material-icons"
                onClick={
                  isDisable
                    ? undefined
                    : () => {
                        if (detail.quantity > 1) {
                          onMinusQuantity();
                        } else {
                          onDelete();
                        }
                      }
                }
              >
                remove
              </span>
              <input
                disabled={isDisable}
                value={detail.quantity}
                type="number"
                onChange={(e) => {
                  const quantity = Number(e.target.value);
                  if (quantity > 0) {
                    onChangeQuantity(quantity);
                  }
                }}
              />
              <span
                className="material-icons"
                onClick={isDisable ? undefined : () => onPlusQuantity()}
              >
                add
              </span>
            </div>
            <label> {` / ${currentSoldQuantity}`}</label>
          </div>
          {!isDisable && (
            <div
              className="od-requirement-pre-remove"
              onClick={isDisable ? undefined : () => onDelete()}
            >
              remove
            </div>
          )}
        </div>
        <div className="od-requirement-pre-change-price">
          {isAdmin ? (
            <input
              disabled={isDisable}
              value={detail.price ?? 0}
              type="number"
              onChange={(e) => onChangePrice(Number(e.target.value))}
            />
          ) : (
            <div>{number2money(detail.price ?? 0)}</div>
          )}
          <div>{' + '}</div>
          <input
            disabled={isDisable}
            value={detail.extraAmount ?? 0}
            type="number"
            onChange={(e) => onChangeExtraAmount(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderRequirementPreviewComponent;
