/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, CSSProperties, MouseEvent } from 'react';
import { SpatialPhysics, PhysicsBehavior } from '../types/shapeshifter';

/**
 * Default fallback spatial physics if a student doesn't specify one
 */
export const DEFAULT_SPATIAL_PHYSICS: SpatialPhysics = {
  behavior: 'tactile-damped',
  tension: 180,
  friction: 22,
  mass: 1.0,
  transitionTimingFunction: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
  transitionDuration: '380ms',
  hoverTransform: 'translateY(-6px) scale(1.02)',
  perspectiveDepth: '1000px',
  particleDriftSpeed: 1.0,
  description: 'Balanced physical damping with tactile settle',
};

/**
 * Utility function to compute CSS properties based on a student's spatialPhysics
 */
export function getSpatialPhysicsStyles(spatialPhysics?: SpatialPhysics): {
  containerStyle: CSSProperties;
  baseCardStyle: CSSProperties;
  physicsInfo: {
    name: string;
    behavior: PhysicsBehavior;
    tension: number;
    friction: number;
    mass: number;
    duration: string;
    timingFunction: string;
    description: string;
  };
} {
  const physics = spatialPhysics || DEFAULT_SPATIAL_PHYSICS;
  const tension = physics.tension ?? 180;
  const friction = physics.friction ?? 22;
  const mass = physics.mass ?? 1.0;
  const duration = physics.transitionDuration || '380ms';
  const timing = physics.transitionTimingFunction || 'cubic-bezier(0.2, 0.9, 0.3, 1)';
  const perspective = physics.perspectiveDepth || '1000px';

  // Behavior-specific human-readable names
  const behaviorTitles: Record<PhysicsBehavior, string> = {
    'spring-elastic': 'Spring Elastic (High Rebound)',
    'gravitational-slow': 'Gravitational Slow (Floating Inertia)',
    'crystalline-snappy': 'Crystalline Snappy (Instant Refraction)',
    'tactile-damped': 'Tactile Damped (Material Settle)',
    'fluid-wave': 'Fluid Wave (Harmonic Drift)',
    'kinetic-magnetic': 'Kinetic Magnetic (Tension Snap)',
  };

  const containerStyle: CSSProperties & Record<string, string | number> = {
    '--physics-ease': timing,
    '--physics-duration': duration,
    '--physics-hover-transform': physics.hoverTransform,
    '--perspective-depth': perspective,
    perspective: perspective,
    transition: `background-color ${duration} ${timing}, color ${duration} ${timing}`,
  };

  const baseCardStyle: CSSProperties = {
    transitionProperty: 'transform, box-shadow, border-color, background-color, opacity',
    transitionDuration: duration,
    transitionTimingFunction: timing,
    transformStyle: 'preserve-3d',
    willChange: 'transform, box-shadow',
  };

  return {
    containerStyle,
    baseCardStyle,
    physicsInfo: {
      name: behaviorTitles[physics.behavior] || physics.behavior,
      behavior: physics.behavior,
      tension,
      friction,
      mass,
      duration,
      timingFunction: timing,
      description: physics.description || 'Spatial physical translation model',
    },
  };
}

/**
 * Custom React hook for dynamic spring physics and interactive transforms in student worlds
 */
export function useSpatialPhysics(spatialPhysics?: SpatialPhysics) {
  const physics = useMemo(() => spatialPhysics || DEFAULT_SPATIAL_PHYSICS, [spatialPhysics]);

  // Track dynamic tilt/spring state per card index
  const [activeCardTransforms, setActiveCardTransforms] = useState<
    Record<number, { rotateX: number; rotateY: number; translateZ: number; isPressed: boolean }>
  >({});

  const { containerStyle, baseCardStyle, physicsInfo } = useMemo(
    () => getSpatialPhysicsStyles(physics),
    [physics]
  );

  /**
   * Generates interactive spring handlers for individual artefact cards
   */
  const getInteractiveSpringProps = (index: number) => {
    const cardState = activeCardTransforms[index] || {
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      isPressed: false,
    };

    // Calculate spring responsiveness based on mass and tension
    const tiltMultiplier = (physics.tension || 180) / 20; // e.g. 180 / 20 = 9 deg max tilt
    const massFactor = 1 / (physics.mass || 1.0);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      // Invert Y for 3D tilt
      const rotateX = -relativeY * tiltMultiplier * massFactor;
      const rotateY = relativeX * tiltMultiplier * massFactor;

      setActiveCardTransforms((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          rotateX,
          rotateY,
          translateZ: cardState.isPressed ? 5 : 20,
          isPressed: prev[index]?.isPressed || false,
        },
      }));
    };

    const handleMouseEnter = () => {
      setActiveCardTransforms((prev) => ({
        ...prev,
        [index]: {
          rotateX: 0,
          rotateY: 0,
          translateZ: 15,
          isPressed: false,
        },
      }));
    };

    const handleMouseLeave = () => {
      // Return smoothly to rest state
      setActiveCardTransforms((prev) => ({
        ...prev,
        [index]: {
          rotateX: 0,
          rotateY: 0,
          translateZ: 0,
          isPressed: false,
        },
      }));
    };

    const handleMouseDown = () => {
      // Spring compression on press
      setActiveCardTransforms((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          translateZ: -5,
          isPressed: true,
        },
      }));
    };

    const handleMouseUp = () => {
      // Spring rebound
      setActiveCardTransforms((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          translateZ: 20,
          isPressed: false,
        },
      }));
    };

    // Compose dynamic transform style
    const dynamicTransform: CSSProperties = {
      ...baseCardStyle,
      transform: cardState.isPressed
        ? `perspective(${physics.perspectiveDepth || '1000px'}) rotateX(${cardState.rotateX * 0.5}deg) rotateY(${cardState.rotateY * 0.5}deg) scale(0.98) translateZ(${cardState.translateZ}px)`
        : cardState.translateZ > 0
        ? `perspective(${physics.perspectiveDepth || '1000px'}) rotateX(${cardState.rotateX}deg) rotateY(${cardState.rotateY}deg) ${physics.hoverTransform} translateZ(${cardState.translateZ}px)`
        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
    };

    return {
      style: dynamicTransform,
      onMouseEnter: handleMouseEnter,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
    };
  };

  return {
    containerStyle,
    baseCardStyle,
    physicsInfo,
    getInteractiveSpringProps,
  };
}
