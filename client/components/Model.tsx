import React, { useRef } from "react";
import { useGLTF, Text, MeshTransmissionMaterial } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";

export function Model() {
  const { nodes } = useGLTF("/medias/torrus.glb");
  const { viewport } = useThree();
  const torus = useRef(null);
  useFrame(() => {
    torus.current.rotation.x += 0.015;
  });
  const materialProps = {
    thickness: 0.9,
    roughness: 0.5,
    transmission: 1.0,
    ior: 1.05,
    chromaticAberration: 0.2,
    backside: false,
  };
  console.log(nodes);
  return (
    <group dispose={null} scale={viewport.width / 2.9}>
      <Text
        position={[0, 0, -1]}
        fontSize={viewport.width * 0.08}
        color="#5b21b6"
        anchorX="center"
        anchorY="middle"
        strokeWidth={0.02}
        strokeColor="#8b5cf6"
        strokeOpacity={0.8}
        fillOpacity={0.3}
        font={"/fonts/CSCalebMono-Regular.otf"}
      >
        INNOFUND
      </Text>

      <mesh ref={torus} {...nodes.Torus002}>
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/medias/torrus5.glb");

export default Model;
