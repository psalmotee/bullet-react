import { ArchiveX } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = ArchiveX, 
  title = 'No items found', 
  description,
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Icon size={48} className="text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-4">{description}</p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;