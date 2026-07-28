import './StaticPage.css';
import React from 'react';
import { useParams } from 'react-router';
import { useGetStaticPageByKey } from 'src/api/backend-api';
import { useEffect } from 'react';
import { useState } from 'react';
import { StaticPageType } from 'src/api/models';
import { PageContainer, PageHeader } from 'src/components/GlobalStyled';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StaticPage: React.FC = () => {
  //Value
  const params = useParams<{ key: string }>();
  const key = params.key;

  //State
  const [staticPage, setStaticPage] = useState<StaticPageType>(null);
  const { t, i18n } = useTranslation();
  //Function
  const getStaticPageByKey = useGetStaticPageByKey();

  useEffect(() => {
    getStaticPageByKey(key)
      .then((res) => {
        setStaticPage(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getStaticPageByKey, key]);

  //Main
  return (
    <PageContainer>
      <PageHeader>
        <NavLink to={'/'}>{t("Home")}</NavLink>{` / `}{t(staticPage?.staticPageTitle)}
      </PageHeader>
      <div className='static-page-container'>
        {staticPage ? (
          <div
            dangerouslySetInnerHTML={{
              __html: eval(`staticPage?.${i18n.language}??''`),
            }}
          />
        ) : null}
      </div>
    </PageContainer>

  );
};

export default StaticPage;
