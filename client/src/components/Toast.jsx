import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RESET_TOAST } from "../redux/actionTypes";

const Toast = React.memo(() => {

  let timer;
  const dispatch = useDispatch();
  const toastContainer = useRef();
  const {isToastVisible, toastContent, isError} = useSelector((state) => state.toast);

  if (isToastVisible) showToast();

  const hideToast = () => {
    toastContainer?.current?.classList.remove("d-flex", "toast_animation", "error");
    dispatch({ type: RESET_TOAST });
    clearTimeout(timer);
  };

  function showToast() {
    console.log("showtoast", toastContainer?.current?.classList);
    if (isError) {
      toastContainer?.current?.classList.add("d-flex", "toast_animation", "error");
    } else {
      toastContainer?.current?.classList.add("d-flex", "toast_animation");
    }
    timer = setTimeout(() => {
      hideToast();
    }, 4000);
  };

  return (
    <>
      <div className="toast_container" ref={toastContainer}>
      {isToastVisible &&
        <div className="toast">{toastContent}</div>}
      </div>
    </>
  );
});

export default Toast;