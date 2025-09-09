'use client'

import { useEffect, useRef, useState } from 'react'
import * as PIXI from 'pixi.js'

interface GameStats {
    score: number
    asteroidsDestroyed: number
    isPlaying: boolean
    hp: number
    maxHp: number
    gameOver: boolean
}

// Extended Graphics interface for game objects
interface GameGraphics extends PIXI.Graphics {
    vx?: number
    vy?: number
    rotationSpeed?: number
    life?: number
}

export default function SpaceShooterGame() {
    const canvasRef = useRef<HTMLDivElement>(null)
    const appRef = useRef<PIXI.Application | null>(null)
    const gameStateRef = useRef<any>(null)
    const [gameStats, setGameStats] = useState<GameStats>({
        score: 0,
        asteroidsDestroyed: 0,
        isPlaying: false,
        hp: 4,
        maxHp: 4,
        gameOver: false
    })

    useEffect(() => {
        if (!canvasRef.current) return

        // Initialize PIXI Application
        const app = new PIXI.Application()
        appRef.current = app

        const initGame = async () => {
            await app.init({
                width: 800,
                height: 600,
                backgroundColor: 0x000011,
                antialias: true
            })

            canvasRef.current?.appendChild(app.canvas)

            // Game objects
            const gameState = {
                ship: null as GameGraphics | null,
                asteroids: [] as GameGraphics[],
                bullets: [] as GameGraphics[],
                keys: {
                    space: false
                },
                mouse: {
                    x: 400,
                    y: 300
                },
                mousePressed: false,
                thruster: null as GameGraphics | null,
                score: 0,
                hp: 4,
                maxHp: 4,
                isPlaying: true,
                gameOver: false,
                invulnerable: false,
                invulnerabilityTimer: 0
            }

            gameStateRef.current = gameState

            // Create spaceship
            const ship = new PIXI.Graphics() as GameGraphics
            ship.fill(0xFFFFFF)
            ship.poly([
                0, -15,
                -8, 10,
                0, 5,
                8, 10
            ])
            ship.fill()
            ship.x = 400
            ship.y = 300
            app.stage.addChild(ship)
            gameState.ship = ship

            // Create thruster
            const thruster = new PIXI.Graphics() as GameGraphics
            thruster.fill(0xFF6600)
            thruster.poly([
                0, 15,
                -4, 25,
                0, 30,
                4, 25
            ])
            thruster.fill()
            thruster.x = ship.x
            thruster.y = ship.y
            thruster.visible = false
            app.stage.addChild(thruster)
            gameState.thruster = thruster

            // Create initial asteroids
            for (let i = 0; i < 8; i++) {
                createAsteroid()
            }

            function createAsteroid() {
                const asteroid = new PIXI.Graphics() as GameGraphics
                const sides = 8 + Math.floor(Math.random() * 4)
                const radius = 20 + Math.random() * 30

                asteroid.fill(0x888888)

                const points = []
                for (let i = 0; i < sides; i++) {
                    const angle = (i / sides) * Math.PI * 2
                    const r = radius * (0.8 + Math.random() * 0.4)
                    points.push(Math.cos(angle) * r, Math.sin(angle) * r)
                }
                asteroid.poly(points)
                asteroid.fill()

                // Random position at edge of screen
                const edge = Math.floor(Math.random() * 4)
                switch (edge) {
                    case 0: // top
                        asteroid.x = Math.random() * 800
                        asteroid.y = -50
                        break
                    case 1: // right
                        asteroid.x = 850
                        asteroid.y = Math.random() * 600
                        break
                    case 2: // bottom
                        asteroid.x = Math.random() * 800
                        asteroid.y = 650
                        break
                    case 3: // left
                        asteroid.x = -50
                        asteroid.y = Math.random() * 600
                        break
                }

                // Random velocity toward center
                const centerX = 400
                const centerY = 300
                const dx = centerX - asteroid.x
                const dy = centerY - asteroid.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                const speed = 0.5 + Math.random() * 1.5
                asteroid.vx = (dx / distance) * speed
                asteroid.vy = (dy / distance) * speed
                asteroid.rotation = Math.random() * Math.PI * 2
                asteroid.rotationSpeed = (Math.random() - 0.5) * 0.1

                app.stage.addChild(asteroid)
                gameState.asteroids.push(asteroid)
            }

            function createBullet(x: number, y: number, angle: number) {
                const bullet = new PIXI.Graphics() as GameGraphics
                bullet.fill(0xFFFF00)
                bullet.circle(0, 0, 3)
                bullet.fill()
                bullet.x = x
                bullet.y = y

                const speed = 8
                bullet.vx = Math.cos(angle) * speed
                bullet.vy = Math.sin(angle) * speed
                bullet.life = 60 // frames

                app.stage.addChild(bullet)
                gameState.bullets.push(bullet)
            }

            // Input handlers
            window.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                    e.preventDefault()
                    gameState.keys.space = true
                }
            })

            window.addEventListener('keyup', (e) => {
                if (e.code === 'Space') {
                    e.preventDefault()
                    gameState.keys.space = false
                }
            })

            const handleMouseMove = (e: MouseEvent) => {
                const rect = app.canvas.getBoundingClientRect()
                gameState.mouse.x = e.clientX - rect.left
                gameState.mouse.y = e.clientY - rect.top
            }

            const handleMouseDown = () => {
                gameState.mousePressed = true
            }

            const handleMouseUp = () => {
                gameState.mousePressed = false
            }

            app.canvas.addEventListener('mousemove', handleMouseMove)
            app.canvas.addEventListener('mousedown', handleMouseDown)
            app.canvas.addEventListener('mouseup', handleMouseUp)

            // Game loop
            app.ticker.add(() => {
                if (!gameState.isPlaying || gameState.gameOver) return

                const ship = gameState.ship!
                const thruster = gameState.thruster!

                // Update invulnerability timer
                if (gameState.invulnerable) {
                    gameState.invulnerabilityTimer--
                    if (gameState.invulnerabilityTimer <= 0) {
                        gameState.invulnerable = false
                        ship.alpha = 1 // Reset alpha when invulnerability ends
                    } else {
                        // Flashing effect during invulnerability
                        ship.alpha = Math.sin(gameState.invulnerabilityTimer * 0.3) * 0.5 + 0.5
                    }
                }

                // Ship rotation to follow mouse
                const dx = gameState.mouse.x - ship.x
                const dy = gameState.mouse.y - ship.y
                ship.rotation = Math.atan2(dy, dx) + Math.PI / 2

                // Thruster
                if (gameState.keys.space) {
                    thruster.visible = true
                    const thrust = 0.3
                    ship.vx = (ship.vx || 0) + Math.cos(ship.rotation - Math.PI / 2) * thrust
                    ship.vy = (ship.vy || 0) + Math.sin(ship.rotation - Math.PI / 2) * thrust
                } else {
                    thruster.visible = false
                }

                // Apply friction
                ship.vx = (ship.vx || 0) * 0.98
                ship.vy = (ship.vy || 0) * 0.98

                // Move ship
                ship.x += ship.vx || 0
                ship.y += ship.vy || 0

                // Keep ship on screen
                if (ship.x < 0) ship.x = 800
                if (ship.x > 800) ship.x = 0
                if (ship.y < 0) ship.y = 600
                if (ship.y > 600) ship.y = 0

                // Update thruster position
                thruster.x = ship.x
                thruster.y = ship.y
                thruster.rotation = ship.rotation

                // Shooting
                if (gameState.mousePressed && app.ticker.lastTime % 10 < 5) {
                    createBullet(ship.x, ship.y, ship.rotation - Math.PI / 2)
                }

                // Update bullets
                for (let i = gameState.bullets.length - 1; i >= 0; i--) {
                    const bullet = gameState.bullets[i]
                    bullet.x += bullet.vx || 0
                    bullet.y += bullet.vy || 0
                    bullet.life = (bullet.life || 0) - 1

                    if ((bullet.life || 0) <= 0 || bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 600) {
                        app.stage.removeChild(bullet)
                        gameState.bullets.splice(i, 1)
                    }
                }

                // Update asteroids
                for (let i = gameState.asteroids.length - 1; i >= 0; i--) {
                    const asteroid = gameState.asteroids[i]
                    asteroid.x += asteroid.vx || 0
                    asteroid.y += asteroid.vy || 0
                    asteroid.rotation += asteroid.rotationSpeed || 0

                    // Remove asteroids that are too far off screen
                    if (asteroid.x < -100 || asteroid.x > 900 || asteroid.y < -100 || asteroid.y > 700) {
                        app.stage.removeChild(asteroid)
                        gameState.asteroids.splice(i, 1)
                        createAsteroid() // Replace with new one
                    }
                }

                // Collision detection
                for (let i = gameState.bullets.length - 1; i >= 0; i--) {
                    const bullet = gameState.bullets[i]

                    for (let j = gameState.asteroids.length - 1; j >= 0; j--) {
                        const asteroid = gameState.asteroids[j]

                        const dx = bullet.x - asteroid.x
                        const dy = bullet.y - asteroid.y
                        const distance = Math.sqrt(dx * dx + dy * dy)

                        if (distance < 25) {
                            // Remove bullet and asteroid
                            app.stage.removeChild(bullet)
                            app.stage.removeChild(asteroid)
                            gameState.bullets.splice(i, 1)
                            gameState.asteroids.splice(j, 1)

                            // Update score
                            gameState.score += 10

                            // Create new asteroid
                            createAsteroid()

                            break
                        }
                    }
                }

                // Ship-Asteroid collision detection
                if (!gameState.invulnerable && !gameState.gameOver) {
                    for (let i = gameState.asteroids.length - 1; i >= 0; i--) {
                        const asteroid = gameState.asteroids[i]

                        const dx = ship.x - asteroid.x
                        const dy = ship.y - asteroid.y
                        const distance = Math.sqrt(dx * dx + dy * dy)

                        if (distance < 30) { // Ship collision radius
                            // Take damage
                            gameState.hp--
                            gameState.invulnerable = true
                            gameState.invulnerabilityTimer = 120 // 2 seconds at 60fps

                            // Remove the asteroid that hit the ship
                            app.stage.removeChild(asteroid)
                            gameState.asteroids.splice(i, 1)
                            createAsteroid() // Replace with new one

                            // Check for game over
                            if (gameState.hp <= 0) {
                                gameState.gameOver = true
                                gameState.isPlaying = false
                                ship.alpha = 0.5 // Make ship semi-transparent when dead
                            }

                            break
                        }
                    }
                }

                // Update game stats
                setGameStats({
                    score: gameState.score,
                    asteroidsDestroyed: Math.floor(gameState.score / 10),
                    isPlaying: gameState.isPlaying,
                    hp: gameState.hp,
                    maxHp: gameState.maxHp,
                    gameOver: gameState.gameOver
                })
            })

            setGameStats(prev => ({
                ...prev,
                isPlaying: true,
                hp: 4,
                maxHp: 4,
                gameOver: false
            }))
        }

        initGame()

        return () => {
            if (appRef.current) {
                appRef.current.destroy(true)
            }
        }
    }, [])

    const resetGame = () => {
        if (gameStateRef.current) {
            gameStateRef.current.score = 0
            gameStateRef.current.hp = 4
            gameStateRef.current.isPlaying = true
            gameStateRef.current.gameOver = false
            gameStateRef.current.invulnerable = false
            gameStateRef.current.invulnerabilityTimer = 0

            // Reset ship appearance
            if (gameStateRef.current.ship) {
                gameStateRef.current.ship.alpha = 1
            }

            setGameStats({
                score: 0,
                asteroidsDestroyed: 0,
                isPlaying: true,
                hp: 4,
                maxHp: 4,
                gameOver: false
            })
        }
    }

    return (
        <div className="flex flex-col items-center">
            {/* Game Stats */}
            <div className="flex justify-between w-full max-w-3xl mb-4 text-white flex-wrap gap-2">
                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                    <span className="text-yellow-400 font-bold">Điểm: </span>
                    <span className="text-xl">{gameStats.score}</span>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                    <span className="text-green-400 font-bold">Thiên thạch: </span>
                    <span className="text-xl">{gameStats.asteroidsDestroyed}</span>
                </div>

                {/* HP Display */}
                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                    <span className="text-red-400 font-bold">HP: </span>
                    <span className="text-xl">
                        {Array.from({ length: gameStats.maxHp }, (_, i) => (
                            <span
                                key={i}
                                className={`inline-block mx-1 ${i < gameStats.hp ? 'text-red-500' : 'text-gray-600'
                                    }`}
                            >
                                ❤️
                            </span>
                        ))}
                    </span>
                    <span className="text-sm ml-2">({gameStats.hp}/{gameStats.maxHp})</span>
                </div>

                <button
                    onClick={resetGame}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${gameStats.gameOver
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {gameStats.gameOver ? '💀 Game Over - Reset' : '🔄 Reset Game'}
                </button>
            </div>

            {/* Game Canvas */}
            <div
                ref={canvasRef}
                className="border-2 border-gray-600 rounded-lg overflow-hidden"
                style={{ width: '800px', height: '600px' }}
            />

            {/* Game Status */}
            <div className="mt-4 text-center text-gray-300">
                {gameStats.gameOver ? (
                    <div className="bg-red-900/50 border border-red-600 rounded-lg p-4 max-w-md">
                        <p className="text-red-400 text-xl font-bold mb-2">💀 GAME OVER!</p>
                        <p className="text-gray-300 mb-2">Tàu vũ trụ của bạn đã bị phá hủy!</p>
                        <p className="text-yellow-400">Điểm số cuối: <span className="font-bold">{gameStats.score}</span></p>
                        <p className="text-green-400">Thiên thạch đã phá hủy: <span className="font-bold">{gameStats.asteroidsDestroyed}</span></p>
                    </div>
                ) : gameStats.isPlaying ? (
                    <div className="space-y-2">
                        <p className="text-green-400">🎮 Game đang chạy - Chúc bạn chơi vui vẻ!</p>
                        {gameStats.hp <= 1 && (
                            <p className="text-red-400 animate-pulse">⚠️ CẢNH BÁO: HP thấp! Tránh thiên thạch!</p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-400">⏸️ Game đã tạm dừng</p>
                )}
            </div>
        </div>
    )
}
