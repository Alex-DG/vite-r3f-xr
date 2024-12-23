import { Canvas } from '@react-three/fiber'
import { XR, createXRStore, XROrigin, XRDomOverlay } from '@react-three/xr'
import { useEffect, useState, useMemo } from 'react'
import Ico from './components/Ico'

const App = () => {
  // Stabilize the XR store creation
  const store = useMemo(() => createXRStore(), [])

  // Check for localhost / Dev environment
  const isLocalHost = window.location.hostname === 'localhost'

  const [isLoading, setLoading] = useState(true)
  const [isEnteredXR, setEnteredXR] = useState(false)
  const [isXRSupported, setXRSupported] = useState(isLocalHost)

  // Setup store subscription inside useEffect
  useEffect(() => {
    const unsubscribe = store.subscribe((result) => {
      console.log('📩', 'XR Store ->', { result })

      if (result.session) {
        // Only update state if it's different
        setEnteredXR((prev) => {
          if (!prev) {
            console.log('➡️', 'Enter XR')
            return true
          }
          return prev
        })
      } else {
        setEnteredXR((prev) => {
          if (prev) {
            console.log('⬅️', 'Exit XR')
            return false
          }
          return prev
        })
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [store])

  // Function to detect if WebXR API is supported
  const detectXRCompatibility = async () => {
    if (!isXRSupported) {
      if (navigator.xr) {
        const immersiveArSupported = await navigator.xr.isSessionSupported(
          'immersive-ar'
        )
        const immersiveVrSupported = await navigator.xr.isSessionSupported(
          'immersive-vr'
        )
        setXRSupported(immersiveArSupported || immersiveVrSupported)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    detectXRCompatibility()
  }, [])

  const handleEnterXR = async () => {
    try {
      await store.enterAR()
    } catch (err) {
      console.error('Failed to enter XR session:', err)
    }
  }

  const handleExitAR = async () => {
    try {
      await store.getState().session?.end()
    } catch (err) {
      console.error('Failed to exit XR session:', err)
    }
  }

  return (
    <>
      {isLoading ? (
        <div className='loading-message'>
          Checking WebXR support... please wait.
        </div>
      ) : (
        <>
          {isXRSupported ? (
            <div className='bottom-container'>
              <button className='enter-btn' onClick={handleEnterXR}>
                Enter AR
              </button>
            </div>
          ) : (
            <p className='unsupported-message'>
              WebXR is not supported on this device.
            </p>
          )}
        </>
      )}

      <Canvas>
        <XR store={store}>
          <XRDomOverlay>
            <button className='exit-btn' onClick={handleExitAR}>
              Exit XR
            </button>
          </XRDomOverlay>

          <ambientLight intensity={1} />

          <Ico position={[0, 2, 0]} />

          <XROrigin position={[0, 2, 4]} />
        </XR>
      </Canvas>
    </>
  )
}

export default App
