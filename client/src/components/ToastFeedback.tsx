import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface ToastFeedbackProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export default function ToastFeedback({
  message,
  type = 'info',
}: ToastFeedbackProps) {
  useEffect(() => {
    if (!message) return;
    toast[type](message);
  }, [message, type]);

  return null;
}
