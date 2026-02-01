import React from 'react';
import { useApp } from '../context/AppContext';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function ToastContainer() {
    const { toasts, removeToast } = useApp();

    if (toasts.length === 0) return null;

    const icons = {
        success: <FaCheckCircle />,
        error: <FaExclamationCircle />,
        info: <FaInfoCircle />,
    };

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <span className="toast-icon">{icons[toast.type] || icons.info}</span>
                    <span className="toast-message">{toast.message}</span>
                    <button className="toast-close" onClick={() => removeToast(toast.id)}>
                        <FaTimes />
                    </button>
                </div>
            ))}
        </div>
    );
}
