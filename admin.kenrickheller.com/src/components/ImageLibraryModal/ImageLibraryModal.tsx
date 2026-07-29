import React, { useEffect, useState } from 'react';
import { useGetImages, useAddImage } from 'src/api/fileApi';
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

  const getImages = useGetImages();
  const addImage = useAddImage();
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

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onDismiss();
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
          images.map((img) => {
            const isSelected = selectedImage?.fileId === img.fileId;
            return (
              <div 
                key={img.fileId} 
                className={`library-image-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img.thumbUrl || img.fileUrl} alt={img.fileName} title={img.fileName} />
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
          title="CHỌN ẢNH NÀY"
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
};

export default ImageLibraryModal;
