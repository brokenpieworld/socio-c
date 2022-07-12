import { toast } from "react-toastify";

export const Toast = (message, type = "error") => {
  if (type == "error") {
    return toast.error(message);
  }
  return toast.success(message);
};
