import './News.css';
import { MouseEvent } from 'react';
import {
  useAddPopup,
  useGetStatusReload,
  useReloadTable,
  useRemovePopup,
} from 'src/state/application/hooks';
import { EnumAction, EventButton, EnumDataType } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { TableColumnType } from 'src/components/Table/TableHeader/TableHeader';
import { useNavigate } from 'react-router-dom';
import { EnumViewType } from 'src/common/enum/EnumViewType';
import { useGetNews, useDeleteNews } from 'src/api/newsApi';
import { BASE_WEB_URL } from 'src/constants';
import useModal from 'src/hooks/useModal';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';

//PreventDefault
// window.addEventListener('contextmenu', (e) => e.preventDefault());

const News: React.FC = () => {
  const display = {
    header: [
      {
        code: 'newAvatar',
        dataType: EnumDataType.Image,
        isOptions: false,
        title: 'Avatar',
      },
      {
        code: 'newTitle',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiêu đề',
      },
      {
        code: 'displayOrder',
        dataType: EnumDataType.Text, // or Int
        isOptions: false,
        title: 'Thứ tự',
        cellCss: {
          textAlign: 'center',
        },
      },
      {
        code: 'description',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Mô tả',
      },
      {
        code: 'newValue',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Giá trị',
      },
    ] as TableColumnType[],
  };

  //Function
  const addPopup = useAddPopup();
  const reloadTable = useReloadTable();
  const getNews = useGetNews();
  const deleteNews = useDeleteNews();
  const navigate = useNavigate();
  //State
  const reloadFlag = useGetStatusReload();
  const [data, setData] = useState(null);
  const confirmModal = useModal(ConfirmModal);

  useEffect(() => {
    getNews()
      .then((data) => {
        setData(data.items);
      })
      .catch(() => {
        alert('Có lỗi xảy ra vui lòng thử lại sau');
      });
  }, [getNews, reloadFlag]);

  //Menucontext
  const onView = (newId: number) => {
    openDetail(EnumViewType.View, newId);
  };

  const onEdit = (newId: number) => {
    openDetail(EnumViewType.Edit, newId);
  };

  const onDelete = (newId: number) => {
    const onConfirm = () => {
      deleteNews(newId)
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
        buttonClass: 'info',
        align: 'center',
      },
    ];
    confirmModal.handlePresent(
      {
        question: 'Bạn có chắc muốn xóa tin này?',
        listActionButton: listButton,
        postProcess: confirmModal.handleDismiss,
      },
      'XÓA TIN TỨC',
    );
  };

  //When click right mouse
  const onRightMouseClick = (e: MouseEvent, index: number, newId: number) => {
    const RIGHT_MOUSE_BUTTON = 2;
    const listToDo: EventButton[] = [
      {
        name: 'Chi tiết',
        icon: 'info',
        actionType: EnumAction.Edit,
        action: () => {
          onView(newId);
        },
        buttonClass: 'info',
        align: 'left',
      },
      {
        name: 'Sửa',
        icon: 'auto_fix_high',
        actionType: EnumAction.Edit,
        action: () => onEdit(newId),
        buttonClass: 'info',
        align: '',
      },
      {
        name: 'Xóa',
        icon: 'delete',
        actionType: EnumAction.Edit,
        action: () => onDelete(newId),
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
  const onDoubleClick = (newId: number) => {
    onView(newId);
  };
  //End of double click

  const openDetail = (type: EnumViewType, newId: number) => {
    const url = `${BASE_WEB_URL}/news/${type}/id/${newId}`;
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
    <div className="news-container">
      <ToolBar
        toolbarName={'Danh sách tin tức'}
        listRightButton={listButton}
        width={'100%'}
        height={'50px'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      />
      <Table
        display={display}
        isInput={false}
        data={data as any}
        menuContext={(item: any) => {
          return [
            {
              name: 'Chi tiết',
              icon: 'info',
              actionType: EnumAction.Edit,
              action: () => onView(item.newId),
              buttonClass: 'info',
              align: 'left',
            },
            {
              name: 'Sửa',
              icon: 'auto_fix_high',
              actionType: EnumAction.Edit,
              action: () => onEdit(item.newId),
              buttonClass: 'info',
              align: '',
            },
            {
              name: 'Xóa',
              icon: 'delete',
              actionType: EnumAction.Edit,
              action: () => onDelete(item.newId),
              buttonClass: 'info',
              align: '',
            },
          ];
        }}
        onDoubleClick={(item: any) => onDoubleClick(item.newId)}
      />
    </div>
  );
};

export default News;
