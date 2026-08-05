import React, { useEffect } from 'react';
import { useGetProfileInfo, useNotifyChat } from 'src/state/application/hooks';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';

const UserNotification: React.FC = () => {
  const profile = useGetProfileInfo();
  const notifyChat = useNotifyChat();
  const { backendWs } = useConfiguration();

  useEffect(() => {
    let ws: WebSocket;
    if (profile?.accessToken && backendWs) {
      ws = new WebSocket(`${backendWs}/user-notifications?token=${profile.accessToken}`);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'CHAT_NOTIFICATION') {
            notifyChat(data.roomId);
          }
        } catch (e) {
          console.error(e);
        }
      };
      
      ws.onerror = (err) => {
        console.error("UserNotification WebSocket error", err);
      };
    }
    return () => {
      if (ws) ws.close();
    };
  }, [profile?.accessToken, backendWs, notifyChat]);

  return null;
};

export default UserNotification;
