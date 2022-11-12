import { useRef, useEffect, useState, cloneElement } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

export default function Modal({ children, selector = "#modal", onClose = () => {}, show = false, width = "100%", height = "100%", size = "md", showCloseButton = false }) {
    useEffect(() => {
        if (show === false) return;
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        }
    }, [show]);

    return (
        show && (
            <Portal selector={selector}>
                <div className="w-screen h-full max-h-screen bg-white dark:bg-zinc-900 bg-opacity-90 fixed top-0 left-0 overflow-hidden z-40">
                    <div className="w-full h-full relative flex justify-center items-center p-2">
                        <div
                            className={classNames(
                                "relative shadow-lg overflow-hidden flex flex-col relative w-full h-full",
                                size === "xs" ? "md:w-3/12 md:h-2/6" : null,
                                size === "sm" ? "md:w-6/12 md:h-4/6" : null,
                                size === "md" ? "md:w-8/12 md:h-5/6" : null,
                                size === "lg" ? "md:w-11/12 md:h-5/6" : null,
                                size === "xl" ? "md:w-12/12 md:h-6/6" : null,
                                size === "xl" ? "rounded-non" : "rounded-none"
                            )}
                            style={{ width: size ? null :  width, height: size ? null : height }}
                        >
                            {showCloseButton && (
                                <button
                                    className={`
                                        absolute top-3 right-3 focus:outline-none appearance-none
                                        text-red-500 rounded-full p-px hover:scale-105 duration-200
                                        cursor-pointer
                                    `}
                                    style={{ zIndex: 999 }}
                                    type="button"
                                    onClick={onClose}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            )}
                            {cloneElement(children, { onClose })}
                        </div>
                    </div>
                </div>
            </Portal>
        )
    );
}

function Portal({ children, selector }) {
    const ref = useRef()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        ref.current = document.querySelector(selector);
        setMounted(true)
    }, [selector])

    return mounted ? createPortal(children, ref.current) : null
}