import './ItemView.css';
import {
  EnumDataType, EventButton, OptionType,
} from 'src/api/models';
import React, { CSSProperties, useEffect, useRef } from 'react';
import Input from 'src/components/Input/Input';
import { useState } from 'react';
import { number2money, numberFormat } from 'src/utils/numberUtils';
import useLongPress from 'src/hooks/useLongPress';
import ButtonAction from 'src/components/ButtonAction/ButtonAction';

export type CellViewType = {
  code: string;
  icon?: string;
  title?: string;
  dataType: EnumDataType;
  isOptions: boolean;
  options?: OptionType[];
  collumCss?: any;
  cellCss?: CSSProperties;
  ratio?: number;
};

export type ItemDisplayType<T extends {[code: string]: any}> = {
  header: CellViewType[];
  detail: {
    data?: string;
    avatar?: string;
    info: CellViewType[][];
  };
  bottom?: CellViewType[][];
  actions?: (item: T) => EventButton[];
};


export interface IItemView<T extends {[code: string]: any}> {
  display: ItemDisplayType<T>;
  data: T;
  index: number;

  isShowContext: boolean;
  isInput: boolean;

  onDoubleClick: (...args: any[]) => any;
  onClickCheckbox?: (...args: any[]) => any;
  onClick?: (...args: any[]) => any;
  onSelect?: () => void;
  highlight: boolean;
  allowCheckbox?: boolean;
  isChecked?: boolean;
  isNo?: boolean;
}

