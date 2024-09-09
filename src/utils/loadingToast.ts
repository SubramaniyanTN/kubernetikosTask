import { toast, ToastOptions } from "react-toastify";

export const useLoadingToast = (text: string, props?: ToastOptions) => {
  return toast.loading(text, {
    closeButton: true,
    draggable: true,
    hideProgressBar: false,
    progress: 1,
    ...props,
  });
};
