import './TableRow.css';
import { EnumDataType, EventButton } from 'src/api/models';
import Input from 'src/components/Input/Input';
import { TableColumnType } from '../TableHeader/TableHeader';
import { numberFormat } from 'src/utils/numberUtils';
import ButtonAction from 'src/components/ButtonAction/ButtonAction';
import useLongPress from 'src/hooks/useLongPress';

export interface ITableRow<T extends { [code: string]: any }> {
  header: TableColumnType[];
  actions?: (item: T) => EventButton[];
  data: T;
  index: number;

  isShowContext: boolean;
  isInput: boolean;

  onRightMouseClick: (...args: any[]) => any;
  onDoubleClick: (...args: any[]) => any;
  onClickCheckbox?: (...args: any[]) => any;
  onClick?: (...args: any[]) => any;
  onSelect?: () => void;
  highlight: boolean;
  allowCheckbox?: boolean;
  isChecked?: boolean;
  isNo?: boolean;
}

const TableRow = <T extends { [code: string]: any }>(props: ITableRow<T>) => {
  const {
    header,
    actions,
    data,
    index,
    isInput,
    onRightMouseClick,
    onDoubleClick,
    onClickCheckbox,
    onClick,
    onSelect,
    highlight,
    allowCheckbox,
    isChecked,
    isNo,
  } = props;

  // document.addEventListener('contextmenu', event => event.preventDefault())

  const getValueElement = (value: any, column: TableColumnType) => {
    if (isInput) {
      <Input value={data[column.code]} disabled={false} />;
    } else {
      if (column.isOptions) {
        const option = column.options.find((o) => o.value == value);
        return (
          <div className={'label-table'} style={option?.css ?? undefined}>
            {option?.title}
          </div>
        );
      } else {
        switch (column.dataType) {
          case EnumDataType.Boolean:
            return (
              <div
                className={`label-table ${column.cellCss ? '' : 'text-center'} ${
                  value ? 'color-blue' : 'color-red'
                }`}
                style={column.cellCss ?? undefined}
              >
                {value ? '✓' : '🗙'}
              </div>
            );
          case EnumDataType.BigInt:
          case EnumDataType.Int:
          case EnumDataType.Month:
          case EnumDataType.QuarterOfYear:
            return (
              <div
                className={`label-table ${column.cellCss ? '' : 'text-right'}`}
                style={column.cellCss ?? undefined}
              >
                {numberFormat(value)}
              </div>
            );
          case EnumDataType.Decimal:
            return (
              <div
                className={` ${column.cellCss ? '' : 'text-right'}`}
                style={column.cellCss ?? undefined}
              >
                {numberFormat(value)}
              </div>
            );
          case EnumDataType.Date:
            return (
              <div
                className={`label-table ${column.cellCss ? '' : 'text-center'}`}
                style={column.cellCss ?? undefined}
              >
                {value}
              </div>
            );
          case EnumDataType.Image:
            return <img className="cell-image" src={value} alt="image" />;
          case EnumDataType.Ratio:
            return (
              <div
                className={`label-table ${column.cellCss ? '' : 'text-right'}`}
                style={column.cellCss ?? undefined}
              >
                {value / column.ratio}
              </div>
            );
          case EnumDataType.HTML:
            return column.convert ? column.convert(value) : null;
          default:
            return (
              <div className={'label-table'} style={column.cellCss ?? undefined} title={value}>
                {value}
              </div>
            );
        }
      }
    }
  };
  const onLongPressProps = useLongPress({
    onLongPress: (ev) => {
      const touch = ev.touches[0] || ev.changedTouches[0];
      const posX =
        touch.pageX >= 0 && touch.pageX <= window.innerWidth
          ? touch.pageX
          : touch.pageX < 0
          ? touch.pageX + window.innerWidth
          : touch.pageX - window.innerWidth;
      const posY =
        touch.pageY >= 0 && touch.pageY <= window.innerHeight
          ? touch.pageY
          : touch.pageY < 0
          ? touch.pageY + window.innerHeight
          : touch.pageY - window.innerHeight;
      onRightMouseClick(posX, posY, data);
    },
    onPress: () => {
      onSelect();
      if (onClick) onClick(data);
    },
  });

  //End of function
  return (
    <tr
      className={`table-row-component ${
        highlight ? 'highlight' : index % 2 == 0 ? 'even-row' : 'odd-row'
      }`}
      id={`row_${index}`}
      {...onLongPressProps}
      onMouseDown={(e) => {
        const RIGHT_MOUSE_BUTTON = 2;
        onSelect();
        if (e.button === RIGHT_MOUSE_BUTTON) {
          const posX =
            e.clientX >= 0 && e.clientX <= window.innerWidth
              ? e.clientX
              : e.clientX < 0
              ? e.clientX + window.innerWidth
              : e.clientX - window.innerWidth;
          const posY =
            e.clientY >= 0 && e.clientY <= window.innerHeight
              ? e.clientY
              : e.clientY < 0
              ? e.clientY + window.innerHeight
              : e.clientY - window.innerHeight;
          onRightMouseClick(posX, posY, data);
        }
      }}
      onDoubleClick={(e) => {
        onSelect();
        onDoubleClick(data);
      }}
      onClick={(e) => {
        onSelect();
        if (onClick) onClick(data);
      }}
    >
      {isNo ? <td className={`first-column text-center`}>{index + 1}</td> : null}
      {allowCheckbox ? (
        <td className={`table-row-checkbox`}>
          <div className="table-row-btn-check">
            <i
              className={isChecked ? 'fas fa-check check' : 'fas fa-square'}
              onClick={() => {
                onClickCheckbox(data, isChecked);
              }}
            />
          </div>
        </td>
      ) : null}

      {header.map((column: TableColumnType, index: number) => {
        return (
          <td
            key={`tablecell${index}`}
            className={`column `}
            style={column.cellCss ? column.cellCss : undefined}
          >
            {getValueElement(eval(`data.${column.code}`), column)}
          </td>
        );
      })}
      {actions?.length > 0 ? (
        <td className={`table-cell-action`}>
          {actions(data).map((action: EventButton, index: number) => (
            <ButtonAction key={`itemactionbutton${index}`} button={action} />
          ))}
        </td>
      ) : null}
      <td className={`last-column`} />
    </tr>
  );
};

export default TableRow;
