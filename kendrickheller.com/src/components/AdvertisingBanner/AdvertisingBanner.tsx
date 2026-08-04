import './AdvertisingBanner.css';
import React from 'react';
import { ImageType } from 'src/api/models';
import { useState } from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';

interface IBanner {
  listImages: ImageType[];
  startNumber: number;
}

const AdvertisingBanner: React.FC<IBanner> = (props) => {
  //State
  const [listBanner, setListBanner] = useState<ImageType[]>(props.listImages);
  const [bannerIndex, setBannerIndex] = useState(props.startNumber);

  useEffect(() => {
    setListBanner(props.listImages);
  }, [props]);

  useEffect(() => {
    if (props.startNumber < props.listImages.length) {
      setBannerIndex(props.startNumber);
    } else {
      setBannerIndex(0);
    }
  }, [props.listImages.length, props.startNumber]);

  return (
    <div className="banner-wrapper">
      <div className="banner-container">
        <Wrapper index={bannerIndex}>
          {listBanner.length > 0
            ? listBanner.map((image: ImageType, index: number) => {
                return (
                  <img
                    key={`banner-image${index}`}
                    width="1920"
                    height="900"
                    className="banner-image-ad"
                    src={image.fileUrl}
                    title="Advertising Banner"
                    alt="Advertising Banner"
                  />
                );
              })
            : null}
        </Wrapper>
      </div>
    </div>
  );
};

export default AdvertisingBanner;

const Wrapper = styled.div<{ index: number }>`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  transition: 0.5s;
  flex-shrink: 0;
  transform: translateX(${({ index }) => `-${index * 100}%`});
`;
