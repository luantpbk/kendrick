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

const Chat: React.FC = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);

  const receiveRoomId = useGetNotifyChat();
  const cleanNotifyChat = useCleanNotifyChat();

  const chatUser = useGetChat();
  const cleanChat = useCleanChat();

  const getRoomByUser = useGetRoomByUser();
  const getRoomById = useGetRoomById();

  useEffect(() => {
    if (receiveRoomId) {
      const indx = rooms.findIndex((r) => r.roomId === receiveRoomId);
      if (indx < 0) {
        getRoomById(receiveRoomId).then((data: RoomType) => {
          const newRooms = [...rooms, data];
          setRooms(newRooms);
        });
      } else if (rooms[indx].isCollapse) {
        rooms[indx].isCollapse = false;
        setRooms([...rooms]);
      }
    }
    cleanNotifyChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveRoomId]);

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
