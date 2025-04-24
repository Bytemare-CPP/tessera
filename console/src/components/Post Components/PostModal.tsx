import { useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

function Modal( {isOpen, onClose, children }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent scrolling when the modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Handle escape key presses
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        window.addEventListener("keydown", handleEscape);
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen, onClose])

    // Handle clicks outside the modal
    const handleOutsideClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    }

    if (!isOpen) return null

    return (
        <div 
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50' 
            onClick={handleOutsideClick}>
            <div ref={modalRef} className='relative bg-[#FDF7F4] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto'>
                <button 
                    style={{ outline: "none" }}
                    className='!w-10 !h-10 !bg-[#FDF7F4] !absolute !top-4 !right-4 !p-1 !rounded-full !focus:outline-none !border-none !button-focus: none' 
                    onClick={onClose}>
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                            <path fill="#000" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                </button>
                {children}
            </div>
        </div>
    )
}

export default Modal;