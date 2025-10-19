import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

export const Toast = ({ message, type, onDismiss }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const baseClasses = 'fixed bottom-5 right-5 p-4 rounded-lg border-2 border-black text-white font-bold transition-opacity duration-300 z-50';
  const typeClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`${baseClasses} ${typeClasses}`} style={{ boxShadow: '4px 4px 0px #000' }}>
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 font-bold opacity-70 hover:opacity-100">X</button>
    </div>
  );
};