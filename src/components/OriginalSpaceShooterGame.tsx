'use client'

import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'

// Import game classes (we'll create these)
import { App } from '@/game/App'
import { loadTexturesAsync } from '@/game/loadTexturesAsync'

// Import images - we'll need to add these to public folder
const asteroidImagePath = '/game-assets/asteroids.png'
const shipImagePath = '/game-assets/Spaceship_Asset.png'
const bgImagePath = '/game-assets/Blue_Nebula_5.png'
const explosionImagePath = '/game-assets/circle_explosion.png'

export default function OriginalSpaceShooterGame() {
    const canvasRef = useRef<HTMLDivElement>(null)
    const appRef = useRef<PIXI.Application | null>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const initGame = async () => {
            if (!canvasRef.current) return;

            const config = {
                backgroundColor: 0x000000,
                resizeTo: canvasRef.current,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                antialias: true,
            }

            const pixiApp = new PIXI.Application(config)
            pixiApp.stage.sortableChildren = true
            canvasRef.current.appendChild(pixiApp.view)
            appRef.current = pixiApp

            // Load textures
            const textures = [
                { name: 'asteroid', url: asteroidImagePath },
                { name: 'ship', url: shipImagePath },
                { name: 'background', url: bgImagePath },
                { name: 'explosion', url: explosionImagePath },
            ]

            const onProgress = (loader: PIXI.Loader) => {
                console.log(`Loading: ${loader.progress}%`)
            }

            try {
                await loadTexturesAsync({ textures, loader: pixiApp.loader, onProgress })

                // Initialize the game app
                new App(pixiApp)

                // Add PIXI to window for debugging
                if (typeof window !== 'undefined') {
                    (window as any).PIXI = PIXI
                }
            } catch (error) {
                console.error('Failed to load game assets:', error)
            }
        }

        initGame()

        return () => {
            if (appRef.current) {
                appRef.current.destroy(true)
            }
        }
    }, [])

    return (
        <div className="w-full h-full relative">
            <div
                ref={canvasRef}
                className="game-canvas"
            />
        </div>
    )
}
