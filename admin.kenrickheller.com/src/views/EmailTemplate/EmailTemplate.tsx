import { MouseEvent } from 'react';
import {
  useAddPopup,
  useGetStatusReload,
  useReloadTable,
  useRemovePopup,
} from 'src/state/application/hooks';
import { EnumAction, EventButton } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { useNavigate } from 'react-router-dom';
import { EnumViewType } from 'src/common/enum/EnumViewType';
import { BASE_SETTING_URL } from 'src/constants';
import { useDeleteEmailTemplate, useGetEmailTemplate } from 'src/api/emailTemplateApi';

//PreventDefault
// window.addEventListener('contextmenu', (e) => e.preventDefault());

//Realm
const EmailTemplate: React.FC = () => {
  //Define
  const header: string[] = ['Key', 'Tiêu đề', 'Thứ tự', 'Mô tả', 'Giá trị'];
  const displayList: string[] = [
    '.emailTemplateKey',
    '.emailTemplateTitle',
    '.displayOrder',
    '.description',
    '.emailTemplateValue',
  ];
  const typeList: string[] = ['string', 'string', 'status', 'string', 'string'];

  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const reloadTable = useReloadTable();
  const getEmailTemplate = useGetEmailTemplate();
  const deleteEmailTemplate = useDeleteEmailTemplate();
  const navigate = useNavigate();
  //State
  const reloadFlag = useGetStatusReload();
  const [data, setData] = useState(null);
  useEffect(() => {
    getEmailTemplate()
      .then((data) => {
        setData(data);
      })
      .catch(() => {
        alert('Có lỗi xảy ra vui lòng thử lại sau');
      });
  }, [getEmailTemplate, reloadFlag]);

  //Menucontext
  const onView = (emailTemplateId: number) => {
    openDetail(EnumViewType.View, emailTemplateId);
  };

  const onEdit = (emailTemplateId: number) => {
    openDetail(EnumViewType.Edit, emailTemplateId);
  };

  const onDelete = (emailTemplateId: number) => {
    const onCancel = () => {
      console.log('cancel');
    };
    const onConfirm = () => {
      deleteEmailTemplate(Number(emailTemplateId))
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa thành công!',
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
    //     question: 'Bạn có chắc muốn xóa mẫu email này?',
    //     listActionButton: listButton,
    //   },
    // });
  };

  //When click right mouse
  const onRightMouseClick = (e: MouseEvent, index: number, emailTemplateId: number) => {
    const RIGHT_MOUSE_BUTTON = 2;
    const listToDo: EventButton[] = [
      {
        name: 'Chi tiết',
        icon: 'info',
        actionType: EnumAction.Edit,
        action: () => {
          onView(emailTemplateId);
        },
        buttonClass: 'info',
        align: 'left',
      },
      {
        name: 'Sửa',
        icon: 'auto_fix_high',
        actionType: EnumAction.Edit,
        action: () => onEdit(emailTemplateId),
        buttonClass: 'info',
        align: '',
      },
      {
        name: 'Xóa',
        icon: 'delete',
        actionType: EnumAction.Edit,
        action: () => onDelete(emailTemplateId),
        buttonClass: 'info',
        align: '',
      },
    ];

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
      addPopup({
        context: {
          width: '100px',
          height: '100px',
          listActionButton: listToDo,
          posX: `${posX.toString()}px`,
          posY: `${(posY - 60).toString()}px`,
        },
      });
    }
  };
  //End of menucontext

  //Double click
  const onDoubleClick = (emailTemplateId: number) => {
    onView(emailTemplateId);
  };
  //End of double click

  const openDetail = (type: EnumViewType, emailTemplateId: number) => {
    const url = `${BASE_SETTING_URL}/email-template/${type}/id/${emailTemplateId}`;
    navigate(url);
  };

  //Toolbar
  const onAddNew = () => {
    openDetail(EnumViewType.Edit, 0);
  };

  const listButton: EventButton[] = [
    {
      name: 'Thêm',
      icon: 'add',
      actionType: EnumAction.View,
      buttonClass: 'info100',
      action: onAddNew,
      align: 'center',
    },
  ];
  //End of toolbar

  return (
    <div className="static-page-container">
      {/* <ToolBar
        toolbarName={'Danh sách mẫu email'}
        listRightButton={listButton}
        width={'100%'}
        height={'50px'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      /> */}
      {/* <Table
        header={header}
        tableType={'label'}
        isDisable={true}
        data={data}
        onRightMouseClick={onRightMouseClick}
        displayList={displayList}
        manage={'.emailTemplateId'}
        typeList={typeList}
        onDoubleClick={onDoubleClick}
      /> */}
    </div>
  );
};

export default EmailTemplate;
