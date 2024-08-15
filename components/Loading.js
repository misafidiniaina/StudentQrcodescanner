import React from "react";
import { View, ActivityIndicator } from "react-native";
import { BarIndicator } from "react-native-indicators";
import { colors } from "../utils/Utils";

const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 100000,
      }}
    >
      <BarIndicator color={colors.primary} count={5} />
    </View>
  );
};

export default Loading;
