export type UseModalProviderContext = {
  showModal: (props: ShowModalProps) => void;
};

export type UseModalProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export type ShowModalProps = {
  message: string | JSX.Element;
  title?: string;
  options?: {
    buttonTitle?: string;
    cancelButton?: boolean;
    variant: 'success' | 'failed' | 'info';
    onOk?: () => void;
    onClose?: () => void;
  };
};
