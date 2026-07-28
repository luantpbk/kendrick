import './User.css';
import React from 'react';
import { MouseEvent } from 'react';
import {
  useAddPopup,
} from 'src/state/application/hooks';
import { EnumAction, EnumDataType, EventButton, ProfileInfo } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import { useDeleteUser, useGetUserList } from 'src/api/userApi';
import UserDetail, { EnumUserDetailConfig } from './UserDetail/UserDetail';
import UserSlideBar from './UserSlideBar/UserSlideBar';
import { TableColumnType } from 'src/components/Table/TableHeader/TableHeader';
import useModal from 'src/hooks/useModal';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';
import { useDebounce } from 'use-debounce';
import useSlideBar from 'src/hooks/useSlideBar';
import Table from 'src/components/Table/Table';
import QRCode from 'src/components/QRCode/QRCode';
import Printed from 'src/components/Printed/Printed';

const User: React.FC = () => {
  //Function
  const addPopup = useAddPopup();
  const getUserList = useGetUserList();
  const deleteUser = useDeleteUser();

  //Local state
  const [keyword, setKeyword] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
  const [count, setCount] = useState<number>();
  const [userList, setUserList] = useState<ProfileInfo[]>([]);

  const [keywordDebound] = useDebounce(keyword, 1000);
  const [reloadFlag, setReloadFlag] = useState(false);

  const confirmModal = useModal(ConfirmModal);
  const detailModal = useModal(UserDetail);
  const slideBar = useSlideBar(UserSlideBar);
  const qrModal = useModal(QRCode);
  const printedModal = useModal(Printed);
  
  const display = {
    header: [
      {
        code: 'email',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Email',
      },
      {
        code: 'fullName',
        dataType: EnumDataType.Text,
        isOptions: false,
        title: 'Tên khách hàng',
      },

    ] as TableColumnType[],
  };

  //Menucontext
  const onView = (userId: number) => {
    detailModal.handlePresent(
      {
        config: EnumUserDetailConfig.view,
        userId: userId,
        postProcess: confirmModal.handleDismiss,
      },
      'CHI TIẾT TÀI KHOẢN',
    );
  };

  const onEdit = (userId: number) => {
    detailModal.handlePresent(
      {
        config: EnumUserDetailConfig.edit,
        userId: userId,
        postProcess: confirmModal.handleDismiss,
      },
      'THAY ĐỔI TÀI KHOẢN',
    );
  };

  const onChangePassword = (userId: number) => {
    detailModal.handlePresent(
      {
        config: EnumUserDetailConfig.change_pass,
        userId: userId,
        postProcess: confirmModal.handleDismiss,
      },
      'THAY ĐỔI MẬT KHẨU',
    );
  };

  const onDelete = (userId: number) => {
    const onConfirm = () => {
      deleteUser(userId)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa tài khoản thành công!',
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
        question: 'Bạn có chắc muốn xóa tài khoản này?',
        listActionButton: listButton,
        postProcess: confirmModal.handleDismiss,
      },
      'XÓA TÀI KHOẢN',
    );
  };

  const menuContext = (item: ProfileInfo) => [
    {
      name: 'Chi tiết',
      icon: 'info',
      actionType: EnumAction.Edit,
      action: () => onView(item.userId),
      buttonClass: 'info',
      align: 'left',
    },
    {
      name: 'Sửa',
      icon: 'auto_fix_high',
      actionType: EnumAction.Edit,
      action: () => onEdit(item.userId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Đổi mật khẩu',
      icon: 'vpn_key',
      actionType: EnumAction.Edit,
      action: () => onChangePassword(item.userId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Xóa',
      icon: 'delete',
      actionType: EnumAction.Edit,
      action: () => onDelete(item.userId),
      buttonClass: 'info',
      align: '',
    },
  ];

  const onClick = (user: ProfileInfo) => {
    slideBar.handlePresent({
      userId: user.userId,
      isDisable: true,
    });
  };

  //Function in the listButton
  const onAddNewUser = (e: MouseEvent) => {
    detailModal.handlePresent(
      {
        config: EnumUserDetailConfig.add,
        postProcess: confirmModal.handleDismiss,
      },
      'THÊM TÀI KHOẢN',
    );
  };

  //Toolbar
  const listButton: EventButton[] = [
    {
      name: 'Thêm',
      icon: 'add',
      actionType: EnumAction.View,
      buttonClass: 'info100 tool-btn',
      action: onAddNewUser,
      align: 'center',
    },
  ];

  //End of toolbar

  useEffect(() => {
    getUserList(keyword)
      .then((data) => {
        setCount(data.count);
        setUserList(data.items);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getUserList, keyword, reloadFlag]);

  useEffect(() => {
    return () => {
      slideBar.handleDismiss();
    };
  }, []);

  return (
    <>
    <ToolBar
      toolbarName={'DANH SÁCH TÀI KHOẢN'}
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
      data={userList}
      menuContext={menuContext}
      allowCheckbox={false}
      onDoubleClick={(item) => onView(item.userId)}
      onClick={onClick}
      isNo={true}
    />
  </>
  );
};
export default User;
