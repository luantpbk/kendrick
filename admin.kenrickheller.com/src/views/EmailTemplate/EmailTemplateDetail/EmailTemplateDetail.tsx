import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from 'src/components/Input/Input';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import ToolBar from 'src/components/ToolBar/ToolBar';
import {
  HtmlColumnsType,
  HtmlSimpleParameterType,
  HtmlTableParameterType,
  EmailTemplateType,
  EnumAction,
  EnumDataType,
  EventButton,
} from 'src/api/models';
import MonacoEditor from '@monaco-editor/react';
import { Editor } from '@tinymce/tinymce-react';
import { EnumViewType } from 'src/common/enum/EnumViewType';
import Tabs from 'src/components/Tabs';
import { BASE_SETTING_URL } from 'src/constants';
import {
  useGetEmailTemplateById,
  usePostEmailTemplate,
  usePutEmailTemplate,
} from 'src/api/emailTemplateApi';
import './EmailTemplateDetail.css';
import OtherImageUpload from 'src/components/OtherImageUpload';
import useModal from 'src/hooks/useModal';

enum TabKey {
  Content,
  SourceCode,
}

const EmailTemplateDetail: React.FC = () => {

//Value
const params = useParams<{ type: string; emailTemplateId: string }>();
const [emailTemplateId, setEmailTemplateId] = useState(
  params?.emailTemplateId ? Number(params.emailTemplateId) : undefined,
);

const isAdd = Number(params.type) === EnumViewType.Edit && emailTemplateId == 0;
const isDisable = Number(params.type) == EnumViewType.View;

  //Function
  const getEmailTemplateById = useGetEmailTemplateById();
  const postEmailTemplate = usePostEmailTemplate();
  const putEmailTemplate = usePutEmailTemplate();
  const addPopup = useAddPopup();

  //Value
  const navigate = useNavigate();
  const tinyEditorRef = useRef(null);

  //State
  const [emailTemplateKey, setEmailTemplateKey] = useState<string>();
  const [emailTemplateTitle, setEmailTemplateTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [value, setValue] = useState<string>();
  const [displayOrder, setDisplayOrder] = useState<number>();

  const [reloadFlag, setReloadFlag] = useState(false);
  const [tab, setTab] = useState(TabKey.Content);
  //Param state
  const [emailSimpleParameter, setEmailSimpleParameter] =
    useState<HtmlSimpleParameterType[]>([]);
  const [emailTableParameter, setEmailTableParameter] =
    useState<HtmlTableParameterType[]>([]);

  //Function
  const editorRef = useRef(null);

  const imageModal = useModal(OtherImageUpload);


  useEffect(() => {
    if (!isAdd) {
      getEmailTemplateById(emailTemplateId)
        .then((data) => {
          setEmailTemplateKey(data.emailTemplateKey);
          setEmailTemplateTitle(data.emailTemplateTitle);
          setValue(data.emailTemplateValue);
          setDescription(data.description);
          setDisplayOrder(data.displayOrder);
          setEmailSimpleParameter(data.emailSimpleParameter);
          setEmailTableParameter(data.emailTableParameter);
        })
        .catch((error) => {
          isAdd
            ? null
            : addPopup({
                error: {
                  message: error.errorMessage,
                  title: 'Đã có lỗi xảy ra!',
                },
              });
        });
    }
  }, [
    addPopup,
    isAdd,
    reloadFlag,
    emailTemplateId,
    getEmailTemplateById,
  ]);

  //Function Content

  function handleEditorDidMount(editor: unknown) {
    editorRef.current = editor;
  }

  const onChangeSimpleParam = (value: string, index: number, type: string) => {
    if (emailSimpleParameter) {
      const temp = emailSimpleParameter.filter(() => true);
      if (type == 'PARAMETERNAME') {
        temp[index].parameterName = value;
      } else if (type == 'DESCRIPTION') {
        temp[index].description = value;
      } else if (type == 'DATATYPE') {
        temp[index].dataType = Number(value);
      }
      setEmailSimpleParameter(temp);
    }
  };

  const onChangeTableParam = (
    value: string,
    type: string,
    mainIndex: number,
    columnIndex?: number,
  ) => {
    if (emailTableParameter) {
      const temp = emailTableParameter.filter(() => true);
      if (type == 'TABLENAME') {
        temp[mainIndex].tableName = value;
      } else if (type == 'COLUMNTITLE') {
        temp[mainIndex].columns[columnIndex].columnTitle = value;
      } else if (type == 'COLUMNNAME') {
        temp[mainIndex].columns[columnIndex].columnName = value;
      } else if (type == 'DATATYPE') {
        temp[mainIndex].columns[columnIndex].dataType = Number(value);
      } else if (type == 'COLUMNCSS') {
        temp[mainIndex].columns[columnIndex].columnCss = value;
      } else if (type == 'TABLECSS') {
        temp[mainIndex].tableCss = value;
      } else if (type == 'ROWCSS') {
        temp[mainIndex].rowCss = value;
      }
      setEmailTableParameter(temp);
    }
  };

  const onDeleteColumn = (mainIndex: number, columnIndex: number) => {
    if (emailTableParameter) {
      const temp = emailTableParameter.filter(() => true);
      if (temp[mainIndex].columns.length >= 2) {
        temp[mainIndex].columns.splice(columnIndex, 1);
        setEmailTableParameter(temp);
      } else {
        temp.splice(mainIndex, 1);
        setEmailTableParameter(temp);
      }
    }
  };

  const onAddColumn = (mainIndex: number) => {
    const arr = emailTableParameter.filter(() => true);
    const temp: HtmlColumnsType = {
      columnTitle: '',
      columnName: '',
      dataType: EnumDataType.Text,
      columnCss: '',
    };
    arr[mainIndex].columns.push(temp);
    setEmailTableParameter(arr);
  };

  const onDeleteSimpleParam = (index: number) => {
    if (emailSimpleParameter) {
      const temp = emailSimpleParameter.filter(() => true);
      temp.splice(index, 1);
      setEmailSimpleParameter(temp);
    }
  };

  const onAddSimpleParam = () => {
    if (emailSimpleParameter) {
      const arr = emailSimpleParameter.filter(() => true);
      const temp: HtmlSimpleParameterType = {
        parameterName: '',
        description: '',
        dataType: EnumDataType.Text,
      };
      arr.push(temp);
      setEmailSimpleParameter(arr);
    } else {
      const arr: HtmlSimpleParameterType[] = [
        {
          parameterName: '',
          description: '',
          dataType: EnumDataType.Text,
        },
      ];
      setEmailSimpleParameter(arr);
    }
  };

  const onAddTableParam = () => {
    if (emailTableParameter) {
      const arr = emailTableParameter.filter(() => true);
      const temp: HtmlTableParameterType = {
        tableName: '',
        columns: [
          {
            columnTitle: '',
            columnName: '',
            dataType: EnumDataType.Text,
            columnCss: '',
          },
        ],
        tableCss: '',
        rowCss: '',
      };
      arr.push(temp);
      setEmailTableParameter(arr);
    } else {
      const arr: HtmlTableParameterType[] = [
        {
          tableName: '',
          columns: [
            {
              columnTitle: '',
              columnName: '',
              dataType: EnumDataType.Text,
              columnCss: '',
            },
          ],
          tableCss: '',
          rowCss: '',
        },
      ];
      setEmailTableParameter(arr);
    }
  };


  const onSave = useCallback(() => {
    const pageValue = tab == TabKey.SourceCode ? editorRef.current.getValue() : tinyEditorRef.current.getContent();

    const emailTemplate: EmailTemplateType = {
      emailTemplateId: emailTemplateId,
      displayOrder: displayOrder,
      emailTemplateKey: emailTemplateKey,
      emailTemplateTitle: emailTemplateTitle,
      emailTemplateValue: pageValue,
      emailSimpleParameter: emailSimpleParameter,
      emailTableParameter: emailTableParameter,
      description: description,
    };

    const api = isAdd? postEmailTemplate : putEmailTemplate;

    api(emailTemplate).then((r) => {
      setEmailTemplateId(r.emailTemplateId);
      setReloadFlag(!reloadFlag);
      addPopup({
        txn: {
          success: true,
          summary: isAdd? 'Thêm thành công!' : 'Sửa thành công!',
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
  }, [tab, emailTemplateId, displayOrder, emailTemplateKey, emailTemplateTitle, emailSimpleParameter, emailTableParameter, description, isAdd, postEmailTemplate, putEmailTemplate, reloadFlag, addPopup]);


  //End of function

  const listEditToolButton: EventButton[] = [
    {
      name: 'Lưu',
      icon: 'add',
      actionType: isAdd ? EnumAction.Add : EnumAction.Edit,
      buttonClass: 'info static-page-tool-btn',
      action: onSave,
      align: 'center',
    },
    {
      name: 'D.sách ảnh',
      icon: 'image',
      actionType: EnumAction.Add,
      buttonClass: 'info700 static-page-tool-btn cloud_upload-btn',
      action: () => {
        imageModal.handlePresent({}, 'DANH SÁCH ẢNH')
      },
      align: 'center',
    }
  ];

  const listViewToolButton: EventButton[] = [
    {
      name: 'Sửa',
      icon: 'edit',
      actionType: EnumAction.Edit,
      buttonClass: 'info100 static-page-tool-btn',
      action: () => navigate(`${BASE_SETTING_URL}/email-template/${EnumViewType.Edit}/id/${emailTemplateId}`),
      align: 'center',
    }
  ];

  const tabs = [
    {
      title: 'Content',
      key: TabKey.Content,
      onClick: () => {
        if (tab == TabKey.SourceCode) {
          const content = editorRef.current.getValue();
          setValue(content);
        }
        setTab(TabKey.Content);
      },
    },
    {
      title: 'Source code',
      key: TabKey.SourceCode,
      onClick: () => {
        if (tab == TabKey.Content) {
          const content = tinyEditorRef.current.getContent();
          setValue(content);
        }
        setTab(TabKey.SourceCode);
      },
    },
  ];

  //Component
  const paramComponent = () => {
    return (
      <div className="email-template-detail-param-container">
        <div className="table-param-container">
          <div className="table-param">
            <div className="table-param-component title">tableName</div>
            <div className="table-param-component title">tableCss</div>
            <div className="table-param-component title">rowCss</div>
            <div className="table-param-detail">
              <div className="table-param-detail-component">
                <div className="table-param-component title">columnTitle</div>
                <div className="table-param-component title">columnName</div>
                <div className="table-param-component title">dataType</div>
                <div className="table-param-component title">columnCss</div>
                <div className="email-template-btn-component title"></div>
              </div>
            </div>
          </div>
          {emailTableParameter
            ? emailTableParameter.map((value: HtmlTableParameterType, mainIndex: number) => {
                return (
                  <div className={`table-param ${mainIndex % 2 == 0 ? 'chan' : 'le'}`}>
                    <div className="table-param-component">
                      <input
                        type="text"
                        value={value.tableName}
                        onChange={(event) => {
                          onChangeTableParam(event.target.value, 'TABLENAME', mainIndex);
                        }}
                      />
                    </div>
                    <div className="table-param-component">
                      <input
                        type="text"
                        value={value.tableCss}
                        onChange={(event) => {
                          onChangeTableParam(event.target.value, 'TABLECSS', mainIndex);
                        }}
                      />
                    </div>
                    <div className="table-param-component">
                      <input
                        type="text"
                        value={value.rowCss}
                        onChange={(event) => {
                          onChangeTableParam(event.target.value, 'ROWCSS', mainIndex);
                        }}
                      />
                    </div>
                    <div className="table-param-detail">
                      {value.columns.map((v: HtmlColumnsType, columnIndex: number) => {
                        return (
                          <div className="table-param-detail-component">
                            <div className="table-param-component">
                              <input
                                type="text"
                                value={v.columnTitle}
                                onChange={(event) => {
                                  onChangeTableParam(
                                    event.target.value,
                                    'COLUMNTITLE',
                                    mainIndex,
                                    columnIndex,
                                  );
                                }}
                              />
                            </div>
                            <div className="table-param-component">
                              <input
                                type="text"
                                value={v.columnName}
                                onChange={(event) => {
                                  onChangeTableParam(
                                    event.target.value,
                                    'COLUMNNAME',
                                    mainIndex,
                                    columnIndex,
                                  );
                                }}
                              />
                            </div>
                            <div className="table-param-component">
                              <select
                                value={v.dataType}
                                onChange={(event) => {
                                  onChangeTableParam(
                                    event.target.value,
                                    'DATATYPE',
                                    mainIndex,
                                    columnIndex,
                                  );
                                }}
                              >
                                <option value={EnumDataType.Text}>Text</option>
                                <option value={EnumDataType.Int}>Int</option>
                                <option value={EnumDataType.Date}>Date</option>
                                <option value={EnumDataType.PhoneNumber}>
                                  PhoneNumber
                                </option>
                                <option value={EnumDataType.Email}>Email</option>
                                <option value={EnumDataType.Boolean}>
                                  Boolean
                                </option>
                                <option value={EnumDataType.Percentage}>
                                  Percentage
                                </option>
                                <option value={EnumDataType.BigInt}>BigInt</option>
                                <option value={EnumDataType.JPY}>
                                  JPY
                                </option>
                                <option value={EnumDataType.Month}>Month</option>
                                <option value={EnumDataType.QuarterOfYear}>
                                  QuarterOfYear
                                </option>
                                <option value={EnumDataType.Year}>Year</option>
                                <option value={EnumDataType.DateRange}>
                                  DateRange
                                </option>
                              </select>
                            </div>
                            <div className="table-param-component">
                              <input
                                type="text"
                                value={v.columnCss}
                                onChange={(event) => {
                                  onChangeTableParam(
                                    event.target.value,
                                    'COLUMNCSS',
                                    mainIndex,
                                    columnIndex,
                                  );
                                }}
                              />
                            </div>
                            <div
                              className="email-template-btn-component title"
                              onClick={() => {
                                onDeleteColumn(mainIndex, columnIndex);
                              }}
                            >
                              <i className="fas fa-trash"></i>
                            </div>
                          </div>
                        );
                      })}
                      <div className="table-param-detail-component">
                        <div
                          className="email-template-add-btn"
                          onClick={() => {
                            onAddColumn(mainIndex);
                          }}
                        >
                          Add column
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
          <div className="table-param">
            <div className="email-template-add-btn" onClick={onAddTableParam}>
              Add table param
            </div>
          </div>
        </div>
        <div className="simple-param-container">
          <div className="simple-param">
            <div className="simple-param-component title">parameterName</div>
            <div className="simple-param-component title">description</div>
            <div className="simple-param-component title">dataType</div>
            <div className="email-template-btn-component title"></div>
          </div>
          {emailSimpleParameter
            ? emailSimpleParameter.map((value: HtmlSimpleParameterType, index: number) => {
                return (
                  <div className="simple-param">
                    <div className="simple-param-component">
                      <input
                        type="text"
                        value={value.parameterName}
                        onChange={(event) => {
                          onChangeSimpleParam(event.target.value, index, 'PARAMETERNAME');
                        }}
                      />
                    </div>
                    <div className="simple-param-component">
                      <input
                        type="text"
                        value={value.description}
                        onChange={(event) => {
                          onChangeSimpleParam(event.target.value, index, 'DESCRIPTION');
                        }}
                      />
                    </div>
                    <div className="simple-param-component">
                      <select
                        value={value.dataType}
                        onChange={(event) => {
                          onChangeSimpleParam(event.target.value, index, 'DATATYPE');
                        }}
                      >
                        <option value={EnumDataType.Text}>Text</option>
                        <option value={EnumDataType.Int}>Int</option>
                        <option value={EnumDataType.Date}>Date</option>
                        <option value={EnumDataType.PhoneNumber}>
                          PhoneNumber
                        </option>
                        <option value={EnumDataType.Email}>Email</option>
                        <option value={EnumDataType.Boolean}>Boolean</option>
                        <option value={EnumDataType.Percentage}>Percentage</option>
                        <option value={EnumDataType.BigInt}>BigInt</option>
                        <option value={EnumDataType.JPY}>JPY</option>
                        <option value={EnumDataType.Month}>Month</option>
                        <option value={EnumDataType.QuarterOfYear}>
                          QuarterOfYear
                        </option>
                        <option value={EnumDataType.Year}>Year</option>
                        <option value={EnumDataType.DateRange}>DateRange</option>
                      </select>
                    </div>
                    <div
                      className="email-template-btn-component title"
                      onClick={() => {
                        onDeleteSimpleParam(index);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </div>
                  </div>
                );
              })
            : null}
          <div className="simple-param">
            <div className="email-template-add-btn" onClick={onAddSimpleParam}>
              Add simple param
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ToolBar
        toolbarName={'MẪU EMAIL'}
        listRightButton={isDisable ? listViewToolButton : listEditToolButton}
        isBack={true}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      />
      {paramComponent()}
      <div className='page-content'>
        <div className='page-content-info'>
          <div className='page-content-input'>
            <Input
              title='Mã mẫu Email'
              require={true}
              disabled={isDisable}
              value={emailTemplateKey}
              onChange={setEmailTemplateKey}
            />
          </div>
          <div className='page-content-input'>
            <Input
              title='Tiêu đề'
              require={true}
              disabled={isDisable}
              value={emailTemplateTitle}
              onChange={setEmailTemplateTitle}
            />
          </div>
          <div className='page-content-input'>
            <Input
              title='Thứ tự'
              require={true}
              disabled={isDisable}
              value={displayOrder}
              onChange={setDisplayOrder}
            />
          </div>
          <div className='page-content-input'>
            <Input
              title='Mô tả'
              require={true}
              disabled={isDisable}
              value={description}
              onChange={setDescription}
            />
          </div>

        </div>

        <Tabs activeTab={tab} tabs={tabs} />

        {tab == TabKey.SourceCode ? (
          <MonacoEditor
            height="690px"
            defaultLanguage="html"
            value={value}
            onMount={handleEditorDidMount}
            options={{
              readOnly: isDisable,
            }}
          />
        ) : (
          <Editor
            disabled={isDisable}
            apiKey={'9rjkn0nooxthjws4ylk4s6ogwe2x1ll74eozkdq1or2maa59'}
            onInit={(evt, editor) => (tinyEditorRef.current = editor)}
            initialValue={value}
            init={{
              min_height: 690,
              menubar: true,
              plugins: ['preview', 'lists', 'advlist', 'anchor', 'link', 'autolink', 'autoresize', 'charmap', 'code', 'codesample',
              'directionality', 'emoticons', 'fullscreen', 'image', 'insertdatetime', 'media', 'nonbreaking', 'pagebreak', 'quickbars',
              'searchreplace', 'table', 'visualblocks', 'visualchars', 'wordcount', 'help'],
              toolbar:
                'preview | undo redo | forecolor | formatselect | bold italic backcolor | blocks | blockquote | hr | ' +
                'align | bullist numlist outdent indent | alignjustify | visualchars | wordcount' +
                'link | charmap | code | ltr rtl | emoticons | fullscreen | image | table |' +
                'nonbreaking | pagebreak | print | view |searchreplace | visualblocks | insertdatetime | media | paste | wordcount |' +
                'rotateleft rotateright | ' +
                'removeformat | help',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
        )}
      </div>
    </>

  );
};

export default EmailTemplateDetail;
