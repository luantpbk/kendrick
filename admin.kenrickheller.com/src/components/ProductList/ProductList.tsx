/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import './ProductList.css';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { ProductType } from 'src/api/models';
import { useGetProduct } from 'src/api/productApi';
import { number2money } from 'src/utils/numberUtils';
import useDebounce from 'src/hooks/useDebounce';
import { useAddPopup } from 'src/state/application/hooks';
import { useGetProductRealm } from 'src/api/productRealmApi';

interface IProductList {
  onSelect: (...args: any[]) => any;
  onHidden: (...args: any[]) => any;
}

const ProductList: React.FC<IProductList> = (props) => {
  const size = 20;

  //State
  const [productList, setProductList] = useState<ProductType[]>([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState<string>('');
  const keywordDebound = useDebounce(keyword, 500);
  const [hasMore, setHasMore] = useState(true);
  const getProduct = useGetProduct();
  const first = useRef(true);
  const { defaultAvatar } = useConfiguration();
  const addPopup = useAddPopup();
  const getRealms = useGetProductRealm();

  const fetchData = (reset: boolean) => {
    const cpage = reset ? 1 : page;
    getProduct(keyword, cpage, size, undefined, undefined, undefined)
      .then((res) => {
        const nList = reset ? res.items : [...productList, ...res.items];
        setProductList(nList);
        if (res.items.length < size) {
          setHasMore(false);
        } else {
          setHasMore(true);
          setPage(cpage + 1);
        }
      })
      .catch((e) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: e.message,
          },
        });
      });
  };

  useEffect(() => {
    fetchData(true);
  }, [keywordDebound]);

  useEffect(() => {
    const handleClick = (event: any) => {
      const productPopup = document.getElementById('product-list-popup');
      if (!first.current && productPopup && !productPopup.contains(event.target)) {
        props.onHidden();
      }
      first.current = false;
    };
    document.addEventListener('click', handleClick, false);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  //Main
  return (
    <div className={`product-list-web-con show`} id="product-list-popup">
      <input
        className="product-list-search"
        type="text"
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
        }}
      />
      <i className="fas fa-search product-list-search-icon"></i>
      <div className="infinite-scr-con" id="product-list-content">
        <InfiniteScroll
          dataLength={productList.length}
          next={() => fetchData(false)}
          hasMore={hasMore}
          style={{ display: 'flex', flexDirection: 'column' }}
          scrollableTarget="product-list-content"
          loader={<h4></h4>}
          endMessage={<p style={{ textAlign: 'center' }}></p>}
        >
          {productList.map((value, index) => {
            return (
              <div
                className="product-list-component"
                key={`product${index}`}
                onClick={() => props.onSelect(value)}
              >
                <div className="product-list-avt">
                  {value.avatar ? (
                    <img src={value.avatar} alt="avt" />
                  ) : (
                    <div className="product-list-avt-null"></div>
                  )}
                </div>
                <div className="product-list-content">
                  <div className="product-list-title">
                    <div>{value.productName}</div>
                  </div>
                  <div>{value.productCode}</div>
                  <div className="product-list-main">
                    <div className="product-list-value">
                      <i>{number2money(value.price)}</i>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {productList.length == 0 ? (
            <div className="product-list-component">
              <div className="product-list-avt">
                <img src={defaultAvatar} alt="avt" />
              </div>
              <div className="product-list-content">
                <div className="product-list-title">
                  <div>{'Chưa có sản phẩm nào'}</div>
                </div>
              </div>
            </div>
          ) : null}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProductList;
