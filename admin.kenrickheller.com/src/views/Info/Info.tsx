import './Info.css';
import { MouseEvent } from 'react';
import {
  useAddPopup,
  useGetStatusReload,
  useReloadTable,
  useRemovePopup,
} from 'src/state/application/hooks';
import { CompanyInfoType, EnumAction, EnumDataType, EventButton } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import InfoDetails from './InfoDetails/InfoDetails';
import { useDeleteCompanyInfo, useGetCompanyInfo } from 'src/api/companyInfo';
import { TableColumnType } from 'src/components/Table/TableHeader/TableHeader';
import useModal from 'src/hooks/useModal';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';

const Info: React.FC = () => {
  const header = {
    header: [
      {
        code: 'companyInfoKey',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Từ khóa',
      },
      {
        code: 'companyInfoTitle',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiêu đề',
      },
      {
        code: 'companyInfoValue',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Giá trị',
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
      {
        code: 'href',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Link (Đường dẫn)',
      },
    ] as TableColumnType[],
  };

  //Function
  const addPopup = useAddPopup();
  const getCompanyInfo = useGetCompanyInfo();
  const deleteCompanyInfo = useDeleteCompanyInfo();

  const detailModal = useModal(InfoDetails);
  const confirmModal = useModal(ConfirmModal);

  //State
  const [reloadFlag, setReloadFlag] = useState(false);
  const [data, setData] = useState<CompanyInfoType[]>([]);

  useEffect(() => {
    getCompanyInfo()
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
  }, [getCompanyInfo, reloadFlag]);

  //Menucontext

  const onView = (companyInfoId: number) => {
    detailModal.handlePresent(
      {
        companyInfoId: companyInfoId,
        isDisable: true,
      },
      'CHI TIẾT',
    );
  };

  const onEdit = (companyInfoId: number) => {
    detailModal.handlePresent(
      {
        companyInfoId: companyInfoId,
        isDisable: false,
        postProcess: (data: CompanyInfoType) => {
          detailModal.handleDismiss();
          setReloadFlag(!reloadFlag);
          onView(data.companyInfoId);
        },
      },
      'THAY ĐỔI',
    );
  };

  const onDelete = (companyInfoId: number) => {
    const onConfirm = () => {
      deleteCompanyInfo(companyInfoId)
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
        question: 'Bạn có chắc muốn xóa thông tin này?',
        listActionButton: listButton,
        postProcess: confirmModal.handleDismiss,
      },
      'XÓA THÔNG TIN',
    );
  };

  //When click right mouse
  const menuContext = (item: CompanyInfoType) => [
    {
      name: 'Chi tiết',
      icon: 'info',
      actionType: EnumAction.Edit,
      action: () => {
        onView(item.companyInfoId);
      },
      buttonClass: 'info',
      align: 'left',
    },
    {
      name: 'Sửa',
      icon: 'auto_fix_high',
      actionType: EnumAction.Edit,
      action: () => onEdit(item.companyInfoId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Xóa',
      icon: 'delete',
      actionType: EnumAction.Edit,
      action: () => onDelete(item.companyInfoId),
      buttonClass: 'info',
      align: '',
    },
  ];

  //Toolbar
  const onAddCompanyInfoNew = (e: MouseEvent) => {
    detailModal.handlePresent(
      {
        isDisable: false,
        postProcess: (data: CompanyInfoType) => {
          detailModal.handleDismiss();
          setReloadFlag(!reloadFlag);
          onView(data.companyInfoId);
        },
      },
      'THÊM MỚI',
    );
  };

  const listButton: EventButton[] = [
    {
      name: 'Thêm',
      icon: 'add',
      actionType: EnumAction.View,
      buttonClass: 'info100',
      action: onAddCompanyInfoNew,
      align: 'center',
    },
  ];

  return (
    <>
      <ToolBar
        toolbarName={'Danh sách thông tin'}
        listRightButton={listButton}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      />

      <Table
        display={header}
        isInput={false}
        data={data}
        menuContext={menuContext}
        onDoubleClick={(item) => onView(item.companyInfoId)}
      />
    </>
  );
};

export default Info;
