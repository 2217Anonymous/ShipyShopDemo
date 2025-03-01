import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let existingToastId = null;

export const ToastRight = (msg,type) => {
    const config = {
      position: "top-right",
      hideProgressBar: true,
      className: `bg-${type === 'success' ? 'success' : type === 'Failed' ? 'danger' : 'warning'} text-white`,
    };

    if (existingToastId !== null) {
      toast.update(existingToastId, {
        render: msg,
        ...config,
      });
    } else {
      const newToast = toast(msg, config);
      existingToastId = newToast;
    }
  
    const timer = setTimeout(() => {
      toast.dismiss(existingToastId);
      existingToastId = null;
    }, 10000);
  
    return () => clearTimeout(timer);
}
