
import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

interface ISwipingTouchable {
  children: React.ReactNode;
  onRightAction: () => void;
  onLeftAction: () => void;
  className?: string;
}

const SwipingTouchable: React.FC<ISwipingTouchable> = (props) => {
  //Value
  const { children, onRightAction, onLeftAction, className } = props;
  const container = useRef<HTMLDivElement>();
  //sự kiện trên mobi rê qua trái, và rê qua phải
  const xDown = useRef<number>();
  const yDown = useRef<number>();
  const xUp = useRef<number>();
  const yUp = useRef<number>();

  const touchstart = useCallback((evt: Event) => {
    const firstTouch = (evt as TouchEvent).touches[0];
    xDown.current = firstTouch.clientX;
    yDown.current = firstTouch.clientY;
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const touchmove = useCallback((evt: Event) => {
    if (!xDown || !yDown) return;
    xUp.current = (evt as TouchEvent).touches[0].clientX;
    yUp.current = (evt as TouchEvent).touches[0].clientY;
  }, []);
  const touchend = useCallback(
    () => {
      const xDiff = xUp.current - xDown.current,
        yDiff = yUp.current - yDown.current;
      if (
        Math.abs(xDiff) > Math.abs(yDiff) &&
        Math.abs(xDiff) > 0.1 * document.body.clientWidth
      ) {
        if (xDiff < 0) {
          onRightAction();
        } else {
          onLeftAction();
        }
        xDown.current = null;
        yDown.current = null;
      }
    },
    [onLeftAction, onRightAction],
  );
  //End of function


  useEffect(() => {
    container.current?.addEventListener('touchstart', touchstart, false);
    container.current?.addEventListener('touchmove', touchmove, false);
    container.current?.addEventListener('touchend', touchend, false);
    return () => {
      container.current?.removeEventListener('touchstart', touchstart, false);
      container.current?.removeEventListener('touchmove', touchmove, false);
      container.current?.removeEventListener('touchend', touchend, false);
    };
  }, [touchend, touchmove, touchstart]);


  return (
    <div className={className} ref={container}>
      {children}
    </div>
  );

};

export default SwipingTouchable;


