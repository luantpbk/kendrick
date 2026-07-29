import './ProductDetails.css';
import React, { useCallback, useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  ProductCategoryType,
  ImageType,
  ProductCategoryAttributeType,
  ProductType,
  RealmType,
  EnumDataType,
} from 'src/api/models';
import { useAddPopup } from 'src/state/application/hooks';
import styled from 'styled-components';
import {
  useGetProductCategory,
  useGetProductCategoryById,
  useGetProductCategoryDisplayOption,
} from 'src/api/productCategoryApi';
import {
  usePostProduct,
  useGetProductById,
  usePutProduct,
  useUpdateProductAvatar,
  useAddProductImage,
  useDeleteProductImage,
} from 'src/api/productApi';
import { useGetProductRealm } from 'src/api/productRealmApi';
import Avatar from 'src/components/Avatar';
import Checkbox from 'src/components/Checkbox';
import Input from 'src/components/Input';
import SelectBoxComponent from 'src/components/SelectBoxComponent/SelectBoxComponent';
import ImageUpload from 'src/components/ImageUpload';
import { useParams } from 'react-router-dom';
import ToolBar from 'src/components/ToolBar/ToolBar';
import ButtonComponent from 'src/components/ButtonComponent/ButtonComponent';
import OptionInfo from 'src/components/OptionInfo';
import OptionPrice from 'src/components/OptionPrice';
import { yymmddhhmmss } from 'src/utils/formatTime';
import useModal from 'src/hooks/useModal';
import QRCodeReader from 'src/components/QRCodeReader/QRCodeReader';
import HtmlCode from 'src/components/HtmlCode/HtmlCode';

interface IProductDetails {
  productId?: number;
  isDisable: boolean;
  isPopup?: boolean;
  postProcess?: (...args: any[]) => void;
}

