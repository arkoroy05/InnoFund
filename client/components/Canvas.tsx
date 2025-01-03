import React from "react";
import { Canvas } from "@react-three/fiber";
import Model from "@/components/Model";
import { Environment } from "@react-three/drei";

const Scene = () => {
  return (
    <>
      <Canvas style={{ backgroundColor: "#000000" }}>
        <Model />
        <directionalLight intensity={2} position={[0, 2, 3]} />

        <Environment preset="city" />
      </Canvas>
    </>
  );
};

export default Scene;
