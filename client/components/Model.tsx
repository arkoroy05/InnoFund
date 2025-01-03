import React, { useRef } from "react";
import { useGLTF, Text } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";

export function Model() {
  const { nodes } = useGLTF("/medias/torrus.glb");
  const { viewport } = useThree();
  const torus = useRef(null);
  useFrame(() => {
    torus.current.rotation.x += 0.01;
  });
  console.log(nodes);
  return (
    <group dispose={null} scale={viewport.width / 3.5}>
      <Text fontSize={0.5} font={'/fonts/InterVariable.woff2'}>
        INNOFUND
        </Text>

      <mesh ref={torus} {...nodes.Torus002}>
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

useGLTF.preload("/medias/torrus5.glb");

export default Model;
