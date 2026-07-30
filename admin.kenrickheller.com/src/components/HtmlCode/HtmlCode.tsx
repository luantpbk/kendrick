/* eslint-disable react-hooks/exhaustive-deps */
import './HtmlCode.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import MonacoEditor, { Monaco, OnMount } from '@monaco-editor/react';
import { Editor } from '@tinymce/tinymce-react';
import Tabs from 'src/components/Tabs';
import useModal from 'src/hooks/useModal';
import OtherImageUpload from 'src/components/OtherImageUpload';
import Language from 'src/components/Language';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { useTranslateHtml } from 'src/api/translationApi';

enum TabKey {
  Content,
  SourceCode,
}

interface IHtmlCodeProps {
  onSave: (value: { [lang: string]: string }) => void;
  value: string;
}

const HtmlCode = (props: IHtmlCodeProps) => {
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const translateHtml = useTranslateHtml();
  const [isTranslating, setIsTranslating] = useState(false);

  const imageModal = useModal(OtherImageUpload);

  const tinyEditorRef = useRef(null);

  const [language, setLanguage] = useState<string>('en');
  const [data, setData] = useState<{ [lang: string]: string }>({
    vi: '',
    en: '',
    jp: '',
    cn: '',
    de: '',
    fr: '',
    it: '',
    pt: '',
    et: '',
  });
  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (props.value) setData(JSON.parse(props.value));
  }, [props]);

  //State
  const [tab, setTab] = useState(TabKey.Content);

  const editorRef = useRef(null);

  const handleEditorDidMount: OnMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
  };

  const onSave = useCallback(() => {
    const content =
      tab == TabKey.SourceCode
        ? editorRef.current?.getValue()
        : tinyEditorRef.current?.getContent();
    const nData = { ...data };
    nData[language] = content;
    setData(nData);
    props.onSave(nData);
  }, [tab, language, removePopup, addPopup]);

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

  useEffect(() => {
    setValue(data[language]);
  }, [language, data]);

  return (
    <>
      <div className="html-code-content">
        <div className="inline">
          <ButtonComponent
            title="SAVE"
            onClick={() => {
              const content =
                tab == TabKey.SourceCode
                  ? editorRef.current?.getValue()
                  : tinyEditorRef.current?.getContent();
              const nData = { ...data };
              nData[language] = content;
              props.onSave(nData);
            }}
          />
          <ButtonComponent
            title="TỰ ĐỘNG DỊCH"
            loader={isTranslating}
            onClick={() => {
              const content =
                tab == TabKey.SourceCode
                  ? editorRef.current?.getValue()
                  : tinyEditorRef.current?.getContent();
              if (!content) return;
              
              setIsTranslating(true);
              const targetLangs = ['vi', 'en', 'jp', 'cn', 'de', 'fr', 'it', 'pt', 'et'].filter(l => l !== language);
              translateHtml(content, language, targetLangs)
                .then((res) => {
                  const nData = { ...data };
                  nData[language] = content;
                  for (const lang of Object.keys(res)) {
                    if (res[lang]) nData[lang] = res[lang];
                  }
                  setData(nData);
                  addPopup({
                    txn: { success: true, summary: 'Tự động dịch thành công' },
                  });
                })
                .catch((err) => {
                  addPopup({
                    error: { title: 'Lỗi', message: 'Dịch thất bại: ' + err.message },
                  });
                })
                .finally(() => {
                  setIsTranslating(false);
                });
            }}
          />
          <Tabs activeTab={tab} tabs={tabs} />
          <Language
            className="page-language"
            language={language}
            setLanguage={(lang) => {
              setValue(undefined);
              const content =
                tab == TabKey.SourceCode
                  ? editorRef.current?.getValue()
                  : tinyEditorRef.current?.getContent();
              const nData = { ...data };
              nData[language] = content;
              setData(nData);
              setLanguage(lang);
            }}
          />
        </div>

        {tab == TabKey.SourceCode ? (
          <MonacoEditor
            defaultLanguage="html"
            value={value}
            height="100%"
            onMount={handleEditorDidMount}
            options={{
              readOnly: false,
            }}
          />
        ) : (
          <Editor
            apiKey={'9rjkn0nooxthjws4ylk4s6ogwe2x1ll74eozkdq1or2maa59'}
            onInit={(evt, editor) => (tinyEditorRef.current = editor)}
            initialValue={value}
            init={{
              menubar: true,
              min_height: 600,
              toolbar_sticky: true,
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
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; overflow: auto; }',
            }}
          />
        )}
      </div>
    </>
  );
};

export default HtmlCode;
