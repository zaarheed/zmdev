import Modal from "@/components/shared/modal";
import classNames from "classnames";
import { Fragment, useState } from "react";
import CourseItemModal from "./course-item-modal";

export default function CourseItem({ subtitle, title, href, details }) {
    const [showModal, setShowModal] = useState(false);

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                className="w-full border shadow rounded-lg flex flex-row font-plex group">
                <div className="w-full h-full justify-center flex flex-col p-4">
                    <p className="text-xs uppercase font-semibold text-flesh-500 dark:text-hulk-500">
                        {subtitle}
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-200 text-lg font-medium leading-5">
                        {title}
                    </p>
                </div>
                <div className="shrink-0 h-full flex flex-col justify-center pr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-500 dark:group-hover:text-zinc-300 duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>
            </a>
        );
    }

    return (
        <Fragment>
            <button
                className={`
                    w-full border shadow rounded-lg flex flex-row appearance-none
                    focus:outline-none text-left font-plex group
                `}
                type="button"
                onClick={() => setShowModal(true)}
            >
                <div className="w-full h-full justify-center flex flex-col p-4">
                    <p
                        className={classNames(
                            "text-xs uppercase font-semibold",
                            subtitle.toLowerCase() === "coming soon" ? "text-azure-500 dark:text-mango-500" : "text-flesh-500 dark:text-hulk-500"
                        )}
                    >
                        {subtitle}
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-200 text-lg font-medium leading-5">
                        {title}
                    </p>
                </div>
                <div className="shrink-0 h-full flex flex-col justify-center pr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>
            </button>
            <Modal show={showModal} onClose={() => setShowModal(false)} size="sm">
                <CourseItemModal
                    title={title}
                    details={details}
                />
            </Modal>
        </Fragment>
    );
}