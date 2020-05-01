import React, { useState, useCallback } from 'react';
import DialogComponent from '@material-ui/core/Dialog';

const useDialog = (
  isVisibleByDefault: boolean = false
): [React.ComponentType, (isVisible?: boolean) => void] => {
  const [isVisible, setIsVisible] = useState(isVisibleByDefault);

  const Dialog = useCallback(
    (props) => (
      <DialogComponent
        open={isVisible}
        onClose={() => setIsVisible(false)}
        {...props}
      />
    ),
    [isVisible, setIsVisible]
  );

  return [Dialog, (isVisible = true) => setIsVisible(isVisible)];
};

export default useDialog;
