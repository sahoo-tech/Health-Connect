"use client";

interface ToastProps {
    message: string;
    type: "success" | "error" | "info";
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    return (
        <div className={`toast toast-${type}`} onClick={onClose} role="alert">
            <span className="toast-dot" />
            <span>{message}</span>
        </div>
    );
}
