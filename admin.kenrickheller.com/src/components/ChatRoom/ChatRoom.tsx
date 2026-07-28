import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useGetMessages } from 'src/api/messageApi';
import { RoomType, RoomUserType } from 'src/api/models';
import { EnumRoomType } from 'src/common/enum/EnumRoomType';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { useGetProfileInfo, useReloadChat } from 'src/state/application/hooks';
import styled from 'styled-components';
import './ChatRoom.css';

const ChatBox = styled.div<{ indx: number }>`
  position: fixed;
  right: ${({ indx }) => indx * 310 + 94}px;
  bottom: 0px;
  height: 500px;
  width: 300px;
  border: none;
  border-radius: 15px;
  -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 20%);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 20%);
  margin-left: 10px;
  background: white;
`;

const ChatBoxCollapse = styled.div<{ indx: number }>`
  position: fixed;
  right: 24px;
  bottom: ${({ indx }) => indx * 66 + 24}px;
  -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 20%);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 20%);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  overflow: hidden;
  &:hover .message-lastest {
    visibility: visible;
  }
  z-index: 1;
`;

const MessageLastest = styled.span<{ indx: number }>`
  position: fixed;
  right: 60px;
  bottom: ${({ indx }) => indx * 58 + 70}px;
  -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 20%);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 20%);
  border-radius: 10px;
  background: white;
  visibility: hidden;
  padding: 10px;
  font-size: 12px;
  width: 300px;
`;

const AvatarGroup = styled.img<{ top: number; left: number }>`
  width: 36px;
  cursor: pointer;
  border-radius: 50%;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  position: relative;
`;

interface IChatRooom {
  room: RoomType;
  index: number;
  collapseIndex: number;
  isCollapse: boolean;
  removeRoom: (roomId: string) => void;
  collapse: (roomId: string) => void;
  unCollapse: (roomId: string) => void;
}

interface MessageData {
  value: string;
  type: number;
}

interface MessageInfo {
  type: number;
  data: MessageData;
  from: number;
}

