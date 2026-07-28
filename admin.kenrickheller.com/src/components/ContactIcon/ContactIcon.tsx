import React, { useEffect, useState } from 'react';
import { useChat } from 'src/state/application/hooks';
import ContactList from '../ContactList/ContactList';
import { ProfileInfo } from 'src/api/models';

const ContactIcon: React.FC = () => {
  const [isShow, setIsShow] = useState(false);

  const [iconX, setIconX] = useState(0);
  const [iconY, setIconY] = useState(0);
  const chat = useChat();

  const onHiddenPopup = () => {
    setIsShow(false);
  };

  const openContact = (userId: number) => {
    chat(userId);
  };

  //Main
  return (
    <div className="base-head-icon">
      <i
        className="fas fa-address-book"
        style={{ fontSize: 20 }}
        onClick={() => setIsShow(!isShow)}
        title="Danh sách người dùng"
        id="btn-show-contact"
        ref={(el) => {
          if (el) {
            const boundingClient = el.getBoundingClientRect();
            setIconX(boundingClient.left);
            setIconY(boundingClient.y + boundingClient.height);
          }
        }}
      ></i>
      {isShow ? (
        <ContactList
          iconX={iconX}
          iconY={iconY}
          onHidden={onHiddenPopup}
          onSelect={(user: ProfileInfo) => {
            openContact(user.userId);
            onHiddenPopup();
          }}
        />
      ) : null}
    </div>
  );
};
export default ContactIcon;
