/* eslint-disable react-hooks/exhaustive-deps */
import './OrderRequirement.css';
import { MouseEvent, useEffect, useState } from 'react';
import { useAddPopup } from 'src/state/application/hooks';
import {
  EnumAction,
  EnumDataType,
  EnumOrderRequirementProgressStatus,
  EnumOrderRequirementProgressStatusTitle,
  EnumReceiveTime,
  EnumReceiveTimeTitle,
  EventButton,
  OrderRequirementType,
} from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import Table from 'src/components/Table/Table';
import {
  useDeleteOrderRequirement,
  useDeleteOrderRequirementForAdmin,
  useDownLoadOrderRequirementExcel,
  useGetMyOrderRequirement,
  useGetOrderRequirement,
  usePrintOrderRequirement,
  usePutUpdateOrderRequirementProgressStatus,
} from 'src/api/orderRequirementApi';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_WEB_URL } from 'src/constants';
import UpdateStatus from '../../components/UpdateStatus/UpdateStatus';
import Printed from 'src/components/Printed/Printed';
import useModal from 'src/hooks/useModal';
import useDebounce from 'src/hooks/useDebounce';
import useSlideBar from 'src/hooks/useSlideBar';
import OrderRequirementDetail from './OrderRequirementDetail/OrderRequirementDetail';
import { EnumViewType } from 'src/common/enum/EnumViewType';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';
import { ADMIN, SALE } from 'src/common/constant/Constant';
import ListView from 'src/components/ListView/ListView';
import { ItemDisplayType } from 'src/components/ListView/ItemView/ItemView';

