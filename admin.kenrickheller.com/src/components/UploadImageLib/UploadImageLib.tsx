import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAddImage, useDeleteImage, useGetImages } from 'src/api/fileApi';
import { EnumAction, EventButton, ImageType } from 'src/api/models';
import { useAddPopup } from 'src/state/application/hooks';
import styled from 'styled-components';
import ImageUpload from '../ImageUpload';
import './UploadImageLib.css';

interface IUploadImageLib {
  getApi: () => Promise<ImageType[]>;
  deleteApi: (fileId: number) => Promise<boolean>;
  addApi: (data: any) => Promise<ImageType>;
  isPopup?: boolean;
  onChoose?: (file: ImageType) => void;
  postProcess?: (...args: any[]) => void;
}

const UploadImageLib = (props: IUploadImageLib) => {
  const {getApi, deleteApi, addApi, onChoose, postProcess} = props;
  const [images, setImages] = useState<ImageType[]>([]);
  
  const addPopup = useAddPopup();

  useEffect(() => {
    getApi().then((res) => {
      setImages(res);
    }).catch((error) => {
      addPopup({
        error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
      });
    });
  }, []);

  const onDeleteImage = (file: ImageType | File) => {
    if(!(file instanceof File)) {
      deleteApi(file.fileId).then(() => {
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
      addApi(formData).then((res) => {
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
      <ImageUpload images={images} showLink={true} onDelete={onDeleteImage} addImage={onAddImage} onChoose={onChoose} postProcess={postProcess}/>
    </div>
  );
};



export default UploadImageLib;
