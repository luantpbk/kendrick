import './Realm.css';
import { MouseEvent } from 'react';
import {
  useAddPopup,
  useGetStatusReload,
  useReloadTable,
  useRemovePopup,
} from 'src/state/application/hooks';
import { EnumAction, EnumDataType, EventButton, RealmType } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import RealmDetails from './RealmDetails/RealmDetails';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import {
  useDeleteProductRealm,
  useDownLoadProductRealmExcelTemplate,
  useExportProductRealmExcel,
  useGetProductRealm,
} from 'src/api/productRealmApi';
import RealmImportExcel from './RealmImportExcel/RealmImportExcel';
import { TableColumnType } from 'src/components/Table/TableHeader/TableHeader';
import React from 'react';
import useModal from 'src/hooks/useModal';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';

//Realm
const Realm: React.FC = () => {
  const detailModal = useModal(RealmDetails);

  const importModal = useModal(RealmImportExcel);
  const [reloadFlag, setReloadFlag] = useState(false);

  const header = {
    header: [
      {
        code: 'productRealmId',
        dataType: EnumDataType.BigInt,
        isOptions: false,
        title: 'ID',
      },
      {
        code: 'productRealmCode',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Mã loại SP',
      },
      {
        code: 'productRealmName',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tên loại SP',
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
        code: 'isHidden',
        dataType: EnumDataType.Boolean,
        isOptions: false,
        title: 'Ẩn trên Website',
      },
    ] as TableColumnType[],
  };

  //Function
  const addPopup = useAddPopup();
  const deleteRealm = useDeleteProductRealm();
  const getRealm = useGetProductRealm();
  const downLoadProductRealmExcelTemplate = useDownLoadProductRealmExcelTemplate();
  const exportProductRealmExcel = useExportProductRealmExcel();
  const confirmModal = useModal(ConfirmModal);

  const onView = (item: RealmType) =>
    detailModal.handlePresent(
      {
        productRealmId: item.productRealmId,
        isDisable: true,
      },
      'CHI TIẾT',
    );
  const menuContext = (item: RealmType) => [
    {
      name: 'Chi tiết',
      icon: 'info',
      actionType: EnumAction.View,
      action: () => onView(item),
      buttonClass: 'info',
      align: 'left',
    },
    {
      name: 'Sửa',
      icon: 'auto_fix_high',
      actionType: EnumAction.Edit,
      action: () =>
        detailModal.handlePresent(
          {
            productRealmId: item.productRealmId,
            isDisable: false,
            postProcess: (data: RealmType) => {
              detailModal.handleDismiss();
              setReloadFlag(!reloadFlag);
              onView(data);
            },
          },
          'THAY ĐỔI',
        ),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Xóa',
      icon: 'delete',
      actionType: EnumAction.Delete,
      action: () => {
        const onConfirm = () => {
          deleteRealm(item.productRealmId)
            .then(() => {
              addPopup({
                txn: {
                  success: true,
                  summary: 'Xóa loại sản phẩm thành công',
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
        const listButton = [
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
            buttonClass: 'cancel',
            align: 'center',
          },
        ];
        confirmModal.handlePresent(
          {
            question: 'Bạn có chắc muốn xóa loại sản phẩm này?',
            listActionButton: listButton,
            postProcess: confirmModal.handleDismiss,
          },
          'XÓA LOẠI SẢN PHẨM',
        );
      },
      buttonClass: 'info',
      align: '',
    },
  ];

  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('Refresh');
    getRealm()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  }, [getRealm, reloadFlag]);

  const onDownloadProductRealmExcelTemplate = () => {
    downLoadProductRealmExcelTemplate()
      .then((data) => {
        const productRealmTemplate = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = productRealmTemplate;
        tempLink.setAttribute('download', 'product-realm-template.xlsx');
        tempLink.click();
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  };

  const onExportProductRealmExcel = () => {
    exportProductRealmExcel()
      .then((data) => {
        console.log(data);
        const productRealmTemplate = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = productRealmTemplate;
        tempLink.setAttribute('download', 'product-realms.xlsx');
        tempLink.click();
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  };

  const listButton: EventButton[] = [
    {
      name: 'Thêm',
      icon: 'add',
      actionType: EnumAction.Add,
      buttonClass: 'info100 sim-order-tool-btn',
      action: () =>
        detailModal.handlePresent(
          {
            isDisable: false,
            postProcess: (data: RealmType) => {
              detailModal.handleDismiss();
              setReloadFlag(!reloadFlag);
              onView(data);
            },
          },
          'THÊM MỚI',
        ),
      align: 'center',
    },
    {
      name: 'Download template',
      icon: 'file_download',
      actionType: EnumAction.View,
      buttonClass: 'info sim-order-tool-btn',
      action: onDownloadProductRealmExcelTemplate,
      align: 'center',
    },
    {
      name: 'Export excel',
      icon: 'file_download',
      actionType: EnumAction.View,
      buttonClass: 'info100 sim-order-tool-btn',
      action: onExportProductRealmExcel,
      align: 'center',
    },
    {
      name: 'Import Excel',
      icon: 'file_upload',
      actionType: EnumAction.Add,
      buttonClass: 'info sim-order-tool-btn',
      action: () => importModal.handlePresent({}, 'NHẬP LOẠI SẢN PHẨM'),
      align: 'center',
    },
  ];
  //End of toolbar

  return (
    <>
      <ToolBar
        toolbarName={'Loại sản phẩm'}
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
        onDoubleClick={(item) => onView(item)}
      />
    </>
  );
};

export default Realm;
