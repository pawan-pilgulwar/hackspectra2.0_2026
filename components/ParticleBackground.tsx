"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";

export default function ParticleBackground() {
    const [init, setInit] = useState(false);

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            // this loads the slim version of @tsparticles/slim for smaller bundle size
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container?: Container): Promise<void> => {
        console.log(container);
    };

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={{
                background: { color: { value: "transparent" } },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "repulse" },
                        onClick: { enable: true, mode: "push" },
                    },
                    modes: {
                        repulse: { distance: 120, duration: 0.45 },
                        push: { quantity: 2 },
                    },
                },
                particles: {
                    color: { value: ["#e9d8c8", "#ff8fb0", "#9fbcd4"] },
                    stroke: { width: 0.6, color: "#e9d8c8" },
                    links: {
                        color: "#e9d8c8",
                        distance: 160,
                        enable: true,
                        opacity: 0.28,
                        width: 1.4,
                    },
                    move: {
                        enable: true,
                        speed: 0.6,
                        direction: "none",
                        random: true,
                        straight: false,
                        outModes: { default: "out" },
                    },
                    number: {
                        density: { enable: true },
                        value: 80,
                    },
                    opacity: {
                        value: { min: 0.18, max: 0.6 },
                    },
                    shape: { type: "circle" },
                    size: { value: { min: 1.5, max: 4 } },
                },
                detectRetina: true,
            }}
            className="absolute inset-0 z-0"
        />
    );
}

