import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { AutoColumn } from '../Column';
import { AutoRow } from '../Row';

interface TractionPopupProps {
  success?: boolean;
  summary?: string;
}

const TransactionPopup: React.FC<TractionPopupProps> = ({ success, summary }) => {
  const theme = useContext(ThemeContext);

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? (
          <i
            className="fas  fa-check-circle"
            style={{ color: theme.color.success, fontSize: '24px' }}
          />
        ) : (
          <i
            className="fas  fa-exclamation-circle"
            style={{ color: theme.color.danger, fontSize: '24px' }}
          />
        )}
      </div>
      <AutoColumn gap="8px">
        <StyledPopupDesc>{summary}</StyledPopupDesc>
      </AutoColumn>
    </RowNoFlex>
  );
};

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`;

const StyledPopupDesc = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.color.white};
`;

export default TransactionPopup;
