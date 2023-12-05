import React, { useEffect, useState } from "react"

const Game = () => {
	const [gifts, setGifts] = useState([])
	const [score, setScore] = useState(0)
	const [catcherPosition, setCatcherPosition] = useState({
		x: window.innerWidth / 2,
		y: window.innerHeight - 140,
	})

	const generateGift = () => {
		const positionX = Math.random() * window.innerWidth
		return {
			id: Math.random(),
			posX: positionX,
			posY: 0,
			caught: false,
		}
	}
	const checkCatch = gift => {
		const catcherBagWidth = 80
		const catcherBagHeight = 60
		return (
			gift.posX >= catcherPosition.x - catcherBagWidth / 2 &&
			gift.posX <= catcherPosition.x + catcherBagWidth / 2 &&
			gift.posY >= catcherPosition.y - catcherBagHeight / 2 &&
			gift.posY <= catcherPosition.y + catcherBagHeight / 2
		)
	}

	useEffect(() => {
		const intervalDuration = 2000
		const interval = setInterval(() => {
			setGifts(prevGifts => [...prevGifts, generateGift()])
		}, intervalDuration)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		const fallInterval = setInterval(() => {
			setGifts(prevGifts => {
				const newGifts = prevGifts.map(gift => {
					const newPosY = gift.posY + 8
					const isCaught = checkCatch({ ...gift, posY: newPosY })

					if (isCaught) {
						setScore(prevScore => prevScore + 1)
					}

					return isCaught ? null : { ...gift, posY: newPosY }
				})

				return newGifts.filter(gift => gift !== null)
			})
		}, 50)

		return () => clearInterval(fallInterval)
	}, [])

	const handleMouseMove = e => {
		const catcherBagWidth = 100

		const newX = Math.min(
			Math.max(e.clientX - catcherBagWidth / 2, 0),
			window.innerWidth - catcherBagWidth
		)
		setCatcherPosition({ x: newX, y: catcherPosition.y })
	}
	const handleTouchMove = e => {
		const catcherBagWidth = 1

		const touch = e.touches[0]
		const newX = Math.min(
			Math.max(touch.clientX - catcherBagWidth / 2, 0),
			window.innerWidth - catcherBagWidth
		)
		setCatcherPosition({ x: newX, y: touch.clientY })
	}
	return (
		<div
			onMouseMove={handleMouseMove}
			onTouchMove={handleTouchMove}
			className='w-full'
		>
			<div className='bg-white absolute right-0 top-2 w-full '>
				<h2 className='text-xl uppercase font-extrabold text-red-800'>
					Wynik:{score}
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
					<img src='./src/assets/gift.svg' alt='alt' className='w-32 h-10 ' />
				</div>
			))}
			<div
				style={{
					position: "absolute",
					left: `${catcherPosition.x}px`,
					top: `${catcherPosition.y}px`,
				}}
				className='flex justify-center items-center catcherBag bg-blue'
				// onClick={() => handleCatching()}
			>
				<img
					src='./src/assets/bag.svg'
					alt='bag'
					className='w-36 bg-white shadow-lg rounded-full shadow-white'
				/>
			</div>
		</div>
	)
}

export default Game
