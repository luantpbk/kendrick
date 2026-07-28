import { toString } from 'lodash';
import React from 'react';
import './InfoBody.css';

interface IProduct {
  title: string;
  img_src: string;
  name: string;
  oldprice: number;
  newprice: number;
  rating: number;
  total_rating: number;
}

const InfoBody: React.FC<IProduct> = (props) => {
  function ConvertToVND(a: number): string {
    const VND = toString(a);
    let b = '';
    let length = VND.length;

    for (length; length - 3 > 0; length -= 3) {
      b = '.' + VND.slice(length - 3, length) + b;
    }
    b = VND.slice(0, length) + b;
    return b;
  }

  return (
    <div className="product-container col-xl-2 col-lg-3 col-md-4 col-5 p-md-2 p-1 m-md-2 m-1">
      <a href="#">
        <p className="product-title mb-5">{props.title}</p>
        <div className="product-img mb-4">
          <img src={props.img_src} alt="product" />
        </div>
        <p className="product-name m-0"> {props.name} </p>
        <div className="old-price">
          <span> {ConvertToVND(props.oldprice)} </span> &nbsp;
          <span className="old-price-percent">
            {' '}
            {'-' + Math.round(100 - (props.newprice / props.oldprice) * 100) + '%'}{' '}
          </span>
        </div>
        <b className="new-price m-0"> {ConvertToVND(props.newprice)} </b>
        <div className="product-rating mb-5 ">
          <span> {props.rating} </span>
          <span> {props.total_rating} </span>
        </div>
      </a>
    </div>
  );
};

export default InfoBody;
