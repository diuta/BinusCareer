/* eslint-disable react/jsx-no-constructed-context-values */
import { ModalAlert } from '../../components/common/modal-alert';
import { useState } from 'react';

import UseModalContext from './context';
import { ShowModalProps, UseModalProviderProps } from './types';

export function UseModalProvider({ children }: UseModalProviderProps) {
  const [modal, setModal] = useState<ShowModalProps & { open: boolean }>({
    open: false,
    message: '',
    title: undefined,
    options: {
      variant: 'success',
      onOk: () => setModal({ ...modal, open: false }),
      onClose: () => setModal({ ...modal, open: false }),
      cancelButton: false,
    },
  });

  const contextValue = {
    showModal: ({ message, title, options }: ShowModalProps) =>
      setModal({
        open: true,
        message,
        title,
        options,
      }),
  };

  return (
    <UseModalContext.Provider value={contextValue}>
      {children}
      <ModalAlert
        open={modal.open}
        title={modal.title}
        variant={modal.options?.variant}
        message={modal.message}
        buttonTitle={modal.options?.buttonTitle}
        onOk={() => {
          modal.options?.onOk?.();
          setModal({ ...modal, open: false });
        }}
        onClose={() => {
          modal.options?.onClose?.();
          setModal({ ...modal, open: false });
        }}
        cancelButton={modal.options?.cancelButton}
      />
    </UseModalContext.Provider>
  );
}
