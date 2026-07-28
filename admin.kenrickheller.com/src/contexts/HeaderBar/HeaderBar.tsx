import React from 'react';
import './HeaderBar.css';
import ButtonNavLink from 'src/components/ButtonNavLink/ButtonNavLink';
import useProfile from 'src/hooks/useProfile';
import { useRemoveProfileInfo } from 'src/state/application/hooks';
import { getFCMToken } from 'src/firebase';
import { useDeleteFirebaseToken } from 'src/api/firebaseTokenApi';
import ChatIcon from 'src/components/ChatIcon/ChatIcon';
import ContactIcon from 'src/components/ContactIcon/ContactIcon';
import FCMNotificationIcon from 'src/components/FCMNotificationIcon/FCMNotificationIcon';
import styled from 'styled-components';

window.addEventListener('contextmenu', (e) => e.preventDefault());

const HeaderBar: React.FC = () => {
  //Value
  const profile = useProfile();

  //Function
  const removeProfileInfo = useRemoveProfileInfo();

  const deleteFirebaseToken = useDeleteFirebaseToken();

  const logout = () => {
    removeProfileInfo();
    getFCMToken().then((fcmToken: string) => {
      if (fcmToken) {
        deleteFirebaseToken(fcmToken).then(() => {
          console.log('delete token ' + fcmToken);
        });
      }
    });
  };

  //Main
  return (
    profile && (
      <HeaderBarContainer>
        <FlexRowWrapper>
          <HeaderBarName>KENDRICK HELLER ADMIN</HeaderBarName>
        </FlexRowWrapper>
        <FlexRowWrapper>
          <ChatIcon />
          <ContactIcon />
          <FCMNotificationIcon />
          <ButtonNavLink
            link={'/auth'}
            activeClass={'focus'}
            iconName={'logout'}
            name={'Đăng xuất'}
            backgroundColor={'red'}
            color={'black'}
            buttonClass={'info'}
            onClick={logout}
          />
        </FlexRowWrapper>
      </HeaderBarContainer>
    )
  );
};

export default HeaderBar;

const HeaderBarContainer = styled.div`
  margin: 0px 0px 5px 0px;
  font-weight: 700;
  padding: 10px;
  justify-content: space-between;
  width: 100%;
  box-shadow: 0 5px 10px lightgray;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

const FlexRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const HeaderBarName = styled.div`
  padding: 0 15px 10px 15px;
`;
