import './ProductDetail.css';
import React from 'react';
import { useParams } from 'react-router';
import {
  useGetProductById,
  useGetProductGift,
  useGetStaticPageByKey,
} from 'src/api/backend-api';
import { useEffect, useState } from 'react';
import {
  CategoryAttributeType,
  ProductGiftType,
  ProductType,
  StaticPageType,
  CategoryType,
  EnumDataType,
  ImageType,
  EnumDisplayConfig,
} from 'src/api/models';
import {
  useAddPopup,
  useInsertCart,
  useGetCart,
  useEditCart,
  useNotifyChat,
  useGetProfileInfo,
} from 'src/state/application/hooks';
import {
  useGetCategoryDisplayOption,
  useGetProductCategoryById,
} from 'src/api/productCategoryApi';
import ProductBanner from 'src/components/ProductBanner/ProductBanner';
import { NavLink, useNavigate } from 'react-router-dom';
import { number2money } from 'src/utils/stringUtils';
import Products from 'src/components/Products/Products';
import { PageContainer, PageHeader } from 'src/components/GlobalStyled';
import { OptionExtraType, OptionType } from 'src/state/application/models';
import { useGetConsulationRoom } from 'src/api/roomApi';
import { useTranslation } from 'react-i18next';

enum EnumBoolean {
  true = 1,
  false = 0,
}

