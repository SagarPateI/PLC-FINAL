import React from "react";
import { useBox } from "@react-three/cannon";
import { useThree, useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "./useKeyControls";
import { Vector3 } from "three";
import * as THREE from '/node_modules/three/build/three.module.js';

const SPEED = 6;

export function Block(props) { 
    const { camera } = useThree();
    const { moveForward, moveBackward, moveLeft, moveRight } =
    useKeyboardControls();
    
    const [ref, api] = useBox(() => ({
    mass: 1,
    position: props.position,
    args: [1,1,1],
  }));
    const velocity = React.useRef([0, 0, 0]);
    React.useEffect(() => {
        api.velocity.subscribe((v) => (velocity.current = v));
    }, [api.velocity]);

    useFrame(() => {
      const offset = new Vector3(5,5,5);
      //camera.position.copy(ref.current.position.add(offset));
      
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
    
      api.velocity.set(direction.x, Number(), direction.z);
      ref.current.getWorldPosition(ref.current.position);
    });

  return (
    <mesh ref={ref}>
            <boxBufferGeometry attach="geometry" />
            <meshLambertMaterial attach="material" color= "purple" />
    </mesh>
  )
}