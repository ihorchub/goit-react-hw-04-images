import { useEffect } from 'react';
import { ModalWindow, Overlay } from './Modal.styled';

export const Modal = ({ onClose, url }) => {
  useEffect(() => {
    const handlerKeyDown = e => e.code === 'Escape' && onClose();

    window.addEventListener('keydown', handlerKeyDown);

    return () => {
      window.removeEventListener('keydown', handlerKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = e => e.currentTarget === e.target && onClose();

  return (
    <Overlay onClick={handleBackdropClick}>
      <ModalWindow>
        <img src={url} alt="" />
      </ModalWindow>
    </Overlay>
  );
};