const ChatRoom: React.FC<IChatRooom> = (props) => {
  const size = 10;
  const profile = useGetProfileInfo();
  const socket = useRef<WebSocket>(undefined);
  const users = useRef<{ [key: number]: RoomUserType }>(undefined);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [receiver, setReceiver] = useState<MessageInfo>(undefined);
  const [receiverFlg, setReceiverFlg] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [avatarUrls, setAvatarUrls] = useState<string[]>([]);
  const { backendWs } = useConfiguration();
  const getMessages = useGetMessages();
  const reloadChat = useReloadChat();
  const { defaultAvatar } = useConfiguration();

  const chatContent = useRef(null);

  const scrollToBottom = () => {
    const offset = chatContent.current.scrollHeight;
    chatContent.current.scrollTo({ top: offset, behavior: 'smooth' });
  };

  useEffect(() => {
    if (receiver) {
      setMessages([receiver, ...messages]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiver]);

  useEffect(() => {
    if (receiverFlg && !props.isCollapse) {
      scrollToBottom();
    }
    setReceiverFlg(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const close = () => {
    socket.current.close();
    props.removeRoom(props.room.roomId);
  };

  const fetchData = () => {
    getMessages(props.room.roomId, size, page).then((data) => {
      const oldMessages: MessageInfo[] = [...messages];
      data.items.forEach((item) => {
        oldMessages.push({
          type: 1,
          data: {
            type: item.messageType,
            value: item.messageValue,
          },
          from: item.userId,
        });
      });
      setMessages(oldMessages);
      if (data.items.length < size) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setPage(page + 1);
      }
    });
  };

  useEffect(() => {
    console.log('Connect... ' + props.room.roomId);
    const roomName = props.room.roomName
      ? props.room.roomName
      : props.room.roomUsers
          .filter((u) => u.userId !== profile.info.userId)
          .map((u) => u.fullName)
          .join(',');

    const avatarUrls = props.room.roomUsers
      .filter((u) => u.userId !== profile.info.userId && u.avatarUrl)
      .map((u) => u.avatarUrl);

    setAvatarUrls(avatarUrls);

    setRoomName(roomName);
    fetchData();
    users.current = {};
    props.room.roomUsers.forEach((u) => {
      users.current[u.userId] = u;
    });
    socket.current = new WebSocket(
      `${backendWs}/chat/${props.room.roomId}?access_token=${profile.accessToken}`,
    );
    socket.current.onopen = () => {
      console.log('Connect success');
      setTimeout(reloadChat, 500);
    };
    socket.current.onmessage = (event) => socketOnMessage(event);
    socket.current.onerror = (err) => console.log(err);
    socket.current.onclose = () => console.log('close');
    // eslint-disable-next-line react-hooks/exhaustive-deps

    return () => {
      console.log('cleaned up');
      close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const socketOnMessage = (event: MessageEvent) => {
    console.log('Socket on message: type: ' + event.type + ', data: ' + event.data);
    setReceiverFlg(true);
    setReceiver(JSON.parse(event.data));
  };

  const sentMessage = () => {
    console.log('Sent ' + message);
    if (message) {
      socket.current.send(
        JSON.stringify({
          type: 1,
          data: {
            type: 1,
            value: message,
          },
        }),
      );
    }

    setMessage('');
  };

  const collapse = () => {
    //setIsCollapse(true);
    props.collapse(props.room.roomId);
  };

  const unCollapse = () => {
    //setIsCollapse(false);
    props.unCollapse(props.room.roomId);
  };

  const handlePressInput = (event: any) => {
    if (event.key.toLowerCase() === 'enter') {
      if (!event.altKey) {
        sentMessage();
        event.preventDefault();
      } else {
        setMessage(message ?? '' + '\r\n');
      }
    }
  };

  return props.isCollapse ? (
    <ChatBoxCollapse indx={props.collapseIndex} onClick={unCollapse}>
      {avatarUrls.length > 0 ? (
        props.room.roomType == EnumRoomType.Single ? (
          <img className="avatar-collapse" src={avatarUrls[0]} />
        ) : (
          avatarUrls.map((avatarUrl, indx) => {
            const length = avatarUrls.length;
            const rotation = (2 * Math.PI * indx) / length;
            const x = 12 * Math.sin(rotation);
            const y = 12 * Math.cos(rotation);
            const top = 30 - x - 18 - 36 * indx;
            const left = 30 - y - 18;
            return (
              <AvatarGroup key={`avatar-group-${indx}`} top={top} left={left} src={avatarUrl} />
            );
          })
        )
      ) : (
        <img className="avatar-collapse" src={defaultAvatar} />
      )}
      <MessageLastest indx={props.collapseIndex} className="message-lastest">
        {messages.length > 0 ? messages[0].data.value : 'Cuộc trò chuyện chưa có tin nhắn nào.'}
      </MessageLastest>
    </ChatBoxCollapse>
  ) : (
    <ChatBox indx={props.index}>
      <div className="d-flex flex-row justify-content-between p-3 adiv text-white">
        <span className="pb-3 room-name">{roomName}</span>
        <div className="option">
          <i className="fas fa-minus btn-icon" onClick={collapse}></i>
          <i className="fas fa-times btn-icon" onClick={close}></i>
        </div>
      </div>
      <div id="chat-content" className="chat-content" ref={chatContent}>
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchData}
          inverse={true}
          hasMore={hasMore}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          scrollableTarget="chat-content"
          loader={<h4></h4>}
        >
          {messages.map((m: MessageInfo, index) => {
            return m.from != profile.info.userId ? (
              <div className="d-flex flex-row p-1" key={index}>
                <img src={users.current[m.from]?.avatarUrl} width="30" height="30" />
                <div className="chat ml-2 p-2">{m?.data?.value}</div>
              </div>
            ) : (
              <div className="d-flex flex-row p-1 sent-message" key={index}>
                <img src={users.current[m.from]?.avatarUrl} width="30" height="30" />
                <div className="bg-white mr-2 p-2">
                  <span className="text-muted">{m?.data?.value}</span>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
      <div className="form-group">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-control"
          rows={3}
          placeholder="Nhập tin nhắn của bạn"
          onKeyDown={handlePressInput}
        />
      </div>
      <span className="material-icons sent-btn" onClick={sentMessage}>
        send
      </span>
    </ChatBox>
  );
};

export default ChatRoom;
