import React, { useState, useEffect } from 'react';
import './FCMNotification.css';

import { onMessageListener } from '../../firebase';
import { getStrTime } from 'src/utils/formatTime';
import styled from 'styled-components';
import { animated, useSpring } from 'react-spring';
import { useNotifyChat, useReloadNotification } from 'src/state/application/hooks';
import { useNavigate  } from 'react-router-dom';
import { useReadNotificationById } from 'src/api/notificationApi';
import { getNotificationUrl } from 'src/utils/notificationUtils';
import { EnumNotiTemplateKey } from 'src/api/models';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';

interface IFCMNotification {
  title: string;
  body: string;

  avatar: string;
  fromUser: string;
  notificationTemplateKey: string;
  time: string;
  notificationId: number;
  extendData: string;
}

const Snackbar = styled.div<{ indx: number }>`
  min-width: 250px;
  height: 106px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 8px;
  position: fixed;
  z-index: 1;
  right: 50px;
  top: ${({ indx }) => (indx + 1) * 30 + indx * 106}px;
  display: flex;
  font-size: small;
`;

const AnimatedSnackbar = animated(Snackbar);
const fcmData: { [messageId: string]: IFCMNotification } = {};
const FCMNotification: React.FC = () => {
  const [data, setData] = useState<{ [messageId: string]: IFCMNotification }>({});
  const reloadNotificationFlg = useReloadNotification();
  const readNotificationById = useReadNotificationById();
  const notifyChat = useNotifyChat();
  const { backendWs } = useConfiguration();

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connectWS = () => {
      ws = new WebSocket(`${backendWs}/admin-notifications`);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'CHAT_NOTIFICATION' && msg.roomId) {
             notifyChat(msg.roomId);
          }
        } catch (e) {
          console.error('Invalid admin-notification message', e);
        }
      };
      ws.onclose = () => {
        // Reconnect after 5 seconds
        reconnectTimer = setTimeout(connectWS, 5000);
      };
    };

    if (backendWs) {
      connectWS();
    }

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [backendWs, notifyChat]);

  const removeNotification = (messageId: string) => {
    if (messageId in fcmData) {
      delete fcmData[messageId];
    }
    setData({ ...fcmData });
  };

  onMessageListener()
    .then((payload: any) => {
      console.log(payload);
      const templateKey = payload?.data?.notificationTemplateKey;
      if (templateKey) {
        switch (templateKey) {
          case EnumNotiTemplateKey.CHAT:
            if (payload?.data?.extendData) {
              const extendData = JSON.parse(payload?.data?.extendData);
              notifyChat(extendData.roomId);
            }
            break;
          default:
            fcmData[payload.messageId] = {
              notificationId: payload?.data?.notificationId,
              title: payload?.notification?.title,
              body: payload?.notification?.body,
              avatar: payload?.data?.avatar,
              fromUser: payload?.data?.fromUser,
              notificationTemplateKey: payload?.data?.notificationTemplateKey,
              time: getStrTime(),
              extendData: payload?.data?.extendData,
            };
            setData({ ...fcmData });
            setTimeout(() => {
              reloadNotificationFlg();
            }, 1000);
            setTimeout(() => {
              removeNotification(payload.messageId);
            }, 10000);
            break;
        }
      }
    })
    .catch((err) => console.log('failed: ', err));

  const onClick = (item: IFCMNotification) => {
    console.log('Click ' + item.notificationId);
    readNotificationById(item.notificationId);
    const url = getNotificationUrl(item.notificationTemplateKey, item.extendData);
    window.open(url);
  };

  const faderStyle = useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
    <div className="fb-notification">
      {Object.entries(data).map(([key, item], indx) => {
        return (
          <AnimatedSnackbar
            indx={indx}
            style={faderStyle}
            id={key}
            onClick={() => onClick(item)}
          >
            {item?.avatar ? (
              <div className="nav-logo">
                <div>
                  <img src={item?.avatar} />
                </div>
              </div>
            ) : null}
            <div>
              <div className="toast-header">
                <strong className="mr-auto text-primary">{item?.title}</strong>
                <small className="text-muted">{item?.time}</small>
                <span
                  className="ml-2 mb-1 close cancel-notification"
                  data-dismiss="toast"
                  onClick={(e) => {
                    removeNotification(key);
                    e.stopPropagation();
                  }}
                >
                  &times;
                </span>
              </div>
              <div
                className="toast-body"
                dangerouslySetInnerHTML={{
                  __html: item?.body,
                }}
              />
            </div>
          </AnimatedSnackbar>
        );
      })}
    </div>
  );
};

export default FCMNotification;
