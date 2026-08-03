import React, { useEffect, useState } from 'react';
import { useGetImages, useAddImage, useRegisterExistingImage, useCheckImageUsage, useDeleteImage } from 'src/api/fileApi';
import { ImageType } from 'src/api/models';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import Loading from '../Loading';
import { useAddPopup } from 'src/state/application/hooks';
import './ImageLibraryModal.css';

interface ImageLibraryModalProps {
  onDismiss: () => void;
  onSelect: (image: ImageType) => void;
}

const ImageLibraryModal = (props: ImageLibraryModalProps) => {
  const { onDismiss, onSelect } = props;
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const getImages = useGetImages();
  const addImage = useAddImage();
  const registerExistingImage = useRegisterExistingImage();
  const checkImageUsage = useCheckImageUsage();
  const deleteImage = useDeleteImage();
  const addPopup = useAddPopup();

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await getImages();
      if (res && res.length > 0) {
        setImages(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size <= 5242880) { // 5MB limit
        try {
          const formData = new FormData();
          formData.append('file', file);
          const newImage = await addImage(formData);
          if (newImage) {
            setImages([newImage, ...images]);
            setSelectedImage(newImage);
            addPopup({ txn: { success: true, summary: 'Tải ảnh lên thành công!' } });
          }
        } catch (e) {
          addPopup({ error: { message: 'Tải ảnh lên thất bại', title: 'Lỗi' } });
        }
      } else {
        addPopup({ error: { message: 'Ảnh tối đa 5MB', title: 'Đã có lỗi xảy ra!' } });
      }
    }
  };

  const handleConfirm = async () => {
    if (selectedImage) {
      if (selectedImage.fileId === -1) {
        try {
          setIsRegistering(true);
          const newImage = await registerExistingImage((selectedImage as any).systemName || selectedImage.fileName);
          if (newImage) {
            onSelect(newImage);
            onDismiss();
          }
        } catch (e) {
          addPopup({ error: { message: 'Đăng ký ảnh thất bại', title: 'Lỗi' } });
        } finally {
          setIsRegistering(false);
        }
      } else {
        onSelect(selectedImage);
        onDismiss();
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent, img: ImageType) => {
    e.stopPropagation();

    try {
      let confirmMsg = 'Bạn có chắc chắn muốn xóa vĩnh viễn ảnh này? Thao tác này không thể hoàn tác.';
      let usages: string[] = [];

      if (img.fileId !== -1) {
        usages = await checkImageUsage(img.fileId);
        if (usages && usages.length > 0) {
          confirmMsg = `CẢNH BÁO: Ảnh này đang được sử dụng tại các vị trí sau:\n- ${usages.join('\n- ')}\n\nBạn vẫn muốn bắt buộc xóa?`;
        }
      }

      if (window.confirm(confirmMsg)) {
        const success = await deleteImage(img.fileId, (img as any).systemName);
        if (success) {
          addPopup({ txn: { success: true, summary: 'Xóa ảnh thành công!' } });
          setImages(images.filter(i => {
            if (img.fileId === -1) {
              return (i as any).systemName !== (img as any).systemName;
            }
            return i.fileId !== img.fileId;
          }));
          
          const isSelected = selectedImage?.fileId === -1 
              ? (selectedImage as any)?.systemName === (img as any).systemName 
              : selectedImage?.fileId === img.fileId;
          if (isSelected) {
            setSelectedImage(null);
          }
        }
      }
    } catch (error) {
      addPopup({ error: { message: 'Xóa ảnh thất bại', title: 'Lỗi' } });
    }
  };

  return (
    <div className="image-library-modal" onClick={(e) => e.stopPropagation()}>
      <div className="image-library-header">
        <h2 className="image-library-title">Thư viện ảnh</h2>
        <div className="image-library-actions">
          <label className="library-upload-btn">
            <span className="material-icons">cloud_upload</span>
            Tải ảnh lên
            <input type="file" onChange={handleUpload} accept="image/*" />
          </label>
        </div>
      </div>
      
      <div className="image-library-content">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px' }}>
            <Loading />
          </div>
        ) : images.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', gridColumn: '1 / -1', color: '#888' }}>
            Chưa có hình ảnh nào trong thư viện.
          </div>
        ) : (
          images.map((img, index) => {
            const isSelected = selectedImage?.fileId === -1 
                ? (selectedImage as any)?.systemName === (img as any).systemName 
                : selectedImage?.fileId === img.fileId;
            return (
              <div 
                key={img.fileId === -1 ? `virt-${index}` : img.fileId} 
                className={`library-image-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img.thumbUrl || img.fileUrl} alt={img.fileName} title={img.fileName} />
                
                <div 
                  className="delete-icon" 
                  onClick={(e) => handleDelete(e, img)}
                  title="Xóa ảnh"
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>delete</span>
                </div>

                {isSelected && (
                  <div className="selected-icon">
                    <span className="material-icons" style={{ fontSize: '16px' }}>check</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="image-library-footer">
        <ButtonComponent 
          title="HỦY BỎ" 
          onClick={onDismiss} 
        />
        <ButtonComponent
          title={isRegistering ? "ĐANG TẠO..." : "CHỌN ẢNH NÀY"}
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
};

export default ImageLibraryModal;
