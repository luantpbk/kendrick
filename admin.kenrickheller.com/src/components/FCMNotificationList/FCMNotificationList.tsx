import React, { useEffect, useState } from 'react';
import { useNavigate  } from 'react-router';
import {
  EnumDisplayConfig,
  EnumNotificationStatus,
  EnumNotiTemplateKey,
  NotificationType,
} from 'src/api/models';
import {
  useGetNotification,
  useReadAllNotification,
  useReadNotificationById,
} from 'src/api/notificationApi';
import InfiniteScroll from 'react-infinite-scroll-component';
import './FCMNotificationList.css';
import { getNotificationUrl } from 'src/utils/notificationUtils';
import { useGetReloadNotificationFlg } from 'src/state/application/hooks';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';

interface IDBHB {
  onHiddenPopup: (...args: any[]) => any;
}

const FCMNotificationList: React.FC<IDBHB> = (props) => {
  //Value
  const navigate = useNavigate();
  const size = 10;

  //State
  const [notiList, setNotiList] = useState<NotificationType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const reloadNotificationFlg = useGetReloadNotificationFlg();
  const { defaultAvatar } = useConfiguration();

  //Function
  const getNotification = useGetNotification();
  const readAllNotification = useReadAllNotification();
  const readNotificationById = useReadNotificationById();

  const onReadById = (notificationId: number) => {
    readNotificationById(notificationId)
      .then(() => {
        const index = notiList.findIndex((n) => n.notificationId == notificationId);
        notiList[index].status = EnumNotificationStatus.Read;
        setNotiList([...notiList]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openNotification = (
    templateKey: EnumNotiTemplateKey,
    notificationData: string,
    notificationId: number,
  ) => {
    onReadById(notificationId);
    const url = getNotificationUrl(templateKey, notificationData);
    navigate(url);
  };

  const fetchData = (reset: boolean) => {
    const cpage = reset ? 1 : page;
    getNotification(size, cpage)
      .then((res) => {
        const nList = reset ? res.data.items : [...notiList, ...res.data.items];
        setNotiList(nList);
        if (res.data.items.length < size) {
          setHasMore(false);
        } else {
          setHasMore(true);
          setPage(cpage + 1);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadNotificationFlg]);

  //Main
  return (
    <div className={`noti-web-con show`} id="noti-popup">
      <div className="noti-tick-all-container">
        <div
          className="noti-tick-all"
          onClick={() => {
            readAllNotification();
          }}
        >
          <a href="">
            <i>Đánh dấu tất cả đã đọc</i>
          </a>
        </div>
      </div>
      <div className="infinite-scr-con" id="scrollableDiv">
        <InfiniteScroll
          dataLength={notiList.length}
          next={() => fetchData(false)}
          hasMore={hasMore}
          style={{ display: 'flex', flexDirection: 'column' }}
          scrollableTarget="scrollableDiv"
          loader={<h4></h4>}
          endMessage={<p style={{ textAlign: 'center' }}></p>}
        >
          {notiList.map((value) => {
            return (
              <div
                className={`noti-component ${
                  value.status == EnumNotificationStatus.Read ? 'read' : ''
                }`}
                onClick={() => {
                  openNotification(
                    value.notificationTemplateKey,
                    value.notificationData,
                    value.notificationId,
                  );
                  props.onHiddenPopup();
                }}
              >
                <div className="noti-avt">
                  {value.avataUrl ? (
                    <img src={value.avataUrl} alt="avt" />
                  ) : (
                    <div className="noti-avt-null"></div>
                  )}
                </div>
                <div className="noti-content">
                  <div className="noti-title">
                    <div>{value.notificationTitle}</div>
                    <div style={{ fontSize: 12 }}>{value.createdAt}</div>
                  </div>
                  <div className="noti-main">
                    <div
                      className="noti-value"
                      dangerouslySetInnerHTML={{
                        __html: value.notificationValue,
                      }}
                    />
                    <div
                      className={`noti-tick ${
                        value.status != EnumNotificationStatus.Read ? 'blue' : ''
                      }`}
                      onClick={(e) => {
                        if (value.status != EnumNotificationStatus.Read) {
                          onReadById(value.notificationId);
                          e.stopPropagation();
                        }
                      }}
                    >
                      <i className="fas fa-eye"></i>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {notiList.length == 0 ? (
            <div className="noti-component read">
              <div className="noti-avt">
                <img src={defaultAvatar} alt="avt" />
              </div>
              <div className="noti-content">
                <div className="noti-title">
                  <div>{'Bạn chưa có thông báo nào'}</div>
                </div>
                <div className="noti-main">
                  <div className="noti-value">
                    {'Chúc bạn có những trải nghiệm thú vị cùng JVSCorp!'}
                  </div>
                  <div className="noti-tick">
                    <i className="fas fa-eye"></i>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default FCMNotificationList;
