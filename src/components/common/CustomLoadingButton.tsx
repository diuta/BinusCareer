import LoadingButton from '@mui/lab/LoadingButton';
import { ButtonProps } from '@mui/material';
import { cloneElement, ReactElement } from 'react';

export default function CustomLoadingButton({
  children,
  loading,
  startIcon,
  endIcon,
  ...props
}: {
  children: JSX.Element | JSX.Element[] | string;
  loading: boolean;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
} & ButtonProps) {
  if (startIcon && endIcon) {
    throw new Error('Cannot use both startIcon and endIcon at the same time.');
  }

  const loadingPosition = startIcon ? 'start' : endIcon ? 'end' : 'center';

  const applyOpacity = (icon?: ReactElement) =>
    loading && icon ? cloneElement(icon, { style: { opacity: 0 } }) : icon;

  return (
    <LoadingButton
      loading={loading}
      loadingPosition={loadingPosition}
      startIcon={applyOpacity(startIcon)}
      endIcon={applyOpacity(endIcon)}
      variant="contained"
      {...props}
    >
      {loading && loadingPosition === 'center' ? (
        <span style={{ opacity: 0 }}>{children}</span>
      ) : (
        <span>{children}</span>
      )}
    </LoadingButton>
  );
}
