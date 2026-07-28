import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAddImage, useDeleteImage, useGetImages } from 'src/api/fileApi';
import { EnumAction, EventButton, ImageType } from 'src/api/models';
import { useAddPopup } from 'src/state/application/hooks';
import styled from 'styled-components';
import ImageUpload from '../ImageUpload';
import './OtherImageUpload.css';

interface OtherImageUploadProps {
  isPopup?: boolean;
}

const OtherImageUpload = (props: OtherImageUploadProps) => {

  const [images, setImages] = useState<ImageType[]>([]);
  const getImages = useGetImages();
  const addPopup = useAddPopup();
  const deleteImage = useDeleteImage();
  const addImage = useAddImage();

  useEffect(() => {
    getImages().then((res) => {
      setImages(res);
    }).catch((error) => {
      addPopup({
        error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
      });
    });
  }, []);

  const onDeleteImage = (file: ImageType | File) => {
    if(!(file instanceof File)) {
      deleteImage(file.fileId).then(() => {
        setImages(images.filter(i => i.fileId != file.fileId));
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

  const onAddImage = (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      addImage(formData).then((res) => {
        setImages([...images, res]);
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
    
  };

  return (     
    <div className='other-image-container'>
      <ImageUpload images={images} showLink={true} onDelete={onDeleteImage} addImage={onAddImage} />
    </div>
  );
};



export default OtherImageUpload;
