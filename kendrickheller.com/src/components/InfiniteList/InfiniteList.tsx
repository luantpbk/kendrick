import './InfiniteList.css';
import React, { useEffect, useRef } from 'react';

interface IInfiniteList {
  children: React.ReactNode;
  isHorizontally: boolean;
  fetchData: (...args) => void;
  hasMore: boolean;
  className?: string;
}


const InfiniteList: React.FC<IInfiniteList> = (props) => {

  const { children, isHorizontally, fetchData, hasMore, className } = props;
  const proRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (isHorizontally) {
      proRef.current.onscroll = (e) => {
        if (hasMore && proRef.current.scrollWidth - proRef.current.scrollLeft - proRef.current.clientWidth < 10) {
          fetchData(false);
        }
      }
    } else {
      const onScroll = () => {
        if (hasMore && window.scrollY + window.innerHeight >= proRef.current.offsetTop + proRef.current.clientHeight) {
          fetchData(false);
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

  }, [fetchData])

  return (
    <div className={`infinite-list-content ${className} ${isHorizontally ? 'horizontaly' : 'vetically'}`} ref={proRef}>
      {children}
    </div>
  );
};

export default InfiniteList;
