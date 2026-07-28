import './ProductGift.css';
import React from 'react';
import { useState } from 'react';
import { ProductGiftType } from 'src/api/models';
import Input from 'src/components/Input/Input';
import { useEffect } from 'react';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import CopyProductGift from '../CopyProductGift/CopyProductGift';
import { useGetProductGift, usePutProductGift } from 'src/api/productApi';

interface IProductGift {
  productId: number;
}

const ProductGift: React.FC<IProductGift> = (props) => {
  //State
  const [editIndex, setEditIndex] = useState(-1);
  const [value, setValue] = useState('');
  const [listGift, setListGift] = useState<ProductGiftType[]>([]);
  const [elmGift, setElmGift] = useState(null);
  //Functiion
  const getProductGift = useGetProductGift();
  const putProductGift = usePutProductGift();
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();

  useEffect(() => {
    getProductGift(props.productId)
      .then((data) => {
        setListGift(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [addPopup, getProductGift, props.productId]);


  const onDeleteGift = (index: number) => {
    const list = listGift;
    list.splice(index, 1);
    setEditIndex(-1);
    changeElm(list);
    setListGift(list);
  };

  const onEditGift = (index: number) => {
    setEditIndex(index);
    setValue(listGift[index].productGiftValue);
  };

  const onAddGift = () => {
    const list = listGift;
    if (editIndex >= 0) {
      list[editIndex].productGiftValue = value;
    } else {
      list.push({
        productGiftId: 0,
        productId: props.productId,
        productGiftValue: value,
      });
    }
    setListGift(list);
    changeElm(list);
    setEditIndex(-1);
    setValue('');
  };

  const onSaveConfig = () => {
    
    
    putProductGift(props.productId, listGift)
      .then(() => {
        addPopup({
          txn: {
            success: true,
            summary: 'Thay đổi thông tin quà tặng thành công!',
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
  };

  const onCopyProductGift = () => {
    addPopup({
      // view: {
      //   width: '400px',
      //   height: '150px',
      //   title: 'Sao chép thông tin quà tặng',
      //   isManualRemove: false,
      //   data: <CopyProductGift toId={props.productId} />,
      //   isContext: false,
      // },
    });
  };

  const changeElm = (list: ProductGiftType[]) => {
    const _elm = list.map((gift: ProductGiftType, index: number) => {
      return (
        <div className="config-container">
          <div>{gift.productGiftValue}</div>
          <div
            className="edit-config"
            onClick={() => {
              onEditGift(index);
            }}
          >
            Sửa
          </div>
          <div
            className="delete-config"
            onClick={() => {
              onDeleteGift(index);
            }}
          >
            Xóa
          </div>
        </div>
      );
    });

    setElmGift(_elm);
  };

  useEffect(() => {
    changeElm(listGift);
  }, [listGift]);
  //End of function

  return (
    <div className="display-option-container">
      <div className="display-option-left">
        <div className="display-option-left-title">
          <div>Quà tặng</div>
        </div>
        <div className="display-option-left-value">{elmGift}</div>
        <div className="display-option-btn">
          <div className="add-config" onClick={onAddGift}>
            <span className="material-icons">add_circle_outline</span>{' '}
            <span>{editIndex >= 0 ? 'Sửa' : 'Thêm'}</span>
          </div>
          <div className="save-config" onClick={onSaveConfig}>
            <span className="material-icons">upload_file</span>Lưu lại
          </div>
          <div className="save-config" onClick={onCopyProductGift}>
            <span className="material-icons">file_copy</span>Sao chép
          </div>
        </div>
      </div>
      <div className="display-option-right">
        <div>
          <span>Thông tin quà tặng</span>
          <Input
            disabled={false}
            value={value}
            onChange={setValue}
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ProductGift;
