/* eslint-disable react-hooks/exhaustive-deps */
import './OrderRequirement.css';
import React, { useEffect, useState } from 'react';
import useProfile from 'src/hooks/useProfile';
import { Navigate } from 'react-router';
import Images from 'src/assets/img';
import { OrderRequirementType, PageData } from 'src/api/models';
import { useGetOrderRequirement } from 'src/api/orderRequirementApi';
import OrderRequirementComponent from 'src/components/OrderRequirementComponent/OrderRequirementComponent';
import { PageContainer, PageHeader } from 'src/components/GlobalStyled';
import { NavLink } from 'react-router-dom';
import Products from 'src/components/Products/Products';
import Loading from 'src/components/Loading';
import { useTranslation } from 'react-i18next';
import InfiniteList from 'src/components/InfiniteList/InfiniteList';

const OrderRequirement: React.FC = () => {
  //Value
  const profile = useProfile();
  const SIZE = 20;
  const { t, i18n } = useTranslation();
  //State
  const [orders, setOrders] = useState<OrderRequirementType[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFlag, setLoadingFlag] = useState(true);
  //End of state

  //Function
  const getOrderRequirement = useGetOrderRequirement();

  const fetchData = (reset: boolean) => {
    setLoadingFlag(true);
    const cpage = reset ? 1 : page;
    getOrderRequirement(cpage, SIZE).then((r: PageData<OrderRequirementType>) => {
      const nList = reset ? r.items : [...orders, ...r.items];
      setOrders(nList);
      if (nList.length < r.count) {
        setHasMore(true);
        setPage(cpage + 1);
      } else {
        setHasMore(false);
      }
    }).finally(() => setLoadingFlag(false));
  };


  //End of component

  useEffect(() => {
    fetchData(true);
  }, []);

  //Main
  return (profile ?
    <>
      <PageContainer>
        <PageHeader>
          <NavLink to={'/'}>{t("Home")}</NavLink>{` / `}{t("Order list")}
        </PageHeader>
        <InfiniteList fetchData={fetchData} hasMore={hasMore} isHorizontally={false}>
          {orders.map((value, index) => {
            return (
              <OrderRequirementComponent
                key={`orderrequirement${index}`}
                data={value}
              />
            );
          })}
          {loadingFlag && <div className='refresh-loading'>
            <Loading color='gray' />
          </div>}
          {!loadingFlag && orders.length == 0 &&
            <div className="text-center" style={{ margin: "auto" }}>
              <img src={Images.empty_list} width="200" height="200" />
              <div><label>{t("Your order is empty")}</label></div>
              <div><i>{t("Wishing you all the best!")}</i></div>
            </div>}
        </InfiniteList>

      </PageContainer >

      <div className='related-products-title'>{t("RELATED PRODUCTS")}</div>
      <Products isHorizontally={true} />
    </>
    : <Navigate to="/auth-screen" />
  );
};

export default OrderRequirement;
