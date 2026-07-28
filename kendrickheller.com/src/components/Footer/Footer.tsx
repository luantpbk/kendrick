import './Footer.css';
import { useEffect, useState } from 'react';
import React from 'react';
import { useGetCompanyInfo } from 'src/api/backend-api';
import { CompanyInfoType } from 'src/api/models';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  //Value
  const navigate = useNavigate();
  //Function
  const getCompanyInfo = useGetCompanyInfo();

  const { t, i18n } = useTranslation();

  //State
  const [listInfo1, setListInfo1] = useState<CompanyInfoType[]>(null);
  const [listInfo2, setListInfo2] = useState<CompanyInfoType[]>(null);
  const [listInfo3, setListInfo3] = useState<CompanyInfoType[]>(null);
  const [listInfoCall, setListInfoCall] = useState<CompanyInfoType[]>(null);

  //UseEffect
  useEffect(() => {
    getCompanyInfo()
      .then((data) => {
        //Value
        const listInfo1: CompanyInfoType[] = [];
        const listInfo2: CompanyInfoType[] = [];
        const listInfo3: CompanyInfoType[] = [];
        const listInfoCall: CompanyInfoType[] = [];

        data.map((_companyInfo: CompanyInfoType) => {
          if (_companyInfo.companyInfoKey.slice(0, 8) === 'FOOTER_1') {
            listInfo1.push(_companyInfo);
          } else if (_companyInfo.companyInfoKey.slice(0, 8) === 'FOOTER_2') {
            listInfo2.push(_companyInfo);
          } else if (_companyInfo.companyInfoKey.slice(0, 8) === 'FOOTER_3') {
            listInfo3.push(_companyInfo);
          } else if (_companyInfo.companyInfoKey.slice(0, 11) === 'FOOTER_CALL') {
            listInfoCall.push(_companyInfo);
          }
        });

        setListInfo1(listInfo1);
        setListInfo2(listInfo2);
        setListInfo3(listInfo3);
        setListInfoCall(listInfoCall);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getCompanyInfo]);

  return (
    <div className="footer">
      <div className="footer-child">
        <div className="footer-child-title">KENDRICK HELLER</div>
        <div className="footer-child-value">
          {listInfo1
            ? listInfo1.map((item: CompanyInfoType, index: number) => {
              if (item.href === '') {
                return (
                  <div key={`footer1-${index}`}>
                    {item.companyInfoTitle ? <span> {t(item.companyInfoTitle)}: </span> : null}
                    <span> {t(item.companyInfoValue)} </span>
                  </div>
                );
              } else if (item.href.slice(0, 4) === 'http') {
                return (
                  <div key={`footer1-${index}`}>
                    {item.companyInfoTitle ? <span> {t(item.companyInfoTitle)}: </span> : null}
                    <a href={item.href} target="_blank">
                      {' '}
                      {item.companyInfoValue}{' '}
                    </a>
                  </div>
                );
              } else {
                return (
                  <div key={`footer1-${index}`}>
                    <span> {t(item.companyInfoTitle)} </span>
                    <div
                      className="footer-child-value-link"
                      style={{ color: '#2b80dd' }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(item.href);
                      }}
                    >
                      {t(item.companyInfoValue)}
                    </div>
                  </div>
                );
              }
            })
            : null}
        </div>
      </div>
      <div className="footer-child">
        <div className="footer-child-title">{t("COMPANY INFORMATION")}</div>
        <div className="footer-child-value">
          {listInfo2
            ? listInfo2.map((item: CompanyInfoType, index: number) => {
              if (item.href === '') {
                return (
                  <div key={`footer2-${index}`}>
                    {item.companyInfoTitle ? <span> {t(item.companyInfoTitle)}: </span> : null}
                    <span> {t(item.companyInfoValue)} </span>
                  </div>
                );
              } else if (item.href.slice(0, 4) === 'http') {
                return (
                  <div key={`footer2-${index}`}>
                    {item.companyInfoTitle ? <span> {t(item.companyInfoTitle)}: </span> : null}
                    <a href={item.href} target="_blank">
                      {' '}
                      {item.companyInfoValue}{' '}
                    </a>
                  </div>
                );
              } else {
                return (
                  <div key={`footer2-${index}`}>
                    {item.companyInfoTitle ? <span> {t(item.companyInfoTitle)}: </span> : null}
                    <div
                      className="footer-child-value-link"
                      style={{ color: '#2b80dd' }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(item.href);
                      }}
                    >
                      {t(item.companyInfoValue)}
                    </div>
                  </div>
                );
              }
            })
            : null}
        </div>
      </div>
      <div className="footer-child">
        <div className="footer-child-title">{t("COMPANY POLICY")}</div>
        <div className="footer-child-value">
          {listInfo3
            ? listInfo3.map((item: CompanyInfoType, index: number) => {
              if (item.href === '') {
                return (
                  <div key={`footer3-${index}`}>
                    {item.companyInfoTitle ? <span> {t(item.companyInfoTitle)}: </span> : null}
                    <span> {t(item.companyInfoValue)} </span>
                  </div>
                );
              } else if (item.href.slice(0, 4) === 'http') {
                return (
                  <div key={`footer3-${index}`}>
                    {item.companyInfoTitle ? <span> {t(item.companyInfoTitle)}: </span> : null}
                    <a href={item.href} target="_blank">
                      {' '}
                      {item.companyInfoValue}{' '}
                    </a>
                  </div>
                );
              } else {
                return (
                  <div key={`footer3-${index}`}>
                    {item.companyInfoTitle ? <span> {t(item.companyInfoTitle)}: </span> : null}
                    <div
                      className="footer-child-value-link"
                      style={{ color: '#2b80dd' }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(item.href);
                      }}
                    >
                      {t(item.companyInfoValue)}
                    </div>
                  </div>
                );
              }
            })
            : null}
        </div>
      </div>
      <div className="footer-child">
        {listInfoCall
          ? listInfoCall.map((phone, index) => {
            return (
              <div className={`footer-btn num${index % 4}`} key={`footer4-${index}`}>
                <a href={phone.href}>
                  <div>
                    <i className="fas fa-phone-volume"></i>
                  </div>
                  <div>
                    {t(phone.companyInfoTitle)} <br />
                    {phone.companyInfoValue}
                  </div>
                </a>
              </div>
            );
          })
          : null}
      </div>
    </div>
  );
};

export default Footer;
