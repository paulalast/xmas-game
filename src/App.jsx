import React, { useState } from "react"
import Game from "./components/Game"
import "./App.css"

function App() {
	const [gameStarted, setGameStarted] = useState(false)

	const startGame = () => {
		setGameStarted(true)
	}

	return (
		<div className='app flex flex-col justify-center items-center text-center bg-blue-200/50 w-[425px] h-[1000px]'>
			{!gameStarted ? (
				<div className=' flex flex-col justify-center items-center gap-10'>
					<h1 className='text-center font-extrabold w-screen uppercase bg-white block text-main'>
						Złap <br /> Prezent!
					</h1>
					<button
						onClick={startGame}
						className='px-8 py-4 shadow-sm shadow-black/60 hover:bg-main transition-colors'
					>
						Start
					</button>
				</div>
			) : (
				<Game />
			)}
		</div>
	)
}

export default App
