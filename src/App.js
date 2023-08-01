import React, { useRef, useEffect } from "react"; // Import useEffect from React
import * as THREE from '../node_modules/three/build/three.module.js';
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { Block } from "./components/block";
import { OrbitControls, Stats, Text, Stars } from "@react-three/drei";
import ErrorBoundary from "./ErrorBoundary"; // Import the ErrorBoundary component
import './styles.css'

export default function App() {

  return (
    <ErrorBoundary>
      {" "}
      {/* Wrap the entire application with ErrorBoundary */}
      <div className="App">
      <Canvas
        const camera={{ position: [0, 3, 5], fov: 75 }} // Adjust the FOV to a higher value
      >
      <OrbitControls />
        <Stars />
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[10, 20, 5]}
          intensity={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <Physics>
            <Block position={[0, 1, 0]} castShadow receiveShadow />
            <Floor position={[0, -0.5, 0]} receiveShadow />
        </Physics>
      </Canvas>
      </div>
    </ErrorBoundary>
  );
}

function Floor(props) {
  const [floorRef] = usePlane(() => ({
    type: "Static",
    position: [0, -0.5, 0], // Update the position here to bring it closer to the cube
    rotation: [-Math.PI / 2, 0, 0]
  }));

  return (
    <mesh ref={floorRef}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightgray" />
    </mesh>
  );
}
