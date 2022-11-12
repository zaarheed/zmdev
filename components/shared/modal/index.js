import { useRef, useEffect, useState, cloneElement } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

export default function Modal({ children, selector = "#modal", onClose = () => {}, show = false, width = "100%", height = "100%", size = "md" }) {
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
                                "shadow-ld overflow-hidden flex flex-col relative w-full h-full",
                                size === "xs" ? "md:w-3/12 md:h-2/6" : null,
                                size === "sm" ? "md:w-6/12 md:h-4/6" : null,
                                size === "md" ? "md:w-8/12 md:h-5/6" : null,
                                size === "lg" ? "md:w-11/12 md:h-5/6" : null,
                                size === "xl" ? "md:w-12/12 md:h-6/6" : null,
                                size === "xl" ? "rounded-non" : "rounded-none"
                            )}
                            style={{ width: size ? null :  width, height: size ? null : height }}
                        >
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