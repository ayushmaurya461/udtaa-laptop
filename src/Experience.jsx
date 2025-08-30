import {
  PresentationControls,
  useGLTF,
  Environment,
  Float,
  ContactShadows,
  Html,
  Text,
  useAnimations,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useControls } from "leva";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const macbookRef = useRef(null);
  const htmlGroupRef = useRef(null); // Group to contain the Html component
  const textRef = useRef(null); // Reference to the Float component's group
  const [enabledFloat, setEnabledFloat] = useState(true);

  const macbook = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf"
  );

//   const { scene: wizard, animations } = useGLTF(
//     "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/druid/model.gltf"
//   );

//   const { actions } = useAnimations(animations, wizard);

  useEffect(() => {
    // Cleanup function to kill ScrollTriggers
    const cleanup = () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };

    // Wait for next frame to ensure refs are ready
    const timer = setTimeout(() => {
      if (!macbookRef.current || !htmlGroupRef.current) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scroll-section",
          start: "top top",
          end: "+=5000",
          scrub: 3,
          pin: true,
          onUpdate: (self) => {
            macbookRef.current.position.x < -2.1
              ? setEnabledFloat(false)
              : setEnabledFloat(true);
          },
        },
      });

      // Animate the MacBook (primitive object)
      tl.to(htmlGroupRef.current.position, {
        x: -2.0,
        y: 0.08,
        z: 2.09,
        duration: 1,
        ease: "power2.inOut",
      }).to(
        htmlGroupRef.current.rotation,
        {
          x: -3.1,
          y: -2.4,
          z: -3.0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            // console.log(wizard)
          },
        },
        0
      );
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [macbook.scene]); // Add dependency to ensure it runs when model loads

  return (
    <>
      <Environment preset="city" />
      <color args={["#f57242"]} attach="background" />

      {/* <primitive object={wizard} position={[-2.5, -0.2, 0]} /> */}

      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <Float enabled={enabledFloat} floatIntensity={0.4}>
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            rotation={[0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
            color={"#8B0000"}
          />

          <group ref={htmlGroupRef}>
            <primitive
              ref={macbookRef}
              object={macbook.scene}
              position-y={-1.2}
            />

            {/* Wrap Html in a group for better control */}
            <Html
              transform
              wrapperClass="html-screen"
              distanceFactor={1.17}
              position={[0.015, 0.35, -1.4]}
              rotation={[-0.256, 0, 0]}
              style={{
                width: "1024px",
                height: "670px",
                border: "1px solid #333",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <iframe
                src="https://itsayush461.web.app"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "10px",
                }}
              />
            </Html>
          </group>

          <Text
            font="./bangers-v20-latin-regular.woff"
            fontSize={0.5}
            ref={textRef}
            color={"#f2dce0"}
            position={[2, 0.55, 0.75]}
            rotation-y={-1.75}
            maxWidth={4}
            textAlign="center"
          >
            Ayush Maurya Frontend Developer
          </Text>
        </Float>
      </PresentationControls>

      <ContactShadows position-y={-1.4} scale={5} opacity={0.4} blur={2.4} />
    </>
  );
}
