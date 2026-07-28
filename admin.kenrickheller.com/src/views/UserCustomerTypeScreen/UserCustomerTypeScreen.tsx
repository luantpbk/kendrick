import React from 'react';
import { MouseEvent } from 'react';
import {
  useAddPopup,
  useGetStatusReload,
  useReloadTable,
  useRemovePopup,
} from 'src/state/application/hooks';
import { BusinessType, EnumAction, EventButton, UserCustomerType } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { EnumConfigSimPriceDetail } from './UserCustomerTypeDetail/UserCustomerTypeDetail';
import ChooseDateDetail from './ChooseDateDetail/ChooseDateDetail';
import {
  useDeleteUserCustomerType,
  useGetBusinessTypeList,
  useGetUserCustomerTypeByDateAndBusinessType,
} from 'src/api/userCustomerTypeApi';
import UserCustomerTypeDetail from './UserCustomerTypeDetail/UserCustomerTypeDetail';
import './UserCustomerTypeScreen.css';
import UserCustomerTypeSlideBar from './UserCustomerTypeSlideBar/UserCustomerTypeSlideBar';
import ChooseBusinessDetail from './ChooseBusinessDetail/ChooseBusinessDetail';

// window.addEventListener('contextmenu', (e) => e.preventDefault());

//TODO
const UserCustomerTypeScreen: React.FC = () => {
  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const deleteUserCustomerType = useDeleteUserCustomerType();
  const reloadFlag = useGetStatusReload();
  const reloadTable = useReloadTable();
  const getUserCustomerTypeByDateAndBusinessType =
    useGetUserCustomerTypeByDateAndBusinessType();
  const getBusinessType = useGetBusinessTypeList();

  //Local state
  const [keyword, setKeyword] = useState<string>(null);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
  const [count, setCount] = useState<number>(null);
  const [userCustomerTypeList, setUserCustomerTypeList] = useState<UserCustomerType[]>([]);
  const [businessType, setBusinessType] = useState<number>(null);
  const [businessTypeList, setBusinessTypeList] = useState<BusinessType[]>([]);
  const [date, setDate] = useState<string>(null);

  //Define
  const LEFT_MOUSE_BUTTON = 0;
  const displayList: string[] = [
    '.displayOrder',
    '.user.fullName',
    '.effectiveDate',
    '.customerType.customerTypeCode',
    '.customerType.customerTypeTilte',
    '.customerType.feePercent',
    '.customerType.salesTarget',
    '.customerType.discountPercent',
  ];
  const header: string[] = [
    'Thứ tự',
    'Tên người dùng',
    'Ngày hiệu lực',
    'Mã Loại khách hàng',
    'Mô tả',
    'Phí đặt hàng (%)',
    'Doanh số mục tiêu',
    'Tỷ lệ hoa hồng (%)',
  ];
  const typeList: string[] = [
    'status',
    'string',
    'status',
    'status',
    'string',
    'status',
    'number',
    'status',
  ];
  //End of define

  const onChangeDate = (d: string) => {
    setDate(d);
  };

  const onChangeBusinessType = (businessType: number) => {
    setBusinessType(businessType);
  };

  //Menucontext
  const onView = (userCustomerTypeId: number) => {
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '350px',
      //   title: 'Chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <UserCustomerTypeDetail
      //       config={EnumConfigSimPriceDetail.view}
      //       userCustomerTypeId={userCustomerTypeId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onEdit = (userCustomerTypeId: number) => {
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '525px',
      //   title: 'Chỉnh sửa chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <UserCustomerTypeDetail
      //       config={EnumConfigSimPriceDetail.edit}
      //       userCustomerTypeId={userCustomerTypeId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onUpdate = (userCustomerTypeId: number) => {
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '460px',
      //   title: 'Cập nhật',
      //   isManualRemove: true,
      //   data: (
      //     <UserCustomerTypeDetail
      //       config={EnumConfigSimPriceDetail.update}
      //       userCustomerTypeId={userCustomerTypeId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onDelete = (userCustomerTypeId: number) => {
    const onCancel = () => {
      console.log('cancel');
    };

    const onConfirm = () => {
      deleteUserCustomerType(Number(userCustomerTypeId))
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
    //     question: 'Bạn có chắc muốn xóa bản ghi này này?',
    //     listActionButton: listButton,
    //   },
    // });
  };

  //When click right mouse
  const onRightMouseClick = (e: MouseEvent, index: number, userCustomerTypeId: number) => {
    const RIGHT_MOUSE_BUTTON = 2;
    const listToDo: EventButton[] = [
      {
        name: 'Chi tiết',
        icon: 'info',
        actionType: EnumAction.Edit,
        action: () => onView(userCustomerTypeId),
        buttonClass: 'info',
        align: 'left',
      },
      {
        name: 'Sửa',
        icon: 'auto_fix_high',
        actionType: EnumAction.Edit,
        action: () => onEdit(userCustomerTypeId),
        buttonClass: 'info',
        align: '',
      },
      {
        name: 'Cập nhật',
        icon: 'update',
        actionType: EnumAction.Edit,
        action: () => onUpdate(userCustomerTypeId),
        buttonClass: 'info',
        align: '',
      },
      {
        name: 'Xóa',
        icon: 'delete',
        actionType: EnumAction.Edit,
        action: () => onDelete(userCustomerTypeId),
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

  const onClick = (userCustomerTypeId: number) => {
    //showSlideBar();
    //setSlideBarContent({
    // view: {
    //   width: '',
    //   height: '100%',
    //   title: '',
    //   isManualRemove: true,
    //   data: (
    //     <UserCustomerTypeSlideBar
    //       key={Math.random()}
    //       userCustomerTypeId={userCustomerTypeId}
    //     />
    //   ),
    //   isContext: false,
    // },
    //});
  };

  //Function in the listButton
  const onAddNewUserCustomerType = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      //hiddenSLideBar();
      addPopup({
        // view: {
        //   width: '475px',
        //   height: '525px',
        //   title: 'Thêm bản ghi mới',
        //   isManualRemove: true,
        //   data: <UserCustomerTypeDetail config={EnumConfigSimPriceDetail.add} />,
        //   isContext: false,
        // },
      });
    }
  };

  const onChooseDate = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      //hiddenSLideBar();
      addPopup({
        // view: {
        //   width: '382px',
        //   height: '375px',
        //   title: 'Chọn ngày',
        //   isManualRemove: true,
        //   data: <ChooseDateDetail onChange={onChangeDate} />,
        //   isContext: false,
        // },
      });
    }
  };

  const onChooseBusinessType = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      //hiddenSLideBar();
      addPopup({
        // view: {
        //   width: '382px',
        //   height: '175px',
        //   title: 'Chọn loại hình kinh doanh',
        //   isManualRemove: true,
        //   data: (
        //     <ChooseBusinessDetail
        //       onChange={onChangeBusinessType}
        //       businessTypeList={businessTypeList}
        //       businessType={businessType}
        //     />
        //   ),
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
      action: onAddNewUserCustomerType,
      align: 'center',
    },
    {
      name: `${date ? date : 'Tất cả'}`,
      icon: 'calendar_month',
      actionType: EnumAction.View,
      buttonClass: 'info sim-order-tool-btn',
      action: onChooseDate,
      align: 'center',
    },
    {
      name: `${
        businessType
          ? businessTypeList.filter((value) => {
              if (value.businessType == businessType) {
                return true;
              }
            })[0].businessTypeTitle
          : 'Chọn loại hình kinh doanh'
      }`,
      icon: 'business',
      actionType: EnumAction.View,
      buttonClass: 'info100 sim-order-tool-btn',
      action: onChooseBusinessType,
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
    if (date && businessType) {
      getUserCustomerTypeByDateAndBusinessType(date, businessType)
        .then((data) => {
          setUserCustomerTypeList(data);
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
    }
  }, [addPopup, businessType, date, getUserCustomerTypeByDateAndBusinessType, reloadFlag]);

  useEffect(() => {
    const date = new Date();
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yy = date.getFullYear();
    const temp = `${dd}/${mm}/${yy}`;
    setDate(temp);
  }, []);

  useEffect(() => {
    getBusinessType()
      .then((data) => {
        setBusinessTypeList(data);
        setBusinessType(data[0].businessType);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getBusinessType]);

  return (
    <div className="product-container">
      {/* <ToolBar
        toolbarName={'Quản lý loại khách hàng'}
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
        key={'table sim'}
        header={header}
        tableType={'label'}
        isDisable={true}
        data={userCustomerTypeList}
        onRightMouseClick={onRightMouseClick}
        displayList={displayList}
        manage={'.userCustomerTypeId'}
        typeList={typeList}
        onDoubleClick={onDoubleClick}
        onClick={onClick}
      /> */}
    </div>
  );
};
export default UserCustomerTypeScreen;
