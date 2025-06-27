import { X } from 'lucide-react';

const Drawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  position = 'right',
  // size = 'xs'
}) => {
  const positions = {
    left: 'left-0',
    right: 'right-0'
  };
  
  // const sizes = {
  //   xs: 'w-60',
  //   sm: 'w-80',
  //   md: 'w-96',
  //   lg: 'w-[32rem]',
  //   xl: 'w-[40rem]'
  // };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`
        fixed top-0 bottom-0 ${positions[position]}
         w-3/4 sm:max-w-[540px] max-w-[800px] 
        bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
        ${
          isOpen
            ? "translate-x-0"
            : position === "right"
            ? "translate-x-full"
            : "-translate-x-full"
        }
      `}
      >
        <div className="flex flex-col space-y-4 h-full p-6">
          {/* Header */}
          <div className="">
            <h2 className="text-lg font-medium">{title}</h2>
          </div>

          <div className="absolute top-3 right-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
            {children}

          {/* Footer */}
            {footer}
          
        </div>
      </div>
    </>
  );
};

export default Drawer;