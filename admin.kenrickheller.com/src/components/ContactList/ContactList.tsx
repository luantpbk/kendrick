/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import InfiniteScroll from 'react-infinite-scroll-component';
import './ContactList.css';
import { useGetUserList } from 'src/api/userApi';
import { useChat, useGetProfileInfo } from 'src/state/application/hooks';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { ProfileInfo } from 'src/api/models';
import useDebounce from 'src/hooks/useDebounce';
import styled from 'styled-components';

interface IContactType {
  iconX: number;
  iconY: number;
  onSelect: (...args: any[]) => any;
  onHidden: (...args: any[]) => any;
}

const ContactList: React.FC<IContactType> = (props) => {
  const size = 20;

  //State
  const [contactList, setContactList] = useState<ProfileInfo[]>([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState<string>('');
  const keywordDebound = useDebounce(keyword, 500);
  const [hasMore, setHasMore] = useState(true);
  const profile = useGetProfileInfo();
  const getUserList = useGetUserList();
  const first = useRef(true);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const { defaultAvatar } = useConfiguration();

  const fetchData = (reset: boolean) => {
    const cpage = reset ? 1 : page;
    getUserList(keyword, size, cpage)
      .then((res) => {
        const nList = reset ? res.items : [...contactList, ...res.items];
        setContactList(nList);
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
    const width = Math.min((window.innerWidth * 80) / 100, 340);
    setPositionX(props.iconX > width ? props.iconX - width : 10);
    setPositionY(props.iconY + 10);
  }, [props.iconX, props.iconY]);

  useEffect(() => {
    fetchData(true);
  }, [keywordDebound]);

  useEffect(() => {
    const handleClick = (event: any) => {
      const contactPopup = document.getElementById('contact-popup');
      if (!first.current && contactPopup && !contactPopup.contains(event.target)) {
        props.onHidden();
      }
      first.current = false;
    };

    document.addEventListener('click', handleClick, false);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  //Main
  return (
    <ContactListContainer x={positionX} y={positionY} id="contact-popup">
      <input
        className="contact-search"
        type="text"
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
        }}
      />
      <i className="fas fa-search contact-search-icon"></i>
      <div className="infinite-scr-con" id="contact-content">
        <InfiniteScroll
          dataLength={contactList.length}
          next={() => fetchData(false)}
          hasMore={hasMore}
          style={{ display: 'flex', flexDirection: 'column' }}
          scrollableTarget="contact-content"
          loader={<h4></h4>}
          endMessage={<p style={{ textAlign: 'center' }}></p>}
        >
          {contactList.map((value, index) => {
            if (value.userId == profile.info.userId) return null;
            return (
              <div
                key={`contact${index}`}
                className="contact-component"
                onClick={() => {
                  props.onSelect(value);
                }}
              >
                <div className="contact-avt">
                  {value.avataUrl ? (
                    <img src={value.avataUrl} alt="avt" />
                  ) : (
                    <div className="contact-avt-null"></div>
                  )}
                </div>
                <div className="contact-content">
                  <div className="contact-title">
                    <div>{value.fullName}</div>
                  </div>
                  <div className="contact-main">
                    <div className="contact-value">{value.email}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {contactList.length == 0 ? (
            <div className="contact-component">
              <div className="contact-avt">
                <img src={defaultAvatar} alt="avt" />
              </div>
              <div className="contact-content">
                <div className="contact-title">
                  <div>{'Chưa có liên hệ nào'}</div>
                </div>
                <div className="contact-main">
                  <div className="contact-value">
                    {'Vui lòng thêm liên hệ để có những cuộc trò chuyện thú vị cùng GuitarTNT !'}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </InfiniteScroll>
      </div>
    </ContactListContainer>
  );
};

export default ContactList;

const ContactListContainer = styled.div<{ x: number; y: number }>`
  display: flex;
  flex-direction: column;
  width: 340px;
  max-width: 80vw;
  max-height: 60vh;
  background-color: white;
  position: fixed;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  border-radius: 5px;
  border: 1px solid rgb(231, 228, 228);
  font-weight: 500;
  font-size: small;
  padding-left: 4px;
  z-index: 1;
`;
