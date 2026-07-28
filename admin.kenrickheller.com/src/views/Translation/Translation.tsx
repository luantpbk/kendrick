/* eslint-disable react-hooks/exhaustive-deps */
import './Translation.css';
import { MouseEvent } from 'react';
import { EnumAction, EnumDataType, EventButton, TranslationType } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import TranslationDetail from './TranslationDetail/TranslationDetail';
import {
  useGetTranslations,
  useDeleteTranslation,
  useGenerateFile,
} from 'src/api/translationApi';
import useModal from 'src/hooks/useModal';
import { useAddPopup } from 'src/state/application/hooks';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';
import { TableColumnType } from 'src/components/Table/TableHeader/TableHeader';
import useDebounce from 'src/hooks/useDebounce';

const Translation: React.FC = () => {
  //Function

  const addPopup = useAddPopup();
  const getAllTranslations = useGetTranslations();
  const deleteTranslation = useDeleteTranslation();
  const generateFile = useGenerateFile();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(50);
  const [keyword, setKeyword] = useState<string>();
  const [reloadFlag, setReloadFlag] = useState(false);
  const [items, setItems] = useState<TranslationType[]>([]);

  const [count, setCount] = useState<number>();
  const keywordDebound = useDebounce(keyword, 1000);

  const detailModal = useModal(TranslationDetail);
  const confirmModal = useModal(ConfirmModal);

  const display = {
    header: [
      {
        code: 'translationId',
        dataType: EnumDataType.Int,
        isOptions: false,
        title: 'ID',
      },
      {
        code: 'code',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Mã',
      },
      {
        code: 'vi',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiếng Việt',
      },
      {
        code: 'en',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiếng Anh',
      },
      {
        code: 'jp',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiếng Nhật',
      },
      {
        code: 'fr',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiếng Pháp',
      },
      {
        code: 'de',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiếng Đức',
      },
      {
        code: 'cn',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiếng Trung',
      },
      {
        code: 'it',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiếng Ý',
      },
      {
        code: 'et',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiếng TBN',
      },
      {
        code: 'pt',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tiếng BĐN',
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

  useEffect(() => {
    getAllTranslations(keyword ?? '', page, size)
      .then((data) => {
        setCount(data.count);
        setItems(data.items);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [getAllTranslations, reloadFlag, keywordDebound, page, size, addPopup]);

  //Translationcontext
  const onView = (translationId: number) => {
    detailModal.handlePresent(
      {
        translationId: translationId,
        isDisable: true,
      },
      'CHI TIẾT',
    );
  };

  const onEdit = (translationId: number) => {
    detailModal.handlePresent(
      {
        translationId: translationId,
        isDisable: false,
        postProcess: (data: TranslationType) => {
          detailModal.handleDismiss();
          setReloadFlag(!reloadFlag);
          onView(data.translationId);
        },
      },
      'THAY ĐỔI',
    );
  };

  const onDelete = (translationId: number) => {
    const onConfirm = () => {
      deleteTranslation(translationId)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa bản dịch thành công',
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
        question: 'Bạn có chắc muốn xóa bản dịch này?',
        listActionButton: listButton,
        postProcess: confirmModal.handleDismiss,
      },
      'XÓA BẢN DỊCH',
    );
  };

  const menuContext = (item: TranslationType) => [
    {
      name: 'Chi tiết',
      icon: 'info',
      actionType: EnumAction.Edit,
      action: () => onView(item.translationId),
      buttonClass: 'info',
      align: 'left',
    },
    {
      name: 'Sửa',
      icon: 'auto_fix_high',
      actionType: EnumAction.Edit,
      action: () => onEdit(item.translationId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Xóa',
      icon: 'delete',
      actionType: EnumAction.Edit,
      action: () => onDelete(item.translationId),
      buttonClass: 'info',
      align: '',
    },
  ];

  //Function in the listButton
  const onAddTranslationNew = (e: MouseEvent) => {
    detailModal.handlePresent(
      {
        isDisable: false,
        postProcess: (data: TranslationType) => {
          detailModal.handleDismiss();
          setReloadFlag(!reloadFlag);
          onView(data.translationId);
        },
      },
      'THÊM MỚI',
    );
  };

  //Toolbar
  const listButton: EventButton[] = [
    {
      name: 'Thêm',
      icon: 'add',
      actionType: EnumAction.Add,
      buttonClass: 'info sim-order-tool-btn',
      action: onAddTranslationNew,
      align: 'center',
    },

    {
      name: 'Tạo file',
      icon: 'cloud_upload',
      actionType: EnumAction.Add,
      buttonClass: 'info100 sim-order-tool-btn',
      action: () => {
        generateFile()
          .then((res) => {
            addPopup({
              txn: {
                success: true,
                summary: 'Tạo file dịch thành công',
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
          });
      },
      align: 'center',
    },
  ];

  return (
    <>
      <ToolBar
        toolbarName={'Bản dịch'}
        listRightButton={listButton}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        count={count}
        onSearch={(value) => setKeyword(value)}
        onChangePage={setPage}
        onChangeSize={setSize}
        keyword={keyword}
        page={page}
        size={size}
        isPaging={true}
      />

      <Table
        display={display}
        isInput={false}
        data={items}
        menuContext={menuContext}
        onDoubleClick={(item) => onView(item.translateId)}
      />
    </>
  );
};

export default Translation;
