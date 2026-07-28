/* eslint-disable react-hooks/exhaustive-deps */
import './StaticPageDetails.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from 'src/components/Input/Input';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { EnumAction, EventButton, ImageType, StaticPageType } from 'src/api/models';
import { uniqueId } from 'lodash';
import MonacoEditor, { Monaco, OnMount } from '@monaco-editor/react';
import { Editor } from '@tinymce/tinymce-react';
import { EnumViewType } from 'src/common/enum/EnumViewType';
import { LEFT_MOUSE_BUTTON } from 'src/common/constant/Constant';
import Tabs from 'src/components/Tabs';
import {
  useGetStaticPageById,
  usePostStaticPage,
  usePutStaticPage,
} from 'src/api/staticPageApi';
import { BASE_WEB_URL } from 'src/constants';
import useModal from 'src/hooks/useModal';
import OtherImageUpload from 'src/components/OtherImageUpload';
import Language from 'src/components/Language';

enum TabKey {
  Content,
  SourceCode,
}

const StaticPageDetails: React.FC = () => {
  //Function
  const getStaticPageById = useGetStaticPageById();
  const postStaticPage = usePostStaticPage();
  const putStaticPage = usePutStaticPage();
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();

  const imageModal = useModal(OtherImageUpload);

  //Value
  const navigate = useNavigate();
  const tinyEditorRef = useRef(null);
  const params = useParams<{ type: string; staticPageId: string }>();

  //State
  const [staticPageKey, setStaticPageKey] = useState<string>();
  const [staticPageTitle, setStaticPageTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [vi, setVi] = useState<string>();
  const [en, setEn] = useState<string>();
  const [jp, setJp] = useState<string>();
  const [de, setDe] = useState<string>();
  const [fr, setFr] = useState<string>();
  const [it, setIt] = useState<string>();
  const [pt, setPt] = useState<string>();
  const [et, setEt] = useState<string>();
  const [cn, setCn] = useState<string>();
  const [displayOrder, setDisplayOrder] = useState<number>();
  const [language, setLanguage] = useState<string>('en');
  const [value, setValue] = useState<string>();

  //State
  const [tab, setTab] = useState(TabKey.Content);

  const [staticPageId, setStaticPageId] = useState(
    params?.staticPageId ? Number(params.staticPageId) : undefined,
  );

  const editorRef = useRef(null);

  //Value
  const isAdd = Number(params.type) === EnumViewType.Edit && !(staticPageId > 0);
  const isDisable = Number(params.type) == EnumViewType.View;

  useEffect(() => {
    if (!isAdd) {
      getStaticPageById(staticPageId)
        .then((data) => {
          setStaticPageKey(data.staticPageKey);
          setStaticPageTitle(data.staticPageTitle);
          setVi(data.vi);
          setEn(data.en);
          setJp(data.jp);
          setCn(data.cn);
          setDe(data.de);
          setFr(data.fr);
          setIt(data.it);
          setPt(data.pt);
          setEt(data.et);
          setDescription(data.description);
          setDisplayOrder(data.displayOrder);
          setValue(
            language == 'vi' ? data.vi ?? '' 
            : language == 'en' ? data.en ?? '' 
            : language == 'jp' ? data.jp ?? '' 
            : language == 'de' ? data.de ?? '' 
            : language == 'fr' ? data.fr ?? '' 
            : language == 'cn' ? data.cn ?? '' 
            : language == 'it' ? data.it ?? '' 
            : language == 'pt' ? data.pt ?? '' 
            : data.et ?? ''
          );
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          });
        });
    }
  }, [addPopup, getStaticPageById, staticPageId]);

  const handleEditorDidMount: OnMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
  };

  const onSave = useCallback(() => {
    const content =
      tab == TabKey.SourceCode
        ? editorRef.current?.getValue()
        : tinyEditorRef.current?.getContent();
    switch (language) {
      case 'vi':
        setVi(content);
        break;
      case 'en':
        setEn(content);
        break;
      case 'jp':
        setJp(content);
        break;
      case 'de':
        setDe(content);
        break;
      case 'fr':
        setFr(content);
        break;
      case 'it':
        setIt(content);
        break;
      case 'pt':
        setPt(content);
        break;
      case 'cn':
        setCn(content);
        break;
      case 'et':
        setEt(content);
        break;
      default:
        break;
    }

    const body: StaticPageType = {
      staticPageId: staticPageId,
      staticPageKey: staticPageKey,
      staticPageTitle: staticPageTitle,
      vi: language == 'vi' ? content : vi,
      en: language == 'en' ? content : en,
      jp: language == 'jp' ? content : jp,
      cn: language == 'cn' ? content : cn,
      de: language == 'de' ? content : de,
      fr: language == 'fr' ? content : fr,
      it: language == 'it' ? content : it,
      pt: language == 'pt' ? content : pt,
      et: language == 'et' ? content : et,
      description: description,
      displayOrder: displayOrder,
    };
    const api = isAdd ? postStaticPage(body) : putStaticPage(body);

    api
      .then((r) => {
        setStaticPageId(r.staticPageId);
        addPopup({
          txn: {
            success: true,
            summary: isAdd ? 'Thêm thành công!' : 'Sửa thành công!',
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
  }, [
    tab,
    postStaticPage,
    staticPageId,
    staticPageKey,
    staticPageTitle,
    description,
    displayOrder,
    language,
    vi,
    en,
    jp,
    cn,
    fr,
    de,
    it,
    et,
    pt,
    removePopup,
    addPopup,
  ]);

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
        imageModal.handlePresent({}, 'DANH SÁCH ẢNH');
      },
      align: 'center',
    },
  ];

  const listViewToolButton: EventButton[] = [
    {
      name: 'Sửa',
      icon: 'edit',
      actionType: EnumAction.Edit,
      buttonClass: 'info100 static-page-tool-btn',
      action: () =>
        navigate(`${BASE_WEB_URL}/static-page/${EnumViewType.Edit}/id/${staticPageId}`),
      align: 'center',
    },
  ];

  const tabs = [
    {
      title: 'Content',
      key: TabKey.Content,
      onClick: () => {
        setTab(TabKey.Content);
        const content = editorRef.current?.getValue();
        setValue(content);
      },
    },
    {
      title: 'Source code',
      key: TabKey.SourceCode,
      onClick: () => {
        setTab(TabKey.SourceCode);
        const content = tinyEditorRef.current?.getContent();
        setValue(content);
      },
    },
  ];

  return (
    <>
      <ToolBar
        toolbarName={'Trang thông tin'}
        listRightButton={isDisable ? listViewToolButton : listEditToolButton}
        isBack={true}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      />

      <div className="page-content">
        <div className="page-content-info">
          <div className="page-content-input">
            <Input
              title="Từ khóa"
              require={true}
              disabled={isDisable}
              value={staticPageKey}
              onChange={setStaticPageKey}
            />
          </div>
          <div className="page-content-input">
            <Input
              title="Tiêu đề"
              require={true}
              disabled={isDisable}
              value={staticPageTitle}
              onChange={setStaticPageTitle}
            />
          </div>
          <div className="page-content-input">
            <Input
              title="Thứ tự"
              require={true}
              disabled={isDisable}
              value={displayOrder}
              onChange={setDisplayOrder}
            />
          </div>
          <div className="page-content-input">
            <Input
              title="Mô tả"
              require={true}
              disabled={isDisable}
              value={description}
              onChange={setDescription}
            />
          </div>
        </div>
        <div className="inline">
          <Tabs activeTab={tab} tabs={tabs} />
          <Language
            className="page-language"
            language={language}
            setLanguage={(lang) => {
              const content =
                tab == TabKey.SourceCode
                  ? editorRef.current?.getValue()
                  : tinyEditorRef.current?.getContent();

              switch (language) {
                case 'vi':
                  setVi(content);
                  break;
                case 'en':
                  setEn(content);
                  break;
                case 'jp':
                  setJp(content);
                  break;
                case 'de':
                  setDe(content);
                  break;
                case 'fr':
                  setFr(content);
                  break;
                case 'it':
                  setIt(content);
                  break;
                case 'pt':
                  setPt(content);
                  break;
                case 'cn':
                  setCn(content);
                  break;
                case 'et':
                  setEt(content);
                    break;
                default:
                  break;
              }
              setLanguage(lang);
              let nValue =  lang == 'vi' ? vi ?? '' 
              : lang == 'en' ? en ?? '' 
              : lang == 'jp' ? jp ?? '' 
              : lang == 'de' ? de ?? '' 
              : lang == 'fr' ? fr ?? '' 
              : lang == 'cn' ? cn ?? '' 
              : lang == 'it' ? it ?? '' 
              : lang == 'pt' ? pt ?? '' 
              : et ?? ''
              if (nValue == value) nValue += ' ';
              console.log(nValue);
              setValue(nValue);
            }}
          />
        </div>

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
              plugins: [
                'preview',
                'lists',
                'advlist',
                'anchor',
                'link',
                'autolink',
                'autoresize',
                'charmap',
                'code',
                'codesample',
                'directionality',
                'emoticons',
                'fullscreen',
                'image',
                'insertdatetime',
                'media',
                'nonbreaking',
                'pagebreak',
                'quickbars',
                'searchreplace',
                'table',
                'visualblocks',
                'visualchars',
                'wordcount',
                'help',
              ],
              toolbar:
                'preview | undo redo | forecolor | formatselect | bold italic backcolor | blocks | blockquote | hr | ' +
                'align | bullist numlist outdent indent | alignjustify | visualchars | wordcount' +
                'link | charmap | code | ltr rtl | emoticons | fullscreen | image | table |' +
                'nonbreaking | pagebreak | print | view |searchreplace | visualblocks | insertdatetime | media | paste | wordcount |' +
                'rotateleft rotateright | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
        )}
      </div>
    </>
  );
};

export default StaticPageDetails;
