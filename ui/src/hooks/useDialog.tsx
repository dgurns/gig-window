import React, { useState, Dispatch, SetStateAction } from 'react';
import Dialog from '@material-ui/core/Dialog';

const useDialog = (): [
  React.ReactElement,
  Dispatch<SetStateAction<boolean>>
] => {
  const [isVisible, setIsVisible] = useState(false);

  return [
    <Dialog open={isVisible} onClose={() => setIsVisible(false)} />,
    setIsVisible
  ];
};

export default useDialog;
