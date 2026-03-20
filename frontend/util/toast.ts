// src/utils/toast.ts
import { DeviceEventEmitter } from "react-native";

type ToastOptions = {
  type: "success" | "error" | "info";
  text1?: string;
  text2?: string;
};

export const Toast = {
  show: (options: ToastOptions) => {
    // Emite um evento global que o nosso Container vai escutar
    DeviceEventEmitter.emit("SHOW_CUSTOM_TOAST", options);
  },
  hide: () => {
    DeviceEventEmitter.emit("HIDE_CUSTOM_TOAST");
  },
};