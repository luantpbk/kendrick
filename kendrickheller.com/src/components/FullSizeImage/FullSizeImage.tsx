
import React, { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { ImageType } from 'src/api/models';
import { useCallback } from 'react';
import './FullSizeImage.css';
import SwipingTouchable from '../SwipingTouchable/SwipingTouchable';

interface IFullSizeImage {
  images: ImageType[];
  index: number;
  hidden: () => void;
}

const FullSizeImage: React.FC<IFullSizeImage> = (props) => {
  //Value
  const { images, index: initIndex, hidden } = props;
  const [index, setIndex] = useState(initIndex);

  const escFunction = useCallback((event: KeyboardEvent) => {
    console.log(event.key);
    if (event.key === 'Escape') {
      hidden();
    }
    if (event.key === 'ArrowLeft') {
      setIndex(index - 1 >= 0 ? index - 1 : images.length - 1);
    }
    if (event.key === 'ArrowRight') {
      setIndex(index + 1 < images.length ? index + 1 : 0);
    }
  }, [hidden, images.length, index]);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);




  return (
    <SwipingTouchable
      className={`fullsize-image-container`}
      onLeftAction={() => setIndex(index - 1 >= 0 ? index - 1 : images.length - 1)}
      onRightAction={() => setIndex(index + 1 < images.length ? index + 1 : 0)}>
      <img className="fullsize-image" src={images[index]?.fileUrl} alt={images[index]?.fileName} />
      {images.length > 1 && <div className="btn-nav-image back" onClick={() => setIndex(index - 1 >= 0 ? index - 1 : images.length - 1)}>
        <i className="fas fa-chevron-left" />
      </div>}
      {images.length > 1 && <div className="btn-nav-image next" onClick={() => setIndex(index + 1 < images.length ? index + 1 : 0)}>
        <i className="fas fa-chevron-right" />
      </div>}
      <i className="fas fa-times fullsize-image-close" onClick={hidden} />
      {images.length > 1 && <div className='image-dot-wrapper'>
        {images.map((image: ImageType, indx: number) => {
          return (
            <div
              key={`image-dot${indx}`}
              className={`image-dot ${indx == index ? 'show' : ''}`}
              title={image?.fileName}
              onClick={() => setIndex(indx)}
            />
          );
        })}

      </div>}

    </SwipingTouchable>
  );

};

export default FullSizeImage;


