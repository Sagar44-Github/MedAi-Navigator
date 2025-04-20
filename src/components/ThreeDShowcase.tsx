"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeDShowcase: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0e1a2b");

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00bfff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Geometry
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x00bfff,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      reflectivity: 1,
      transmission: 0.5,
      thickness: 0.5,
    });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    // Animation
    let frameId: number;
    const animate = () => {
      knot.rotation.x += 0.01;
      knot.rotation.y += 0.013;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Responsive
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "1.5rem",
        overflow: "hidden",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
      aria-label="3D Showcase"
    />
  );
};

export default ThreeDShowcase;
