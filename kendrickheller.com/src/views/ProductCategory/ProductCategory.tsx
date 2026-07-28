import './ProductCategory.css';
import React, { useEffect } from 'react';
import { useSetNotificationBadge } from 'src/state/application/hooks';
import { useGetNotification } from 'src/api/notificationApi';
import useProfile from 'src/hooks/useProfile';

const ProductCategory: React.FC = () => {
  //Define
  const profile = useProfile();

  //Function
  const getNotification = useGetNotification();
  const setNotificationBadge = useSetNotificationBadge();

  useEffect(() => {
    if (profile) {
      getNotification(1, 1)
        .then((data) => {
          setNotificationBadge(data.badge);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [getNotification, profile, setNotificationBadge]);

  //Main
  return (
    <div className="body col-lg-11 col-12 p-0">
      {/* <CategoryListComponent />
      <Body showCategory={true} /> */}
    </div>
  );
};

export default ProductCategory;