const ProductDetail: React.FC = () => {
  //Value
  const params = useParams<{ productId: string }>();
  const productId = Number(params.productId);
  const cart = useGetCart();

  const [listProductGift, setListProductGift] = useState<ProductGiftType[]>([]);

  const [product, setProduct] = useState<ProductType>();
  const [productCategory, setProductCategory] = useState<CategoryType>();

  const [staticPage, setStaticPage] = useState<StaticPageType>();
  // const [bodyCommit, setBodyCommit] = useState<StaticPageType>();
  const [bodyAddress, setBodyAddress] = useState<StaticPageType>();

  const [descriptions, setDescriptions] = useState<CategoryAttributeType[]>([]);
  const [options, setOptions] = useState<OptionExtraType[]>([]);
  const [selecetedOption, setSelecetedOption] = useState<{ [name: string]: string }>({});
  const [images, setImages] = useState<ImageType[]>([]);

  // const [remain, setRemain] = useState<number>();
  const [price, setPrice] = useState<number>();
  //End of state
  const { t, i18n } = useTranslation();

  //Function
  const getProductCategoryById = useGetProductCategoryById();
  const getProductById = useGetProductById();
  const getListConfig = useGetCategoryDisplayOption();
  const getProductGift = useGetProductGift();
  const addPopup = useAddPopup();
  const getStaticPageByKey = useGetStaticPageByKey();

  const notifyChat = useNotifyChat();
  const profile = useGetProfileInfo();
  const getConsulationRoom = useGetConsulationRoom();
  const navigate = useNavigate();
  const insertCart = useInsertCart();

  const editCart = useEditCart();

  const onInsertCart = () => {
    if (product.isHiddenSerial && product.productId) {
      const strOption = JSON.stringify(selecetedOption);
      const cartItem = cart.find(c => c.productId == product.productId && c.option == strOption);
      // console.log(remain);
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
        // console.log(nCartItem)
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


  //TODO


  useEffect(() => {
    getProductGift(productId).then((productGift) => setListProductGift(productGift));
    // getStaticPageByKey('BODY_COMMIT').then((bodyCommit) => setBodyCommit(bodyCommit));
    getStaticPageByKey('BODY_ADDRESS').then((bodyAddress) => setBodyAddress(bodyAddress));
  }, [getProductGift, getStaticPageByKey, productId]);

  useEffect(() => {
    getProductById(productId).then((product) => setProduct(product));
  }, [getProductById, productId]);

  useEffect(() => {
    if (product) {
      getProductCategoryById(product.productCategoryId.toString()).then((data) => setProductCategory(data));
      getListConfig(product.productCategoryId).then((configRes) => {
        setDescriptions(configRes.filter(c => c.isShowProductSerialDetail == EnumBoolean.true && (c.attribute.attributeType == EnumDataType.Text || c.attribute.attributeType == EnumDataType.HTML)));
        const nOptions = [];
        const nSelectedOption = {};
        configRes.filter(c => c.isShowProductSerialDetail == EnumBoolean.true && c.attribute.attributeType == EnumDataType.Option)
          .map(config => {
            const value = eval(`product?.${config.attributeName}??''`);
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
      });
      if (product.introContent !== '' && product.introContent !== null)
        getStaticPageByKey(product.introContent).then((staticPage) => setStaticPage(staticPage));
    }
  }, [getProductCategoryById, product, getListConfig, getStaticPageByKey]);


  useEffect(() => {
    const optionkey = options ? Object.entries(selecetedOption).map(([key, value]) => value).join("/") : undefined;
    // const remain = optionkey ? product?.optionRemain && Object.prototype.hasOwnProperty.call(product.optionRemain, optionkey) ? product.optionRemain[optionkey] : 0 : (product?.stockRemainQuantity ?? 0);
    const price = optionkey && product?.optionPrice && Object.prototype.hasOwnProperty.call(product.optionPrice, optionkey) ? product.optionPrice[optionkey] : product?.price;
    // setRemain(remain);
    setPrice(price)
    let lstImages = product?.images ?? [];
    options.forEach(option => {
      if (selecetedOption[option.name]
        && option.images
        && option.images[selecetedOption[option.name]]
        && option.images[selecetedOption[option.name]].length > 0) {
        lstImages = lstImages.filter(i => option.images[selecetedOption[option.name]].includes(i.fileId));
      }
    });
    setImages(lstImages);
  }, [product, options, selecetedOption])



  //Main
  return (
    <>
      <PageContainer>
        <PageHeader>
          <NavLink to={'/'}>{t("Home")}</NavLink>{` / `}
          <span>{t(productCategory?.productCategoryName)} </span>
          {product ? `/ ${t(product.productName)}` : ''}
        </PageHeader>
        <div className="product-detail-content">
          <ProductBanner listImages={images} startNumber={1} />
          <div className="product-detail-info">
            <div className='product-name'>{t(product?.productName)}</div>
            <div className="product-detail-price">
              {number2money(price)}
              {product?.discountPercent ? <span className="product_price_discount">
                {number2money(Math.round((price / (100 - product.discountPercent)) * 100))}
              </span> : null}
            </div>

            {options.map((option, index) => {
              return (
                <div key={`productdetailoption${index}`}>
                  <div>{t(option.title)}</div>
                  <div className='option-content'>
                    {option.values.map((value, index) => {
                      const lstImages = product?.images ?? [];
                      const img = option.images[value]?.length > 0 ? lstImages.find(i => option.images[value].includes(i.fileId)) : undefined;
                      return (
                        <div key={`optionvalue${index}`}
                          className={`option-value ${selecetedOption[option.name] == value ? 'option-active' : ''}`}
                          onClick={() => {
                            const nSelecetedOption = { ...selecetedOption };
                            nSelecetedOption[option.name] = value;
                            setSelecetedOption(nSelecetedOption);
                          }}
                        >
                          {img ? <><img src={img.thumbUrl} /><span>{t(value)}</span></> : <label>{t(value)}</label>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            })}

            {descriptions.map((config: CategoryAttributeType, index: number) => {
              const val = eval(`product?.${config.attributeName}??''`);
              if (!val) return null;
              
              return (
                <div key={`productdetailattribute${index}`} className="product-detail-top-child-container mt-4">
                  <div className="product-detail-title">{t(config.attributeTitle)}</div>
                  {config.attribute.attributeType === EnumDataType.HTML ? (
                    <div dangerouslySetInnerHTML={{ __html: t(val) }} />
                  ) : (
                    <div>{t(val)}</div>
                  )}
                </div>
              );
            })}

            {listProductGift.length > 0 ? (
              <div className="product-detail-promotion">
                <div className="box-promotion">
                  <i className="fas fa-gift"></i> &nbsp;
                  <span>{t("Gifts and promotions")}</span>
                </div>
                {listProductGift.map((_productGift: ProductGiftType) => {
                  return (
                    <div>
                      <input type="checkbox" checked />
                      <span> {t(_productGift.productGiftValue)} </span>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="product-detail-add-to-cart-container">
              <div
                className="btn-add-to-cart"
                onClick={() => {
                  onInsertCart();
                }}
              >
                <div>{t("ADD TO YOUR BAG")}</div>
                <div>{t("Delivery or pick up in store")}</div>
              </div>
              <div
                className="btn-add-to-cart"
                onClick={() => {
                  if (profile?.accessToken) {
                    getConsulationRoom().then((res) => {
                      notifyChat(res.roomId, {
                        name: product.productName,
                        description: descriptions.length > 0 ? eval(`product?.${descriptions[0].attributeName}??''`) : '',
                        url: product.thumbAvatar,
                        message: 'Please send me more information about this product',
                        functionId: EnumDisplayConfig.San_pham,
                        objectId: productId
                      });
                    });
                  } else {
                    window.scrollTo(0, 0);
                    navigate(`/auth-screen`);
                  }
                }}
              >
                <div>{t("SUPPORT")}</div>
                <div>{t("Contact customer support")}</div>
              </div>
            </div>

            <div className="product-detail-intro">
              {t("Status")}:&nbsp; <span style={{ color: '#2b80dd', fontWeight: 700 }}>{t("In stock")}</span>
            </div>
            {/* <div className="product-detail-top-child-container mt-4">
              {bodyCommit ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: eval(`bodyCommit?.${i18n.language}??''`),
                  }}
                />
              ) : null}
            </div> */}
            <div className="product-detail-top-child-container mt-4">
              {bodyAddress ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: eval(`bodyAddress?.${i18n.language}??''`),
                  }}
                />
              ) : null}
            </div>
          </div>

        </div>
        {staticPage ? <>
          <div className="product-detail-title col-12">{staticPage?.staticPageTitle}</div>
          <div
            dangerouslySetInnerHTML={{
              __html: eval(`staticPage?.${i18n.language}??''`),
            }}
          />
        </> : null}
      </PageContainer>
      <div className='related-products-title'>{t("RELATED PRODUCTS")}</div>
      <Products categoryId={product?.productCategoryId} isHorizontally={true} />
    </>
  );
};

export default ProductDetail;
