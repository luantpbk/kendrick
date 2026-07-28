import './Table.css';
import TableHeader, { TableColumnType } from './TableHeader/TableHeader';
import TableRow from './TableRow/TableRow';
import { useEffect, useRef, useState } from 'react';
import { EventButton } from 'src/api/models';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';

export interface ITable<T> {
  display: {
    header: TableColumnType[];
    actions?: (item: T) => EventButton[];
  };
  data: T[];
  isInput: boolean;

  menuContext?: (data: T) => EventButton[];
  onDoubleClick?: (...args: any[]) => any;
  onClickCheckbox?: (...args: any[]) => any;
  onClick?: (...args: any[]) => any;
  onClickCheckAll?: (...args: any[]) => any;
  allowCheckbox?: boolean;
  checkedData?: T[];
  isNo?: boolean;
}

const Table = <T,>(props: ITable<T>) => {
  const addPopup = useAddPopup();

  const {
    display,
    data,
    isInput,
    menuContext,
    onDoubleClick,
    onClickCheckbox,
    onClickCheckAll,
    onClick,
    allowCheckbox,
    checkedData,
    isNo,
  } = props;

  useEffect(() => {
    const handleContextMenu = (e: any) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const [selected, setSelected] = useState<T>();

  const onRightMouseClick = (posX: number, posY: number, item: T) => {
    if (menuContext) {
      addPopup({
        context: {
          listActionButton: menuContext(item),
          posX: `${posX}px`,
          posY: `${posY - 60}px`,
        },
      });
    }
  };

  //Main
  return (
    <div className="table-container">
      <table id="table-component">
        <thead>
          <TableHeader
            header={display.header}
            isAction={display.actions?.length > 0}
            allowCheckbox={allowCheckbox}
            isNo={isNo}
            onClickCheckAll={onClickCheckAll}
            isCheckedAll={data?.length == 0}
          />
        </thead>
        <tbody>
          {checkedData
            ? checkedData.map((item: any, index: number) => {
                return (
                  <TableRow
                    key={`checkedtablerow${index}`}
                    header={display.header}
                    data={item}
                    index={index}
                    isNo={isNo}
                    isShowContext={false}
                    onRightMouseClick={onRightMouseClick}
                    isInput={isInput}
                    onDoubleClick={onDoubleClick}
                    onClick={onClick}
                    allowCheckbox={allowCheckbox}
                    onClickCheckbox={onClickCheckbox}
                    onSelect={() => setSelected(item)}
                    highlight={item == selected}
                    isChecked={true}
                  />
                );
              })
            : null}
          {data
            ? data.map((item: any, index: number) => {
                return (
                  <TableRow
                    key={`tablerow${index}`}
                    header={display.header}
                    actions={display.actions}
                    data={item}
                    index={index + (checkedData?.length ?? 0)}
                    isNo={isNo}
                    isShowContext={false}
                    onRightMouseClick={onRightMouseClick}
                    isInput={isInput}
                    onDoubleClick={onDoubleClick}
                    onClick={onClick}
                    allowCheckbox={allowCheckbox}
                    onClickCheckbox={onClickCheckbox}
                    onSelect={() => setSelected(item)}
                    highlight={item == selected}
                    isChecked={false}
                  />
                );
              })
            : null}
          {(!data || data.length == 0) && (!checkedData || checkedData.length == 0) ? (
            <tr className="table-row-component even-row">
              <td
                colSpan={
                  (display?.header?.length ?? 0) +
                  1 +
                  (isNo ? 1 : 0) +
                  (allowCheckbox ? 1 : 0) +
                  (display?.actions?.length > 0 ? 1 : 0)
                }
              >
                Không tồn tại bản ghi nào
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
