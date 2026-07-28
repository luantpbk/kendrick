import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { animated, useSpring } from 'react-spring';
import { useRemovePopup } from '../../state/application/hooks';
import TransactionPopup from './TransactionPopup';
import ErrorPopup from './ErrorPopup';
import ConfirmPopup from '../ConfirmModal/ConfirmModal';
import ContextPopup from './ContextPopup/ContextPopup';
import { PopupContent } from 'src/api/models';

export const StyledClose = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  :hover {
    cursor: pointer;
  }
`;

export const Popup = styled.div`
  display: inline-block;
  z-index: 200;
  width: 100%;
  padding: 1em;
  position: relative;
  padding: 20px;
  padding-right: 35px;
  overflow: hidden;
  border-radius: 12px;
  background: rgb(33, 36, 41);
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px,
    rgba(0, 0, 0, 0.04) 0px 16px 24px, rgba(0, 0, 0, 0.01) 0px 24px 32px;

  @media (max-width: 768px) {
    display: block;
    min-width: 290px;
  }
`;

const Fader = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.color.secondary};
`;

const AnimatedFader = animated(Fader);

interface PopupItemProps {
  removeAfterMs: number | null;
  content: PopupContent;
  popKey: string;
}

const PopupItem: React.FC<PopupItemProps> = ({ removeAfterMs, content, popKey }) => {
  const removePopup = useRemovePopup();

  const removeThisPopup = useCallback(() => removePopup(false, popKey), [popKey, removePopup]);

  const handleClick = (event: MouseEvent) => {
    if (
      wrapperRef !== null &&
      !wrapperRef?.current?.contains(event.target as Node) &&
      wrapperRef?.current?.classList.contains('context-popup')
    )
      removeThisPopup();
  };

  const wrapperRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    document.addEventListener('click', handleClick);
    const timeout = removeAfterMs
      ? setTimeout(() => {
          removeThisPopup();
        }, removeAfterMs)
      : undefined;

    return () => {
      document.removeEventListener('click', handleClick);
      clearTimeout(timeout);
    };
  }, [handleClick, removeThisPopup]);

  const faderStyle = useSpring({
    from: { width: '100%' },
    to: { width: '0%' },
    config: { duration: removeAfterMs ?? undefined },
  });

  if ('txn' in content || 'error' in content) {
    return (
      <Popup>
        <StyledClose onClick={removeThisPopup}>
          <i color="#ffffff" className="fas  fa-times"></i>
        </StyledClose>
        {'txn' in content ? (
          <TransactionPopup success={content.txn.success} summary={content.txn.summary} />
        ) : (
          <ErrorPopup message={content.error.message} title={content.error.title} />
        )}
        {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
      </Popup>
    );
  } else if ('context' in content) {
    return (
      <div ref={wrapperRef} className="context-popup">
        <ContextPopup
          width={content.context.width}
          height={content.context.height}
          posX={content.context.posX}
          posY={content.context.posY}
          listActionButton={content.context.listActionButton}
          removePopup={removeThisPopup}
        />
      </div>
    );
  }
};

export default PopupItem;
