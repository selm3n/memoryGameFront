import React from "react";
import { ICard } from "../App";
import './singleCard.css';
import cardBack from '../assets/img/card-back.png';

interface cardProps {
    card: ICard;
    handleChoice: (card: ICard) => void;
    flipped: boolean;
    offline?: boolean;//variable used to show the correct source image
}

//component to show a single card
const SingleCard = ({ card, flipped, handleChoice, offline }: cardProps) => {    
    const handleClick = () => {
        handleChoice(card);
     }
    return (
        <div className={flipped ? "flipped card-container" : "card-container"}>
                <div className='card card-front'>
                    <img src={offline? card.src:process.env.REACT_APP_DOMAIN+card.src} alt='card front' />
                </div>
                <div className='card card-back'>
                    <img 
                        src={cardBack} 
                        alt='card back' 
                        onClick={handleClick}
                    />
                </div>

        </div>
    )
} 

export { SingleCard }