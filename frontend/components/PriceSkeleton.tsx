import React from "react";
import { PulseView } from "./PulseView"; 

export const PriceSkeleton = () => {
  return (
    <PulseView
      style={{
        width: 100, 
        height: 24, 
        borderRadius: 6,
        backgroundColor: "#E0E0E0", 
      }}
    />
  );
};
