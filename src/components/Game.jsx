import React, { useEffect, useRef, useState } from "react"

const Game = () => {
	const gameContainerRef = useRef(null)
	const [gifts, setGifts] = useState([])
	const [score, setScore] = useState(0)
	const [isGameOver, setIsGameOver] = useState(false)

	const [catcherPosition, setCatcherPosition] = useState({
		x: 200,
		y: 520,
	})
	const giftWidth = 70
	const giftHeight = 30
	const catcherBagWidth = 100
	const catcherBagHeight = 100

	const [timeLeft, setTimeLeft] = useState(10)

	useEffect(() => {
		const timer =
			timeLeft > 0 &&
			setInterval(() => {
				setTimeLeft(timeLeft - 1)
			}, 1000)

		return () => clearInterval(timer)
	}, [timeLeft])

	useEffect(() => {
		if (timeLeft === 0) {
			setIsGameOver(true)
			clearInterval(giftIntervalRef.current)
			clearInterval(fallIntervalRef.current)
		}
	}, [timeLeft])

	const generateGift = () => {
		const maxX = 425 - giftWidth

		const positionX = Math.random() * maxX
		const randomOffset = Math.random() * 5 - 2
		return {
			id: Math.random(),
			posX: Math.max(0, Math.min(maxX, positionX + randomOffset)),
			posY: 0,
			caught: false,
		}
	}
	const checkCatch = gift => {
		const currentCatcherPosition = catcherPositionRef.current
		const giftCenterX = gift.posX + giftWidth / 2
		const giftCenterY = gift.posY + giftHeight / 2

		return (
			giftCenterX >= currentCatcherPosition.x &&
			giftCenterX <= currentCatcherPosition.x + catcherBagWidth &&
			giftCenterY >= currentCatcherPosition.y &&
			giftCenterY <= currentCatcherPosition.y + catcherBagHeight
		)
	}
	const giftIntervalRef = useRef(null)
	const fallIntervalRef = useRef(null)

	useEffect(() => {
		giftIntervalRef.current = setInterval(() => {
			setGifts(prevGifts => [...prevGifts, generateGift()])
		}, 300)

		return () => clearInterval(giftIntervalRef.current)
	}, [])

	useEffect(() => {
		fallIntervalRef.current = setInterval(() => {
			setGifts(prevGifts => {
				let newScore = score
				const newGifts = prevGifts.map(gift => {
					if (gift.caught) {
						return null
					}

					const newPosY = gift.posY + 14
					if (checkCatch({ ...gift, posY: newPosY })) {
						newScore++
						return { ...gift, posY: newPosY, caught: true }
					}
					return { ...gift, posY: newPosY }
				})

				if (newScore !== score) {
					setScore(newScore)
				}

				return newGifts.filter(gift => gift !== null && gift.posY < 1000)
			})
		}, 30)

		return () => clearInterval(fallIntervalRef.current)
	}, [score])

	const handleMouseMove = e => {
		const newX = Math.min(
			Math.max(e.clientX - catcherBagWidth / 2, 0),
			425 - catcherBagWidth
		)
		setCatcherPosition(prevPosition => ({ ...prevPosition, x: newX }))
	}

	const handleTouchMove = e => {
		const touch = e.touches[0]
		const newX = Math.min(
			Math.max(touch.clientX - catcherBagWidth / 2, 0),
			425 - catcherBagWidth
		)
		setCatcherPosition(prevPosition => ({ ...prevPosition, x: newX }))
	}

	const catcherPositionRef = useRef(catcherPosition)

	useEffect(() => {
		catcherPositionRef.current = catcherPosition
	}, [catcherPosition])

	const resetGame = () => {
		setGifts([])
		setScore(0)
		setTimeLeft(10)
		setIsGameOver(false)
		setCatcherPosition({ x: 200, y: 520 })

		clearInterval(giftIntervalRef.current)
		clearInterval(fallIntervalRef.current)

		giftIntervalRef.current = setInterval(() => {
			setGifts(prevGifts => [...prevGifts, generateGift()])
		}, 300)

		fallIntervalRef.current = setInterval(() => {
			setGifts(prevGifts => {
				let newScore = score
				const newGifts = prevGifts.map(gift => {
					if (gift.caught) {
						return null
					}

					const newPosY = gift.posY + 14
					if (checkCatch({ ...gift, posY: newPosY })) {
						newScore++
						return { ...gift, posY: newPosY, caught: true }
					}
					return { ...gift, posY: newPosY }
				})

				if (newScore !== score) {
					setScore(newScore)
				}

				return newGifts.filter(gift => gift !== null && gift.posY < 1000)
			})
		}, 30)
	}

	return (
		<div
			onMouseMove={handleMouseMove}
			onTouchMove={handleTouchMove}
			ref={gameContainerRef}
			className='flex w-[425px] h-screen bg-white/30'
		>
			<div className='bg-main h-fit right-0 top-2 w-full  mx-4 flex justify-center'>
				<h2 className='text-xl uppercase font-extrabold text-white'>
					Wynik:{score} | Czas: {timeLeft}s
				</h2>
			</div>
			{gifts.map((gift, index) => (
				<div
					key={gift.id}
					className='gift'
					style={{
						position: "absolute",
						left: `${gift.posX}px`,
						top: `${gift.posY}px`,
					}}
				>
					<img src='./gift.svg' alt='alt' className='w-[70px] h-[50px] ' />
				</div>
			))}
			<div
				style={{
					position: "absolute",
					left: `${catcherPosition.x}px`,
					top: `${catcherPosition.y}px`,
				}}
				className=' w-[100px] h-[100px]  justify-center items-center  bottom-0 right-0'
			>
				<img
					src='./bag.svg'
					alt='bag'
					className='w-[100px] h-[100px] bg-white/50 shadow-lg rounded-full shadow-white'
				/>
			</div>
			{isGameOver && (
				<div className='game-over flex flex-col absolute bg-red-600 w-[425px] p-8 h-screen text-4xl gap-10 justify-center items-center z-50 text-white'>
					<h2 className='uppercase font-extrabold text-main '>
						Koniec <br /> Zbierania!
					</h2>
					<p className=''>
						Dzięki Tobie mamy aż:{" "}
						<span className='font-extrabold text-5xl text-yellow-400'>
							{score}
						</span>
						prezentów!
					</p>
					<button
						className='bg-main text-2xl hover:bg-red-700 transition-colors'
						onClick={resetGame}
					>
						Zagraj jeszcze raz!
					</button>
					<img src='./bag.svg' alt='elf' className='w-44' />
				</div>
			)}
		</div>
	)
}

export default Game
