import Prose from "../prose";
import styles from "./success.module.css";

export default function Success({ onClose = () => {} }) {
    return (
        <div
            className={`
                w-full h-full flex flex-col justify-center items-center border-4 border-dashed
                rounded-lg overflow-hidden border-l-azure-500 border-b-mango-500 border-r-flesh-500
                border-t-hulk-500 bg-white dark:bg-zinc-900 text-zinc-700 dark:zinc-text-200 p-4 space-y-4
            `}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="154px" height="154px">
                <g fill="none" stroke="#007CFF" strokeWidth="2">
                    <circle className={styles.circle} cx="77" cy="77" r="72" style={{ "stroke-dasharray": "480px, 480px", "stroke-dashoffset": "960px" }} />
                    <circle className={styles.coloredCircle} fill="#007CFF" cx="77" cy="77" r="72" style={{ "stroke-dasharray": "480px, 480px", "stroke-dashoffset": "960px" }} />
                    <polyline className={styles.polyline} stroke="#ffffff" strokeWidth="10" points="43.5,77.8 63.7,97.9 112.2,49.4 " style={{ "stroke-dasharray" : "100px, 100px", "stroke-dashoffset": "200px" }} />
                </g>
            </svg>

            <h3 className="w-full text-2xl font-semibold text-zinc-900 dark:text-zinc-100 text-center">
                Thanks, I'll keep you updated by email.
            </h3>

            <Prose>
                Know anyone else who might be interested? Send them to 👉 <a href="https://www.zmdev.com/learn">zmdev.com/learn</a>
            </Prose>

            <button
                className={`
                    bg-azure-500 py-3 font-bold text-white border-4 border-azure-500 w-full
                    focus:outline-none cursor-pointer hover:bg-white dark:hover:bg-zinc-900 hover:text-azure-500 duration-200
                `}
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
}