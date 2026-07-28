import { useContext } from 'react';
import { Context } from '../contexts/SmartCardProvider';

const useProfile = () => {
  const { profile } = useContext(Context);
  return profile;
};

export default useProfile;
