import './CopyDisplayOption.css';
import React, { useCallback } from 'react';
import SelectBoxComponent from 'src/components/SelectBoxComponent/SelectBoxComponent';
import { useState } from 'react';
import { useEffect } from 'react';
import { ProductCategoryType } from 'src/api/models';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import {
  useGetProductCategory,
  useCopyProductCategoryDisplayOption,
} from 'src/api/productCategoryApi';
import { uniqueId } from 'lodash';

interface ICopyDisplayOption {
  toId: number;
  refresh: () => void;
}

const CopyDisplayOption: React.FC<ICopyDisplayOption> = (props) => {
  const [listCategory, setListCategory] = useState<ProductCategoryType[] | null>(undefined);
  const [fromProductCategoryId, setFromProductCategoryId] = useState<number>();
  //Function
  const getProductCategory = useGetProductCategory();
  const copyCategoryDisplayOption = useCopyProductCategoryDisplayOption();
  const addPopup = useAddPopup();

  useEffect(() => {
    getProductCategory()
      .then((data) => {
        const fromCategories = data.filter((c) => c.productCategoryId != props.toId);
        setListCategory(fromCategories);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        }, uniqueId(), true);
      });
  }, [getProductCategory, props.toId]);


  const onCopyDisplayOption = () => {
    if (fromProductCategoryId > 0) {      
      copyCategoryDisplayOption(props.toId, fromProductCategoryId)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Sao chép thuộc tính danh mục thành công!',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          }, uniqueId(), true);
        })
        .finally(() => props.refresh());
    } else {
      addPopup({
        error: {
          message: 'Vui lòng chọn danh mục gốc!',
          title: 'Đã có lỗi xảy ra!',
        },
      }, undefined, true);  }
  };

  return (
    <div className="copy-display-container">
      <div className='copy-display-row'>
        <SelectBoxComponent
          onChange={setFromProductCategoryId}
          require={true}
          isDisable={false}
          data={listCategory}
          placeholder={'Chọn danh mục gốc'}
          valueType={'productCategoryId'}
          titleType={'productCategoryName'}
          value={fromProductCategoryId}
        />

      </div>
      <div className='copy-display-row'>
        <button className="btn-copy-config" onClick={onCopyDisplayOption}>
          Sao chép
        </button>
      </div>
    </div>
  );
};

export default CopyDisplayOption;
