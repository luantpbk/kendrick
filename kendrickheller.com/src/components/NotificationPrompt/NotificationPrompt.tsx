import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PromptWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #eee;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  background: ${props => props.$primary ? '#007bff' : '#f0f0f0'};
  color: ${props => props.$primary ? 'white' : '#333'};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const NotificationPrompt: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      const hasDismissed = localStorage.getItem('dismissed_notification_prompt');
      if (!hasDismissed) {
        const timer = setTimeout(() => setShow(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAllow = () => {
    Notification.requestPermission().then((status) => {
      console.log('Notification permission status:', status);
      setShow(false);
    });
  };

  const handleDismiss = () => {
    localStorage.setItem('dismissed_notification_prompt', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <PromptWrapper>
      <Title>Stay Updated</Title>
      <Message>Would you like to receive notifications for our latest updates and promotions?</Message>
      <ButtonGroup>
        <Button onClick={handleDismiss}>Later</Button>
        <Button $primary onClick={handleAllow}>Allow Notifications</Button>
      </ButtonGroup>
    </PromptWrapper>
  );
};

export default NotificationPrompt;
