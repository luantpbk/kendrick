import './Cart.css';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  useRemoveCart,
  useGetCart,
  useEditCart,
} from 'src/state/application/hooks';
import { CartItemType } from 'src/state/application/models';
import { number2money } from 'src/utils/stringUtils';
import { useGetListProductByIds } from 'src/api/backend-api';
import CartItem from '../CartItem/CartItem';
import { ProductType } from 'src/api/models';
import { useTranslation } from 'react-i18next';

const Cart = (_, ref) => {
  //Value
  const cart = useGetCart();
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<{ [key: string]: ProductType }>({});
  const [totalMoney, setTotalMoney] = useState(0);

  //End of state

  //Function
  const removeCart = useRemoveCart();
  const editCart = useEditCart();
  const getListProductByIds = useGetListProductByIds();

  useImperativeHandle(ref, () => ({
    getSubTotal: () => {
      return totalMoney;
    }
  }))


  useEffect(() => {
    const productIds = cart.map(c => c.productId);
    let total = 0;
    getListProductByIds(productIds).then(res => {
      const removeItems = cart.filter(c => !res.some(p => p.productId == c.productId));
      if (removeItems.length > 0) removeCart(removeItems);
      const map: { [key: string]: ProductType } = {};
      cart.forEach(item => {
        const product = res.find(p => p.productId == item.productId);
        map[item.key] = product;
        total += product.price ?? 0 * item.quantity;
      })
      setProducts(map);
      setTotalMoney(total);
    });

  }, [cart, getListProductByIds, removeCart])

  const onDeleteItem = (cartItem: CartItemType) => {
    removeCart([cartItem]);
  };


  return (
    <div className="cart-container">

      {cart.length > 0 ?
        <>
          {cart.map((item: CartItemType, index: number) => {
            return (
              <CartItem
                key={`cartitem${index}`}
                cartItem={item}
                product={products[item.key]}
                onChange={editCart}
                onDelete={onDeleteItem}
              />
            );
          })}
          {totalMoney > 0 && <div className='total-money'>
            <label>{t("Subtotal")}</label><span>{number2money(totalMoney)}</span>
          </div>}
        </> :
        <div className="empty-cart-cls text-center">
          <div><span className="material-icons">remove_shopping_cart</span></div>
          <label>{t("Your cart is empty")}</label>
          <div><i>"{t("Wishing you all the best!")}"</i></div>
        </div>}
    </div>
  );

};

export default forwardRef(Cart);
