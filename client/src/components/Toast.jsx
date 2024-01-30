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
    console.log('showtoast',toastContainer.current.classList)
    if(isError){
        toastContainer.current.classList.add("d-block","error")
    }else{
        toastContainer.current.classList.add("d-block")
    }
    timer = setTimeout(() => {
      toastContainer.current.classList.remove("d-block","error");
      dispatch({ type: RESET_TOAST })
      //call hidetoast instead of the above lines
    }, 3500);
  };

  const isToastVisible = useSelector((state) => state.toast.toast);
  const isError = useSelector((state) => state.toast.isError);
  const message = useSelector((state) => state.toast.toastContent);

  if (isToastVisible) {
    showToast();
  }

//   add fade up/in and fade out animation
  return (
    <>
    <div className={`toast`} ref={toastContainer}>{message}</div>
      {/* <div
        className="toastContainer shadow rounded-1"
        ref={toastContainer}
        onClick={hideToast}
        style={{
          borderLeft: isSuccess
            ? "6px solid var(--color-green)"
            : "6px solid var(--color-red)",
        }}
      >
        {isSuccess ? (
          <span>
            <i className="fa-solid fa-circle-check me-3"></i>
          </span>
        ) : (
          <span>
            <i className="fa-solid fa-triangle-exclamation me-3"></i>
          </span>
        )}

        <section className="toast-inner">{message}</section>
        <span onClick={hideToast}>
          <i className="fa-solid fa-xmark close ms-5"></i>
        </span>
      </div> */}
    </>
  );
};

export default Toast;