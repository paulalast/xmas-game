import React, { useEffect, useRef, useState } from "react"

const Game = () => {
	const gameContainerRef = useRef(null)
	const [gifts, setGifts] = useState([])
	const [score, setScore] = useState(0)
	const [catcherPosition, setCatcherPosition] = useState({
		x: 200,
		y: 800,
	})
	const giftWidth = 100
	const giftHeight = 70
	const catcherBagWidth = 144
	const catcherBagHeight = 144

	const generateGift = () => {
		const maxX = 425 - giftWidth

		const positionX = Math.random() * maxX
		console.log(" prezent na  X:", positionX)

		return {
			id: Math.random(),
			posX: positionX,
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
				let caughtNewGift = false
				const newGifts = prevGifts.map(gift => {
					const newPosY = gift.posY + 8
					if (!gift.caught) {
						if (checkCatch({ ...gift, posY: newPosY })) {
							caughtNewGift = true
							return { ...gift, posY: newPosY, caught: true }
						}
					}
					return { ...gift, posY: newPosY }
				})

				if (caughtNewGift) {
					setScore(prevScore => prevScore + 1)
				}

				return newGifts.filter(gift => !gift.caught)
			})
		}, 50)

		return () => clearInterval(fallInterval)
	}, [])
	const handleMouseMove = e => {
		const newX = Math.min(
			Math.max(e.clientX - catcherBagWidth / 2, 0),
			425 - catcherBagWidth
		)
		setCatcherPosition({ ...catcherPosition, x: newX })
		console.log("Nowa pozycja catchera:", newX)
	}

	const handleTouchMove = e => {
		const touch = e.touches[0]
		const newX = Math.min(
			Math.max(touch.clientX - catcherBagWidth / 2, 0),
			425 - catcherBagWidth
		)
		setCatcherPosition({ ...catcherPosition, x: newX })
		console.log("Nowa pozycja catchera (dotyk):", newX)
	}
	const catcherPositionRef = useRef(catcherPosition)

	useEffect(() => {
		catcherPositionRef.current = catcherPosition
	}, [catcherPosition])

	return (
		<div
			onMouseMove={handleMouseMove}
			onTouchMove={handleTouchMove}
			ref={gameContainerRef}
			className='flex w-[425px] h-[1000px] bg-yellow-100/30'
		>
			<div className='bg-green-500 h-10 right-0 top-2 w-full flex justify-center'>
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
					<img
						src='./src/assets/gift.svg'
						alt='alt'
						className='w-[100px] h-[70px] '
					/>
				</div>
			))}
			<div
				style={{
					position: "absolute",
					left: `${catcherPosition.x}px`,
					top: `${catcherPosition.y}px`,
				}}
				className=' w-[144px] h-[144px]  justify-center items-center  bottom-0 right-0'
			>
				<img
					src='./src/assets/bag.svg'
					alt='bag'
					className='w-[144px] h-[144px] bg-white shadow-lg rounded-full shadow-white'
				/>
			</div>
		</div>
	)
}

export default Game
