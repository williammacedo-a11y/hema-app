import { DeviceEventEmitter } from "react-native";

type ToastOptions = {
  type: "success" | "error";
  text1?: string;
  text2?: string;
};

export const Toast = {
  show: (options: ToastOptions) => {
    DeviceEventEmitter.emit("SHOW_CUSTOM_TOAST", options);
  },
  hide: () => {
    DeviceEventEmitter.emit("HIDE_CUSTOM_TOAST");
  },
};