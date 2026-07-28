import './ListView.css';
import ItemView, { ItemDisplayType } from './ItemView/ItemView';
import { useState } from 'react';
import { EventButton } from 'src/api/models';
import { useAddPopup } from 'src/state/application/hooks';



export interface IListView<T> {
  display: ItemDisplayType<T>;
  data: T[];
  isInput: boolean;

  onDoubleClick?: (...args: any[]) => any;
  onClickCheckbox?: (...args: any[]) => any;
  onClick?: (...args: any[]) => any;

  allowCheckbox?: boolean;
  checkedData?: T[],
  isNo?: boolean
}




const ListView = <T, >(props: IListView<T>) => {const addPopup = useAddPopup();

  const {
    display,
    data,
    isInput,
    onDoubleClick,
    onClickCheckbox,
    onClick,  allowCheckbox,
    checkedData,
    isNo
  } = props;

  const [selected, setSelected] = useState<T>();

  //Main
  return (
    <div className="list-view-container">
        {checkedData? checkedData.map((item: any, index: number) => {
          return (
            <ItemView
              key={`checkedtablerow${index}`}
              display={display}
              data={item}
              index={index}
              isNo={isNo}
              isShowContext={false}
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
        {data? data.map((item: any, index: number)  => {
          return (
            <ItemView
              key={`tablerow${index}`}
              display={display}
              data={item}
              index={index + (checkedData?.length??0)}
              isNo={isNo}
              isShowContext={false}
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
        {(!data || data.length == 0) && (!checkedData || checkedData.length == 0)? (
          <div className='none-item-component'>Không tồn tại bản ghi nào</div>
        ): null}
    </div>
  );
};

export default ListView;
