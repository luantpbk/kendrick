import './Category.css';
import React from 'react';
import { MouseEvent } from 'react';
import { useAddPopup } from 'src/state/application/hooks';
import { EnumAction, EnumDataType, EventButton, ProductCategoryType } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import CategoryDisplayOption from './CategoryDisplayOption/CategoryDisplayOption';
import { useGetProductRealm } from 'src/api/productRealmApi';
import {
  useDeleteProductCategory,
  useDownLoadProductCategoryExcelTemplate,
  useExportProductCategoryExcel,
  useGetProductCategory,
} from 'src/api/productCategoryApi';
import { TableColumnType } from 'src/components/Table/TableHeader/TableHeader';
import { FilterType } from 'src/components/FilterBox/FilterOptionBox';
import useModal from 'src/hooks/useModal';
import CategoryDetails from './CategoryDetails/CategoryDetails';
import CategoryImportExcel from './CategoryImportExcel/CategoryImportExcel';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';

const Category: React.FC = () => {
  const REALM_FILTER = 'realm';
  const VALUE_FIELD_FILTER = 'productRealmId';

  const header = {
    header: [
      {
        code: 'productCategoryId',
        dataType: EnumDataType.BigInt,
        isOptions: false,
        title: 'ID',
      },
      {
        code: 'productRealm.productRealmName',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tên loại SP',
      },
      {
        code: 'productCategoryCode',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Mã danh mục SP',
      },
      {
        code: 'productCategoryName',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tên danh mục SP',
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
  const getRealm = useGetProductRealm();
  const deleteCategory = useDeleteProductCategory();
  const getProductCategory = useGetProductCategory();
  const downLoadProductCategoryExcelTemplate = useDownLoadProductCategoryExcelTemplate();
  const exportProductCategoryExcel = useExportProductCategoryExcel();

  //State
  const [reloadFlag, setReloadFlag] = useState(false);
  const [data, setData] = useState(null);
  const [realmId, setRealmId] = useState();
  const [filters, setFilters] = useState<FilterType<object>[]>([]);

  const detailModal = useModal(CategoryDetails);
  const configModal = useModal(CategoryDisplayOption);
  const importModal = useModal(CategoryImportExcel);
  const confirmModal = useModal(ConfirmModal);

  useEffect(() => {
    getProductCategory(realmId)
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
  }, [addPopup, getProductCategory, realmId, reloadFlag]);

  const onView = (productCategoryId: number) => {
    detailModal.handlePresent(
      {
        productCategoryId: productCategoryId,
        isDisable: true,
      },
      'CHI TIẾT',
    );
  };

  const onEdit = (productCategoryId: number) => {
    detailModal.handlePresent(
      {
        productCategoryId: productCategoryId,
        isDisable: false,
        postProcess: (data: ProductCategoryType) => {
          detailModal.handleDismiss();
          setReloadFlag(!reloadFlag);
          onView(data.productCategoryId);
        },
      },
      'THAY ĐỔI',
    );
  };

  const onDelete = (productCategoryId: number) => {
    const onConfirm = () => {
      deleteCategory(productCategoryId)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa sản phẩm thành công',
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
        question: 'Bạn có chắc muốn xóa danh mục sản phẩm này?',
        listActionButton: listButton,
        postProcess: confirmModal.handleDismiss,
      },
      'XÓA DANH MỤC SẢN PHẨM',
    );
  };

  const onDisplayOption = (productCategoryId: number) => {
    configModal.handlePresent(
      {
        productCategoryId: productCategoryId,
      },
      'CHỈNH SỬA CẤU HÌNH HIỂN THỊ',
    );
  };

  //End of function on menucontext

  //When click right mouse
  const menuContext = (item: ProductCategoryType) => [
    {
      name: 'Chi tiết',
      icon: 'info',
      actionType: EnumAction.Edit,
      action: () => onView(item.productCategoryId),
      buttonClass: 'info',
      align: 'left',
    },
    {
      name: 'Sửa',
      icon: 'auto_fix_high',
      actionType: EnumAction.Edit,
      action: () => onEdit(item.productCategoryId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Cấu hình hiển thị',
      icon: 'settings',
      actionType: EnumAction.Edit,
      action: () => onDisplayOption(item.productCategoryId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Xóa',
      icon: 'delete',
      actionType: EnumAction.Edit,
      action: () => onDelete(item.productCategoryId),
      buttonClass: 'info',
      align: '',
    },
  ];
  //End of menucontext

  //TODO
  const onDownloadProductCategoryExcelTemplate = () => {
    downLoadProductCategoryExcelTemplate()
      .then((data) => {
        console.log(data);
        const productRealmTemplate = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = productRealmTemplate;
        tempLink.setAttribute('download', 'product-category-template.xlsx');
        tempLink.click();
      })
      .catch((error) => {
        console.log(error);
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  };

  const onExportProductCategoryExcel = () => {
    exportProductCategoryExcel()
      .then((data) => {
        console.log(data);
        const productRealmTemplate = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = productRealmTemplate;
        tempLink.setAttribute('download', 'product-categorys.xlsx');
        tempLink.click();
      })
      .catch((error) => {
        console.log(error);
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  };

  const listRightButton: EventButton[] = [
    {
      name: 'Thêm',
      icon: 'add',
      actionType: EnumAction.View,
      buttonClass: 'info100 sim-order-tool-btn',
      action: () =>
        detailModal.handlePresent(
          {
            isDisable: false,
            postProcess: (data: ProductCategoryType) => {
              detailModal.handleDismiss();
              setReloadFlag(!reloadFlag);
              onView(data.productCategoryId);
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
      action: onDownloadProductCategoryExcelTemplate,
      align: 'center',
    },
    {
      name: 'Export excel',
      icon: 'file_download',
      actionType: EnumAction.View,
      buttonClass: 'info100 sim-order-tool-btn',
      action: onExportProductCategoryExcel,
      align: 'center',
    },
    {
      name: 'Import Excel',
      icon: 'file_upload',
      actionType: EnumAction.View,
      buttonClass: 'info sim-order-tool-btn',
      action: () => importModal.handlePresent({}, 'NHẬP DANH MỤC SẢN PHẨM'),
      align: 'center',
    },
  ];

  const onFilter = (res: { [filterKey: string]: any }) => {
    if (res[REALM_FILTER] != undefined) {
      const value = res[REALM_FILTER][VALUE_FIELD_FILTER];
      setRealmId(value);
    } else {
      setRealmId(undefined);
    }
  };

  //End of toolbar

  useEffect(() => {
    getRealm().then((data) => {
      setFilters([
        {
          data: data,
          valueField: VALUE_FIELD_FILTER,
          titleField: 'productRealmName',
          title: 'Loại SP',
          filterKey: REALM_FILTER,
        },
      ]);
    });
  }, []);

  return (
    <>
      <ToolBar
        toolbarName={'Danh mục sản phẩm'}
        listRightButton={listRightButton}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
        onFilter={onFilter}
        filters={filters}
      />
      <Table
        display={header}
        isInput={false}
        data={data}
        menuContext={menuContext}
        onDoubleClick={(item) => onView(item.productCategoryId)}
      />
    </>
  );
};

export default Category;
