import React from 'react';
import { MouseEvent } from 'react';
import { useAddPopup, useReloadTable, useRemovePopup } from 'src/state/application/hooks';
import { EnumAction, EventButton, ReceiverInfoType } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { useDeleteUserCustomerType } from 'src/api/userCustomerTypeApi';
import './ReceiverInfo.css';
import { useGetReceiverInfo } from 'src/api/receiverInfoApi';
import ReceiverInfoDetail, {
  EnumConfigReceiverInfoDetail,
} from './ReceiverInfoDetail/ReceiverInfoDetail';
import useQuery from 'src/hooks/useQuery';
import { useNavigate } from 'react-router-dom';
import { BASE_SETTING_URL } from 'src/constants';

// window.addEventListener('contextmenu', (e) => e.preventDefault());

//TODO
const ReceiverInfo: React.FC = () => {
  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const deleteUserCustomerType = useDeleteUserCustomerType();
  const reloadTable = useReloadTable();
  const getReceiverInfo = useGetReceiverInfo();

  const navigate = useNavigate();
  const query = useQuery();
  const page = query.get('page') ? Number(query.get('page')) : 1;
  const size = query.get('size') ? Number(query.get('size')) : 50;
  const keyword = query.get('keyword') ? query.get('keyword') : '';
  const userId = query.get('userId') ? Number(query.get('userId')) : undefined;

  //Local state
  const [count, setCount] = useState<number>(null);
  const [receiverInfoList, setReceiverInfoList] = useState<ReceiverInfoType[]>([]);

  //Define
  const LEFT_MOUSE_BUTTON = 0;
  const displayList: string[] = [
    '.userName',
    '.fullname',
    '.phoneNumber',
    '.zipCode',
    '.address1',
    '.address2',
    '.address3',
    '.address4',
    '.facebook',
    '.zalo',
  ];
  const header: string[] = [
    'CTV',
    'Tên người dùng',
    'Số điện thoại',
    'ZipCode',
    'Địa chỉ dòng 1',
    'Địa chỉ dòng 2',
    'Địa chỉ dòng 3',
    'Địa chỉ dòng 4',
    'Facebook',
    'Zalo',
  ];
  const typeList: string[] = [
    'status',
    'status',
    'status',
    'status',
    'status',
    'status',
    'status',
    'status',
    'status',
    'status',
  ];
  //End of define

  //Menucontext
  const onView = (receiverInfoId: number) => {
    addPopup({
      // view: {
      //   width: '85vw',
      //   height: '70vh',
      //   title: 'Chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <ReceiverInfoDetail
      //       config={EnumConfigReceiverInfoDetail.view}
      //       receiverInfoId={receiverInfoId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onEdit = (receiverInfoId: number) => {
    addPopup({
      // view: {
      //   width: '85vw',
      //   height: '80vh',
      //   title: 'Chỉnh sửa chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <ReceiverInfoDetail
      //       config={EnumConfigReceiverInfoDetail.edit}
      //       receiverInfoId={receiverInfoId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onDelete = (receiverInfoId: number) => {
    const onCancel = () => {
      console.log('cancel');
    };

    const onConfirm = () => {
      deleteUserCustomerType(Number(receiverInfoId))
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa bản ghi thành công',
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
    //     question: 'Bạn có chắc muốn xóa địa chỉ nhận hàng này?',
    //     listActionButton: listButton,
    //   },
    // });
  };

  //When click right mouse
  const onRightMouseClick = (e: MouseEvent, index: number, receiverInfoId: number) => {
    const RIGHT_MOUSE_BUTTON = 2;
    const listToDo: EventButton[] = [
      {
        name: 'Chi tiết',
        icon: 'info',
        actionType: EnumAction.Edit,
        action: () => onView(receiverInfoId),
        buttonClass: 'info',
        align: 'left',
      },
      {
        name: 'Sửa',
        icon: 'auto_fix_high',
        actionType: EnumAction.Edit,
        action: () => onEdit(receiverInfoId),
        buttonClass: 'info',
        align: '',
      },
      {
        name: 'Xóa',
        icon: 'delete',
        actionType: EnumAction.Edit,
        action: () => onDelete(receiverInfoId),
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
          height: '152px',
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
  const onAddNewReceiverInfo = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      //hiddenSLideBar();
      addPopup({
        // view: {
        //   width: '85vw',
        //   height: '70vh',
        //   title: 'Thêm địa chỉ nhận hàng mới',
        //   isManualRemove: true,
        //   data: <ReceiverInfoDetail config={EnumConfigReceiverInfoDetail.add} />,
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
      action: onAddNewReceiverInfo,
      align: 'center',
    },
  ];

  const onChangeToolBar = (name: string, _value: string) => {
    let newSize = size;
    let newPage = page;
    let newKeyword = keyword;
    switch (name) {
      case 'keyword':
        newPage = 1;
        newKeyword = _value;
        break;
      case 'page':
        newPage = Number(_value);
        break;
      case 'size':
        newPage = 1;
        newSize = Number(_value);
        break;
      default:
        break;
    }
    const url = `${BASE_SETTING_URL}/receiver-info?userId=${userId}&keyword=${newKeyword}&page=${newPage}&size=${newSize}`;
    navigate(url);
  };
  //End of toolbar

  //useEffect
  useEffect(() => {
    getReceiverInfo(page, size, keyword, userId)
      .then((data) => {
        setReceiverInfoList(data.items);
        setCount(data.count);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getReceiverInfo, keyword, page, size, userId]);

  //Main
  return (
    <div className="product-container">
      {/* <ToolBar
        toolbarName={'Danh sách địa chỉ nhận hàng'}
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
        key={'table receiver info'}
        header={header}
        tableType={'label'}
        isDisable={true}
        data={receiverInfoList}
        onRightMouseClick={onRightMouseClick}
        displayList={displayList}
        manage={'.receiverInfoId'}
        typeList={typeList}
        onDoubleClick={onDoubleClick}
      /> */}
    </div>
  );
};
export default ReceiverInfo;
