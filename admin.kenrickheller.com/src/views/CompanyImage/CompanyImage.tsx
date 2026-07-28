import './CompanyImage.css';
import React, { useState } from 'react';
import styled from 'styled-components';
import { EnumAction, EventButton, ImageType } from 'src/api/models';
import { useAddPopup } from 'src/state/application/hooks';
import { useEffect } from 'react';
import ImageUpload from 'src/components/ImageUpload';
import ToolBar from 'src/components/ToolBar/ToolBar';
import {
  useAddCompanyImage,
  useDeleteCompanyImage,
  useGetCompanyImage,
} from 'src/api/companyImageApi';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';
import useModal from 'src/hooks/useModal';

const CompanyImage: React.FC = () => {
  //State
  const [images, setImages] = useState<ImageType[]>([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  //Function
  const addPopup = useAddPopup();
  const getCompanyImages = useGetCompanyImage();
  const addCompanyImage = useAddCompanyImage();
  const deleteCompanyImage = useDeleteCompanyImage();
  const confirmModal = useModal(ConfirmModal);

  //UseEffect
  useEffect(() => {
    getCompanyImages()
      .then((data) => {
        setImages(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [addPopup, getCompanyImages, reloadFlag]);

  //Upload image
  const onAddImage = (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('name', '');
      formData.append('file', file);
      addCompanyImage(formData)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Upload ảnh thành công!',
            },
          });
          setReloadFlag(!reloadFlag);
        })
        .catch((error) => {
          addPopup({
            error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
          });
        });
      addPopup({
        txn: {
          success: true,
          summary: 'Vui lòng chờ upload ảnh!',
        },
      });
    }
  };

  const onDeleteCompanyImage = (file: ImageType | File) => {
    const onConfirm = () => {
      deleteCompanyImage((file as ImageType).fileId)
        .then(() => {
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
        })
        .finally(() => setReloadFlag(!reloadFlag));
    };
    const listToDo: EventButton[] = [
      {
        name: 'Xác nhận',
        icon: 'check',
        actionType: EnumAction.Confirm,
        action: onConfirm,
        buttonClass: 'info',
        align: 'center',
      },
      {
        name: 'Hủy',
        icon: 'clear',
        actionType: EnumAction.Cancel,
        buttonClass: 'info',
        align: 'center',
      },
    ];
    confirmModal.handlePresent(
      {
        question: 'Bạn có chắc muốn xóa ảnh này?',
        listActionButton: listToDo,
        postProcess: confirmModal.handleDismiss,
      },
      'XÓA ẢNH CÔNG TY',
    );
  };

  return (
    <>
      <ToolBar
        toolbarName={`Hình ảnh công ty`}
        isBack={true}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      />
      <CompanyImageContainer>
        <ImageUpload images={images} onDelete={onDeleteCompanyImage} addImage={onAddImage} />
      </CompanyImageContainer>
    </>
  );
};

export default CompanyImage;

const CompanyImageContainer = styled.div`
  margin-top: 10vh;
`;
