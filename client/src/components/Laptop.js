import React from 'react'
import './laptop.css'

// TAILWIND REQUIRED
// NEEDED CSS
// .screen{
//     transform: rotateX(-74.9746deg) translateX(-50%);
//     background-color: #4b5563;
//     transition-property: transform;
//     transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
//     transition-duration: 1000ms;
// }

// .s-hold:hover .screen{
//     background-color: green !important;
//     /* background-color: #212126 !important; */
//     transform: rotateX(19.8148deg) translateX(-50%) ;
// }

const Laptop = () => {
    return (
        <div className="outer relative z-10 mx-auto mt-12 w-64 rounded-lg bg-gray-500/5 bg-gradient-to-br from-white/5 to-65% px-6 pb-6 pt-14 text-[0.625rem]/[1.125rem] shadow-[0_1px_1px_rgba(255,255,255,0.05)_inset,0_2px_13px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.2)] backdrop-blur-sm">
            <div className="relative isolate z-20 mx-auto flex justify-center">
                <div className="relative isolate [perspective:1000px] s-hold">
                    <div className="screen  [--screen-off-color:theme(colors.gray.900)] [--screen-on-color:theme(colors.gray.600)] absolute bottom-[calc(100%-0.0625rem)] left-1/2 flex h-[4.25rem] w-[6.5rem] origin-bottom items-center justify-center rounded-t border border-gray-600 shadow-[inset_0_0_0_2px_theme(colors.black/75%)] [transform-style:preserve-3d] before:absolute before:inset-[-0.0625rem] before:z-10 before:rounded-[inherit] before:bg-gradient-to-b before:from-black/40 before:from-[0.0625rem] before:to-black/80 before:transition-opacity before:duration-1000 before:group-hover:opacity-0 before:group-hover:duration-500 after:absolute after:inset-x-[-1px] after:top-0 after:-z-10 after:h-[0.125rem] after:rounded-t-full after:bg-gray-500 after:[transform:rotateX(90deg)_translateY(-1px)] [perspective:60px]" >
                        <div className="absolute inset-x-0 top-0.5 h-5 origin-top bg-gradient-to-b from-white/15 to-transparent blur-sm" style={{ transform: "rotateX(90deg) translateZ(0px)", opacity: 1 }}></div>
                        <div className="absolute inset-0 z-30 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:duration-1000">
                            <div className="absolute size-[125%] -translate-x-10 -translate-y-1/2 -rotate-45 bg-gradient-to-l from-white/[0.08]"></div>
                        </div>
                        <div className="rounded-full bg-gray-950 p-2 shadow-[0_1px] shadow-white/5" style={{ opacity: 0 }}><svg className="relative z-20 brightness-150 drop-shadow-[0_0_8px_theme(colors.sky.300/50%)]" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10.9419 1.82065C11.128 1.63454 11.1093 1.32641 10.8906 1.17994C9.77796 0.434669 8.43972 0 6.99997 0C3.13399 0 0 3.13401 0 7C0 8.43976 0.434666 9.778 1.17993 10.8906C1.32641 11.1093 1.63453 11.128 1.82064 10.9419L3.41924 9.3433C3.56372 9.19882 3.58655 8.97468 3.49338 8.79283C3.21791 8.2551 3.06248 7.6457 3.06248 7C3.06248 4.82538 4.82535 3.0625 6.99997 3.0625C7.64566 3.0625 8.25506 3.21792 8.79278 3.4934C8.97463 3.58656 9.19877 3.56374 9.34325 3.41926L10.9419 1.82065ZM9.18748 7C9.18748 8.20812 8.20811 9.1875 6.99999 9.1875C5.79187 9.1875 4.8125 8.20812 4.8125 7C4.8125 5.79188 5.79187 4.8125 6.99999 4.8125C8.20811 4.8125 9.18748 5.79188 9.18748 7ZM10.9432 12.1792C11.1293 12.3653 11.1106 12.6734 10.8919 12.8199C9.77931 13.5652 8.44107 13.9998 7.00131 13.9998C5.56155 13.9998 4.22331 13.5652 3.11067 12.8199C2.89199 12.6734 2.8733 12.3653 3.05942 12.1792L4.65801 10.5806C4.80249 10.4361 5.02663 10.4133 5.20848 10.5064C5.74621 10.7819 6.35561 10.9373 7.00131 10.9373C7.64701 10.9373 8.25641 10.7819 8.79413 10.5064C8.97599 10.4133 9.20012 10.4361 9.34461 10.5806L10.9432 12.1792Z" fill="#5DE3FF"></path></svg>
                        </div>
                    </div>
                    <div className="relative h-[0.375rem] w-[7.25rem] rounded-b-md rounded-t-sm bg-gradient-to-b from-gray-600 from-65% to-gray-700 shadow-[inset_0_1px_0px] shadow-white/10 before:absolute before:left-1/2 before:top-0 before:h-[0.125rem] before:w-[1.25rem] before:-translate-x-1/2 before:rounded-b-full before:bg-gray-700 before:shadow-[inset_2px_0_1px_-2px_theme(colors.black/50%),inset_-2px_0_1px_-2px_theme(colors.black/50%),0_1px_0_theme(colors.white/10%)]">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Laptop