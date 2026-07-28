import './Logo.css';
import React, { useState } from 'react';
import styled from 'styled-components';
import { EnumAction, EventButton, ImageType } from 'src/api/models';
import { useAddPopup } from 'src/state/application/hooks';
import { useEffect } from 'react';
import { useGetLogos, useAddLogoImage, useDeleteLogoImage } from 'src/api/logoApi';
import ImageUpload from 'src/components/ImageUpload';
import ToolBar from 'src/components/ToolBar/ToolBar';
import useModal from 'src/hooks/useModal';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';

const Logo: React.FC = () => {
  //State
  const [images, setImages] = useState<ImageType[]>([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  const addPopup = useAddPopup();
  const getLogos = useGetLogos();
  const addLogoImage = useAddLogoImage();
  const deleteLogoImage = useDeleteLogoImage();
  const confirmModal = useModal(ConfirmModal);

  //UseEffect
  useEffect(() => {
    getLogos()
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
  }, [addPopup, getLogos, reloadFlag]);

  //Upload image
  const onAddImage = (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('name', '');
      formData.append('file', file);
      addLogoImage(formData)
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

  const onDeleteLogoImage = (file: ImageType | File) => {
    const onConfirm = () => {
      deleteLogoImage((file as ImageType).fileId)
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
        .finally(() => {
          setReloadFlag(!reloadFlag);
        });
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
      'XÓA LOGO',
    );
  };

  return (
    <>
      <ToolBar
        toolbarName={`Logo`}
        isBack={true}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      />
      <LogoContainer>
        <ImageUpload images={images} onDelete={onDeleteLogoImage} addImage={onAddImage} />
      </LogoContainer>
    </>
  );
};

export default Logo;

const LogoContainer = styled.div`
  margin-top: 10vh;
`;
