import './Language.css';
import React from 'react';

interface ILanguageProps {
  className?: string;
  language?: string;
  setLanguage?: (value: string) => void;
}

const Language: React.FC<ILanguageProps> = (props) => {
  const { className, language, setLanguage } = props;

  return (
    <div className={`${className ? className : ''}`}>
      <span
        className={`flag-icon flag-icon-en ${language == 'en' ? 'active' : 'deactive'}`}
        onClick={() => setLanguage('en')}
        title='Tiếng Anh'
      >
        &#8203;
      </span>
      <span
        className={`flag-icon flag-icon-vn ${language == 'vi' ? 'active' : 'deactive'}`}
        onClick={() => setLanguage('vi')}
        title='Tiếng Việt'
      >
        &#8203;
      </span>
      <span
        className={`flag-icon flag-icon-jp ${language == 'jp' ? 'active' : 'deactive'}`}
        onClick={() => setLanguage('jp')}
        title='Tiếng Nhật'
      >
        &#8203;
      </span>
      <span
        className={`flag-icon flag-icon-de ${language == 'de' ? 'active' : 'deactive'}`}
        onClick={() => setLanguage('de')}
        title='Tiếng Đức'
      >
        &#8203;
      </span>
      <span
        className={`flag-icon flag-icon-fr ${language == 'fr' ? 'active' : 'deactive'}`}
        onClick={() => setLanguage('fr')}
        title='Tiếng Pháp'
      >
        &#8203;
      </span>
      <span
        className={`flag-icon flag-icon-it ${language == 'it' ? 'active' : 'deactive'}`}
        onClick={() => setLanguage('it')}
        title='Tiếng Ý'
      >
        &#8203;
      </span>
      <span
        className={`flag-icon flag-icon-pt ${language == 'pt' ? 'active' : 'deactive'}`}
        onClick={() => setLanguage('pt')}
        title='Tiếng Bồ Đào Nha'
      >
        &#8203;
      </span>
      <span
        className={`flag-icon flag-icon-et ${language == 'et' ? 'active' : 'deactive'}`}
        onClick={() => setLanguage('et')}
        title='Tiếng Tây Ban Nha'
      >
        &#8203;
      </span>
      <span
        className={`flag-icon flag-icon-cn ${language == 'cn' ? 'active' : 'deactive'}`}
        onClick={() => setLanguage('cn')}
        title='Tiếng Trung'
      >
        &#8203;
      </span>
    </div>
  );
};

export default Language;
