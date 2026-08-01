import './Categories.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CategoryType } from 'src/api/models';

interface ICategories {
  categories: CategoryType[];
  selectedCategory?: CategoryType;
  onSelect: (category: CategoryType) => void;
}


const Categories: React.FC<ICategories> = (props) => {

  const { categories, selectedCategory, onSelect } = props;
  const { t, i18n } = useTranslation();

  //Main
  return (
    <div className={`categories-container`}>
      <div className="categories-header mt-2">
        <div className="categories-title">{t("CATEGORY_TITLE1")}</div>
      </div>
      <div className="category-list-cpn">
        {categories.map((item: CategoryType, index: number) => {
          return (
            <div
              key={`categoryitemcomponent${item.productCategoryId}${index}`}
              className={`category-item-ctn ${item.productCategoryId == selectedCategory?.productCategoryId ? 'focus' : ''
                }`}
              title={item.productCategoryName}
              onClick={() => onSelect(item)}
            >
              <div className="category-item-img">
                {item.thumbAvatar ? <img loading="lazy" src={item.thumbAvatar} alt="avatar" /> : null}
              </div>
              <div className="category-item-name">{t(item.productCategoryName)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
