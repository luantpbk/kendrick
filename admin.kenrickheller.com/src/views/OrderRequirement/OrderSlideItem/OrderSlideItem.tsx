import React, { useState, useEffect } from 'react';
import {
  OrderRequirementDetailsItemType,
  ProductSerialType,
  ProductType,
} from 'src/api/models';
import { useGetProductById } from 'src/api/productApi';
import { useGetProductSerialById } from 'src/api/productSerialApi';
import './OrderSlideItem.css';

interface IOrderSlideItem {
  data: OrderRequirementDetailsItemType;
  index: number;
}

const OrderSlideItem: React.FC<IOrderSlideItem> = (props) => {
  //Value
  const data = props.data;

  //State
  const [product, setProduct] = useState<ProductType>(null);
  const [productSerial, setProductSerial] = useState<ProductSerialType>(null);

  //Function
  const getProductSerialById = useGetProductSerialById();
  const getProductById = useGetProductById();

  useEffect(() => {
    if (data.productSerialId) {
      getProductSerialById(data.productSerialId)
        .then((data) => {
          setProductSerial(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      getProductById(data.productId)
        .then((r) => {
          setProduct(r);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [data.productId, data.productSerialId, getProductById, getProductSerialById]);

  //Main
  return product ? (
    <div className="order-slide-item-container">
      <div className="slide-sim-order-item-count">{props.index + 1}.</div>
      <div className="slide-item-image">
        <img src={product.thumbAvatar} alt="avatar" />
      </div>
      <div className="slide-item-detail">
        <div>
          <div className="order-slide-item-title">{product.productName}</div>
          <div className="slide-item-des">
            <span>ProductCode:</span> {product.productCode}
          </div>
        </div>
        <div className="slide-item-imei-container">
          <div style={{ marginRight: 10, fontWeight: 500 }}>Số lượng:</div>
          {data.quantity}
        </div>
      </div>
    </div>
  ) : productSerial ? (
    <div className="order-slide-item-container">
      <div className="slide-sim-order-item-count">{props.index + 1}.</div>
      <div className="slide-item-image">
        <img src={productSerial.thumbAvatar} alt="avatar" />
      </div>
      <div className="slide-item-detail">
        <div>
          <a
            href={`https://jvscorp.jp/product-detail/${productSerial.productId}`}
            target="_blank"
          >
            <div className="order-slide-item-title">{productSerial.productName}</div>
          </a>
        </div>
        <div className="slide-item-imei-container">
          <div style={{ marginRight: 10, fontWeight: 500 }}>Số lượng:</div>
          {data.quantity}
        </div>
      </div>
    </div>
  ) : null;
};

export default OrderSlideItem;
