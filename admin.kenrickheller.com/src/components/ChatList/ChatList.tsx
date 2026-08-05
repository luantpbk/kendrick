import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './ChatList.css';
import { useGetProfileInfo, useNotifyChat, useGetNotifyChat } from 'src/state/application/hooks';
import { EnumChatStatus, MessageType, RoomType } from 'src/api/models';
import { useGetRooms } from 'src/api/roomApi';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { useGetLastestMessages } from 'src/api/messageApi';
import { EnumRoomType } from 'src/common/enum/EnumRoomType';
import styled from 'styled-components';

const AvatarGroupInList = styled.img<{ top: number; left: number }>`
  width: 32px;
  height: 32px !important;
  cursor: pointer;
  border-radius: 50%;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  position: relative;
`;

interface IChatType {
  onHiddenPopup: (...args: any[]) => any;
}

const ChatList: React.FC<IChatType> = (props) => {
  const size = 20;

  //State
  const [roomList, setRoomList] = useState<RoomType[]>([]);
  const messageMap = useRef<{ [roomId: string]: MessageType }>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const getRooms = useGetRooms();
  const getLastestMessages = useGetLastestMessages();
  const notifyChat = useNotifyChat();
  const notifyChatRoomId = useGetNotifyChat();
  const profile = useGetProfileInfo();
  const { defaultAvatar } = useConfiguration();

  const openChat = (roomId: string) => {
    notifyChat(roomId);
    props.onHiddenPopup();
  };

  const fetchData = (reset: boolean) => {
    const cpage = reset ? 1 : page;
    getRooms(size, cpage)
      .then((res) => {
        const roomIds = res.items.map((r) => r.roomId);
        if (roomIds.length > 0) {
          getLastestMessages(roomIds).then((messages) => {
            Object.assign(messageMap.current, messages);
            const nList = reset ? res.items : [...roomList, ...res.items];
            setRoomList(nList);
          }).catch(e => console.log(e));
        } else {
          setRoomList([]);
        }

        if (res.items.length < size) {
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
  }, [notifyChatRoomId]);

  //Main
  return (
    <div className={`chat-list-web-con show`} id="chat-popup">
      <div className="infinite-scr-con" id="chat-content">
        <InfiniteScroll
          dataLength={roomList.length}
          next={() => fetchData(false)}
          hasMore={hasMore}
          style={{ display: 'flex', flexDirection: 'column' }}
          scrollableTarget="chat-content"
          loader={<h4></h4>}
          endMessage={<p style={{ textAlign: 'center' }}></p>}
        >
          {roomList.map((room) => {
            const roomName = room.roomName
              ? room.roomName
              : room.roomUsers
                  .filter((u) => u.userId !== profile.info.userId)
                  .map((u) => u.fullName)
                  .join(',');
            const status = room.roomUsers.find((u) => u.userId == profile.info.userId).status;
            const avatarUrls = room.roomUsers
              .filter((u) => u.userId !== profile.info.userId && u.avatarUrl)
              .map((u) => u.avatarUrl);
            return (
              <div
                className="chat-list-component"
                onClick={() => {
                  openChat(room.roomId);
                }}
              >
                <div className="chat-list-avt">
                  {avatarUrls.length > 0 ? (
                    room.roomType == EnumRoomType.Single ? (
                      <img className="chat-list-avt-single" src={avatarUrls[0]} />
                    ) : (
                      avatarUrls.map((avatarUrl, indx) => {
                        const length = avatarUrls.length;
                        const rotation = (2 * Math.PI * indx) / length;
                        const x = 8 * Math.sin(rotation);
                        const y = 8 * Math.cos(rotation);
                        const top = 24 - x - 16 - indx * 32;
                        const left = 24 - y - 16;
                        return (
                          <AvatarGroupInList
                            key={`avatar-group-${indx}`}
                            top={top}
                            left={left}
                            src={avatarUrl}
                          />
                        );
                      })
                    )
                  ) : (
                    <img className="chat-list-avt-single" src={defaultAvatar} />
                  )}
                </div>
                <div className="chat-list-content">
                  <div className="chat-list-title">
                    <div>{roomName}</div>
                  </div>
                  <div className="chat-list-main">
                    <div
                      className={`chat-list-value ${
                        status == EnumChatStatus.Waiting ? 'wait' : ''
                      }`}
                    >
                      {room.roomId in messageMap.current
                        ? messageMap.current[room.roomId].messageValue
                        : 'Bắt đầu cuộc trò chuyện'}
                    </div>
                    <div
                      className={`chat-tick ${status == EnumChatStatus.Waiting ? 'wait' : ''}`}
                    >
                      <i className="fas fa-circle"></i>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {roomList.length == 0 ? (
            <div className="chat-list-component">
              <div className="chat-list-avt">
                <img src={defaultAvatar} alt="avt" />
              </div>
              <div className="chat-list-content">
                <div className="chat-list-title">
                  <div>{'Bạn chưa có cuộc trò chuyện nào'}</div>
                </div>
                <div className="chat-list-main">
                  <div className="chat-list-value">
                    {'Chúc bạn có những cuộc trò chuyện thú vị cùng JVSCorp!'}
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

export default ChatList;
