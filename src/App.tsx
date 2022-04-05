import { useState, useEffect } from 'react';
import './App.css';
import { SingleCard } from './components/singleCard';
import LinearProgress from "@mui/material/LinearProgress";
import DialogCompoent from './components/popup';
import { getCards } from "./actions/cardActions"
import { getBestScore, setScore } from "./actions/playerActions"
import card1Img from './assets/img/card-1.png';
import card2Img from './assets/img/card-2.png';
import card3Img from './assets/img/card-3.png';
import card4Img from './assets/img/card-4.png';
import card5Img from './assets/img/card-5.png';
import card6Img from './assets/img/card-6.png';
import Spinner from './components/Spinner';


export interface ICard {
  src: string;
  id: number;
  matched: boolean;
}

export interface IBestScore {
  userName: string;
  timeToWin: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: string;
  _id?: string;
}

function App() {
  const [cardImages, setCardImages] = useState<any[]>([]);
  const [bestScore, setbestScore] = useState<IBestScore | null>();
  const [cards, setCards] = useState<ICard[]>([]);
  const [choice1, setChoice1] = useState<ICard | null>(null)
  const [choice2, setChoice2] = useState<ICard | null>(null)
  const [progress, setProgress] = useState(-1);
  const [open, setOpen] = useState<boolean>(false);
  const [faceUpCounter, setFaceUpCounter] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [timeToWin, setTimeToWin] = useState<number>(0);
  const [didWin, setDidWin] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [offline, setOffline] = useState<boolean>(false);

  const winDialogContent = `vous avez gagné en ${timeToWin} seconds`;
  const loseDialogContent = `vous avez perdu, essayez d'etre plus rapide la prochaine fois`;

  // initialize the game
  const shuffleCards = () => {
    const shuffledCards = [];
    // for each of the six cards, duplicate it and add random ID's, then push to shuffledDeck
    for (let i = 0; i < cardImages.length; i++) {
      let randId = Math.floor(Math.random() * 10000);
      shuffledCards.push(
        {
          ...cardImages[i],
          id: randId,
          matched: false
        }
      );
      randId = Math.floor(Math.random() * 10000);
      shuffledCards.push(
        {
          ...cardImages[i],
          id: randId,
          matched: false
        }
      );
      setChoice1(null);
      setChoice2(null);
    };

    setCards(shuffledCards.sort((a, b) => a.id - b.id));

    setDidWin(false)
    setProgress(0);
    setStartTime(new Date());
    setTimeToWin(0)
    setFaceUpCounter(0)
  };

  //handle the choice options
  const handleChoice = (card: ICard) => {
    if (choice1 && choice2) {
      return;
    } else if (choice1) {
      setChoice2(card)
    } else {
      setChoice1(card);
    }
  }

  //reset the user turn
  const resetTurn = () => {
    setChoice1(null);
    setChoice2(null);
  }

  useEffect(() => {
    // get the cards if the backEnd serer is up use its cards or use static cards 
    getCards().then((res: any) => {
      if (res?.data?.data) {
        setCardImages(res?.data?.data)
      } else {
        setCardImages(
          [
            { src: card1Img },
            { src: card2Img },
            { src: card3Img },
            { src: card4Img },
            { src: card5Img },
            { src: card6Img }
          ]
        )
        setOffline(true)
      }

    })
    // get the best score
    getBestScore().then((res: any) => {
      if (res?.data?.data) {
        setbestScore(res?.data?.data)
      }

    })
  }, [])

  //handle matching cards
  useEffect(() => {
    if (choice1 && choice2) {
      if (choice1.src === choice2.src && choice1.id !== choice2.id) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choice1.src) {
              setFaceUpCounter(faceUpCounter + 1)
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 400);
      }
    }
  }, [choice1, choice2])


  useEffect(() => {
    //handle winning the game
    if (faceUpCounter === cardImages.length && cardImages.length !== 0) {
      setOpen(true);
      setProgress(-1)
      setTimeToWin((new Date().valueOf() - startTime?.valueOf()) / 1000);
      setDidWin(true)
    }
  }, [faceUpCounter])

  useEffect(() => {
    //handle the progressBar
    const timer = setInterval(() => {
      if (progress > -1) {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            setOpen(true)
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }

    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  //handle close Modal
  const handleClose = () => {
    setOpen(false);
    setProgress(-1)
    setCards([])

  };

  const handleSubmit = async () => {
    //handle submit score
    await setScore({ 'timeToWin': timeToWin, 'userName': userName }).then((res: any) => {

      if (res?.data?.data) {
        let newScore = res?.data?.data
        if (bestScore && newScore.timeToWin < bestScore?.timeToWin) {
          setbestScore(res?.data?.data)
        }
      }


    })
    setOpen(false);

  }

  //handle userName change
  const handleChange = (e: any) => {
    setUserName(e)
  }

  return (
    <>
      <div className="App">
        <h1>Memory Game</h1>

        {bestScore?.timeToWin && <div><p>Le meilleur score est : {bestScore?.timeToWin} secondes  par: {bestScore?.userName}</p></div>}
        <div className={'container'}>
          <div className="card-grid" >
            {cards.map(card =>
              <SingleCard
                card={card}
                key={card.id}
                handleChoice={handleChoice}
                flipped={card === choice1 || card === choice2 || card.matched}
                offline={offline}
              />
            )}
          </div>
        </div>

        {cards.length > 0 && <div className='progress-bar' >
          <LinearProgress variant="determinate" value={progress} />
        </div>}

        {(cards.length === 0 && cardImages.length > 0) ? <button onClick={shuffleCards} className='new-button'>New Game</button> : cards.length === 0 ?<Spinner /> : null}
      </div>
      <DialogCompoent open={open} handleClose={handleClose} dialogContent={didWin ? winDialogContent : loseDialogContent} didWin={didWin} userName={userName} handleSubmit={handleSubmit} handleChange={handleChange} />


    </>

  );
}

export default App;
