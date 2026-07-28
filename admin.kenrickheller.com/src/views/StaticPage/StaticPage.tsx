import './StaticPage.css';
import { MouseEvent } from 'react';
import { useAddPopup, useGetStatusReload, useReloadTable } from 'src/state/application/hooks';
import { EnumAction, EnumDataType, EventButton, StaticPageType } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { useNavigate } from 'react-router-dom';
import { EnumViewType } from 'src/common/enum/EnumViewType';
import { useDeleteStaticPage, useGetStaticPage } from 'src/api/staticPageApi';
import { BASE_WEB_URL } from 'src/constants';
import { TableColumnType } from 'src/components/Table/TableHeader/TableHeader';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';
import useModal from 'src/hooks/useModal';

const StaticPage: React.FC = () => {
  //Define
  const header = {
    header: [
      {
        code: 'staticPageKey',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Từ khóa',
      },
      {
        code: 'staticPageTitle',
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
        code: 'displayOrder',
        dataType: EnumDataType.Int,
        isOptions: false,
        title: 'Thứ tự',
        cellCss: {
          textAlign: 'center',
        },
      },
    ] as TableColumnType[],
  };

  //Function
  const addPopup = useAddPopup();
  const getStaticPage = useGetStaticPage();
  const deleteStaticPage = useDeleteStaticPage();
  const navigate = useNavigate();
  const confirmModal = useModal(ConfirmModal);
  //State
  const [data, setData] = useState<StaticPageType[]>([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    getStaticPage()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [getStaticPage, reloadFlag]);

  //Menucontext
  const onDelete = (statusPageId: number) => {
    const onConfirm = () => {
      deleteStaticPage(statusPageId)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa thành công!',
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
        question: 'Bạn có chắc muốn xóa trang này?',
        listActionButton: listButton,
        postProcess: confirmModal.handleDismiss,
      },
      'XÓA TRANG',
    );
  };

  //When click right mouse
  const menuContext = (item: StaticPageType) => [
    {
      name: 'Chi tiết',
      icon: 'info',
      actionType: EnumAction.View,
      action: () => openDetail(EnumViewType.View, item.staticPageId),
      buttonClass: 'info',
      align: 'left',
    },
    {
      name: 'Sửa',
      icon: 'auto_fix_high',
      actionType: EnumAction.Edit,
      action: () => openDetail(EnumViewType.Edit, item.staticPageId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Xóa',
      icon: 'delete',
      actionType: EnumAction.Edit,
      action: () => onDelete(item.staticPageId),
      buttonClass: 'info',
      align: '',
    },
  ];

  const openDetail = (type: EnumViewType, statusPageId?: number) => {
    const url = `${BASE_WEB_URL}/static-page/${type}/id/${statusPageId}`;
    navigate(url);
  };

  const listButton: EventButton[] = [
    {
      name: 'Thêm',
      icon: 'add',
      actionType: EnumAction.View,
      buttonClass: 'info100',
      action: () => openDetail(EnumViewType.Edit),
      align: 'center',
    },
  ];
  //End of toolbar

  return (
    <>
      <ToolBar
        toolbarName={'Danh sách trang thông tin'}
        listRightButton={listButton}
        width={'100%'}
        height={'50px'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      />
      <Table
        display={header}
        isInput={false}
        menuContext={menuContext}
        data={data}
        onDoubleClick={(item) => openDetail(EnumViewType.View, item.staticPageId)}
      />
    </>
  );
};

export default StaticPage;
