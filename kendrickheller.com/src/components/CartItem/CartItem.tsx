/* eslint-isDisable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import './CartItem.css';
import { number2money } from 'src/utils/stringUtils';
import { CartItemType, OptionExtraType, OptionType } from 'src/state/application/models';
import { ProductType } from 'src/api/models';
import Option from '../OptionComponent/OptionComponent';
import Images from 'src/assets/img';

interface ICartItem {
  cartItem: CartItemType;
  product: ProductType;
  isDisable?: boolean;
  onDelete?: (...args: any[]) => any;
  onChange?: (...args: any[]) => any;
}

const CartItem: React.FC<ICartItem> = (props) => {
  //Value

  const { cartItem, product, onDelete, onChange, isDisable } = props;

  const [selecetedOption, setSelecetedOption] = useState<{ [name: string]: string }>({});
  const [options, setOptions] = useState<OptionExtraType[]>([]);
  const [productName, setProductName] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const [price, setPrice] = useState<number>();



  const onMinusQuantity = () => {
    if (cartItem.quantity > 1) {
      const nCartItem = { ...cartItem };
      nCartItem.quantity--;
      onChange(nCartItem);
    } else {
      onDelete(cartItem);
    }
  };

  const onPlusQuantity = () => {
    const nCartItem = { ...cartItem };
    nCartItem.quantity++;
    onChange(nCartItem);
  };

  const onChangeQuantity = (value: string) => {
    const quantity = Number(value);
    if (!isNaN(quantity)) {
      const nCartItem = { ...cartItem };
      nCartItem.quantity == quantity;
      onChange(nCartItem);
    }
  };

  const onChangeOption = (option: string) => {
    const nCartItem = { ...cartItem };
    nCartItem.option = option;
    onChange(nCartItem);
  };

  useEffect(() => {
    let avatar = product?.thumbAvatar;
    let images = product?.images ?? [];
    let isOption = false;
    if (cartItem.option) {
      const option = JSON.parse(cartItem.option) as { [key: string]: string };
      const nOptions = [];
      Object.entries(option).forEach(([key, value]) => {
        if (product && product[key]) {
          const optionAttribute = JSON.parse(product[key]) as OptionType;
          if (optionAttribute?.images && optionAttribute?.images[value]?.length > 0) {
            images = images.filter(image => optionAttribute.images[value].some(i => i == image.fileId));
            isOption = true;
          }
          const optionExtra: OptionExtraType = {
            ...optionAttribute,
            name: key
          };
          nOptions.push(optionExtra);
        }
      })
      if (isOption && images.length > 0) avatar = images[0].thumbUrl;
      setOptions(nOptions)
      setSelecetedOption(option);
    }
    setProductName(product?.productName);
    setPrice(cartItem?.price != undefined ? cartItem?.price : product?.price);
    setAvatar(avatar);


  }, [cartItem.option, product])

  //Main
  return (
    <div className='cartitem-container'>
      <img className='cartitem-image' src={avatar ?? Images.noimage} />
      <div className='cartitem-content'>
        <div className='cartitem-name'><label title={productName}>{productName}</label> <label className='cart-price' title={number2money(price)}>{number2money(price)}</label></div>
        <div className='cartitem-option'>
          {options.map((option, index) => {
            return (
              <Option key={`cartitemoption${index}`}
                isDisable={isDisable}
                onChange={isDisable ? undefined : (value: string) => {
                  const nSelecetedOption = { ...selecetedOption };
                  nSelecetedOption[option.name] = value;
                  onChangeOption(JSON.stringify(nSelecetedOption));
                }}
                data={option.values}
                value={selecetedOption[option.name]}
              />
            )
          })}
        </div>
        <div className='cartitem-action'>
          <div className='cartitem-action-quantity'>
            <span className="material-icons" onClick={isDisable ? undefined : onMinusQuantity}>remove</span>
            <input value={cartItem.quantity} disabled={isDisable} onChange={(e) => onChangeQuantity(e.target.value)} />
            <span className="material-icons" onClick={isDisable ? undefined : onPlusQuantity}>add</span>
          </div>

          {!isDisable ? <div className="cartitem-remove" onClick={() => onDelete(cartItem)}>remove</div> : null}
        </div>


      </div>


    </div>
  );
};

export default CartItem;
