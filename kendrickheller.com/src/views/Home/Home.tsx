import './Home.css';
import React from 'react';
import { useGetBanner, useGetRealm } from 'src/api/backend-api';
import { useEffect } from 'react';
import { useState } from 'react';
import Banner from 'src/components/Banner/Banner';
import { useSetNotificationBadge } from 'src/state/application/hooks';
import { useGetBadge } from 'src/api/notificationApi';
import useProfile from 'src/hooks/useProfile';
import { useGetCategory } from 'src/api/productCategoryApi';
import { CategoryType, RealmType } from 'src/api/models';
import Realms from 'src/components/Realms/Realms';
import Categories from 'src/components/Categories/Categories';
import Products from 'src/components/Products/Products';
import FeaturedNews from '../../components/FeaturedNews/FeaturedNews';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  //Define
  const profile = useProfile();

  //State
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [category, setCategory] = useState<CategoryType>();
  const [realm, setRealm] = useState<RealmType>();
  const { t, i18n } = useTranslation();
  const getBanner = useGetBanner();
  const getRealm = useGetRealm();
  const getBadge = useGetBadge();
  const setNotificationBadge = useSetNotificationBadge();
  const getCategories = useGetCategory();

  useEffect(() => {
    getBanner().then(res => setBanners(res));
    getCategories().then(res => setCategories(res));
    if (profile) getBadge().then(res => setNotificationBadge(res));


  }, [getBadge, getBanner, getCategories, getRealm, profile, setNotificationBadge]);

  //Main
  return (
    <>
      <div className="banner-home-container">
        <Banner key="banner" listImages={banners} startNumber={1} />
      </div>
      <div className='home-info'>
        <Categories categories={categories} selectedCategory={category} onSelect={(item) => {
          setRealm(undefined);
          setCategory(!category || item.productCategoryId != category.productCategoryId ? item : undefined);
        }} />
      </div>
      <div className="realm-description">{t(realm?.description ?? 'CATEGORY_TITLE2')}</div>
      <Products categoryId={category?.productCategoryId} realmId={realm?.productRealmId} />
    </>
  );
};

export default Home;
