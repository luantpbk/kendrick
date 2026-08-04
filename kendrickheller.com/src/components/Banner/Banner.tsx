import './Banner.css';
import React, { useCallback } from 'react';
import { ImageType } from 'src/api/models';
import { useState } from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';

interface IBanner {
  listImages: ImageType[];
  startNumber: number;
}

const Banner: React.FC<IBanner> = (props) => {
  //State
  const [listBanner, setListBanner] = useState<ImageType[]>(props.listImages);
  const [bannerIndex, setBannerIndex] = useState(0);

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

  useEffect(() => {
    setListBanner(props.listImages);
  }, [props]);

  useEffect(() => {
    const action = listBanner.length > 0 ? setInterval(() => {
      onNextSlide();
    }, 15000) : undefined;
    return () => {
      clearInterval(action);
    };
  }, [listBanner, onNextSlide, onBackSLide]);

  //Touch event
  useEffect(() => {
    const containerCompanyImage = document.getElementsByClassName('banner-wrapper')[0];
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
    <div className="banner-wrapper">
      <div className="banner-container">
        <Wrapper index={bannerIndex}>
          {listBanner.length > 0
            ? listBanner.map((image: ImageType, index: number) => {
              return (
                <picture key={`banner-image${index}`} className="banner-picture">
                  <source media="(max-width: 768px)" srcSet={image.thumbUrl || image.fileUrl} />
                  <source media="(min-width: 769px)" srcSet={image.fileUrl} />
                  <img
                    width="1920"
                    height="900"
                    loading={index === 0 ? "eager" : "lazy"}
                    {...(index === 0 ? { fetchpriority: "high" } as any : {})}
                    className="banner-image"
                    src={image.fileUrl}
                    title="Banner Image"
                    alt="Banner Image"
                  />
                </picture>
              );
            })
            : null}
        </Wrapper>
      </div>
      <div className="dot-banner-container">
        {listBanner.length > 0
          ? listBanner.map((image: ImageType, index: number) => {
            return (
              <div
                key={'dotbanner' + index}
                className={`dot-banner ${bannerIndex === index ? 'show' : ''}`}
                onClick={() => {
                  setBannerIndex(index);
                }}
              ></div>
            );
          })
          : null}
      </div>
      <div className="banner-nav left" onClick={onBackSLide}>
        <i className="fas fa-chevron-left"></i>
      </div>
      <div className="banner-nav right" onClick={onNextSlide}>
        <i className="fas fa-chevron-right"></i>
      </div>
    </div>
  );
};

export default Banner;

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
