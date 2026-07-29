import React, { useState } from 'react';
import { useEffect } from 'react';
import { EnumAction, EventButton, ImageType } from 'src/api/models';
import useModal from 'src/hooks/useModal';
import { useAddPopup } from 'src/state/application/hooks';
import styled from 'styled-components';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import ImageLibraryModal from '../ImageLibraryModal/ImageLibraryModal';
import Input from '../Input';
import './ImageUpload.css';

interface ImageUploadProps {
  images: ImageType[] | File[];
  onDelete: (file: ImageType | File) => void;
  addImage: (file: File) => void;
  showLink?: boolean;
  onChoose?: (file: ImageType) => void;
  postProcess?: (...args: any[]) => void;
} 

const ImageUpload = (props: ImageUploadProps) => {
  const { images, onDelete, addImage, showLink, onChoose, postProcess } = props;

  const [isFullSize, setFullSize] = useState(false);

  const [imageIndex, setImageIndex] = useState(0);

  const addPopup = useAddPopup();
  const confirmModal = useModal(ConfirmModal);
  const imageLibraryModal = useModal(ImageLibraryModal);

  const onDeleteImage = () => {
    const listToDo: EventButton[] = [
      {
        name: 'Xác nhận',
        icon: 'check',
        actionType: EnumAction.Confirm,
        action: () => {
          onDelete(images[imageIndex]);
          setImageIndex(0);
          confirmModal.handleDismiss();
        },
        buttonClass: 'info',
        align: 'center',
      },
      {
        name: 'Hủy',
        icon: 'clear',
        actionType: EnumAction.Cancel,
        buttonClass: 'info',
        align: 'center',
        action: () => confirmModal.handleDismiss()
      },
    ];
    confirmModal.handlePresent(
      {
        question: 'Bạn có chắc muốn xóa ảnh này?',
        listActionButton: listToDo,
      },
      'XÓA ẢNH',
    );
  };

  const onAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size <= 5242880) {
        addImage(file);
      } else {
        addPopup({
          error: { message: 'Ảnh tối đa 5MB', title: 'Đã có lỗi xảy ra!' },
        });
      }
    }
  };

  const getImage = (image: ImageType | File, isThumb = false) => {
    return image instanceof File
      ? URL.createObjectURL(image)
      : isThumb
      ? image.thumbUrl
      : image.fileUrl;
  };

  return (
    <>
      <div className="bigsize-image-container">
        {images.length >= 3 ? (
          <div className="image-child">
            <img
              src={getImage(images[imageIndex - 1 >= 0 ? imageIndex - 1 : images.length - 1])}
            />
          </div>
        ) : null}
        <div className={`image-child center ${isFullSize ? 'full-size' : ''}`}>
          {images.length > 0 ? (
            <>
              {images.length > 1 ? (
                <div
                  className="btn-nav-image back"
                  onClick={() =>
                    setImageIndex(imageIndex - 1 >= 0 ? imageIndex - 1 : images.length - 1)
                  }
                >
                  <span className="material-icons">arrow_back_ios_new</span>
                </div>
              ) : null}
              <div className="btn-delete-image" title="Xóa" onClick={() => onDeleteImage()}>
                <span className="material-icons">delete</span>
              </div>
              <div
                className="btn-zoom-out-image"
                title="Thu nhỏ"
                onClick={() => setFullSize(false)}
              >
                <span className="material-icons">close</span>
              </div>
              <img onClick={() => setFullSize(true)} src={getImage(images[imageIndex])} />
              {images.length > 1 ? (
                <div
                  className="btn-nav-image next"
                  onClick={() =>
                    setImageIndex(imageIndex + 1 > images.length - 1 ? 0 : imageIndex + 1)
                  }
                >
                  <span className="material-icons">arrow_forward_ios</span>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
        {images.length >= 3 ? (
          <div className="image-child">
            <img
              src={getImage(images[imageIndex + 1 > images.length - 1 ? 0 : imageIndex + 1])}
            />
          </div>
        ) : null}
      </div>
      {showLink && images[imageIndex] && !(images[imageIndex] instanceof File) ? (
        <>
          <div className="image-url">
            <Input
              title="URL (Đường dẫn)"
              require={true}
              disabled={false}
              value={(images[imageIndex] as ImageType)?.fileUrl}
            />
            <div
              className="copy-url-btn"
              title="Copy URL"
              onClick={() => {
                navigator.clipboard.writeText((images[imageIndex] as ImageType)?.fileUrl);
              }}
            >
              <span className="material-icons copy-url-icon">content_copy</span>
            </div>
          </div>
          <div
            className="image-url"
            title="Copy thumb URL"
            onClick={() => {
              navigator.clipboard.writeText((images[imageIndex] as ImageType)?.fileUrl);
            }}
          >
            <Input
              title="Thumb URL"
              require={true}
              disabled={false}
              value={(images[imageIndex] as ImageType)?.thumbUrl}
            />
            <div className="copy-url-btn">
              <span className="material-icons copy-url-icon">content_copy</span>
            </div>
          </div>
        </>
      ) : null}
      <div className="row-container justify-content-center">
        {images.length > 0
          ? images.map((img: ImageType | File, index: number) => {
              return (
                <div
                  key={`image${index}`}
                  className={`thumb-image-child ${imageIndex === index ? 'focus-img' : ''}`}
                  onClick={() => {
                    setImageIndex(index);
                  }}
                >
                  <img src={getImage(img, true)} />
                </div>
              );
            })
          : null}
      </div>
      <div className="row-container justify-content-center">
        <label className="btn-image-upload">
          <StyledInput
            type="file"
            onChange={onAddImage}
            className="filetype"
            id="group_image"
          />
          <span className="material-icons image-upload-label">cloud_upload</span>
          <span className="image-upload-label">THÊM ẢNH</span>
        </label>
        <div className="btn-image-upload" onClick={() => {
          imageLibraryModal.handlePresent({
            onDismiss: imageLibraryModal.handleDismiss,
            onSelect: (image: ImageType) => {
                // Add the selected image from library to the image list
                addImage(image as any);
            }
          })
        }}>
          <span className="material-icons image-upload-label">photo_library</span>
          <span className="image-upload-label">CHỌN TỪ THƯ VIỆN</span>
        </div>
        {onChoose? <div className="btn-image-upload" onClick={() => {
          onChoose(images[imageIndex] as ImageType)
          if(postProcess) postProcess();
        }}>
          <span className="material-icons image-upload-label">check</span>
          <span className="image-upload-label">CHỌN ẢNH</span>
        </div> : null }
      </div>
    </>
  );
};

const StyledInput = styled.input`
  display: none;
`;

export default ImageUpload;
