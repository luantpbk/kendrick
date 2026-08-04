import './CategoryDetails.css';
import React, { useCallback, useEffect, useState } from 'react';
import Input from 'src/components/Input/Input';
import SelectBoxComponent from 'src/components/SelectBoxComponent/SelectBoxComponent';
import { useAddPopup } from 'src/state/application/hooks';
import {
  useGetProductCategoryById,
  usePostProductCategory,
  usePostProductCategoryAvatar,
  usePutProductCategory,
} from 'src/api/productCategoryApi';
import { useGetProductRealm } from 'src/api/productRealmApi';
import styled from 'styled-components';
import Avatar from 'src/components/Avatar';
import { ProductCategoryType, ImageType } from 'src/api/models';
import ButtonComponent from 'src/components/ButtonComponent/ButtonComponent';

interface IEditCategoryView {
  productCategoryId?: number;
  isDisable: boolean;
  postProcess?: (...args: any[]) => void;
}

const CategoryDetails: React.FC<IEditCategoryView> = (props) => {
  //State
  const [productCategoryId, setProductCategoryId] = useState<number>(props.productCategoryId);
  const [isDisable, setDisable] = useState<boolean>(props.isDisable);

  const [selectionRealm, setSelectionRealm] = useState<number>();
  const [code, setCode] = useState<string>();
  const [name, setName] = useState<string>();
  const [displayOrder, setDisplayOrder] = useState<number>();
  const [listRealm, setListRealm] = useState([]);

  const [avatar, setAvatar] = useState<string>();
  const [avatarFile, setAvatarFile] = useState<File>();
  const [thumbAvatar, setThumbAvatar] = useState<string>();
  const [avatarId, setAvatarId] = useState<number>();
  //End of state

  const getRealm = useGetProductRealm();
  const postCategory = usePostProductCategory();
  const getProductCategoryById = useGetProductCategoryById();
  const postProductCategoryAvatar = usePostProductCategoryAvatar();
  const putProductCategory = usePutProductCategory();

  const addPopup = useAddPopup();

  const uploadAvatar = (productCategoryId: number, file: File) => new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    postProductCategoryAvatar(formData, productCategoryId).then((data) => {
      setAvatar(data.fileUrl);
      setThumbAvatar(data.thumbUrl);
      setAvatarId(data.fileId);
      resolve(data);
    }).catch((error) => reject(error));
  });

  const onChooseFromLibrary = (image: ImageType) => {
    setAvatar(image.fileUrl);
    setThumbAvatar(image.thumbUrl || image.fileUrl);
    setAvatarId(image.fileId);
  };

  const onChangeAvatar = (file: File) => {
    if (file) {
      if(!productCategoryId) {
        const url = URL.createObjectURL(file);
        setAvatar(url);
        setThumbAvatar(url);
        setAvatarFile(file);
      } else {
        uploadAvatar(productCategoryId, file).then((res) => {
          addPopup({
            txn: {
              success: true,
              summary: 'Tải ảnh thành công',
            },
          });
        }).catch((error) => {
          addPopup({
            error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
          });
        });
      }
    }
  };

  useEffect(() => {
    getRealm().then((realms) => {
      setListRealm(realms);
    }).catch((error) => {
      addPopup({
        error: {
          message: error.errorMessage,
          title: 'Đã có lỗi xảy ra!',
        },
      });
    });
  }, [getRealm])

  //Get infomation from sever
  useEffect(() => {
    if(productCategoryId)
      getProductCategoryById(props.productCategoryId).then((category) => {
        setCode(category.productCategoryCode);
        setName(category.productCategoryName);
        setDisplayOrder(category.displayOrder);
        setSelectionRealm(category.productRealmId);
        setAvatar(category.avatar);
        setThumbAvatar(category.thumbAvatar);
      }).catch((error) => {
      addPopup({
        error: {
          message: error.errorMessage,
          title: 'Đã có lỗi xảy ra!',
        },
      });
    });
  }, [getProductCategoryById, productCategoryId]);

  const onSuccess = (isAdd: boolean, res: ProductCategoryType) => {
    addPopup({
      txn: {
        success: true,
        summary: isAdd ? 'Thêm danh mục sản phẩm thành công' : 'Sửa danh mục sản phẩm thành công',
      }
    });
    if(props.postProcess) props.postProcess(res);
  }

  const onSave = useCallback(() => {
    const isAdd = !productCategoryId;
    const api = isAdd? 
      postCategory(selectionRealm, code, name, displayOrder, avatarId) : 
      putProductCategory(productCategoryId, selectionRealm, code, name, displayOrder, avatarId);
    api.then((res) => {
      setProductCategoryId(res.productCategoryId);
      setDisable(true);
      if(isAdd && avatarFile) {
        uploadAvatar(res.productCategoryId, avatarFile).then(() => {
          onSuccess(isAdd, res);
        }).catch((error) => addPopup({
          error: {
            message: error.errorMessage,
            title: 'Tải ảnh danh mục thất bại!',
          },
        }))
      } else {
        onSuccess(isAdd, res);
      }
    }).catch((error) => addPopup({
      error: {
        message: error.errorMessage,
        title: 'Đã có lỗi xảy ra!',
      },
    }));

  }, [productCategoryId, selectionRealm, code, name, displayOrder, avatarId, postCategory, putProductCategory, uploadAvatar, addPopup]);


  //Main
  return (
    <div className="container-fluid add-category-container">
      <Avatar 
        change={onChangeAvatar} 
        thumbAvatar={thumbAvatar} 
        avatar={avatar}
        onChooseFromLibrary={onChooseFromLibrary}
      />
      <div className='category-row'>
        <SelectBoxComponent
          width='100%'
          onChange={setSelectionRealm}
          isDisable={isDisable}
          name={'category-selectbox'}
          placeholder={'Chọn loại sản phẩm'}
          
          value={selectionRealm}
          data={listRealm}
          valueType={'productRealmId'}
          titleType={'productRealmName'}
        />
      </div>
      <div className='category-row'>
        <Input
          title='Mã sản phẩm'
          require={true}
          disabled={isDisable}
          value={code}
          onChange={setCode}
        />
      </div>
      <div className='category-row'>
        <Input
          title='Tên sản phẩm'
          require={true}
          disabled={isDisable}
          value={name}
          onChange={setName}
        />
      </div>
      <div className='category-row'>
        <Input
          title='Thứ tự'
          require={true}
          disabled={isDisable}
          value={displayOrder}
          onChange={setDisplayOrder}
        />
      </div>
      <div className='category-row'>
        {isDisable ? null : <ButtonComponent icon='save' title={!productCategoryId ? 'THÊM' : 'LƯU'} onClick={onSave}/>}
      </div>
    </div>
  );
};

export default CategoryDetails;

const StyledInput = styled.input`
  display: none;
`;
