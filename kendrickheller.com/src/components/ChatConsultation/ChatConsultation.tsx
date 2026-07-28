import React, { useEffect, useState } from 'react';
import { CompanyInfoType } from 'src/api/models';
import './ChatConsultation.css';

import MessengerCustomerChat from 'react-messenger-customer-chat';
import { useGetCompanyInfo } from 'src/api/backend-api';
import { useGetProfileInfo, useNotifyChat } from 'src/state/application/hooks';
import { useNavigate } from 'react-router-dom';
import { useGetConsulationRoom } from 'src/api/roomApi';
import { useTranslation } from 'react-i18next';

const ChatConsultation: React.FC = () => {
  const navigate = useNavigate();
  const [pageId, setPageId] = useState(null);
  const [appId, setAppId] = useState(null);
  const getCompanyInfo = useGetCompanyInfo();
  const notifyChat = useNotifyChat();
  const profile = useGetProfileInfo();
  const getConsulationRoom = useGetConsulationRoom();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getCompanyInfo()
      .then((data) => {
        data.map((value: CompanyInfoType) => {
          if (value.companyInfoKey === 'CONTACT_MES_PAGE_ID') {
            setPageId(value.companyInfoValue);
          } else if (value.companyInfoKey === 'CONTACT_MES_APP_ID') {
            setAppId(value.companyInfoValue);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getCompanyInfo]);

  const openChat = () => {
    if (profile?.accessToken) {
      getConsulationRoom().then((res) => {
        notifyChat(res.roomId);
      });
    } else {
      window.scrollTo(0, 0);
      navigate(`/auth-screen`);
    }
  };

  //Main
  return (
    <div>
      <div className="jvs-chat-container" onClick={openChat} id="jvs-chat">
        <i className="fas fa-comment" id="btn-show-consolution"></i>
        <span className="consulation-tooltiptext">{t("Contact customer support")}</span>
      </div>
      {/* {appId && pageId ? (
        <MessengerCustomerChat
          pageId={pageId}
          appId={appId}
          htmlRef={window.location.pathname}
        />
      ) : null} */}
    </div>
  );
};

export default ChatConsultation;
