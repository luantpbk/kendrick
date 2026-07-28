import { useCallback, useContext, useRef } from "react";
import { Context } from "../contexts/Modals";

const useModal = <P, > (
  modal?: React.FC<P>,
  id?: string,
  backdropClick = true
) => {
  const { onDismiss, onPresent } = useContext(Context);
  const ref = useRef<string>(id);

  const handlePresent = useCallback((props: object, title?: string) => {
    console.log(onPresent)
    ref.current = onPresent(modal, props, title, backdropClick);
  }, [backdropClick, modal, onPresent]);

  const handleDismiss = useCallback(() => {
    onDismiss(ref.current);
  }, [onDismiss]);

  return {handlePresent, handleDismiss};
};

export default useModal;
