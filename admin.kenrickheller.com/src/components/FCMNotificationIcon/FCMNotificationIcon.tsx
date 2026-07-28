import React, { useEffect, useState } from 'react';
import FCMNotificationList from '../FCMNotificationList/FCMNotificationList';
import { useGetBadge, useSeenNotification } from 'src/api/notificationApi';
import { useGetReloadNotificationFlg } from 'src/state/application/hooks';

const FCMNotificationIcon: React.FC = () => {
  const seenNotification = useSeenNotification();
  const getBadge = useGetBadge();
  const [badge, setBadge] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const reloadNotificationFlg = useGetReloadNotificationFlg();

  const onHiddenPopup = () => {
    setIsShow(false);
  };

  useEffect(() => {
    const handleClick = (event: any) => {
      const notiPopup = document.getElementById('noti-popup');
      const btnShowNoti = document.getElementById('btn-show-noti');
      if (
        btnShowNoti &&
        notiPopup &&
        !btnShowNoti.contains(event.target) &&
        !notiPopup.contains(event.target)
      ) {
        setIsShow(false);
      }
    };

    document.addEventListener('click', handleClick, false);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    console.log('Cập nhật badge');
    getBadge()
      .then((badge) => {
        console.log(badge);
        setBadge(badge);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reloadNotificationFlg, getBadge, setBadge]);

  const onClickIcon = () => {
    console.log('click icon');
    seenNotification()
      .then(() => {
        setBadge(0);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsShow(!isShow);
  };

  //Main
  return (
    <div className="base-head-icon">
      <i
        className="fas fa-bell"
        style={{ fontSize: 20 }}
        onClick={onClickIcon}
        title="Thông báo"
        id="btn-show-noti"
      ></i>
      {badge > 0 ? <div className="badge">{badge}</div> : null}
      {isShow ? <FCMNotificationList onHiddenPopup={onHiddenPopup} /> : null}
    </div>
  );
};
export default FCMNotificationIcon;
