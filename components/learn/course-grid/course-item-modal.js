import { lambda } from "@/services/api";
import { Formik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";
import Prose from "@/components/learn/prose";
import styles from "./success.module.css";

const registerInterestSchema = Yup.object().shape({
    name: Yup.string().required("Enter your name"),
    email: Yup.string().email("Enter a valid email address").required("Enter a valid email address"),
});

export default function CourseItemModal({ onClose, title }) {
    const formRef = useRef();
    const [showSuccess, setSuccess] = useState(false);

    const handleSubmit = async ({ email, name }) => {
        await lambda.post("/subscribe", {
            email,
            name
        });
        
        setSuccess(true);
    }
    
    if (showSuccess === true) {
        return <Success onClose={onClose} />
    }

    return (
        <Formik
            initialValues={{ email: "", name: "" }}
            onSubmit={handleSubmit}
            validationSchema={registerInterestSchema}
            innerRef={formRef}
        >
            {({ values, handleChange, handleBlur, handleSubmit, errors, isValid }) => (
                <form
                    onSubmit={handleSubmit}
                    className={`
                        w-full h-full flex flex-col justify-between border-4 border-dashed rounded-lg
                        overflow-hidden border-l-azure-500 border-b-mango-500 border-r-flesh-500
                        border-t-hulk-500 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 p-4
                    `}
                >
                    <div className="w-full h-full flex flex-col justify-center">
                        <p className="text-xs uppercase font-semibold text-azure-500">
                           Coming soon
                        </p>
                        <h3 className="w-full text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                            {title}
                        </h3>
                        <Prose>
                            <p>
                                This course hasn't been released yet. Enter your details below and I'll email you
                                when it's ready.
                            </p>
                        </Prose>
                        

                        <input
                            className={`
                                w-full bg-white dark:bg-zinc-900 py-3 px-4 focus:outline-none placeholder-zinc-400
                                appearance-none focus:bg-zinc-100 dark:focus:bg-zinc-800 hover:bg-zinc-100
                                dark:hover:bg-zinc-800 border-4 border-mango-500
                            `}
                            placeholder="Enter your name"
                            value={values.name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name="name"
                        />

                        <input
                            className={`
                                w-full bg-white dark:bg-zinc-900 py-3 px-4 focus:outline-none placeholder-zinc-400
                                appearance-none focus:bg-zinc-100 dark:focus:bg-zinc-800 hover:bg-zinc-100
                                dark:hover:bg-zinc-800 border-4 border-mango-500 mt-4
                            `}
                            placeholder="Enter your email address"
                            value={values.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name="email"
                        />
                    </div>
                    
                    <div className="w-full flex flex-row space-x-2 md:space-x-4">
                        <button
                            className={`
                                w-6/12 bg-transparent py-3 rounded-none focus:outline-none
                                cursor-pointer hover:bg-red-100 duration-300 text-flesh-500
                            `}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className={`
                                w-6/12 bg-azure-500 py-3 font-bold text-white border-4 border-azure-500
                                focus:outline-none cursor-pointer hover:bg-white dark:hover:bg-zinc-900
                                hover:text-azure-500 duration-200
                            `}
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            )}
        </Formik>
    )
}

function Success({ onClose = () => {} }) {
    return (
        <div
            className={`
                w-full h-full flex flex-col justify-center items-center border-4
                border-dashed rounded-lg overflow-hidden border-l-azure-500
                border-b-mango-500 border-r-flesh-500 border-t-hulk-500 bg-white dark:bg-zinc-900
                text-zinc-700 dark:text-zinc-200 p-4 space-y-4
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