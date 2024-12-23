import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

const Ico = (props: JSX.IntrinsicElements['mesh']) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(null)
  // Hold state for hovered and clicked events
  const [hovered, setHover] = useState(false)
  const [clicked, setClick] = useState(false)

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_, delta) => {
    if (!ref.current) return

    ref.current.rotation.x += delta
    ref.current.rotation.z += delta
  })

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 0.5 : 1}
      pointerEventsType={{ deny: 'grab' }}
      onClick={() => setClick(!clicked)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={hovered ? 'hotpink' : 'white'} wireframe />
    </mesh>
  )
}

export default Ico
