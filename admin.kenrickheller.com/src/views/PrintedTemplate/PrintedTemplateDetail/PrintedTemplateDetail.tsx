import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from 'src/components/Input/Input';
import { useAddPopup } from 'src/state/application/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import ToolBar from 'src/components/ToolBar/ToolBar';
import {
  HtmlSimpleParameterType,
  HtmlTableParameterType,
  PrintedTemplateType,
  EnumAction,
  EnumDataType,
  EventButton,
} from 'src/api/models';
import { uniqueId } from 'lodash';
import MonacoEditor from '@monaco-editor/react';
import { Editor } from '@tinymce/tinymce-react';
import { EnumViewType } from 'src/common/enum/EnumViewType';
import Tabs from 'src/components/Tabs';
import { BASE_SETTING_URL } from 'src/constants';
import {
  useGetPrintedTemplateById,
  usePostPrintedTemplate,
  usePutPrintedTemplate,
} from 'src/api/printedTemplateApi';
import './PrintedTemplateDetail.css';
import useModal from 'src/hooks/useModal';
import OtherImageUpload from 'src/components/OtherImageUpload';
import SimpleParameter from 'src/components/SimpleParameter';
import TableParameter from 'src/components/TableParameter';

enum TabKey {
  Content,
  SourceCode,
}

const PrintedTemplateDetail: React.FC = () => {


  //Value
  const params = useParams<{ type: string; printedTemplateId: string }>();
 const [printedTemplateId, setPrintedTemplateId] = useState(
   params?.printedTemplateId ? Number(params.printedTemplateId) : undefined,
 );
 const isAdd = Number(params.type) === EnumViewType.Edit && printedTemplateId == 0;
 const isDisable = Number(params.type) == EnumViewType.View;

  //Function
  const getPrintedTemplateById = useGetPrintedTemplateById();
  const postPrintedTemplate = usePostPrintedTemplate();
  const putPrintedTemplate = usePutPrintedTemplate();
  const addPopup = useAddPopup();

  //Value
  const navigate = useNavigate();
  const tinyEditorRef = useRef(null);

  //State
  const [printedTemplateKey, setPrintedTemplateKey] = useState<string>();
  const [printedTemplateTitle, setPrintedTemplateTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [value, setValue] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(null);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [tab, setTab] = useState(TabKey.SourceCode);
  const [printedSimpleParameter, setPrintedSimpleParameter] =
    useState<HtmlSimpleParameterType[]>([]);
  const [printedTableParameter, setPrintedTableParameter] =
    useState<HtmlTableParameterType[]>([]);

  const editorRef = useRef(null);

  const imageModal = useModal(OtherImageUpload);

  useEffect(() => {
    if (!isAdd) {
      getPrintedTemplateById(printedTemplateId)
        .then((data) => {
          setPrintedTemplateKey(data.printedTemplateKey);
          setPrintedTemplateTitle(data.printedTemplateTitle);
          setValue(data.printedTemplateValue);
          setDescription(data.description);
          setDisplayOrder(data.displayOrder);
          setPrintedSimpleParameter(data.printedSimpleParameter);
          setPrintedTableParameter(data.printedTableParameter);
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
    printedTemplateId,
    getPrintedTemplateById,
  ]);

  //Function Content

  function handleEditorDidMount(editor: unknown) {
    editorRef.current = editor;
  }

  const onSave = useCallback(() => {
    const pageValue = tab == TabKey.SourceCode ? editorRef.current.getValue() : tinyEditorRef.current.getContent();
    const printedTemplate: PrintedTemplateType = {
      printedTemplateId: printedTemplateId,
      displayOrder: displayOrder,
      printedTemplateKey: printedTemplateKey,
      printedTemplateTitle: printedTemplateTitle,
      printedTemplateValue: pageValue,
      printedSimpleParameter: printedSimpleParameter,
      printedTableParameter: printedTableParameter,
      description: description,
    };

    const api = isAdd? postPrintedTemplate : putPrintedTemplate;

    api(printedTemplate).then((r) => {
      setPrintedTemplateId(r.printedTemplateId);
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
  }, [tab, printedTemplateId, displayOrder, printedTemplateKey, printedTemplateTitle, printedSimpleParameter, printedTableParameter, description, isAdd, postPrintedTemplate, putPrintedTemplate, reloadFlag, addPopup]);



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
      action: () => navigate(`${BASE_SETTING_URL}/printed-template/${EnumViewType.Edit}/id/${printedTemplateId}`),
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

  return (
    <>
      <ToolBar
        toolbarName={'MẪU IN'}
        listRightButton={isDisable ? listViewToolButton : listEditToolButton}
        isBack={true}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      />
      <div className="printed-template-detail-container">
        <div className="printed-template-detail-param-container">
          <TableParameter tableParameters={printedTableParameter} onChange={setPrintedTableParameter} />
          <SimpleParameter simpleParameters={printedSimpleParameter} onChange={setPrintedSimpleParameter} />
        </div>
        <div className='page-content'>
          <div className='page-content-info'>
            <div className='page-content-input'>
              <Input
                title='Mã mẫu in'
                require={true}
                disabled={isDisable}
                value={printedTemplateKey}
                onChange={setPrintedTemplateKey}
              />
            </div>
            <div className='page-content-input'>
              <Input
                title='Tiêu đề'
                require={true}
                disabled={isDisable}
                value={printedTemplateTitle}
                onChange={setPrintedTemplateTitle}
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
      </div>
    </>
  );
};

export default PrintedTemplateDetail;
