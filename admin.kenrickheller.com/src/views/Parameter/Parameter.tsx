import React from 'react';
import { MouseEvent } from 'react';
import {
  useAddPopup,
  useGetStatusReload,
  useReloadTable,
  useRemovePopup,
} from 'src/state/application/hooks';
import { EnumAction, EventButton, ParameterType } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { useDeleteParameter, useGetParameterByDate } from 'src/api/parameterApi';
import ParameterDetail, { EnumConfigSimPriceDetail } from './ParameterDetail/ParameterDetail';
import ParameterSlideBar from './ParameterSlideBar/ParameterSlideBar';
import ChooseDateDetail from '../UserCustomerTypeScreen/ChooseDateDetail/ChooseDateDetail';

// window.addEventListener('contextmenu', (e) => e.preventDefault());

const Parameter: React.FC = () => {
  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const deleteParameter = useDeleteParameter();
  const reloadFlag = useGetStatusReload();
  const reloadTable = useReloadTable();
  const getParameter = useGetParameterByDate();

  //Local state
  const [keyword, setKeyword] = useState<string>(null);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
  const [count, setCount] = useState<number>(null);
  const [parameterList, setParameterList] = useState<ParameterType[]>([]);
  const [date, setDate] = useState<string>(null);

  //Define
  const LEFT_MOUSE_BUTTON = 0;
  const displayList: string[] = [
    '.displayOrder',
    '.parameterKey',
    '.parameterTitle',
    '.parameterValue',
    '.effectiveDate',
  ];
  const header: string[] = ['Thứ tự', 'Key', 'Tiêu đề', 'Giá trị', 'Ngày hiệu lực'];
  const typeList: string[] = ['status', 'status', 'status', 'number', 'status'];
  //End of define

  const onChangeDate = (d: string) => {
    setDate(d);
  };
  //Menucontext
  const onView = (parameterId: number) => {
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '350px',
      //   title: 'Chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <ParameterDetail config={EnumConfigSimPriceDetail.view} parameterId={parameterId} />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onEdit = (parameterId: number) => {
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '525px',
      //   title: 'Chỉnh sửa chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <ParameterDetail config={EnumConfigSimPriceDetail.edit} parameterId={parameterId} />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onUpdate = (parameterId: number) => {
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '460px',
      //   title: 'Cập nhật',
      //   isManualRemove: true,
      //   data: (
      //     <ParameterDetail config={EnumConfigSimPriceDetail.update} parameterId={parameterId} />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onDelete = (parameterId: number) => {
    const onCancel = () => {
      console.log('cancel');
    };

    const onConfirm = () => {
      deleteParameter(Number(parameterId))
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
  const onRightMouseClick = (e: MouseEvent, index: number, parameterId: number) => {
    const RIGHT_MOUSE_BUTTON = 2;
    const listToDo: EventButton[] = [
      {
        name: 'Chi tiết',
        icon: 'info',
        actionType: EnumAction.Edit,
        action: () => onView(parameterId),
        buttonClass: 'info',
        align: 'left',
      },
      {
        name: 'Sửa',
        icon: 'auto_fix_high',
        actionType: EnumAction.Edit,
        action: () => onEdit(parameterId),
        buttonClass: 'info',
        align: '',
      },
      {
        name: 'Cập nhật',
        icon: 'update',
        actionType: EnumAction.Edit,
        action: () => onUpdate(parameterId),
        buttonClass: 'info',
        align: '',
      },
      {
        name: 'Xóa',
        icon: 'delete',
        actionType: EnumAction.Edit,
        action: () => onDelete(parameterId),
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

  const onClick = (parameterId: number) => {
    //showSlideBar();
    //setSlideBarContent({
    // view: {
    //   width: '',
    //   height: '100%',
    //   title: '',
    //   isManualRemove: true,
    //   data: <ParameterSlideBar key={Math.random()} parameterId={parameterId} />,
    //   isContext: false,
    // },
    //});
  };

  //Function in the listButton
  const onAddParameterNew = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      //hiddenSLideBar();
      addPopup({
        // view: {
        //   width: '475px',
        //   height: '525px',
        //   title: 'Thiết lập',
        //   isManualRemove: true,
        //   data: <ParameterDetail config={EnumConfigSimPriceDetail.add} />,
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
        //   height: '325px',
        //   title: 'Chọn ngày',
        //   isManualRemove: true,
        //   data: <ChooseDateDetail onChange={onChangeDate} />,
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
      action: onAddParameterNew,
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
    if (date) {
      getParameter(date)
        .then((data) => {
          setParameterList(data);
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
  }, [addPopup, date, getParameter, reloadFlag]);

  useEffect(() => {
    const date = new Date();
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yy = date.getFullYear();
    const temp = `${dd}/${mm}/${yy}`;
    setDate(temp);
  }, []);

  return (
    <div className="product-container">
      {/* <ToolBar
        toolbarName={'Thiết lập hệ thống'}
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
        data={parameterList}
        onRightMouseClick={onRightMouseClick}
        displayList={displayList}
        manage={'.parameterId'}
        typeList={typeList}
        onDoubleClick={onDoubleClick}
        onClick={onClick}
      /> */}
    </div>
  );
};
export default Parameter;
