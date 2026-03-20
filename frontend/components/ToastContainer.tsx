import React, { useState, useEffect, useRef } from "react";
import { View, DeviceEventEmitter, Animated, PanResponder } from "react-native";
import { SuccessToast, ErrorToast } from "./CustomToast";

// --- ANIMATED TOAST ITEM (INALTERADO) ---
const AnimatedToastItem = ({ toast }: { toast: any }) => {
  const translateY = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      speed: 12,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        opacity: 1,
        transform: [{ translateY }],
      }}
    >
      {toast.type === "success" ? (
        <SuccessToast text1={toast.text1} text2={toast.text2} />
      ) : (
        <ErrorToast text1={toast.text1} text2={toast.text2} />
      )}
    </Animated.View>
  );
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<any[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerTranslateY = useRef(new Animated.Value(0)).current;

  // Função isolada para podermos chamar ao iniciar e ao soltar o card
  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      Animated.timing(containerTranslateY, {
        toValue: -200,
        duration: 350,
        useNativeDriver: true,
      }).start(() => setToasts([]));
    }, 3000);
  };

  // === MAGIA DO ARRASTAR (PAN RESPONDER) ===
  const panResponder = useRef(
    PanResponder.create({
      // Só assume o controle do gesto se o usuário arrastar mais de 5px na vertical
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,

      onPanResponderGrant: () => {
        // O dedo tocou no Toast: Pausa o cronômetro para ele não sumir do nada!
        if (timerRef.current) clearTimeout(timerRef.current);
      },

      onPanResponderMove: (_, gestureState) => {
        // Se arrastar pra cima (negativo), acompanha o dedo.
        if (gestureState.dy < 0) {
          containerTranslateY.setValue(gestureState.dy);
        } else {
          // Se arrastar pra baixo (positivo), cria uma "resistência elástica"
          containerTranslateY.setValue(gestureState.dy * 0.2);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        // Se jogou pra cima rápido (vy) OU passou de 40px, joga o resto pra fora e deleta
        if (gestureState.dy < -40 || gestureState.vy < -1) {
          Animated.timing(containerTranslateY, {
            toValue: -250, // Joga bem pra fora da tela
            duration: 200,
            useNativeDriver: true,
          }).start(() => setToasts([]));
        } else {
          // Se soltou e não foi o suficiente, quica de volta pro lugar e retoma o timer
          Animated.spring(containerTranslateY, {
            toValue: 0,
            bounciness: 10,
            useNativeDriver: true,
          }).start();
          startTimer();
        }
      },
    }),
  ).current;

  useEffect(() => {
    const showSub = DeviceEventEmitter.addListener(
      "SHOW_CUSTOM_TOAST",
      (toast) => {
        containerTranslateY.setValue(0);
        const newToast = { ...toast, id: Math.random().toString() };
        setToasts((prev) => [...prev, newToast]);
        startTimer(); // Inicia a contagem regressiva
      },
    );

    const hideSub = DeviceEventEmitter.addListener("HIDE_CUSTOM_TOAST", () => {
      setToasts([]);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: [{ translateY: containerTranslateY }],
      }}
      pointerEvents="box-none"
    >
      <View style={{ position: "relative", width: "100%" }}>
        {toasts.map((t) => (
          <AnimatedToastItem key={t.id} toast={t} />
        ))}
      </View>
    </Animated.View>
  );
}
