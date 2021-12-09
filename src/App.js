import { useEffect, useState } from 'react';
import './App.css';
import { SingleCard } from './components/SingleCard';

const cardImages = [
  { "src": "/img/helmet-1.png", matched: false },
  { "src": "/img/potion-1.png", matched: false },
  { "src": "/img/ring-1.png", matched: false },
  { "src": "/img/scroll-1.png", matched: false },
  { "src": "/img/shield-1.png", matched: false },
  { "src": "/img/sword-1.png", matched: false }
]

function App() {

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [isEndGame, setIsEndGame] = useState(false)

  // shuffle cards
  const shuffleCards = () => {
    const shuffledCards = 
      [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))

      setChoiceOne(null);
      setChoiceTwo(null);
      setIsEndGame(false);
      setCards(shuffledCards);
      setTurns(0);
  }

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  }

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setIsEndGame();
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  }

  useEffect(() => {
    if(choiceOne && choiceTwo) {
      setDisabled(true);

      if(choiceOne.src === choiceTwo.src) {
        
        setCards(prevCards => {
          return prevCards.map(card => {
            if(card.src === choiceOne.src)
              return {...card, matched: true}       
            return card
          })
        });


        resetTurn();       
      } else {
        setTimeout(() => {
          resetTurn();                 
        }, 1000);
      }     
    }

  }, [choiceOne, choiceTwo])

  
  // start a new game automatically
  useEffect(() => {
    shuffleCards();
  }, [])

  // check if all cards ar matched
  useEffect(() => {
    let isEnd = true;
    cards.forEach(card => {
      if(card.matched === false) {
        isEnd = false;
      }
    })
    
    if(isEnd) {
      setIsEndGame(true);
    }
  
  },[cards]) 


  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>Start Game</button>

      {
        !isEndGame 
        ? 
        <>
          <div className="card-grid">
          {cards.map(card => (
            
            <SingleCard 
              key={card.id} 
              card={card}
              handleChoice={handleChoice}  
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />

          ))}
        </div>
        <p>Turns: {turns}</p>
        
        </>
        : 
        <>
          <h1>End game</h1>
          <p>Your Score: {turns}</p>
        </>
      }

    </div>
  );
}

export default App;