const ProductDetails: React.FC<IProductDetails> = (props) => {
  //Local state

  const params = useParams<{ productId: string }>();
  const [productId, setProductId] = useState<number>(
    props.productId || Number(params.productId),
  );
  const [isDisable, setDisable] = useState<boolean>(props.isDisable);

  const [productRealmId, setProductRealmId] = useState<number>();
  const [productRealmIdError, setProductRealmIdError] = useState<string>();
  const [productCategoryId, setProductCategoryId] = useState<number>();
  const [productCategoryIdError, setProductCategoryIdError] = useState<string>();
  const [productCode, setProductCode] = useState<string>();
  const [productCodeError, setProductCodeError] = useState<string>();
  const [productName, setProductName] = useState<string>();
  const [productNameError, setProductNameError] = useState<string>();
  const [price, setPrice] = useState<number>();
  const [displayOrder, setDisplayOrder] = useState<number>();
  const [thumbAvatar, setThumbAvatar] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const [avatarFile, setAvatarFile] = useState<File>();
  const [images, setImages] = useState<ImageType[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [introContent, setIntroContent] = useState<string>();
  const [stopSelling, setStopSelling] = useState<boolean>();
  const [hot, setHot] = useState<boolean>();
  const [discountPercent, setDiscountPercent] = useState<number>();
  const [optionPrice, setOptionPrice] = useState<{ [key: string]: number }>();
  const [product, setProduct] = useState<{ [key: string]: any }>({});
  const [realms, setRealms] = useState<RealmType[]>([]);
  const [categories, setCategories] = useState<ProductCategoryType[]>([]);

  const [attributes, setAttributes] = useState<ProductCategoryAttributeType[]>([]);
  const [hasOption, setHasOption] = useState<boolean>(false);
  //End of state
  const qrReaderModal = useModal(QRCodeReader);
  const htmlModal = useModal(HtmlCode);
  //Function
  const getRealm = useGetProductRealm();
  const getProductCategory = useGetProductCategory();

  const postProduct = usePostProduct();
  const getProductById = useGetProductById();
  const putProduct = usePutProduct();

  const addPopup = useAddPopup();

  const updateProductAvatar = useUpdateProductAvatar();
  const addProductImage = useAddProductImage();
  const deleteProductImage = useDeleteProductImage();
  const getProductCategoryDisplayOption = useGetProductCategoryDisplayOption();
  const getProductCategoryById = useGetProductCategoryById();

  //Validate
  const validateProductRealmId = () => {
    setProductRealmIdError(productRealmId > 0 ? undefined : 'Chưa chọn loại sản phẩm');
    return productRealmId > 0;
  };

  const validateProductCategoryId = () => {
    setProductCategoryIdError(
      productCategoryId > 0 ? undefined : 'Chưa chọn danh mục sản phẩm',
    );
    return productCategoryId > 0;
  };

  const validateProductCode = () => {
    setProductCodeError(productCode && productCode != '' ? undefined : 'Chưa nhập mã sản phẩm');
    return productCode && productCode != '';
  };

  const validateProductName = () => {
    setProductNameError(
      productName && productName != '' ? undefined : 'Chưa nhập tên sản phẩm',
    );
    return productName && productName != '';
  };

  const onSuccess = (isAdd: boolean, res: ProductType) => {
    addPopup({
      txn: {
        success: true,
        summary: isAdd ? 'Thêm sản phẩm thành công' : 'Sửa sản phẩm thành công',
      },
    });
    if (props.postProcess) props.postProcess(res);
  };

  const onSave = () =>
    new Promise((resolve, reject) => {
      console.log(product);
      if (
        validateProductRealmId() &&
        validateProductCategoryId() &&
        validateProductCode() &&
        validateProductName()
      ) {
        const body = {
          ...product,
          productId: productId,
          productCategoryId: productCategoryId,
          productCode: productCode,
          productName: productName,
          introContent: introContent,
          discountPercent: discountPercent,
          displayOrder: displayOrder,
          isHiddenSerial: true,
          stopSelling: stopSelling,
          hot: hot,
          price: price,
          optionPrice: optionPrice,
        };
        const isAdd = !productId;
        const api = isAdd ? postProduct(body) : putProduct(body);
        api
          .then((res: ProductType) => {
            setProductId(res.productId);
            setDisable(true);
            if (isAdd) {
              const uploadApis = [];
              if (avatarFile) uploadApis.push(uploadAvatar(res.productId, avatarFile));
              imageFiles
                .filter((f) => f != avatarFile)
                .forEach((image) => uploadApis.push(uploadImage(res.productId, image)));
              Promise.all(uploadApis)
                .then((imageRes) => {
                  setImages([...images, ...imageRes]);
                  onSuccess(isAdd, res);
                  resolve(true);
                })
                .catch((error) => {
                  addPopup({
                    error: {
                      message: error.errorMessage,
                      title: 'Tải ảnh thất bại, vui lòng thử lại!',
                    },
                  });
                  resolve(false);
                });
              setImageFiles([]);
            } else {
              onSuccess(isAdd, res);
              resolve(true);
            }
          })
          .catch((error) => {
            addPopup({
              error: {
                message: error.errorMessage,
                title: 'Đã có lỗi xảy ra, vui lòng thử lại!',
              },
            });
            resolve(false);
          });
      } else {
        addPopup(
          {
            error: {
              title: 'Chưa nhập đủ thông tin',
              message: `${productRealmIdError ?? ''}
          ${productCategoryIdError ?? ''}
          ${productCodeError ?? ''}
          ${productNameError ?? ''}`,
            },
          },
          undefined,
          false,
          3000,
        );
        resolve(false);
      }
    });

  const uploadAvatar = useCallback(
    (productId: number, file: File) =>
      new Promise<ImageType>((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        updateProductAvatar(productId, formData)
          .then((data) => {
            setAvatar(data.fileUrl);
            setThumbAvatar(data.thumbUrl);
            setAvatarFile(undefined);
            resolve(data);
          })
          .catch((error) => reject(error));
      }),
    [updateProductAvatar],
  );

  const uploadImage = useCallback(
    (productId: number, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return addProductImage(productId, formData);
    },
    [addProductImage],
  );

  //Upload Avatar
  const onChangeAvatar = (file: File) => {
    if (file) {
      if (!productId) {
        const url = URL.createObjectURL(file);
        setAvatar(url);
        setThumbAvatar(url);
        setAvatarFile(file);
        setImageFiles([...imageFiles, file]);
      } else {
        uploadAvatar(productId, file)
          .then((res) => {
            setProduct((prev: any) => ({ ...prev, avatar: res.fileId.toString() }));
            addPopup({
              txn: {
                success: true,
                summary: 'Tải ảnh thành công, vui lòng nhấn LƯU để cập nhật',
              },
            });
          })
          .catch((error) => {
            addPopup({
              error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
            });
          });
      }
    }
  };

  //Upload image
  const onAddImage = (file: File) => {
    if (file) {
      if (!productId) {
        setImageFiles([...imageFiles, file]);
      } else {
        uploadImage(productId, file)
          .then((res) => {
            setImages([...images, res]);
            addPopup({
              txn: {
                success: true,
                summary: 'Tải ảnh thành công',
              },
            });
          })
          .catch((error) => {
            addPopup({
              error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
            });
          });
      }
    }
  };

  const onDeleteProductImage = (file: ImageType | File) => {
    if (file instanceof File) {
      setImageFiles(imageFiles.filter((f) => f != file));
    } else {
      deleteProductImage(productId, file.fileId)
        .then(() => {
          setImages(images.filter((i) => i.fileId != file.fileId));
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa ảnh thành công!',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          });
        });
    }
  };

  useEffect(() => {
    getRealm()
      .then((res) => {
        setRealms(res);
      })
      .catch((error) => {
        addPopup({
          error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
        });
      });
  }, [addPopup, getRealm]);

  useEffect(() => {
    if (productRealmId) {
      getProductCategory(productRealmId)
        .then((res) => {
          setCategories(res);
        })
        .catch((error) => {
          addPopup({
            error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
          });
        });
    } else {
      setCategories([]);
    }
  }, [addPopup, getProductCategory, productRealmId]);

  useEffect(() => {
    if (productId) {
      getProductById(productId)
        .then((res) => {
          setProductCategoryId(res.productCategoryId);
          getProductCategoryById(res.productCategoryId).then((category) => {
            setProductRealmId(category.productRealmId);
          });
          setProduct(res);
          setProductCode(res.productCode);
          setProductName(res.productName);
          setPrice(res.price);
          setDisplayOrder(res.displayOrder);
          setThumbAvatar(res.thumbAvatar);
          setAvatar(res.avatar);
          setImages(res.images);
          setIntroContent(res.introContent);
          setDiscountPercent(res.discountPercent);
          setHot(res.hot);
          setStopSelling(res.stopSelling);
          setOptionPrice(res.optionPrice);
        })
        .catch((error) => {
          addPopup({
            error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
          });
        });
    }
  }, [addPopup, getProductCategory, getProductById, productId, getProductCategoryById]);

  const refreshProductCode = (categoryId: number) => {
    const category = categories.find((c) => c.productCategoryId == categoryId);
    setProductCode(`${category.productCategoryCode}-${yymmddhhmmss()}`);
  };

  useEffect(() => {
    if (productCategoryId) {
      getProductCategoryDisplayOption(productCategoryId).then((data) => {
        setAttributes(data);
        setHasOption(data.some((a) => a.attribute.attributeType == EnumDataType.Option));
      });
    }
  }, [getProductCategoryDisplayOption, productCategoryId]);

  const changeProductCode = (code: string) => {
    setProductCode(code);
    if (code) {
      const value = code.split('-');
      const category = categories.find((c) => c.productCategoryCode == value[0]);
      if (category) {
        setProductRealmId(category.productRealmId);
        setProductCategoryId(category.productCategoryId);
      }
    }
  };

  //Main
  return (
    <StyledProductDetailContainer isPopup={props.isPopup}>
      {!props.isPopup && (
        <ToolBar
          toolbarName={`Sản phẩm \\ ${productName} (${productCode})`}
          isBack={true}
          width={'320px'}
          backgroundColor={'#ebe9e9'}
          isPaging={false}
        />
      )}
      <label className="product-title">THÔNG TIN SẢN PHẨM</label>
      <div className="product-detail-info">
        <Avatar change={onChangeAvatar} thumbAvatar={thumbAvatar} avatar={avatar} />
        <div className="product-detail-row">
          <SelectBoxComponent
            width="320px"
            require={true}
            onChange={(value) => {
              setProductRealmId(value);
              setProductCode(undefined);
              setProductCategoryId(undefined);
            }}
            isDisable={isDisable}
            value={productRealmId}
            data={realms}
            valueType={'productRealmId'}
            titleType={'productRealmName'}
            title="Loại sản phẩm"
          />
        </div>
        <div className="product-detail-row">
          <SelectBoxComponent
            width="320px"
            require={true}
            onChange={(value) => {
              setProductCategoryId(value);
              refreshProductCode(value);
            }}
            isDisable={isDisable}
            value={productCategoryId}
            data={categories.filter((c) => c.productRealmId == productRealmId)}
            valueType={'productCategoryId'}
            titleType={'productCategoryName'}
            title="Danh mục sản phẩm"
          />
        </div>
        <div className="product-detail-row">
          <Input
            width="320px"
            title="Key trang thông tin"
            disabled={isDisable}
            value={introContent}
            onChange={setIntroContent}
          />
        </div>
        <div className="product-detail-row">
          <Checkbox
            width="320px"
            value={stopSelling}
            disabled={isDisable}
            title={'Ngừng kinh doanh'}
            onChange={(value) => setStopSelling(value)}
          />
        </div>
        <div className="product-detail-row">
          <Checkbox
            width="320px"
            value={hot}
            disabled={isDisable}
            title={'S.phẩm HOT'}
            onChange={(value) => setHot(value)}
          />
        </div>
        <div className="product-detail-row inline">
          <span
            className="product-detail-tool-left material-icons"
            onClick={() => {
              qrReaderModal.handlePresent(
                {
                  readQR: (code: string) => changeProductCode(code),
                },
                'QUÉT MÃ QR',
              );
            }}
          >
            qr_code_scanner
          </span>
          <Input
            width="280px"
            title="Mã sản phẩm"
            require={true}
            disabled={isDisable}
            value={productCode}
            onChange={changeProductCode}
          />
          <span
            className="material-icons product-detail-icon"
            onClick={() => refreshProductCode(productCategoryId)}
          >
            refresh
          </span>
        </div>
        <div className="product-detail-row">
          <Input
            width="320px"
            title="Tên sản phẩm"
            require={true}
            disabled={isDisable}
            value={productName}
            onChange={setProductName}
          />
        </div>
        <div className="product-detail-row">
          <Input
            width="320px"
            title="Giá tiền (¥)"
            disabled={isDisable}
            value={price}
            onChange={setPrice}
            type="number"
          />
        </div>
        <div className="product-detail-row">
          <Input
            width="320px"
            title="Giảm giá (%)"
            disabled={isDisable}
            value={discountPercent}
            onChange={setDiscountPercent}
          />
        </div>
        <div className="product-detail-row">
          <Input
            width="320px"
            title="Thứ tự"
            disabled={isDisable}
            value={displayOrder}
            onChange={setDisplayOrder}
          />
        </div>
        {attributes
          ? attributes.map((attribute, index) => {
              return (
                <div className="product-detail-row" key={`productattribute${index}`}>
                  {attribute.attribute.attributeType == EnumDataType.Option ? (
                    <OptionInfo
                      width="320px"
                      title={attribute.attributeTitle}
                      value={product[attribute.attributeName]}
                      images={images}
                      disabled={isDisable}
                      onChange={(value) => {
                        console.log('Change option', value);
                        product[attribute.attributeName] = value;
                        setProduct({ ...product });
                      }}
                    />
                  ) : attribute.attribute.attributeType == EnumDataType.HTML ? (
                    <ButtonComponent
                      icon="code"
                      title={attribute.attributeTitle}
                      onClick={() => {
                        htmlModal.handlePresent(
                          {
                            value: product[attribute.attributeName],
                            onSave: (data: { [lang: string]: string }) => {
                              product[attribute.attributeName] = JSON.stringify(data);
                              setProduct({ ...product });
                              htmlModal.handleDismiss();
                            },
                          },
                          `NHẬP THÔNG TIN`,
                        );
                      }}
                    />
                  ) : (
                    <Input
                      width="320px"
                      title={attribute.attributeTitle}
                      disabled={isDisable}
                      value={product[attribute.attributeName]}
                      onChange={(value) => {
                        product[attribute.attributeName] = value;
                        setProduct({ ...product });
                      }}
                    />
                  )}
                </div>
              );
            })
          : null}

        {hasOption && (
          <div className="product-detail-row">
            {' '}
            <OptionPrice
              title="Giá theo tùy chọn"
              disabled={isDisable}
              value={optionPrice}
              onChange={setOptionPrice}
            />{' '}
          </div>
        )}

        <div className="product-detail-row">
          {isDisable ? null : (
            <ButtonComponent
              icon="save"
              title={!productId ? 'THÊM' : 'LƯU'}
              onClick={onSave}
              loader={true}
            />
          )}
        </div>
      </div>
      <label className="product-title">HÌNH ẢNH SẢN PHẨM</label>
      <ImageUpload
        images={productId ? images : imageFiles}
        onDelete={onDeleteProductImage}
        addImage={onAddImage}
        onChoose={(image: ImageType) => {
          setAvatar(image.fileUrl);
          setThumbAvatar(image.thumbUrl);
          setProduct((prev: any) => ({ ...prev, avatar: image.fileId.toString() }));
          addPopup({
            txn: {
              success: true,
              summary: 'Đã chọn ảnh làm đại diện, vui lòng nhấn LƯU để lưu thay đổi',
            },
          });
        }}
      />
    </StyledProductDetailContainer>
  );
};

export default ProductDetails;

const StyledProductDetailContainer = styled.div<{ isPopup: boolean }>`
  background-color: ${({ isPopup }) => (isPopup ? 'white' : 'transparent')};
  overflow: auto;
  max-height: ${({ isPopup }) => (isPopup ? '91vh' : '100vh')};
  width: 90vw;
`;
