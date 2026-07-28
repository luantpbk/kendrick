/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { RoomType } from 'src/api/models';
import { useGetRoomById, useGetRoomByUser } from 'src/api/roomApi';
import {
  useCleanChat,
  useCleanNotifyChat,
  useGetChat,
  useGetNotifyChat,
} from 'src/state/application/hooks';
import ChatRoom from '../ChatRoom/ChatRoom';
import './Chat.css';

interface IChat {
  setConsultationAvailable: (consultationAvailable: boolean) => void;
}

const Chat: React.FC<IChat> = (props) => {
  const [rooms, setRooms] = useState<RoomType[]>([]);

  const receiveRoom = useGetNotifyChat();
  const cleanNotifyChat = useCleanNotifyChat();

  const chatUser = useGetChat();
  const cleanChat = useCleanChat();

  const getRoomByUser = useGetRoomByUser();
  const getRoomById = useGetRoomById();

  useEffect(() => {
    if (receiveRoom) {
      const indx = rooms.findIndex((r) => r.roomId === receiveRoom.roomId);
      if (indx < 0) {
        getRoomById(receiveRoom.roomId).then((data: RoomType) => {
          const newRooms = [...rooms, { ...data, extendData: receiveRoom.extendData }];
          setRooms(newRooms);
        });
      } else {
        rooms[indx].isCollapse = false;
        rooms[indx].extendData = receiveRoom.extendData;
        setRooms([...rooms]);
      }
    }
    cleanNotifyChat();
  }, [receiveRoom]);

  useEffect(() => {
    if (chatUser) {
      getRoomByUser(chatUser).then((data: RoomType) => {
        const indx = rooms.findIndex((r) => r.roomId === data.roomId);
        if (indx < 0) {
          const newRooms = [...rooms, data];
          setRooms(newRooms);
        } else if (rooms[indx].isCollapse) {
          rooms[indx].isCollapse = false;
          setRooms([...rooms]);
        }
      });
    }
    cleanChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatUser]);

  useEffect(() => {
    props.setConsultationAvailable(rooms.length == 0);
  }, [props, rooms]);

  const removeRoom = (roomId: string) => {
    const index = rooms.findIndex((r) => r.roomId == roomId);
    if (index >= 0) rooms.splice(index, 1);
    setRooms([...rooms]);
  };

  const collapseRoom = (roomId: string) => {
    const room = rooms.find((r) => r.roomId == roomId);
    room.isCollapse = true;
    setRooms([...rooms]);
  };

  const unCollapseRoom = (roomId: string) => {
    const room = rooms.find((r) => r.roomId == roomId);
    room.isCollapse = false;
    setRooms([...rooms]);
  };

  const chatRomComponent = () => {
    let collapseIndex = -1;
    let index = -1;

    return rooms.map((room) => {
      if (room.isCollapse) {
        collapseIndex++;
      } else {
        index++;
      }
      return (
        <ChatRoom
          key={room.roomId}
          room={room}
          index={index}
          isCollapse={room.isCollapse}
          collapseIndex={collapseIndex}
          removeRoom={removeRoom}
          collapse={collapseRoom}
          unCollapse={unCollapseRoom}
        />
      );
    });
  };

  return <div className="chat-container">{chatRomComponent()}</div>;
};

export default Chat;
