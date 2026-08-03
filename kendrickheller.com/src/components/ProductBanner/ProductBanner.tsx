import './ProductBanner.css';
import React, { useCallback } from 'react';
import { ImageType } from 'src/api/models';
import { useState } from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';
import Images from 'src/assets/img';
import useModal from 'src/hooks/useModal';
import FullSizeImage from '../FullSizeImage/FullSizeImage';

interface IBanner {
  listImages: ImageType[];
  startNumber: number;
}

const ProductBanner: React.FC<IBanner> = (props) => {
  //State
  const [listBanner, setListBanner] = useState<ImageType[]>(props.listImages ?? []);
  const [bannerIndex, setBannerIndex] = useState(0);

  const fullsizeModal = useModal(FullSizeImage, undefined, false);

  //Touch event
  let xDown: number = null,
    yDown: number = null,
    xUp: number = null,
    yUp: number = null;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onBackSLide = () => {
    if (bannerIndex >= 1) {
      setBannerIndex(bannerIndex - 1);
    } else setBannerIndex(listBanner.length - 1);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onNextSlide = () => {
    if (bannerIndex <= listBanner.length - 2) {
      setBannerIndex(bannerIndex + 1);
    } else {
      setBannerIndex(0);
    }
  };

  //Touch Event
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const touchstart = (evt: any) => {
    const firstTouch = (evt.touches || evt.originalEvent.touches)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const touchmove = (evt: any) => {
    if (!xDown || !yDown) return;
    xUp = evt.touches[0].clientX;
    yUp = evt.touches[0].clientY;
  };
  const touchend = useCallback(
    (evt: any) => {
      // eslint-disable-next-line prefer-const
      const xDiff = xUp - xDown,
        yDiff = yUp - yDown;
      if (
        Math.abs(xDiff) > Math.abs(yDiff) &&
        Math.abs(xDiff) > 0.2 * document.body.clientWidth
      ) {
        if (xDiff < 0) {
          onNextSlide();
        } else {
          onBackSLide();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (xDown = null), (yDown = null);
      }
    },
    [bannerIndex],
  );
  //End of function

  const backButton = () => {
    return (
      <div className="banner-nav left" onClick={onBackSLide}>
        <i className="fas fa-chevron-left"></i>
      </div>
    );
  };

  const nextButton = () => {
    return (
      <div className="banner-nav right" onClick={onNextSlide}>
        <i className="fas fa-chevron-right"></i>
      </div>
    );
  };


  //End of component

  useEffect(() => {
    setListBanner(props.listImages);
  }, [props]);

  useEffect(() => {
    let action: any;
    if (listBanner.length > 0) {
      action = setInterval(() => {
        onNextSlide();
      }, 10000);
    }
    return () => {
      clearInterval(action);
    };
  }, [listBanner, onNextSlide, onBackSLide]);

  //Touch event
  useEffect(() => {
    const containerCompanyImage = document.getElementsByClassName('product-slide-wrapper')[0];
    containerCompanyImage.addEventListener('touchstart', touchstart, false);
    containerCompanyImage.addEventListener('touchmove', touchmove, false);
    containerCompanyImage.addEventListener('touchend', touchend, false);
    return () => {
      containerCompanyImage.removeEventListener('touchstart', touchstart, false);
      containerCompanyImage.removeEventListener('touchmove', touchmove, false);
      containerCompanyImage.removeEventListener('touchend', touchend, false);
    };
  }, [touchend, touchmove, touchstart]);

  useEffect(() => {
    if (props.startNumber < props.listImages.length) {
      setBannerIndex(props.startNumber);
    } else {
      setBannerIndex(0);
    }
  }, [props.listImages.length, props.startNumber]);

  return (
    <div className="product-slide-container slide-resize">
      <div className='product-slide-thumb-wrapper slide-resize'>
        {listBanner.map((image: ImageType, index: number) => {
          return (
            <img
              key={`product-slide-thumb${index}`}
              className="product-slide-thumb slide-resize"
              src={image?.thumbUrl}
              title="Product Image Thumbnail"
              alt="Product Image Thumbnail"
              onClick={() => {
                setBannerIndex(index);
              }}
            />
          );
        })}

      </div>
      <div className="product-slide-wrapper slide-resize">
        <Wrapper index={bannerIndex}>
          {listBanner.length == 0 && <img src={Images.noimage} title={"Images is empty"} />}
          {listBanner.map((image: ImageType, index: number) => {
            return (
              <img
                key={`product-slide-image${index}`}
                className="product-slide-image slide-resize"
                src={image?.fileUrl}
                title="Product Image"
                alt="Product Image"
                onClick={() => {
                  fullsizeModal.handlePresent({
                    images: listBanner,
                    index: index,
                    hidden: fullsizeModal.handleDismiss
                  })
                }}
              />
            );
          })}
        </Wrapper>
        <div className="dot-slide-container">
          {listBanner.map((image: ImageType, index: number) => {
            return (
              <div
                key={'dotbanner' + index}
                className={`dot-banner ${bannerIndex === index ? 'show' : ''}`}
                onClick={() => {
                  setBannerIndex(index);
                }}
              ></div>
            );
          })}
        </div>

        {backButton()}
        {nextButton()}
      </div>
    </div>
  );
};

export default ProductBanner;

const Wrapper = styled.div<{ index: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  transition: 1s;
  flex-shrink: 0;
  transform: translateX(${({ index }) => `-${index * 100}%`});
`;
