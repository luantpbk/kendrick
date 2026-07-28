import React, { useEffect, useRef, useState } from 'react';
import { useGetMessages, useImportImageMessages } from 'src/api/messageApi';
import { EnumDisplayConfig, ExtendDataModel, RoomType, RoomUserType } from 'src/api/models';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import useLogo from 'src/hooks/useLogo';
import useModal from 'src/hooks/useModal';
import { useGetProfileInfo } from 'src/state/application/hooks';
import styled from 'styled-components';
import FullSizeImage from '../FullSizeImage/FullSizeImage';
import Loading from '../Loading';
import './ChatRoom.css';
import InfiniteList from '../InfiniteList/InfiniteList';
import { useTranslation } from 'react-i18next';


const ChatBox = styled.div<{ indx: number }>`
  position: fixed;
  right: ${({ indx }) => `calc(${indx} * min(400px, 90vw) + 40px)`};
  bottom: 0px;
  height: min(600px, 80vh);
  width: min(400px, 90vw);
  border-radius: 15px;
  margin-left: 10px;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-size: smaller;
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
  font-SIZE: 12px;
  width: 300px;
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

enum EnumMessageDataType {
  Text = 1,
  Image = 2,
  Consultation = 3,
}

enum EnumMessageType {
  Exchange = 1,
  Ping = 2,
  Online = 3,
  Connect = 4,
  Disconnect = 5,
}

enum CloseCodes {
  NORMAL_CLOSURE = 1000,
  CANNOT_ACCEPT = 1003,
  CLOSED_ABNORMALLY = 1006,
}

const ChatRoom: React.FC<IChatRooom> = (props) => {
  const SIZE = 20;
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
  const { backendWs } = useConfiguration();
  const getMessages = useGetMessages();
  const importImage = useImportImageMessages();
  const { resourceUrl } = useConfiguration();
  const [connecting, setConnecting] = useState(true);
  const [disconnect, setDisconnect] = useState(false);
  const [uploading, setUploading] = useState<string[]>([]);
  const [isUploadFlg, setIsUploadFlg] = useState(false);
  const uploadNames = useRef<string[]>([]);
  const [path, setPath] = useState<string | undefined>(undefined);
  const [consultation, setConsultation] = useState<ExtendDataModel>();
  const logo = useLogo();
  const interval = useRef(undefined);
  const { t, i18n } = useTranslation();
  const chatContent = useRef(null);

  const fullsizeModal = useModal(FullSizeImage, undefined, false);

  const scrollToBottom = () => {
    const offset = (messages.length - 8) * 39;
    chatContent.current.scrollTo({ top: offset, behavior: 'smooth' });
  };

  useEffect(() => {
    if (receiver) {
      if (messages.length > 0 && messages.length % SIZE == 0) {
        messages.splice(messages.length - 1, 1);
        if (!hasMore) setHasMore(true);
      }
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
    if (socket.current) socket.current.close(CloseCodes.NORMAL_CLOSURE, "Thoát");
    if (interval.current) clearInterval(interval.current);
    props.removeRoom(props.room.roomId);
  };

  const fetchData = (reset: boolean) => {
    const cpage = reset ? 1 : page;
    getMessages(props.room.roomId, SIZE, cpage).then((data) => {
      const nMessenges = data.items.map(item => {
        return {
          type: EnumMessageType.Exchange,
          data: {
            type: item.messageType,
            value: item.messageValue,
          },
          from: item.userId,
        }
      });
      const nList = reset ? nMessenges : [...messages, ...nMessenges];
      setMessages(nList);
      if (data.items.length < SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setPage(page + 1);
      }
    });
  };


  const openSocket = () => {
    console.log('Connect... ' + props.room.roomId);
    socket.current = new WebSocket(
      `${backendWs}/chat/${props.room.roomId}?access_token=${profile.accessToken}`,
    );
    socket.current.onopen = () => {
      console.log('Connect success');
      setDisconnect(false);
      setConnecting(false);
      interval.current = setInterval(() => {
        console.log("ping server");
        if (socket.current?.readyState)
          socket.current?.send(JSON.stringify({
            type: EnumMessageType.Ping,
          }));
      }, 4 * 60 * 1000);


    };
    socket.current.onmessage = (event) => socketOnMessage(event);
    socket.current.onerror = (err) => console.log(err);
    socket.current.onclose = (event) => {
      console.log("OnClose", event.code, event.reason);
      setDisconnect(true);
    }
  }



  useEffect(() => {
    const roomName = props.room.roomName
      ? props.room.roomName
      : props.room.roomUsers
        .filter((u) => u.userId !== profile.info.userId)
        .map((u) => u.fullName)
        .join(',');
    setRoomName(roomName);
    fetchData(true);
    users.current = {};
    props.room.roomUsers.forEach((u) => {
      users.current[u.userId] = u;
    });
    openSocket();


    return () => {
      console.log('cleaned up');
      close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Change data");

    if (props.room.extendData) {
      setMessage(props.room.extendData.message ?? '');
      setConsultation(props.room.extendData);
    }
  }, [props.room.extendData]);

  const socketOnMessage = (event: MessageEvent) => {
    console.log('Socket on message: type: ' + event.type + ', data: ' + event.data);
    setReceiverFlg(true);
    setReceiver(JSON.parse(event.data));
  };

  const sentMessage = () => {
    if (!disconnect && !connecting && message) {
      const type = consultation ? EnumMessageDataType.Consultation : EnumMessageDataType.Text;
      const value = consultation ? JSON.stringify({ ...props.room.extendData, message: message }) : message;
      socket.current?.send(
        JSON.stringify({
          type: EnumMessageType.Exchange,
          data: {
            type: type,
            value: value,
          },
        }),
      );
      if (consultation) setConsultation(undefined);
      setMessage('');
    }
  };

  const collapse = () => {
    props.collapse(props.room.roomId);
  };

  const unCollapse = () => {
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


  const onPressConsultation = (extend) => {
    if (extend?.functionId) {
      switch (extend?.functionId) {
        case EnumDisplayConfig.San_pham:
          window.open(`/product-detail/${extend.objectId}`);
          break;
        default:
          break;
      }
    }
  }

  useEffect(() => {
    if (isUploadFlg) {
      setIsUploadFlg(false);
      setUploading([...uploadNames.current]);
    }
  }, [isUploadFlg])

  useEffect(() => {
    if (path) {
      console.log("Gửi ảnh");
      socket.current?.send(
        JSON.stringify({
          type: EnumMessageType.Exchange,
          data: {
            type: EnumMessageDataType.Image,
            value: path,
          },
        }),
      );
    }
  }, [path])

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files[0];

    uploadNames.current.push(imageFile.name);
    setIsUploadFlg(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    importImage(formData)
      .then((r: any) => {
        setPath(r[0]);
      })
      .finally(() => {
        uploadNames.current.splice(uploadNames.current.indexOf(imageFile.name), 1);
        setIsUploadFlg(true);
      });
  }


  const renderContent = (data, receiver) => {
    switch (data.type) {
      case EnumMessageDataType.Image: {
        const url = `${resourceUrl}images/messenger/${data?.value}`;
        const thumbUrl = `${resourceUrl}/images/messenger/thumb/${data?.value}`;
        return <img className='image-message' src={thumbUrl} onClick={() => {
          fullsizeModal.handlePresent({
            images: [{
              fileUrl: url
            }],
            index: 0,
            hidden: fullsizeModal.handleDismiss
          });
        }} />;
      }

      case EnumMessageDataType.Consultation: {
        const extend = JSON.parse(data.value);
        return (
          <div className='consulation-message' onClick={() => onPressConsultation(extend)}>
            <label>{extend?.message}</label>

            <div className={`consulation-product ${receiver ? 'receiver' : 'sent'}`}>
              <div>
                <label className='consulation-product-name'>{extend?.name}</label>
                <label className='consulation-product-description'>{extend?.description}</label>
              </div>
              <img src={extend?.url} />

            </div>
          </div>
        );

      }


      case EnumMessageDataType.Text:
      default:
        return <span>{data?.value}</span>;
    }

  }

  return props.isCollapse ? (
    <ChatBoxCollapse indx={props.collapseIndex} onClick={unCollapse}>
      <img className="avatar-collapse" src={logo} />
      <MessageLastest indx={props.collapseIndex} className="message-lastest">
        {messages.length > 0 ?
          messages[0].data.type != EnumMessageDataType.Consultation ?
            messages[0].data.type != EnumMessageDataType.Text ?
              messages[0].data.value : 'Image' : 'Support requirement' : 'Empty'}
      </MessageLastest>
    </ChatBoxCollapse>
  ) : (
    <ChatBox indx={props.index}>
      <div className="chat-box-title">
        <span className="room-name">{t(roomName)}</span>
        <div className="option">
          <i className="fas fa-minus btn-icon" onClick={collapse}></i>
          <i className="fas fa-times btn-icon" onClick={close}></i>
        </div>
      </div>
      {disconnect || connecting ?
        <div className={`chat-connect ${connecting ? 'connecting' : 'disconnect'}`}>
          <Loading color='gray' />
          <span >{t(connecting ? 'Connecting the chat' : 'Conversation disconnection. Please try again later...')}</span>
        </div> : null}
      <div id="chat-content" className="chat-content" ref={chatContent}>
        <InfiniteList className='chat-content' fetchData={fetchData} hasMore={hasMore} isHorizontally={true}>

          {uploading.length > 0 ? uploading.map(fileName => (
            <div className='upload-image' key={`file${fileName}`}>
              <Loading />
              <span>{`Uploading ${fileName}...`}</span>
            </div>
          )) : null}
          {messages.map((m: MessageInfo, index) => {
            return m.from != profile.info.userId ? (
              <div className="receiver-mesage" key={index}>

                <img className='message-avatar' src={users.current[m.from]?.avatarUrl} />
                {renderContent(m?.data, true)}
              </div>
            ) : (
              <div className="sent-message" key={index}>
                {renderContent(m?.data, false)}
              </div>
            );
          })}
        </InfiniteList>
      </div>
      {consultation ? (
        <div className={`suggestion-product`}>
          <img src={consultation.url} />
          <div>
            <label className='suggestion-product-name'>{consultation.name}</label>
            <label className='suggestion-product-description'>{consultation.description}</label>
          </div>
          <i className="fas fa-times" onClick={() => {
            setConsultation(undefined);
            setMessage('')
          }} />
        </div>

      ) : null}
      <div className="messenge-form">
        <StyledFileInput
          type="file"
          onChange={onChangeFile}
          title={'Choose file'}
          id="upload-file"
        />
        <label className='sent-btn' htmlFor="upload-file"><span className="material-icons" onClick={sentMessage}>image</span></label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-control"
          rows={2}
          placeholder={t("Enter your message...")}
          onKeyDown={handlePressInput}
        />
        <span className="material-icons sent-btn" onClick={sentMessage}>
          send
        </span>
      </div>
    </ChatBox>
  );
};

export default ChatRoom;

const StyledFileInput = styled.input`
  display: none
`;


