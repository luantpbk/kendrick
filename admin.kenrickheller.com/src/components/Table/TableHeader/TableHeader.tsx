import { uniqueId } from 'lodash';
import React, { ReactNode } from 'react';
import { EnumDataType, OptionType } from 'src/api/models';
import { CSSProperties } from 'styled-components';
import './TableHeader.css';



export type TableColumnType = {
  code: string;
  title: string;
  dataType: EnumDataType;
  isOptions: boolean;
  options?: OptionType[];
  collumCss?: any;
  cellCss?: CSSProperties;
  ratio?: number;
  convert?: (value: any) => ReactNode;
};

interface ITableHeader {
  header: TableColumnType[];
  isAction: boolean;
  allowCheckbox?: boolean;
  isCheckedAll?: boolean;
  isNo?: boolean;
  onClickCheckAll?: (...args: any[]) => any;
}

const TableHeader: React.FC<ITableHeader> = (props) => {
  const {header, isAction, allowCheckbox, isCheckedAll, isNo, onClickCheckAll} = props;

  return (
    <tr className="table-header-component">
      {isNo? <th key={`tableheaderno`} className="text-center">STT</th> : null}
      {allowCheckbox?  <th key={`tableheadercheckbox`} className="text-center">
        <i
          className={isCheckedAll? "fas fa-check check" : "fas fa-square"}
          onClick={onClickCheckAll}
        />
      </th> : null}
      {header.map((column: TableColumnType, index: number) => {
        return (
          <th key={`tableheader${index}`} className="text-center">
            {column.title}
          </th>
        );
      })}
      {isAction && <th key={`tableheaderaction`} className="text-center">
        Hành động
      </th>}
      <th/>
    </tr>
  );
};

export default TableHeader;
