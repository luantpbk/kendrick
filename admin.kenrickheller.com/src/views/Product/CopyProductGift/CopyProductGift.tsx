import './CopyProductGift.css';
import React, { useCallback } from 'react';
import SelectBoxComponent from 'src/components/SelectBoxComponent/SelectBoxComponent';
import { useState } from 'react';
import { useEffect } from 'react';
import { ProductType } from 'src/api/models';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import { useCopyProductGift, useGetProduct } from 'src/api/productApi';
interface ICopyProductGift {
  toId: number;
}

const CopyProductGift: React.FC<ICopyProductGift> = (props) => {
  const [listProduct, setListProduct] = useState<ProductType[] | null>(undefined);
  const [fromProductId, setFromProductId] = useState<number>();
  //Function
  const getProduct = useGetProduct();
  const copyProductGift = useCopyProductGift();
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();

  //Get infomation from sever
  useEffect(() => {
    getProduct('', 1, -1)
      .then((data) => {
        const fromProducts = data.items.filter((c) => c.productCategoryId != props.toId);
        setListProduct(fromProducts);
      })
      .catch(() => {
        alert('Có lỗi xảy ra vui lòng thử lại sau');
      });
  }, [getProduct, props.toId]);

  const onChangeSelection = useCallback((name: string, value: number) => {
    if (name === 'productId') {
      setFromProductId(value);
    }
  }, []);

  const onCopyProductGift = () => {
    if (fromProductId > 0) {
      
      
      copyProductGift(props.toId, fromProductId)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Sao chép thông tin quà tặng thành công!',
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

  return (
    <div className="copy-gift-container">
      <div className="copy-gift-body">
        <span>
          Danh mục sản phẩm:<span style={{ color: 'red' }}>*</span>
        </span>
        <SelectBoxComponent
          width={'20vw'}
          onChange={onChangeSelection}
          isDisable={false}
          data={listProduct}
          name={'productId'}
          placeholder={'Chọn sản phẩm gốc'}
          valueType={'.productId'}
          titleType={'.productName'}
          value={fromProductId}
        />
      </div>
      <div className="copy-gift-footer">
        <button className="btn-add-category" onClick={onCopyProductGift}>
          Sao chép
        </button>
      </div>
    </div>
  );
};

export default CopyProductGift;
