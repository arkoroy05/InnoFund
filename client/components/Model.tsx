import React, { useRef } from "react";
import { useGLTF, Text, MeshTransmissionMaterial } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";


export function Model() {
  const { nodes } = useGLTF("/medias/torrus.glb");
  const { viewport } = useThree();
  const torus = useRef(null);
  useFrame(() => {
    torus.current.rotation.x += 0.01
  });
  const materialProps = {
    thickness: 0.80,
    roughness: 0.4,
    transmission: 1.0,
    ior: 1.1,
    chromaticAberration: 0.15,
    backside: true
  }
  console.log(nodes);
  return (
    <group dispose={null} scale={viewport.width / 2.5}>
      <Text position={[0, 0, -1]} fontSize={viewport.width*0.077} color="#bef264" anchorX="center" anchorY="middle" font={'/fonts/CSCalebMono-Regular.otf'} >
        INNOFUND
        </Text>

      <mesh ref={torus} {...nodes.Torus002}>
        <MeshTransmissionMaterial {...materialProps}/>
      </mesh>
    </group>
  );
}

useGLTF.preload("/medias/torrus5.glb");

export default Model