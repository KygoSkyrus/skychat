import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RESET_TOAST } from "../redux/actionTypes";

const Toast = () => {
  let timer;
  const dispatch = useDispatch();
  const toastContainer = useRef();

  //   const hideToast = () => {
  //     toastContainer.current.classList.remove("d-block");
  //     clearTimeout(timer);
  //   };

  const showToast = () => {
    if (isError) {
      toastContainer.current.classList.add(
        "d-block",
        "toast_animation",
        "error"
      );
    } else {
      toastContainer.current.classList.add("d-block", "toast_animation");
    }
    timer = setTimeout(() => {
      toastContainer.current.classList.remove(
        "d-block",
        "toast_animation",
        "error"
      );
      dispatch({ type: RESET_TOAST });
      //call hidetoast instead of the above lines
    }, 3500);
  };

  const isToastVisible = useSelector((state) => state.toast.toast);
  const isError = useSelector((state) => state.toast.isError);
  const message = useSelector((state) => state.toast.toastContent);

  if (isToastVisible) {
    showToast();
  }

  return (
    <>
      <div className="toast" ref={toastContainer}>
        {message}
      </div>
    </>
  );
};

export default Toast;