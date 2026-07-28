import React, { useCallback, useEffect, useState } from 'react';

import {
  usePutProductRealm,
  useGetProductRealmById,
  usePostProductRealm,
} from 'src/api/productRealmApi';
import ButtonComponent from 'src/components/ButtonComponent/ButtonComponent';
import Checkbox from 'src/components/Checkbox';
import Input from 'src/components/Input/Input';
import { useAddPopup } from 'src/state/application/hooks';
import './RealmDetails.css';

interface IEditRealmView {
  productRealmId: number;
  isDisable: boolean;
  postProcess?: (...args: any[]) => void;
}

const RealmDetails: React.FC<IEditRealmView> = (props) => {
  //Function
  const putRealm = usePutProductRealm();
  const getIdRealm = useGetProductRealmById();
  const addPopup = useAddPopup();
  const postRealm = usePostProductRealm();

  //State
  const [productRealmId, setProductRealmId] = useState<number>(props.productRealmId);
  const [isDisable, setDisable] = useState<boolean>(props.isDisable);

  const [code, setCode] = useState<string>();
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [displayOrder, setDisplayOrder] = useState<number>();
  const [isHidden, setIsHidden] = useState<boolean>();

  useEffect(() => {
    if (productRealmId)
      getIdRealm(productRealmId)
        .then((data) => {
          setCode(data.productRealmCode);
          setName(data.productRealmName);
          setDisplayOrder(data.displayOrder);
          setDescription(data.description);
          if (data.isHidden) {
            setIsHidden(true);
          } else {
            setIsHidden(false);
          }
        })
        .catch((error) =>
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          }),
        );
  }, [addPopup, getIdRealm, productRealmId, isDisable]);

  const onSave = useCallback(() => {
    const api = !productRealmId
      ? postRealm(code, name, description, displayOrder, isHidden)
      : putRealm(productRealmId, code, name, description, displayOrder, isHidden);
    api
      .then((res) => {
        addPopup({
          txn: {
            success: true,
            summary: !productRealmId
              ? 'Thêm thành công loại sản phẩm!'
              : 'Sửa thành công loại sản phẩm',
          },
        });
        setProductRealmId(res.productRealmId);
        setDisable(true);
        if (props.postProcess) props.postProcess(res);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [
    productRealmId,
    postRealm,
    code,
    name,
    description,
    displayOrder,
    isHidden,
    putRealm,
    addPopup,
    props,
  ]);

  return (
    <div className="container-fluid realm-detail-container">
      <div className="realm-detail-row">
        <Input
          title="Mã loại sản phẩm"
          require={true}
          value={code}
          onChange={setCode}
          disabled={isDisable}
        />
      </div>
      <div className="realm-detail-row">
        <Input
          title="Tên loại sản phẩm"
          require={true}
          disabled={isDisable}
          value={name}
          onChange={setName}
        />
      </div>
      <div className="realm-detail-row">
        <Input
          title="Mô tả"
          disabled={isDisable}
          value={description}
          onChange={setDescription}
        />
      </div>
      <div className="realm-detail-row">
        <Input
          title="Thứ tự"
          require={true}
          disabled={isDisable}
          value={displayOrder}
          onChange={setDisplayOrder}
        />
      </div>
      <div className="realm-detail-row">
        <Checkbox
          value={isHidden}
          disabled={isDisable}
          title={'Ẩn trên Websize'}
          onChange={(value) => setIsHidden(value)}
        />
      </div>

      {isDisable ? null : (
        <ButtonComponent
          icon="save"
          title={!productRealmId ? 'THÊM' : 'LƯU'}
          onClick={onSave}
        />
      )}
    </div>
  );
};

export default RealmDetails;
