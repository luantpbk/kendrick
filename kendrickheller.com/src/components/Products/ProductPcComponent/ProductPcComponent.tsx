import './ProductPcComponent.css';
import React, { useState, useEffect } from 'react';
import {
  CategoryAttributeType,
  ProductType,
  EnumDataType,
} from 'src/api/models';
import { useAddPopup, useInsertCart, useGetCart, useEditCart } from 'src/state/application/hooks';
import { useNavigate } from 'react-router-dom';
import Images from 'src/assets/img';
import { number2money } from 'src/utils/stringUtils';
import Option from 'src/components/OptionComponent/OptionComponent';
import { OptionExtraType, OptionType } from 'src/state/application/models';
import { useTranslation } from 'react-i18next';

interface IProductPcComponent {
  product: ProductType;
  isHorizontally?: boolean;
  configs: CategoryAttributeType[];
}

enum EnumBoolean {
  true = 1,
  false = 0,
}

const ProductPcComponent: React.FC<IProductPcComponent> = (props) => {
  //Value
  const navigate = useNavigate();
  const { product, isHorizontally, configs } = props;
  const cart = useGetCart();
  const { t, i18n } = useTranslation();
  //State
  const [options, setOptions] = useState<OptionExtraType[]>([]);
  const [descriptions, setDescriptions] = useState<CategoryAttributeType[]>([]);
  const [selecetedOption, setSelecetedOption] = useState<{ [name: string]: string }>({});
  // const [remain, setRemain] = useState<number>();
  const [price, setPrice] = useState<number>();


  //Function
  const insertCart = useInsertCart();
  const editCart = useEditCart();
  const addPopup = useAddPopup();

  const onCLickProduct = () => {
    const url = `/product-detail/${product.productId}`;
    navigate(url);
  };

  const onInsertCart = () => {
    if (product.isHiddenSerial && product.productId) {
      const strOption = JSON.stringify(selecetedOption);
      const cartItem = cart.find(c => c.productId == product.productId && c.option == strOption);
      // if (!remain || (remain - (cartItem?.quantity ?? 0) <= 0)) {
      //   addPopup({
      //     error: {
      //       title: "An error occurred.",
      //       message: 'The quantity selected in the shopping cart cannot exceed the quantity in stock!!',
      //     },
      //   });
      //   return;
      // }
      if (cartItem) {
        const nCartItem = { ...cartItem };
        nCartItem.quantity++;
        console.log(nCartItem)
        editCart(nCartItem);

      } else {
        insertCart({
          productId: product.productId,
          quantity: 1,
          option: strOption
        });
      }
      addPopup({
        txn: {
          success: true,
          summary: 'Add to your bag successfully!',
        },
      });
    }
  };
  //End of function


  //End of component
  useEffect(() => {

    const optionkey = options ? Object.entries(selecetedOption).map(([key, value]) => value).join("/") : undefined;
    // const remain = optionkey ? product?.optionRemain && Object.prototype.hasOwnProperty.call(product.optionRemain, optionkey) ? product.optionRemain[optionkey] : 0 : (product?.stockRemainQuantity ?? 0);
    const price = optionkey && product?.optionPrice && Object.prototype.hasOwnProperty.call(product.optionPrice, optionkey) ? product.optionPrice[optionkey] : product?.price;
    // setRemain(remain);
    setPrice(price)
  }, [options, selecetedOption, product])



  useEffect(() => {
    if (configs && configs.length > 0) {
      const nOptions = [];
      const nSelectedOption = {};
      configs.filter(c => c.isShowProduct == EnumBoolean.true && c.attribute.attributeType == EnumDataType.Option)
        .map(config => {
          const value = product ? eval(`product?.${config.attributeName}??''`) : undefined;
          if (value) {
            const option = JSON.parse(value) as OptionType;
            const optionExtra: OptionExtraType = {
              ...option,
              name: config.attributeName,
              title: config.attributeTitle
            };
            nOptions.push(optionExtra);
            nSelectedOption[config.attributeName] = option.values[0];
          }
        });

      setOptions(nOptions);
      setSelecetedOption(nSelectedOption);
      setDescriptions(configs.filter(c => c.isShowProduct == EnumBoolean.true && c.attribute.attributeType == EnumDataType.Text));
    }

  }, [product, configs]);

  //Main
  return (
    <div className={`product-pc-cpn-container ${isHorizontally ? 'horizontally' : 'resize'}`}>
      <div className={`product-pc-cpn-img ${isHorizontally ? 'horizontally' : 'resize'}`} onClick={onCLickProduct}>
        <img src={product.thumbAvatar ?? Images.noimage} alt="avatar" />
      </div>
      <div className="product-pc-cpn-des">
        <div className="product-pc-cpn-des-top" onClick={onCLickProduct}>
          <div className="product_des_pc_name">{t(product.productName)}</div>
          {descriptions.map((config, index) => {
            return <div key={`productdesconfig${index}`} className="product_des_pc_config" title={t(product[config.attributeName])}>{t(product[config.attributeName])}</div>;
          })}

        </div>
        <div className='products-option-content'>
          {options.map((option, index) => {
            return (
              <Option key={`productcpnoption${index}`}
                onChange={(value) => {
                  const nSelecetedOption = { ...selecetedOption };
                  nSelecetedOption[option.name] = value;
                  setSelecetedOption(nSelecetedOption);
                }}
                data={option.values}
                value={selecetedOption[option.name]}
              />
            )
          })}
        </div>
        <div className="product-pc-cpn-des-bottom">
          <div className="product_price_pc_container" onClick={onCLickProduct}>
            {product.discountPercent ? <div className="product_pc_price_discount">
              {number2money(Math.round((price / (100 - product.discountPercent)) * 100))}
            </div> : null}
            <div className="product_pc_price">{number2money(price)}</div>
          </div>
          <div className="product-pc-cpn-btn" onClick={onInsertCart}>{t("Buy now")}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductPcComponent;
