import React, { useEffect, useState } from 'react';
import { useGetRoomBadge } from 'src/api/roomApi';
import { useGetReloadChatlg } from 'src/state/application/hooks';
import ChatList from '../ChatList/ChatList';

const ChatIcon: React.FC = () => {
  const [isShow, setIsShow] = useState(false);
  const [badge, setBadge] = useState(0);
  const getRoomBadge = useGetRoomBadge();
  const reloadChatlg = useGetReloadChatlg();
  const onHiddenPopup = () => {
    setIsShow(false);
  };

  useEffect(() => {
    const handleClick = (event: any) => {
      const chatPopup = document.getElementById('chat-popup');
      const btnShowChat = document.getElementById('btn-show-chat');
      if (
        btnShowChat &&
        chatPopup &&
        !btnShowChat.contains(event.target) &&
        !chatPopup.contains(event.target)
      ) {
        setIsShow(false);
      }
    };

    document.addEventListener('click', handleClick, false);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    getRoomBadge()
      .then((badge) => {
        setBadge(badge);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reloadChatlg, getRoomBadge, setBadge]);

  //Main
  return (
    <div className="base-head-icon">
      <i
        className="fas fa-comment"
        style={{ fontSize: 20 }}
        onClick={() => setIsShow(!isShow)}
        title="Trò chuyện"
        id="btn-show-chat"
      ></i>
      {badge > 0 ? <div className="badge">{badge}</div> : null}
      {isShow ? <ChatList onHiddenPopup={onHiddenPopup} /> : null}
    </div>
  );
};
export default ChatIcon;
