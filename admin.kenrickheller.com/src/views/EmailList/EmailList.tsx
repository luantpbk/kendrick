import './EmailList.css';
import React from 'react';
import { MouseEvent } from 'react';
import {
  useAddPopup,
  useGetStatusReload,
  
} from 'src/state/application/hooks';
import { EmailType, EventButton } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { useGetEmailList } from 'src/api/emailApi';
import EmailListSlideBar from './EmailListSlideBar/EmailListSlideBar';

// window.addEventListener('contextmenu', (e) => e.preventDefault());

const EmailList: React.FC = () => {
  //Function
  const reloadFlag = useGetStatusReload();

  const addPopup = useAddPopup();const getEmailList = useGetEmailList();

  //Local state
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(100);
  const [count, setCount] = useState<number>(null);

  const [emailList, setEmailList] = useState<EmailType[]>([]);

  //Define
  const displayList: string[] = ['.createdAt', '.receiver', '.emailTemplateKey'];
  const header: string[] = ['Ngày gửi', 'Người nhận', 'EmailTemplateKey'];
  const typeList: string[] = ['status', 'string', 'string'];
  //End of define

  //When click right mouse
  const onRightMouseClick = (e: MouseEvent, index: number, emailId: number) => {
    console.log('right mouse clicked');
  };
  //End of menucontext

  const onDoubleClick = (emailId: number) => {
    //hiddenSLideBar();
    console.log(emailId);
  };

  const onClick = (emailId: number) => {
    //showSlideBar();
    const temp = emailList;
    let email: EmailType;
    temp.map((value) => {
      if (value.emailId == emailId) {
        email = value;
      }
    });
    //setSlideBarContent({
      // view: {
      //   width: '650px',
      //   height: '100%',
      //   title: '',
      //   isManualRemove: true,
      //   data: (
      //     <EmailListSlideBar
      //       receiver={email.receiver}
      //       emailTitle={email.emailTitle}
      //       emailValue={email.emailValue}
      //     />
      //   ),
      //   isContext: false,
      // },
    //});
  };

  //Toolbar
  const listButton: EventButton[] = [];

  const onChangeToolBar = (name: string, _value: string) => {
    if (name === 'keyword') {
      setKeyword(_value);
      setPage(1);
    } else if (name === 'page') {
      setPage(Number(_value));
    } else if (name === 'size') {
      setSize(Number(_value));
      setPage(1);
    }
  };
  //End of toolbar

  //useEffect
  useEffect(() => {
    getEmailList(page, size, keyword)
      .then((data) => {
        setEmailList(data.items);
        setCount(data.count);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra!',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getEmailList, keyword, page, size, reloadFlag]);

  return (
    <div className="product-container">
      {/* <ToolBar
        toolbarName={'Danh sách email đã gửi'}
        listRightButton={listButton}
        width={'100%'}
        height={'50px'}
        backgroundColor={'#ebe9e9'}
        count={count}
        onChangeToolBar={onChangeToolBar}
        keyword={keyword}
        page={page}
        size={size}
        isPaging={true}
        listCheckbox={[]}
      /> */}
      {/* <Table
        key={'table - email list'}
        header={header}
        tableType={'label'}
        isDisable={true}
        data={emailList}
        onRightMouseClick={onRightMouseClick}
        displayList={displayList}
        manage={'.emailId'}
        typeList={typeList}
        onDoubleClick={onDoubleClick}
        onClick={onClick}
      /> */}
    </div>
  );
};
export default EmailList;
