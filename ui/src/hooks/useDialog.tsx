import React, { useState, useCallback } from 'react';
import DialogComponent from '@material-ui/core/Dialog';

const useDialog = (): [React.ComponentType, () => void] => {
  const [isVisible, setIsVisible] = useState(false);

  const Dialog = useCallback(
    props => (
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