const OrderRequirement: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(50);
  const [keyword, setKeyword] = useState<string>();

  const params = useParams<{ role: string }>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const lstStatus = [
    {
      value: EnumOrderRequirementProgressStatus.Waiting,
      title: EnumOrderRequirementProgressStatusTitle.Waiting,
      css: { color: '#3a3131' },
    },
    {
      value: EnumOrderRequirementProgressStatus.Sent,
      title: EnumOrderRequirementProgressStatusTitle.Sent,
      css: { color: 'blue' },
    },
    {
      value: EnumOrderRequirementProgressStatus.Received,
      title: EnumOrderRequirementProgressStatusTitle.Received,
      css: { color: 'green' },
    },
    {
      value: EnumOrderRequirementProgressStatus.Error,
      title: EnumOrderRequirementProgressStatusTitle.Error,
      css: { color: 'red' },
    },
  ];

  const [progressStatus, setProgressStatus] = useState<EnumOrderRequirementProgressStatus>();
  const keywordDebound = useDebounce(keyword, 1000);
  const STATUS_FIELD_FILTER = 'value';
  const STATUS_FILTER = 'STATUS_FILTER';
  const filters = [
    {
      data: lstStatus,
      valueField: STATUS_FIELD_FILTER,
      titleField: 'title',
      title: 'Trạng thái',
      filterKey: STATUS_FILTER,
    },
  ];

  const receiveTimes = [
    {
      value: EnumReceiveTime.Any,
      title: EnumReceiveTimeTitle.Any,
    },
    {
      value: EnumReceiveTime.Morning,
      title: EnumReceiveTimeTitle.Morning,
    },
    {
      value: EnumReceiveTime.Twelve_Fifteen,
      title: EnumReceiveTimeTitle.Twelve_Fifteen,
    },
    {
      value: EnumReceiveTime.Fifteen_Eightteen,
      title: EnumReceiveTimeTitle.Fifteen_Eightteen,
    },
    {
      value: EnumReceiveTime.Eightteen_TwentyOne,
      title: EnumReceiveTimeTitle.Eightteen_TwentyOne,
    },
  ];

  const display: ItemDisplayType<OrderRequirementType> = {
    header: [
      {
        code: 'receiverFullname',
        dataType: EnumDataType.Text,
        isOptions: false,
        cellCss: {
          display: 'flex',
          flex: 'auto',
        },
      },
      {
        code: 'progressStatus',
        dataType: EnumDataType.Text,
        isOptions: true,
        options: lstStatus,
        cellCss: {
          display: 'flex',
          background: 'lightgreen',
          borderRadius: '5px',
        },
      },
    ],
    detail: {
      data: 'orderRequirementDetails',
      avatar: 'product.thumbAvatar',
      info: [
        [
          {
            code: 'product.productName',
            dataType: EnumDataType.Text,
            isOptions: false,
          },
          {
            code: 'product.productCode',
            dataType: EnumDataType.Text,
            isOptions: false,
            cellCss: {
              justifyContent: 'end',
              flex: 'auto',
            },
          },
        ],
        [
          {
            code: 'quantity',
            dataType: EnumDataType.BigInt,
            isOptions: false,
            icon: 'shopping_cart',
            cellCss: {
              margin: '0 5px',
            },
          },
          {
            code: 'price',
            dataType: EnumDataType.Decimal,
            isOptions: false,
            icon: 'payments',
            cellCss: {
              margin: '0 5px',
            },
          },
          {
            code: 'extraAmount',
            dataType: EnumDataType.Decimal,
            isOptions: false,
            icon: 'add_circle',
            cellCss: {
              margin: '0 5px',
            },
          },
        ],
      ],
    },
    bottom: [],
    actions: (item: OrderRequirementType) => [
      {
        icon: 'mode_edit',
        actionType: EnumAction.Edit,
        action: () => onEdit(item.orderRequirementId),
        buttonClass: 'info',
        align: '',
      },
      {
        icon: 'delete',
        actionType: EnumAction.Edit,
        action: () => onDelete(item.orderRequirementId),
        buttonClass: 'info100',
        align: '',
      },
    ],
  };

  const tableDisplay = {
    header: [
      {
        code: 'userName',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tên người mua',
      },
      {
        code: 'receiverFullname',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tên người nhận',
      },
      {
        code: 'progressStatus',
        dataType: EnumDataType.Text,
        isOptions: true,
        title: 'Trạng thái',
        options: lstStatus,
      },
      {
        code: 'discount',
        dataType: EnumDataType.Decimal,
        isOptions: false,
        title: 'Giảm giá',
      },
    ],
  };

  //State
  const [count, setCount] = useState<number>(0);
  const [reloadFlag, setReloadFlag] = useState(false);

  const [rawData, setRawData] = useState<OrderRequirementType[]>([]);
  const [orderRequirements, setOrderRequirements] = useState<OrderRequirementType[]>([]);
  const [checkList, setCheckList] = useState<OrderRequirementType[]>([]);

  //Function
  const addPopup = useAddPopup();
  const getOrderRequirement = useGetOrderRequirement();
  const getMyOrderRequirement = useGetMyOrderRequirement();
  const deleteOrderRequirementForAdmin = useDeleteOrderRequirementForAdmin();
  const deleteOrderRequirement = useDeleteOrderRequirement();
  const downLoadOrderRequirementExcel = useDownLoadOrderRequirementExcel();
  const printOrderRequirement = usePrintOrderRequirement();
  const putUpdateOrderRequirementProgressStatus = usePutUpdateOrderRequirementProgressStatus();

  const detailModal = useModal(OrderRequirementDetail);

  const updateStatusModal = useModal(UpdateStatus);
  const printedModal = useModal(Printed);
  const slideBar = useSlideBar(OrderRequirementDetail);
  const confirmModal = useModal(ConfirmModal);

  useEffect(() => {
    setIsAdmin(params.role == ADMIN);
  }, [params.role]);

  const onClickCheckbox = (orderRequirement: OrderRequirementType, isChecked: boolean) => {
    if (isChecked) {
      const nCheckList = checkList.filter((o) => o != orderRequirement);
      setCheckList(nCheckList);
      setOrderRequirements(
        rawData.filter(
          (i) => !nCheckList.some((c) => c.orderRequirementId == i.orderRequirementId),
        ),
      );
    } else {
      setCheckList([...checkList, orderRequirement]);
      setOrderRequirements(orderRequirements.filter((o) => o != orderRequirement));
    }
  };

  const onClick = (orderRequirement: OrderRequirementType) => {
    slideBar.handlePresent({
      orderRequirementId: orderRequirement.orderRequirementId,
      isAdmin: isAdmin,
    });
  };
  //End of function

  //Menucontext
  const onView = (orderRequirementId: number) => {
    const url = `${BASE_WEB_URL}/order-requirement/${
      isAdmin ? ADMIN : SALE
    }/${orderRequirementId}/${EnumViewType.View}`;
    navigate(url);
  };

  const onEdit = (orderRequirementId: number) => {
    const url = `${BASE_WEB_URL}/order-requirement/${
      isAdmin ? ADMIN : SALE
    }/${orderRequirementId}/${EnumViewType.Edit}`;
    navigate(url);
  };

  const onDelete = (orderRequirementId: number) => {
    const onConfirm = () => {
      const api = isAdmin ? deleteOrderRequirementForAdmin : deleteOrderRequirement;
      api(orderRequirementId)
        .then(() => {
          const idx = checkList.findIndex((i) => i.orderRequirementId == orderRequirementId);
          if (idx >= 0) {
            checkList.splice(idx, 1);
            setCheckList([...checkList]);
          }
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa đơn hàng thành công!',
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
        question: 'Bạn có chắc muốn xóa đơn hàng này?',
        listActionButton: listButton,
        postProcess: confirmModal.handleDismiss,
      },
      'XÓA ĐƠN HÀNG',
    );
  };

  const menuContext = (item: OrderRequirementType) => [
    {
      name: 'Chi tiết',
      icon: 'info',
      actionType: EnumAction.Edit,
      action: () => {
        onView(item.orderRequirementId);
      },
      buttonClass: 'info',
      align: 'left',
    },
    {
      name: 'Sửa',
      icon: 'auto_fix_high',
      actionType: EnumAction.Edit,
      action: () => onEdit(item.orderRequirementId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Xóa',
      icon: 'delete',
      actionType: EnumAction.Edit,
      action: () => onDelete(item.orderRequirementId),
      buttonClass: 'info',
      align: '',
    },
  ];

  const validateCheckList = () => {
    if (checkList.length == 0) {
      addPopup({
        txn: {
          success: false,
          summary: 'Chưa chọn đơn hàng',
        },
      });
      return false;
    } else {
      return true;
    }
  };

  //Toolbar

  const onUpdateOrderRequirementProgressStatus = (e: MouseEvent) => {
    if (validateCheckList()) {
      updateStatusModal.handlePresent(
        {
          listStatus: lstStatus,
          title: 'Trạng thái đơn hàng',
          postProcess: (status: EnumOrderRequirementProgressStatus) => {
            const ids = checkList.map((i) => i.orderRequirementId);
            updateStatusModal.handleDismiss();
            putUpdateOrderRequirementProgressStatus(ids, status)
              .then((data) => {
                addPopup({
                  txn: {
                    success: true,
                    summary: 'Cập nhật trạng thái thành công',
                  },
                });
                setReloadFlag(!reloadFlag);
              })
              .catch((error) => {
                addPopup({
                  error: {
                    title: 'Đã có lỗi xảy ra',
                    message: error.errorMessage,
                  },
                });
              });
          },
        },
        'CẬP NHẬT TRẠNG THÁI',
      );
    }
  };

  const onExport = (e: MouseEvent) => {
    if (validateCheckList()) {
      const orderRequirementIds = checkList.map((o) => o.orderRequirementId);
      downLoadOrderRequirementExcel(orderRequirementIds)
        .then((data) => {
          const url = window.URL.createObjectURL(data);
          const tempLink = document.createElement('a');
          tempLink.href = url;
          tempLink.setAttribute('download', 'DSDonHang.xlsx');
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
    }
  };

  const onPrint = (e: MouseEvent) => {
    if (validateCheckList()) {
      const orderRequirementIds = checkList.map((o) => o.orderRequirementId);
      printOrderRequirement(orderRequirementIds)
        .then((res) => {
          printedModal.handlePresent(
            {
              values: res,
            },
            'IN ĐƠN HÀNG',
          );
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
  };

  const onAddOrderRequirement = (e: MouseEvent) => {
    detailModal.handlePresent(
      {
        isDisable: false,
        isAdmin: isAdmin,
        postProcess: (data: OrderRequirementType) => {
          detailModal.handleDismiss();
          setReloadFlag(!reloadFlag);
          onView(data.orderRequirementId);
        },
      },
      'THÊM MỚI',
    );
  };

  const listButton: EventButton[] = isAdmin
    ? [
        {
          name: 'Thêm',
          icon: 'add',
          actionType: EnumAction.Add,
          buttonClass: 'info order-tool-btn',
          action: onAddOrderRequirement,
          align: 'center',
        },
        {
          name: 'Cập nhật trạng thái',
          icon: 'sync_alt',
          actionType: EnumAction.Edit,
          buttonClass: 'info100 order-tool-btn',
          action: onUpdateOrderRequirementProgressStatus,
          align: 'center',
        },

        {
          name: 'Export đơn hàng',
          icon: 'file_download',
          actionType: EnumAction.View,
          buttonClass: 'info order-tool-btn',
          action: onExport,
          align: 'center',
        },

        {
          name: 'In đơn hàng',
          icon: 'print',
          actionType: EnumAction.View,
          buttonClass: 'info order-tool-btn',
          action: onPrint,
          align: 'center',
        },
      ]
    : [
        {
          name: 'Thêm',
          icon: 'add',
          actionType: EnumAction.Add,
          buttonClass: 'info order-tool-btn',
          action: onAddOrderRequirement,
          align: 'center',
        },
      ];
  //End of toolbar

  useEffect(() => {
    const api = isAdmin
      ? getOrderRequirement((keywordDebound ?? '') as string, page, size, progressStatus)
      : getMyOrderRequirement((keywordDebound ?? '') as string, page, size, progressStatus);
    api
      .then((data) => {
        setRawData(data.items);
        setCount(data.count);
        setOrderRequirements(
          data.items.filter(
            (i) => !checkList.some((c) => c.orderRequirementId == i.orderRequirementId),
          ),
        );
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  }, [
    isAdmin,
    addPopup,
    getOrderRequirement,
    keywordDebound,
    page,
    progressStatus,
    reloadFlag,
    size,
  ]);

  useEffect(() => {
    setCheckList([]);
    return () => {
      slideBar.handleDismiss();
    };
  }, []);

  const onFilter = (res: { [filterKey: string]: any }) => {
    if (res[STATUS_FILTER] != undefined) {
      const status = res[STATUS_FILTER][STATUS_FIELD_FILTER];
      setProgressStatus(status);
    } else {
      setProgressStatus(undefined);
    }
  };

  return (
    <>
      <ToolBar
        toolbarName={isAdmin ? 'DANH SÁCH ĐẶT HÀNG' : 'ĐƠN HÀNG CỦA TÔI'}
        listRightButton={listButton}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        count={count}
        onFilter={onFilter}
        onSearch={(value) => setKeyword(value)}
        onChangePage={setPage}
        onChangeSize={setSize}
        keyword={keyword}
        page={page}
        size={size}
        isPaging={true}
        filters={filters}
      />

      {window.innerWidth > 600 ? (
        <Table
          display={tableDisplay}
          isInput={false}
          checkedData={checkList}
          data={orderRequirements}
          menuContext={menuContext}
          allowCheckbox={isAdmin}
          onDoubleClick={(item) => onView(item.orderRequirementId)}
          onClickCheckbox={onClickCheckbox}
          onClick={onClick}
          isNo={true}
        />
      ) : (
        <ListView
          display={display}
          isInput={false}
          checkedData={checkList}
          data={orderRequirements}
          allowCheckbox={isAdmin}
          onDoubleClick={(item) => onView(item.orderRequirementId)}
          onClickCheckbox={onClickCheckbox}
          isNo={true}
        />
      )}
    </>
  );
};

export default OrderRequirement;
