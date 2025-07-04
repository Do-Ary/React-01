import { useState } from "react"
import { Children } from "react"
import confetti from "canvas-confetti"
import { Square } from "./components/Square.jsx"
import { TURNS } from "./constants.js"
import { checkWinnerFrom, checkEndGame } from "./Logic/board.js"
import { WinnerModal } from "./components/WinnerModal.jsx"
import {saveGameToStorage, resetGameToStorage } from "./Logic/storage/index.js"

function App() {
  
  const [board, setBoard] = useState(()=>{
    console.log('Inicializar estado del board')
    const boardFromStorage = window.localStorage.getItem('board')
    if(boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })
  
  const [turn, setTurn] = useState(()=>{
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
    })

  const [winner,setWinner] =useState(null) // no hay ganador y false empate
  
  const resetGame = () =>{
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null) 
    resetGameToStorage() 
  }
  const updateBoard = (index) =>{
    //no actualizamos esta posicion si ya tiene algo
    if (board[index] || winner) return
    
    // actualizar el tablero
    const newBoard = [... board]
    newBoard[index] = turn
    setBoard(newBoard)
    //cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //guardar partida
    saveGameToStorage({
      board: newBoard,
      turn:newTurn

    })
    //revisar si hay un ganador
    const newWinner = checkWinnerFrom(newBoard)
    if(newWinner){
      setWinner(newWinner)
      confetti()
    }else if(checkEndGame(newBoard)){
      setWinner(false)
    }
  }

  return (
    <main className= 'board'>
      <h1>Triqui</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className = "game">
        {
          board.map(( square, index ) =>   {
            return (
              <Square
                key={index}
                index={index} 
                updateBoard={updateBoard}
              >
                {square}
              </Square>

            )  
          })
        }
      </section>

      <section className = "turn">
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X} 
        </Square>
        <Square isSelected={turn === TURNS.O}> 
          {TURNS.O} 
        </Square>
        
      </section>
      <WinnerModal resetGame = {resetGame} winner = {winner}/>
    </main>  
  )
}

export default App
