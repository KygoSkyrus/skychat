// import { useEffect, useState } from "react";

// export function useDelayUnmount(isMounted, delayTime) {
//     const [ shouldRender, setShouldRender ] = useState(false);

//     useEffect(() => {
//         let timeoutId;
//         if (isMounted && !shouldRender) {
//             setShouldRender(true);
//         }
//         else if(!isMounted && shouldRender) {
//             timeoutId = setTimeout(
//                 () => setShouldRender(false), 
//                 delayTime
//             );
//         }
//         return () => clearTimeout(timeoutId);
//     }, [isMounted, delayTime, shouldRender]);
//     return shouldRender;
// }


// IN parent react component

 // mount/unmount transition
//  const [ isMounted, setIsMounted ] = useState(true);
//  const shouldRenderChild = useDelayUnmount(isMounted, 500);
//  const mountedStyle = {opacity: 1, transition: "all 500ms ease-in", background:"green !important",transform:"translateX(0%)"};
//  const unmountedStyle = {opacity: 0, transition: "all 500ms ease-in", background:"red !important",transform:"translateX(-100%)"};
//  const handleToggleClicked = () => {
//    setIsMounted(!isMounted);
//  }

//  <>
 
//             {shouldRenderChild && 
//                 <Child style={isMounted ? mountedStyle : unmountedStyle} />}
//             <button onClick={handleToggleClicked}>Click me!</button>
            
//             </>