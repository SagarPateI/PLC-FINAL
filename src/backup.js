import React, { useRef, useEffect } from "react"; // Import useEffect from React
import { useThree, Canvas, useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { useKeyboardControls } from "./components/useKeyControls";
import { Vector3 } from "three";
import ErrorBoundary from "./ErrorBoundary"; // Import the ErrorBoundary component

export default function App() {

  return (
    <ErrorBoundary>
      {" "}
      {/* Wrap the entire application with ErrorBoundary */}
      <Canvas
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Physics>
            <Box position={[0, 1, 0]} />
            <Floor position={[0, -0.5, 0]} />
        </Physics>
      </Canvas>
    </ErrorBoundary>
  );
}

const SPEED = 6;

function Box(props) {
  const { camera } = useThree();
  const { moveForward, moveBackward, moveLeft, moveRight } =
      useKeyboardControls();
  const [boxRef, api] = useBox(() => ({
      mass: 1,
      position: props.position,
      args: [1,1,1],
  }));
  const velocity = React.useRef([0, 0, 0]);
  React.useEffect(() => {
      api.velocity.subscribe((v) => (velocity.current = v));
  }, [api.velocity]);

  useFrame(() => {
      camera.position.copy(boxRef.current.position);
      const direction = new Vector3();

      const frontVector = new Vector3(
          0,
          0,
          Number(moveBackward) - Number(moveForward)
      );
      const sideVector = new Vector3(
          Number(moveLeft) - Number(moveRight),
          0,
          0
      );
      direction
          .subVectors(frontVector, sideVector)
          .normalize()
          .multiplyScalar(SPEED)
          .applyEuler(camera.rotation);

      api.velocity.set(direction.x, velocity.current[1], direction.z);
      boxRef.current.getWorldPosition(boxRef.current.position);
  });

  return (
      <>
          <mesh ref={boxRef} />
              <boxGeometry />
              <meshStandardMaterial color="red" />

      </>
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