import './Banner.css';
import React, { useState } from 'react';
import styled from 'styled-components';
import { EnumAction, EventButton, ImageType } from 'src/api/models';
import { useAddPopup } from 'src/state/application/hooks';
import { uniqueId } from 'lodash';
import { useEffect } from 'react';
import { useGetBanner, useAddBannerImage, useDeleteBannerImage } from 'src/api/bannerApi';
import useModal from 'src/hooks/useModal';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';

const Banner: React.FC = () => {
  //State
  const [images, setImages] = useState<ImageType[] | null>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [maxImageIndex, setMaxImageIndex] = useState(0);
  const [reloadFlag, setReloadFlag] = useState(false);

  //Function
  const [isShowFullSizeImg2, setShowFullSizeImg2] = useState(false);
  const addPopup = useAddPopup();
  const getBanner = useGetBanner();
  const addBannerImage = useAddBannerImage();
  const deleteBannerImage = useDeleteBannerImage();
  const confirmModal = useModal(ConfirmModal);

  //UseEffect
  useEffect(() => {
    getBanner()
      .then((data) => {
        setImages(data);
        setMaxImageIndex(data.length - 1);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [addPopup, getBanner, reloadFlag]);

  //Upload image
  const onAddImage = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size <= 55242880) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        addBannerImage(formData)
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
      } else {
        addPopup({
          error: { message: 'Ảnh tối đa 5MB', title: 'Đã có lỗi xảy ra!' },
        });
      }
    }
  };

  const onShowFullSize = (name: string, isShow: boolean) => {
    if (name == 'img2') setShowFullSizeImg2(isShow);
  };

  const onDeleteBannerImage = () => {
    const onConfirm = () => {
      deleteBannerImage(images[imageIndex].fileId)
        .then(() => {
          setMaxImageIndex(maxImageIndex - 1);
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
          setImageIndex(0);
          setReloadFlag(!reloadFlag);
        });
      addPopup({
        txn: {
          success: true,
          summary: 'Đợi một chút!',
        },
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
      'XÓA ẢNH',
    );
  };

  return (
    <div className="banner-details-img">
      <div className="details-img-title">Banner</div>
      <div className="banner-fullsize-img">
        {images.length > 0 ? (
          <div
            className="btn-nav-banner-image back"
            onClick={() => {
              setImageIndex(imageIndex - 1 >= 0 ? imageIndex - 1 : maxImageIndex);
            }}
          >
            <span className="material-icons">arrow_back_ios_new</span>
          </div>
        ) : null}
        <div className={`banner-img-child center ${isShowFullSizeImg2 ? 'full-size' : ''}`}>
          {images.length > 0 ? (
            <div
              className="btn-delete-banner-image"
              title="Xóa"
              onClick={() => {
                onDeleteBannerImage();
              }}
            >
              <span className="material-icons">delete</span>
            </div>
          ) : null}
          {images.length > 0 ? (
            <div>
              <div
                className="btn-zoom-out-banner-image"
                title="Thu nhỏ"
                onClick={() => {
                  onShowFullSize('img2', false);
                }}
              >
                <span className="material-icons">close</span>
              </div>
              <img
                onClick={() => {
                  onShowFullSize('img2', true);
                }}
                src={images[imageIndex].fileUrl}
              />
            </div>
          ) : null}
        </div>
        {images.length > 0 ? (
          <div
            className="btn-nav-banner-image next"
            onClick={() => {
              setImageIndex(imageIndex + 1 > maxImageIndex ? 0 : imageIndex + 1);
            }}
          >
            <span className="material-icons">arrow_forward_ios</span>
          </div>
        ) : null}
      </div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          {images.length > 0
            ? images.map((img: ImageType, index: number) => {
                return (
                  <div
                    key={uniqueId()}
                    className={`col-1 p-0 m-1 banner-thumb-img-child ${
                      imageIndex === index ? 'focus-img' : ''
                    }`}
                    onClick={() => {
                      setImageIndex(index);
                    }}
                  >
                    <img src={img.thumbUrl} />
                  </div>
                );
              })
            : null}
        </div>
      </div>
      <div className="image-upload-container">
        <label className="custom-image-upload">
          <StyledInput
            key={uniqueId()}
            type="file"
            onChange={onAddImage}
            className="filetype"
            id="group_image"
          />
          <span className="material-icons">cloud_upload</span>
          Thêm ảnh
        </label>
      </div>
    </div>
  );
};

export default Banner;

const StyledInput = styled.input`
  display: none;
`;
