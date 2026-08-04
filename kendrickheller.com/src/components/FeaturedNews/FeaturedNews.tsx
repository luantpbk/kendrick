import './FeaturedNews.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useGetNews } from 'src/api/backend-api';
import { NewsType } from 'src/api/models';

const FeaturedNews: React.FC = () => {
  //Value
  const navigate = useNavigate();
  //State
  const [listFeaturedNews, setListFeaturedNews] = useState<NewsType[]>([]);

  const getNews = useGetNews();



  //End of function
  useEffect(() => {
    getNews(1, 4)
      .then((data) => {
        setListFeaturedNews(data.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getNews]);

  //Main
  return (
    <div className="featured-news-container">
      <div className="featured-news-child">
        {listFeaturedNews.map((item: NewsType, index: number) => {
          return (
            <div
              key={`feature${index}`}
              className="feature-new-item feature-new-resize"
              onClick={() => navigate(`/news/${item.newId}`)}
              title={item.newTitle}
            >
              <div className='feature-new-item-header'>
                <img width="500" height="300" loading="lazy" className="feature-new-avatar" src={item.newAvatar} alt="news" />
                <div className="featured-news-item-title">{item.newTitle}</div>
              </div>
              <div className="featured-news-item-des">
                {item.description}
              </div>
            </div>
          );
        })}
        <div className="all-featured-news new-resize">
          <label
            title="SEE MORE"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate(`/news/default`);
            }}
          >
            SEE MORE
          </label>
        </div>

      </div>

    </div>
  );
};

export default FeaturedNews;
