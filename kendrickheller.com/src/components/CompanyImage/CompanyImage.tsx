import './CompanyImage.css';
import React from 'react';
import { useGetCompanyImage } from 'src/api/backend-api';
import { useState } from 'react';
import { useEffect } from 'react';
import { ImageType } from 'src/api/models';
import useModal from 'src/hooks/useModal';
import FullSizeImage from '../FullSizeImage/FullSizeImage';
import { useTranslation } from 'react-i18next';

const CompanyImage: React.FC = () => {
  //State
  const [images, setImages] = useState<ImageType[]>([]);
  const fullsizeModal = useModal(FullSizeImage, undefined, false);

  const { t, i18n } = useTranslation();
  const getCompanyImage = useGetCompanyImage();

  useEffect(() => {
    getCompanyImage()
      .then((res) => {
        setImages(res);
      });
  }, [getCompanyImage]);

  //Main
  return (
    <div className="company-image-container">
      <div className="company-image-title">
        {t("PICTURES OF CUSTOMERS AND OUR ACTIVITIES")}
      </div>
      <div className="company-image-content">
        {images.map((companyImage: ImageType, index: number) => {
          return (
            <div className="company-image-child" key={`companyimage${index}`}>
              <img loading="lazy" src={companyImage.fileUrl} onClick={() => {
                fullsizeModal.handlePresent({
                  images: images,
                  index: index,
                  hidden: fullsizeModal.handleDismiss
                })
              }} />
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default CompanyImage;