const ItemView = <T extends {[code: string]: any}, >(props: IItemView<T>) => {
  const {
    display,
    data,
    index,
    isInput,
    onDoubleClick,
    onClickCheckbox,
    onClick,
    onSelect,
    highlight,
    allowCheckbox,
    isChecked,
    isNo
  } = props;

  const getValueElement = (value: any, column: CellViewType, index: number) => {
    if(isInput) {
      <Input
        key={`tablecell${index}`}
        value={data[column.code]}
        disabled={false}
      />
    } else {
      if(column.dataType != EnumDataType.Boolean && value == null) return null;
      if(column.isOptions) {
        const option = column.options.find(o => o.value == value);
        return <div key={`tablecell${index}`} className={'view-cell-value'} style={{...option?.css??undefined, ...column.cellCss??undefined}}>
          {column.icon? <span className="view-cell-value-icon material-icons">{column.icon}</span> : null}
          <span>{option?.title}</span>
        </div>
      } else {
        switch(column.dataType) {
          case EnumDataType.Boolean:
            return <>
              {column.title? <span className="view-cell-value-title">{column?.title}</span> : null }
              <div key={`tablecell${index}`} className={`view-cell-value ${column.cellCss? '' : 'text-center'} ${value? 'color-blue' : 'color-red'}`} style={column.cellCss??undefined}>
                {column.icon? <span className="view-cell-value-icon material-icons">{column.icon}</span> : null}
                <span>{value? '✓' : '🗙'}</span>
              </div>
            </>;
          case EnumDataType.BigInt:
          case EnumDataType.Int:
          case EnumDataType.Month:
          case EnumDataType.QuarterOfYear:
            return <>
              {column.title? <span className="view-cell-value-title">{column?.title}</span> : null }
              <div key={`tablecell${index}`} className={`view-cell-value ${column.cellCss? '' : 'text-right'}`} style={column.cellCss??undefined}>
                {column.icon? <span className="view-cell-value-icon material-icons">{column.icon}</span> : null}
                <span>{numberFormat(value)}</span>
              </div>
            </>
          case EnumDataType.Decimal:
            return <>
              {column.title? <span className="view-cell-value-title">{column?.title}</span> : null }
              <div key={`tablecell${index}`} className={`view-cell-value ${column.cellCss? '' : 'text-right'}`} style={column.cellCss??undefined}>
                {column.icon? <span className="view-cell-value-icon material-icons">{column.icon}</span> : null}
                <span>{numberFormat(value)}</span>
              </div>
            </>
          case EnumDataType.Date:
            return <>
              {column.title? <span className="view-cell-value-title">{column?.title}</span> : null }
              <div key={`tablecell${index}`} className={`view-cell-value ${column.cellCss? '' : 'text-center'}`} style={column.cellCss??undefined}>
                {column.icon? <span className="view-cell-value-icon material-icons">{column.icon}</span> : null}
                <span>{value}</span>
              </div>
            </>
          case EnumDataType.Image:
            return <img key={`tablecell${index}`} className="cell-image" src={value} alt="image" />
          case EnumDataType.Ratio:
              return <>
                {column.title? <span className="view-cell-value-title">{column?.title}</span> : null }
                <div key={`tablecell${index}`} className={`view-cell-value ${column.cellCss? '' : 'text-right'}`} style={column.cellCss??undefined}>
                  {column.icon? <span className="view-cell-value-icon material-icons">{column.icon}</span> : null}
                  <span>{numberFormat(value / column.ratio)}</span>
                </div>
              </>
          default:
            return <>
              {column.title? <span className="view-cell-value-title">{column?.title}</span> : null }
              <div key={`tablecell${index}`} className={'view-cell-value'} style={column.cellCss??undefined}>
                {column.icon? <span className="view-cell-value-icon material-icons">{column.icon}</span> : null}
                <span>{value}</span>
              </div>
            </>
        }
      }
    }
  }

  const genDetail = () => {
    const details = display.detail.data? eval(`data.${display.detail.data}`) as [] : [data];
    return details?.map((item, index) => <div className='item-view-detail' key={`item-detail${index}`}>
      {display.detail?.avatar? <img className="cell-image" src={eval(`item.${display.detail.avatar}`)} alt="image" /> : null}
      <div className='detail-item-info'>
        {display.detail.info?.map((columns: CellViewType[], index: number) => {
          return (
            <div key={`detail-row${index}`}
              className={`item-detail-row`}
            >
              {columns?.map((column: CellViewType, index: number) =>

                getValueElement(eval(`item.${column.code}`), column, index)

              )}
            </div>
          );
        })}
      </div>

    </div>);
  }

  //End of function
  return (
    <div className={`item-view-component ${highlight? 'highlight' : index % 2 == 0 ? 'even-row' : 'odd-row'}`} id={`row_${index}`}
      onMouseDown={(e) => {
        onSelect();
      }}
      onDoubleClick={(e) => {
        onSelect();
        onDoubleClick(data);
      }}
      onClick={(e) => {
        onSelect();
        if(onClick) onClick(data);
      }}
    >
      <div className='item-view-header'>
        {isNo? <div className={`item-view-number text-center`}>{index + 1}. </div> : null}
        {allowCheckbox ? (
          <div className={`table-row-checkbox`}>
            <div className="table-row-btn-check">
              <i className={isChecked? "fas fa-check check" : "fas fa-square"}
                  onClick={() => {
                    onClickCheckbox(data, isChecked);
                  }}
              />
            </div>
          </div>
        ) : null}
        <div className='header-info'>
          {display.header?.map((column: CellViewType, index: number) => getValueElement(eval(`data.${column.code}`), column, index))}
        </div>
        <div className='item-action'>
          {display.actions?display.actions(data).map((action: EventButton, index: number) => <ButtonAction key={`itemactionbutton${index}`} button={action}/>) : null}
        </div>
      </div>
      {genDetail()}
      <div className='item-view-bottom'>
        {display.bottom?.map((columns: CellViewType[], index: number) => {
          return (
            <div key={`detail-bottom-row${index}`}
              className={`item-detail-row`}
            >
              {columns?.map((column: CellViewType, index: number) =>

                getValueElement(eval(`data.${column.code}`), column, index)

              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ItemView;
