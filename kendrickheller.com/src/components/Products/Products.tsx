import './Products.css';
import React, { useCallback, useRef } from 'react';
import { CategoryAttributeType, PageData, ProductType } from 'src/api/models';
import { useGetProduct } from 'src/api/backend-api';
import { useEffect, useState } from 'react';
import ProductPcComponent from './ProductPcComponent/ProductPcComponent';
import { useGetCategoryAttribute } from 'src/api/productCategoryApi';
import InfiniteList from '../InfiniteList/InfiniteList';

interface IProducts {
  realmId?: number;
  categoryId?: number;
  isHorizontally?: boolean;
}

const Products: React.FC<IProducts> = (props) => {
  const SIZE = 20;

  const { realmId, categoryId, isHorizontally } = props;

  //State
  const [products, setProducts] = useState([]);
  const [configs, setConfigs] = useState<{ [productCategoryId: number]: CategoryAttributeType[] }>({});
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  //End of state
  const getProduct = useGetProduct();
  const getCategoryAttribute = useGetCategoryAttribute();

  const fetchData = useCallback((reset: boolean) => {
    setHasMore(false);
    const categories = categoryId ? [categoryId] : [];
    const realms = realmId ? [realmId] : [];
    const cpage = reset ? 1 : page;
    getProduct('', cpage, SIZE, realms, categories).then((r: PageData<ProductType>) => {
      const categoryIds = r.items.filter(p => !(p.productCategoryId in configs)).map(p => p.productCategoryId);
      if (categoryIds.length > 0) {
        getCategoryAttribute(categoryIds).then((attRes) => {
          const nConfigs = { ...configs, ...attRes };
          setConfigs(nConfigs);
        })
      }

      const nList = reset ? r.items : [...products, ...r.items];
      setProducts(nList);
      if (nList.length < r.count) {
        setHasMore(true);
        setPage(cpage + 1);
      } else {
        setHasMore(false);
      }
    });
  }, [categoryId, configs, hasMore, getCategoryAttribute, getProduct, page, products, realmId]);

  useEffect(() => {
    fetchData(true);
  }, [categoryId, realmId]);


  //Main
  return (
    <InfiniteList fetchData={fetchData} hasMore={hasMore} isHorizontally={isHorizontally} className={!isHorizontally ? 'product-content' : ""}>
      {products.map((item: ProductType, index: number) => {
        return (
          <ProductPcComponent
            key={`productpccomponent${index}`}
            product={item}
            configs={configs[item.productCategoryId]}
            isHorizontally={isHorizontally}
            isPriority={index < 4}
          />
        );
      })}
    </InfiniteList>
  );
};

export default Products;
