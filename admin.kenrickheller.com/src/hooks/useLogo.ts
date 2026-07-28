import { useEffect, useState } from 'react';
import { useGetLogo } from 'src/api/logoApi';

const useLogo = () => {
  const getLogo = useGetLogo();
  const [logo, setLogo] = useState<string | undefined>(undefined);

  useEffect(() => {
    getLogo().then((data) => {
      setLogo(data.fileUrl);
    });
  }, [getLogo]);

  return logo;
};

export default useLogo;
