import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  TextInput,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onSubmit?: () => void;
  containerStyle?: ViewStyle;
}

export default function SearchBar({
  value,
  onChangeText,
  expanded,
  onExpand,
  onCollapse,
  onSubmit,
  containerStyle,
}: SearchBarProps) {
  const animation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      if (expanded) {
        inputRef.current?.focus();
      }
    });
  }, [expanded]);

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [44, 200], // largura final ajustável
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height: 44,
          backgroundColor: "#FFF",
          borderRadius: 22,
          flexDirection: "row",
          alignItems: "center",
          overflow: "hidden",
        },
        containerStyle,
      ]}
    >
      {/* ÍCONE ESQUERDO */}
      <TouchableOpacity
        onPress={expanded ? onCollapse : onExpand}
        style={{
          width: 44,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name={expanded ? "chevron-right" : "magnify"}
          size={24}
          color="#999"
        />
      </TouchableOpacity>

      {/* INPUT + BOTÃO LIMPAR */}
      <Animated.View
        style={{
          flex: 1,
          opacity,
          flexDirection: "row",
          alignItems: "center",
          paddingRight: 6,
        }}
      >
        <TextInput
          ref={inputRef}
          placeholder="Buscar..."
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={() => {
            Keyboard.dismiss();
            onSubmit?.();
          }}
          onBlur={() => {
            if (!value) {
              onCollapse();
            }
          }}
          style={{
            flex: 1,
            fontSize: 14,
            paddingVertical: 0,
          }}
        />

        {expanded && value.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              onChangeText("");
              inputRef.current?.focus();
            }}
            style={{
              width: 28,
              height: 28,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
}
