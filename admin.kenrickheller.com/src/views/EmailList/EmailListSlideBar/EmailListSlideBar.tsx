import React from 'react';
import './EmailListSlideBar.css';

interface IEmailListSlideBar {
  receiver: string;
  emailTitle: string;
  emailValue: string;
}

const EmailListSlideBar: React.FC<IEmailListSlideBar> = (props) => {
  //Value
  const receiver = props.receiver;
  const emailTitle = props.emailTitle;
  const emailValue = props.emailValue;

  //Main
  return (
    <div className="email-list-slide-bar-container">
      <div className="email-list-title">Người nhận: {receiver}</div>
      <div className="email-list-title">Tiêu đề: {emailTitle}</div>
      <div
        className="email-list-value"
        dangerouslySetInnerHTML={{
          __html: emailValue,
        }}
      />
    </div>
  );
};

export default EmailListSlideBar;
