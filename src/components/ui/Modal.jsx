import { X, AlertCircle } from 'lucide-react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true,
  size = 'xl'
}) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div
        className={`relative bg-white rounded-lg shadow-lg w-full max-h-[90vh] max-w-[425px] overflow-y-auto`}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
          >
            <X size={16} />
          </button>
        )}

        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Close',
  loading = false,
  variant = 'danger'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="text-red-600" size={24} />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <p className="text-gray-600 flex justify-center mb-6">{message}</p>

      <div className="flex justify-end gap-3">
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
};

export { Modal, ConfirmModal };
export default Modal;