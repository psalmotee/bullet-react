import { X } from 'lucide-react';
import Button from './Button';

const Drawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  position = 'right',
  size = 'md'
}) => {
  const positions = {
    left: 'left-0',
    right: 'right-0'
  };
  
  const sizes = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[32rem]',
    xl: 'w-[40rem]'
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed top-0 bottom-0 ${positions[position]} ${sizes[size]}
        bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="border-t border-gray-200 p-6">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Drawer;