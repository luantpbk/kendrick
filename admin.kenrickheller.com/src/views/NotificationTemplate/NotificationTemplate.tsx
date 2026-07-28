import { MouseEvent } from 'react';
import {
  useAddPopup,
} from 'src/state/application/hooks';
import { EnumAction, EnumDataType, EventButton, NotificationTemplateType } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { useNavigate } from 'react-router-dom';
import { EnumViewType } from 'src/common/enum/EnumViewType';
import { BASE_SETTING_URL } from 'src/constants';
import {
  useDeleteNotificationTemplate,
  useGetNotificationTemplate,
} from 'src/api/notificatoinTemplateApi';
import useModal from 'src/hooks/useModal';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';
import { TableColumnType } from 'src/components/Table/TableHeader/TableHeader';

const NotificationTemplate: React.FC = () => {

  const display = {
    header: [
      {
        code: 'notificationTemplateKey',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Mã mẫu thông báo',
      },
      {
        code: 'notificationTemplateTitle',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiêu đề',
      },
      {
        code: 'description',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Mô tả',
      },
      {
        code: 'notificationTemplateValue',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Nội dung',
      },
      {
        code: 'displayOrder',
        dataType: EnumDataType.Int,
        isOptions: false,
        title: 'Thứ tự',
        cellCss: {
          textAlign: 'center',
        },
      },
    ] as TableColumnType[]
  };


  //Function
  const addPopup = useAddPopup();
  const getNotificationTemplate = useGetNotificationTemplate();
  const deleteNotificationTemplate = useDeleteNotificationTemplate();
  const navigate = useNavigate();

  //State
  const [reloadFlag, setReloadFlag] = useState(false);
  const [data, setData] = useState<NotificationTemplateType[]>([]);

  const confirmModal = useModal(ConfirmModal);


  useEffect(() => {
    getNotificationTemplate()
      .then((data) => {
        setData(data);
      });
  }, [getNotificationTemplate, reloadFlag]);

  //Menucontext
  const onView = (notificationTemplateId: number) => {
    openDetail(EnumViewType.View, notificationTemplateId);
  };

  const onEdit = (notificationTemplateId: number) => {
    openDetail(EnumViewType.Edit, notificationTemplateId);
  };

  const onDelete = (notificationTemplateId: number) => {
    const onConfirm = () => {
      deleteNotificationTemplate(notificationTemplateId)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa mẫu thông báo thành công',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          });
        })
        .finally(() => setReloadFlag(!reloadFlag));
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
        buttonClass: 'info',
        align: 'center',
      },
    ];
    confirmModal.handlePresent(
      {
        question: 'Bạn có chắc muốn xóa mẫu thông báo này?',
        listActionButton: listButton,
        postProcess: confirmModal.handleDismiss,
      },
      'XÓA MẪU THÔNG BÁO',
    );
  };

  //When click right mouse
  const menuContext = (item: NotificationTemplateType) => [
    {
      name: 'Chi tiết',
      icon: 'info',
      actionType: EnumAction.Edit,
      action: () => onView(item.notificationTemplateId),
      buttonClass: 'info',
      align: 'left',
    },
    {
      name: 'Sửa',
      icon: 'auto_fix_high',
      actionType: EnumAction.Edit,
      action: () => onEdit(item.notificationTemplateId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Xóa',
      icon: 'delete',
      actionType: EnumAction.Edit,
      action: () => onDelete(item.notificationTemplateId),
      buttonClass: 'info',
      align: '',
    },
  ];
  //End of menucontext

  const openDetail = (type: EnumViewType, notificationTemplateId: number) => {
    const url = `${BASE_SETTING_URL}/notification-template/${type}/id/${notificationTemplateId}`;
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
    <>
      <ToolBar
        toolbarName={'DANH SÁCH MẪU THÔNG BÁO'}
        listRightButton={listButton}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      />
      <Table
        display={display}
        isInput={false}
        data={data}
        menuContext={menuContext}
        onDoubleClick={(item) => onView(item.notificationTemplateId)}
      />
    </>
  );
};

export default NotificationTemplate;
