import { useCallback, useContext, useRef } from "react";
import { Context } from "../contexts/SlideBar";

const useSlideBar = <P, > (
  slideBar?: React.FC<P>
) => {
  const { onDismiss, onPresent } = useContext(Context);
  
  const handlePresent = useCallback((props: object) => {
    onPresent(slideBar, props);
  }, [slideBar, onPresent]);

  const handleDismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  return {handlePresent, handleDismiss};
};

export default useSlideBar;
