import React from 'react';
import { MouseEvent } from 'react';
import {
  useAddPopup,
  useGetStatusReload,
  useReloadTable,
  useRemovePopup,
} from 'src/state/application/hooks';
import { CustomerType, EnumAction, EventButton } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { EnumConfigSimPriceDetail } from './CustomerTypeDetail/CustomerTypeDetail';
import { useDeleteCustomerType, useGetCustomerType } from 'src/api/customerTypeApi';
import './CustomerTypeScreen.css';
import CustomerTypeDetail from './CustomerTypeDetail/CustomerTypeDetail';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';
import useModal from 'src/hooks/useModal';

// window.addEventListener('contextmenu', (e) => e.preventDefault());

const CustomerTypeScreen: React.FC = () => {
  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const deleteCustomerType = useDeleteCustomerType();
  const reloadFlag = useGetStatusReload();
  const reloadTable = useReloadTable();
  const getCustomerType = useGetCustomerType();

  //Local state
  const [keyword, setKeyword] = useState<string>(null);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
  const [count, setCount] = useState<number>(null);
  const [customerTypeList, setCustomerTypeList] = useState<CustomerType[]>([]);
  const confirmModal = useModal(ConfirmModal);

  //Define
  const LEFT_MOUSE_BUTTON = 0;
  const displayList: string[] = [
    '.displayOrder',
    '.customerTypeCode',
    '.customerTypeTitle',
    '.feePercent',
    '.salesTarget',
    '.discountPercent',
  ];
  const header: string[] = [
    'Thứ tự',
    'Code',
    'Tiêu đề',
    'Phí đặt hàng (%)',
    'Doanh số mục tiêu',
    'Tỷ lệ hoa hồng (%)',
  ];
  const typeList: string[] = ['status', 'status', 'string', 'status', 'number', 'status'];
  //End of define

  //Menucontext
  //TODO
  const onView = (customerTypeId: number) => {
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '550px',
      //   title: 'Chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <CustomerTypeDetail
      //       config={EnumConfigSimPriceDetail.view}
      //       customerTypeId={customerTypeId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  //TODO
  const onEdit = (customerTypeId: number) => {
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '550px',
      //   title: 'Chỉnh sửa chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <CustomerTypeDetail
      //       config={EnumConfigSimPriceDetail.edit}
      //       customerTypeId={customerTypeId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  //TODO
  const onDelete = (customerTypeId: number) => {
    const onCancel = () => {
      console.log('cancel');
    };

    const onConfirm = () => {
      deleteCustomerType(Number(customerTypeId))
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa loại khách hàng thành công',
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
  };

  //When click right mouse
  const onRightMouseClick = (e: MouseEvent, index: number, customerTypeId: number) => {
    const RIGHT_MOUSE_BUTTON = 2;
    const listToDo: EventButton[] = [
      {
        name: 'Chi tiết',
        icon: 'info',
        actionType: EnumAction.Edit,
        action: () => onView(customerTypeId),
        buttonClass: 'info',
        align: 'left',
      },
      {
        name: 'Sửa',
        icon: 'auto_fix_high',
        actionType: EnumAction.Edit,
        action: () => onEdit(customerTypeId),
        buttonClass: 'info',
        align: '',
      },
      {
        name: 'Xóa',
        icon: 'delete',
        actionType: EnumAction.Edit,
        action: () => onDelete(customerTypeId),
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

  const onDoubleClick = (simId: number) => {
    onView(simId);
    //hiddenSLideBar();
  };

  //Function in the listButton
  const onAddNewCustomerType = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      //hiddenSLideBar();
      addPopup({
        // view: {
        //   width: '475px',
        //   height: '550px',
        //   title: 'Thêm loại khách hàng mới',
        //   isManualRemove: true,
        //   data: <CustomerTypeDetail config={EnumConfigSimPriceDetail.add} />,
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
      action: onAddNewCustomerType,
      align: 'center',
    },
  ];

  const onChangeToolBar = (name: string, _value: string) => {
    if (name === 'keyword') {
      setKeyword(_value);
      setPage(1);
    } else if (name === 'page') {
      setPage(Number(_value));
    } else if (name === 'size') {
      setSize(Number(_value));
      setPage(1);
    }
  };
  //End of toolbar

  //useEffect
  useEffect(() => {
    getCustomerType()
      .then((data) => {
        setCustomerTypeList(data);
        setCount(data.length);
        setPage(1);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getCustomerType, reloadFlag]);

  return (
    <div className="product-container">
      {/* <ToolBar
        toolbarName={'Danh sách loại khách hàng'}
        listRightButton={listButton}
        width={'100%'}
        height={'50px'}
        backgroundColor={'#ebe9e9'}
        count={count}
        onChangeToolBar={onChangeToolBar}
        keyword={keyword}
        page={page}
        size={size}
        isPaging={true}
        listCheckbox={[]}
      /> */}
      {/* <Table
        key={'table customer type'}
        header={header}
        tableType={'label'}
        isDisable={true}
        data={customerTypeList}
        onRightMouseClick={onRightMouseClick}
        displayList={displayList}
        manage={'.customerTypeId'}
        typeList={typeList}
        onDoubleClick={onDoubleClick}
      /> */}
    </div>
  );
};
export default CustomerTypeScreen;
