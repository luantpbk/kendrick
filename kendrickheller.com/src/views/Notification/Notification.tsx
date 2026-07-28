/* eslint-disable react-hooks/exhaustive-deps */
import './Notification.css';
import React, { useEffect, useState } from 'react';
import useProfile from 'src/hooks/useProfile';
import { Navigate } from 'react-router';
import { useGetNotification, useReadAllNotification, useReadNotificationById, useSeenNotification } from 'src/api/notificationApi';
import { EnumDisplayConfig, EnumNotificationStatus, EnumNotiTemplateKey, NotificationType } from 'src/api/models';
import { NavLink } from 'react-router-dom';
import Images from 'src/assets/img';
import { PageContainer, PageHeader } from 'src/components/GlobalStyled';
import Loading from 'src/components/Loading';
import InfiniteList from 'src/components/InfiniteList/InfiniteList';
import { useTranslation } from 'react-i18next';

const Notification: React.FC = () => {
  //Value
  const profile = useProfile();
  const seenNotification = useSeenNotification();

  //Value
  const SIZE = 20;

  //State
  const [notificationList, setNotificationList] = useState<NotificationType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [loadingFlag, setLoadingFlag] = useState(true);

  const { t, i18n } = useTranslation();


  //Function
  const getNotification = useGetNotification();
  const readNotificationById = useReadNotificationById();
  const readAllNotification = useReadAllNotification();

  const onReadById = (notificationId: number) => {
    readNotificationById(notificationId)
      .then(() => {
        setReloadFlag(!reloadFlag);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getNotificationUrl = (templateKey: string, notificationData: string) => {
    let url: string;
    const extendData = JSON.parse(notificationData);
    switch (templateKey) {
      case EnumNotiTemplateKey.NOTE:
        switch (extendData.functionId) {
          case EnumDisplayConfig.Danh_sach_dat_hang:
            url = `/order-requirement/${extendData.objectId}`;
            break;
          default:
            break;
        }
        break;
      case EnumNotiTemplateKey.CREATE_ORDER_REQUIREMENT:
        url = `/order-requirement/${extendData.orderRequirementId}`;
        break;
      default:
        break;
    }

    return url;
  };

  const onCheck = (
    notificationTemplateKey: EnumNotiTemplateKey,
    notificationData: string,
    notificationId: number,
  ) => {
    const url = getNotificationUrl(notificationTemplateKey, notificationData);
    window.open(url, '_blank');
    onReadById(notificationId);
    setReloadFlag(!reloadFlag);
  };

  const fetchData = (reset: boolean) => {
    setLoadingFlag(true);
    const cpage = reset ? 1 : page;
    getNotification(SIZE, cpage)
      .then((r) => {
        const nList = reset ? r.data.items : [...notificationList, ...r.data.items];
        setNotificationList(nList);
        if (nList.length >= r.data.count) {
          setHasMore(false);
        } else {
          setHasMore(true);
          setPage(page + 1);
        }
      })
      .finally(() => setLoadingFlag(false));
  };

  //useEffect
  useEffect(() => {
    fetchData(true);
  }, [reloadFlag]);


  useEffect(() => {
    seenNotification();
  }, [seenNotification]);

  //Main
  return (profile ? <PageContainer>
    <PageHeader>
      <NavLink to={'/'}>{t("Home")}</NavLink>{` / `}{t("Notification")}
    </PageHeader>
    <InfiniteList fetchData={fetchData} hasMore={hasMore} isHorizontally={false}>
      {notificationList.length > 0 && <div className="noti-tick-all-container">
        <div className="noti-tick-all" onClick={() => readAllNotification()}>
          <a href=""><i className="fas fa-eye"></i> <i>{t("Mark all as read")}</i></a>
        </div>
      </div>}
      {notificationList.map((value: NotificationType, index) => {
        return (
          <div className={`noti-component ${value.status == EnumNotificationStatus.Read ? 'read' : ''}`}
            key={`notification-item-${index}`}
            onClick={() => onCheck(value.notificationTemplateKey, value.notificationData, value.notificationId)} >
            <div className="noti-avt">
              {value.avataUrl ? (
                <img src={value.avataUrl} alt="avt" />
              ) : (
                <div className="noti-avt-null">avt</div>
              )}
            </div>
            <div className="noti-value">
              <div className="noti-title">
                <div>{t(value.notificationTitle)}</div>
                <div style={{ fontSize: 12 }}>{value.createdAt}</div>
              </div>
              <div className="noti-main">
                <div
                  dangerouslySetInnerHTML={{
                    __html: eval(`value?.${i18n.language}??''`),
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
      {loadingFlag && <div className='refresh-loading'>
        <Loading color='gray' />
      </div>}
    </InfiniteList>
    {!loadingFlag && notificationList.length == 0 &&
      <div className="text-center">
        <img
          src={Images.notification_img}
          width="160"
          height="160"
          className="img-fluid mb-4 mr-3"
        />
        <div><label>{t("You don't have any notifications")}</label></div>
        <div><i>"{t("Wishing you all the best!")}"</i></div>
      </div>}

  </PageContainer> : <Navigate to="/auth-screen" />);
};

export default Notification;
