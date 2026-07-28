import React from 'react';
import { MouseEvent } from 'react';
import {
  useAddPopup,
  useGetStatusReload,
  useReloadTable,
  useRemovePopup,
} from 'src/state/application/hooks';
import { EnumAction, EventButton, StoreType } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { useNavigate } from 'react-router';
import useQuery from 'src/hooks/useQuery';
import StoreDetail, { EnumIStoreDetailConfig } from './StoreDetail/StoreDetail';
import { useDeleteStore, useGetStore } from 'src/api/storeApi';
import './Store.css';

// window.addEventListener('contextmenu', (e) => e.preventDefault());

const Store: React.FC = () => {
  //Value
  const navigate = useNavigate();
  const query = useQuery();
  const page = query.get('page') ? Number(query.get('page')) : 1;
  const size = query.get('size') ? Number(query.get('size')) : 50;
  const keyword = query.get('keyword') ? query.get('keyword') : '';

  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();

  const getStore = useGetStore();
  const deleteStore = useDeleteStore();

  const reloadFlag = useGetStatusReload();
  const reloadTable = useReloadTable();

  //Local state
  const [count, setCount] = useState<number>(null);
  const [storeList, setStoreList] = useState<StoreType[]>([]);

  //Define
  const LEFT_MOUSE_BUTTON = 0;
  const displayList: string[] = ['.storeCode', '.storeTitle', '.longitude', '.latitude'];
  const header: string[] = ['Mã nhà kho', 'Tiêu đề', 'Kinh độ', 'Vĩ độ'];
  const typeList: string[] = ['status', 'status', 'status', 'status'];
  //End of define

  //Menucontext
  const onView = (storeId: number) => {
    //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '800px',
      //   height: '500px',
      //   title: 'Chi tiết',
      //   isManualRemove: true,
      //   data: <StoreDetail config={EnumIStoreDetailConfig.view} storeId={storeId} />,
      //   isContext: false,
      // },
    });
  };

  const onEdit = (storeId: number) => {
    //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '800px',
      //   height: '500px',
      //   title: 'Chỉnh sửa',
      //   isManualRemove: true,
      //   data: <StoreDetail config={EnumIStoreDetailConfig.edit} storeId={storeId} />,
      //   isContext: false,
      // },
    });
  };

  const onDelete = (storeId: number) => {
    const onCancel = () => {
      console.log('cancel');
    };

    const onConfirm = () => {
      deleteStore(Number(storeId))
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa địa chỉ kho thành công',
            },
          });
          reloadTable();
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          });
          reloadTable();
        });
    };

    const listButton: EventButton[] = [
      {
        name: 'Xác nhận',
        icon: 'check',
        actionType: EnumAction.Confirm,
        action: onConfirm,
        buttonClass: 'info',
        align: 'center',
      },
      {
        name: 'Hủy',
        icon: 'clear',
        actionType: EnumAction.Cancel,
        action: onCancel,
        buttonClass: 'info',
        align: 'center',
      },
    ];
    // addPopup({
    //   confirm: {
    //     width: '400px',
    //     height: '150px',
    //     question: 'Bạn có chắc muốn xóa địa chỉ này?',
    //     listActionButton: listButton,
    //   },
    // });
  };

  //When click right mouse
  const onRightMouseClick = (e: MouseEvent, index: number, storeId: number) => {
    const RIGHT_MOUSE_BUTTON = 2;
    const listToDo: EventButton[] = [
      {
        name: 'Chi tiết',
        icon: 'info',
        actionType: EnumAction.Edit,
        action: () => onView(storeId),
        buttonClass: 'info',
        align: 'left',
      },
      {
        name: 'Sửa',
        icon: 'auto_fix_high',
        actionType: EnumAction.Edit,
        action: () => onEdit(storeId),
        buttonClass: 'info',
        align: '',
      },
      {
        name: 'Xóa',
        icon: 'delete',
        actionType: EnumAction.Edit,
        action: () => onDelete(storeId),
        buttonClass: 'info',
        align: '',
      },
    ];

    if (e.button === RIGHT_MOUSE_BUTTON) {
      //hiddenSLideBar();
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
      addPopup({
        context: {
          width: '160px',
          height: '125px',
          listActionButton: listToDo,
          posX: `${posX.toString()}px`,
          posY: `${(posY - 60).toString()}px`,
        },
      });
    }
  };
  //End of menucontext

  const onDoubleClick = (storeId: number) => {
    onView(storeId);
    //hiddenSLideBar();
  };

  //Function in the listButton
  const onAddNewStore = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      //hiddenSLideBar();
      addPopup({
        // view: {
        //   width: '800px',
        //   height: '500px',
        //   title: 'Thêm địa chỉ kho mới',
        //   isManualRemove: true,
        //   data: <StoreDetail config={EnumIStoreDetailConfig.add} />,
        //   isContext: false,
        // },
      });
    }
  };

  //Toolbar
  const listButton: EventButton[] = [
    {
      name: 'Thêm',
      icon: 'add',
      actionType: EnumAction.View,
      buttonClass: 'info100 sim-order-tool-btn',
      action: onAddNewStore,
      align: 'center',
    },
  ];

  //End of toolbar

  //useEffect
  useEffect(() => {
    getStore()
      .then((data) => {
        setStoreList(data);
        setCount(data.length);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getStore, reloadFlag]);

  return (
    <div className="product-container">
      {/* <Table
        key={'table store'}
        header={header}
        tableType={'label'}
        isDisable={true}
        data={storeList}
        onRightMouseClick={onRightMouseClick}
        displayList={displayList}
        manage={'.storeId'}
        typeList={typeList}
        onDoubleClick={onDoubleClick}
      /> */}
    </div>
  );
};
export default Store;
