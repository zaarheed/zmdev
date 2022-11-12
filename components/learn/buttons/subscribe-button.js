import Modal from "@/components/shared/modal";
import { Fragment, useState } from "react";
import SubscribeModal from "../subscribe-modal";

export default function SubscribeButton() {
    const [showModal, setShowModal] = useState(false);

    return (
        <Fragment>
            <button
                type="button"
                className={`
                appearance-none focus:outline-none border dark:border-zinc-700 rounded-xl px-5 py-2 bg-white dark:bg-zinc-800 shadow-xs
                font-medium flex flex-row justify-center items-center space-x-3 mt-8 text-zinc-700 dark:text-zinc-200
                group hover:text-zinc-900 dark:hover:text-zinc-100 w-full md:w-auto self-end
                `}
                onClick={() => setShowModal(true)}
            >
                <span className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:hidden text-hulk-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 hidden group-hover:block text-hulk-500 -mt-1 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                        <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                    </svg>
                </span>
                <span>Keep me posted</span>
            </button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <SubscribeModal />
            </Modal>
        </Fragment>
    )
}