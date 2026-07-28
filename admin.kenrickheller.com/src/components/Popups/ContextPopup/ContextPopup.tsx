import React from 'react';
import { EventButton } from 'src/api/models';
import ButtonAction from 'src/components/ButtonAction/ButtonAction';
import styled from 'styled-components';

interface IContextPopup {
  width: string;
  height: string;
  posX: string;
  posY: string;
  listActionButton: EventButton[];
  removePopup?: () => void;
}

const ContextPopup: React.FC<IContextPopup> = (props) => {
  const buttonLength = props.listActionButton.length;
  return (
    <WrapperContainer
      width={props.width}
      height={props.height}
      posX={props.posX}
      posY={props.posY}
    >
      {props.listActionButton? props.listActionButton.map((button: EventButton, index: number) => {
        return (
          <ButtonAction
            key={`contextactionbutton${index}`}
            button={button}
            width={'100%'}
            height={`${(100 / buttonLength).toString()}%`}
            preProcess={props.removePopup}
          />
        );
      }) : null}
    </WrapperContainer>
  );
};

export default ContextPopup;

const WrapperContainer = styled.div<{
  posX: string;
  posY: string;
  width: string;
  height: string;
}>`
  width: ${({ width }) => width || 'fit-content'};
  height: ${({ height }) => height || 'fit-content'};
  left: ${({ posX }) => posX || '50%'};
  top: ${({ posY }) => posY || '50%'};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: fixed;
  border-radius: 5px;
  overflow: hidden;
`;
