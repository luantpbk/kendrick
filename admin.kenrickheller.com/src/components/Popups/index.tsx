import React from 'react';
import styled from 'styled-components';
import { useActivePopups } from '../../state/application/hooks';
import { AutoColumn } from '../Column';
import PopupItem from './PopupItem';

const FixedPopupColumn = styled(AutoColumn)`
  position: fixed;
  top: 90px;
  margin-right: 0px;
  right: 1rem;
  max-width: 355px !important;
  width: 100%;
  z-index: 199;
`;

const Popups: React.FC = () => {
  // get all popups
  const activePopups = useActivePopups();

  console.log('popup', activePopups);

  return (
    <>
      <FixedPopupColumn gap="20px">
        {activePopups.map((item, index) => (
          <PopupItem
            key={`popup${index}`}
            content={item.content}
            popKey={item.key}
            removeAfterMs={item.removeAfterMs}
          />
        ))}
      </FixedPopupColumn>
    </>
  );
};
export default Popups;
