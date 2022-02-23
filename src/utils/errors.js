import React from "react";
import { Modal } from "antd";

export const ERROR = props => {
  
  return (
    <div>
      {Modal.error({
        title: "This is an error message",
        content: props
      })}
    </div>
  );
};

export const Warning = props => {
  Modal.warning({
    title: "This is a warning message",
    content: props
  });
};

export const Success = (props) => {
  Modal.success({
    title: "This is a success message",
    content: props,
  });
};

export const RedirectModal = (props) => {

 
  Modal.error({
    title: "This is an error message",
    content: props,
    onOk: () => {
      window.location = window.location.origin+'/dashboard';
    },
    
  });
};
