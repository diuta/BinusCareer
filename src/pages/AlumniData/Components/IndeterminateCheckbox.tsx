import { useRef, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & React.ComponentPropsWithoutRef<typeof Checkbox>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return (
    <Checkbox
			sx={{padding: 0}}
      inputRef={ref}
      {...rest}
    />
  );
}

export default IndeterminateCheckbox;