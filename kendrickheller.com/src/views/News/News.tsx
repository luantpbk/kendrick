import './News.css';
import React from 'react';
import { useNavigate } from 'react-router';
import {
  useGetNews,
  useGetStaticPageByKey,
} from 'src/api/backend-api';
import { useEffect, useState } from 'react';
import { NewsType, StaticPageType } from 'src/api/models';
import { PageContainer, PageHeader } from 'src/components/GlobalStyled';
import { NavLink } from 'react-router-dom';
import Loading from 'src/components/Loading';
import { useTranslation } from 'react-i18next';
import InfiniteList from 'src/components/InfiniteList/InfiniteList';

const News: React.FC = () => {
  //Value
  const navigate = useNavigate();
  const SIZE = 20;
  //State
  const [listNews, setListNews] = useState<NewsType[]>([]);
  const [newsListAds, setNewsListAds] = useState<StaticPageType>();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [loadingFlag, setLoadingFlag] = useState(true);
  const { t, i18n } = useTranslation();
  //Function
  const getNews = useGetNews();
  const getStaticPageByKey = useGetStaticPageByKey();


  const onClickLink = (link: string) => {
    window.scrollTo(0, 0);
    navigate(link);
  };
  //End of function

  //Get ads
  useEffect(() => {
    getStaticPageByKey('NEWS_EXTRA_INFO_LIST')
      .then((data) => {
        setNewsListAds(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getStaticPageByKey]);



  const fetchData = (reset: boolean) => {
    setLoadingFlag(true);
    const cpage = reset ? 1 : page;
    getNews(cpage, SIZE)
      .then((r) => {
        const nList = reset ? r.items : [...listNews, ...r.items];
        console.log(nList);
        setListNews(nList);
        if (nList.length >= r.count) {
          setHasMore(false);
        } else {
          setHasMore(true);
          setPage(page + 1);
        }
      })
      .finally(() => setLoadingFlag(false));
  };


  //Get news
  useEffect(() => {
    fetchData(true);
  }, [reloadFlag]);


  return (

    <PageContainer>
      <PageHeader>
        <NavLink to={'/'}>Home</NavLink>{` / `}News
      </PageHeader>
      <div className='news-container'>
        <InfiniteList fetchData={fetchData} hasMore={hasMore} isHorizontally={false}>
          {listNews.map((item: NewsType, index: number) => {
            return (
              <div
                key={`new${index}`}
                className="new-item new-resize"
                onClick={() => navigate(`/news/${item.newId}`)}
                title={item.newTitle}
              >
                <div className='new-item-header'>
                  <img loading="lazy" className="new-avatar" src={item.newAvatar} />
                  <div className="news-item-title">{item.newTitle}</div>
                </div>
                <div className="news-item-des">
                  {item.description}
                </div>
              </div>
            );
          })}
          {loadingFlag && <div className='refresh-loading'>
            <Loading color='gray' />
          </div>}
        </InfiniteList>


        {newsListAds ? <div className='news-extra-hidden' dangerouslySetInnerHTML={{
          __html: eval(`newsListAds?.${i18n.language}??''`),
        }} /> : null}
      </div>

    </PageContainer>

  );
};

export default News;
