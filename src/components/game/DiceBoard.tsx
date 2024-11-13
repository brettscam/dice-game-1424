import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceBoardProps {
  onScore: (score: number) => void;
}

export function DiceBoard({ onScore }: DiceBoardProps) {
  const [cupDice, setCupDice] = useState<number[]>([]);
  const [scoringDice, setScoringDice] = useState<number[]>([]);
  const [qualifyingDice, setQualifyingDice] = useState<number[]>([]);
  const [currentTurnScore, setCurrentTurnScore] = useState(0);
  const [canRoll, setCanRoll] = useState(true);
  const [qualified, setQualified] = useState(false);

  useEffect(() => {
    checkQualification();
    calculateCurrentTurnScore();
  }, [scoringDice, qualifyingDice]);

  const rollDice = () => {
    const newDice = Array(6 - scoringDice.length - qualifyingDice.length)
      .fill(0)
      .map(() => Math.floor(Math.random() * 6) + 1);
    setCupDice(newDice);
    setCanRoll(false);
  };

  const checkQualification = () => {
    const hasOne = qualifyingDice.includes(1);
    const hasFour = qualifyingDice.includes(4);
    setQualified(hasOne && hasFour);
  };

  const calculateCurrentTurnScore = () => {
    const turnScore = scoringDice.reduce((sum, die) => sum + die, 0);
    setCurrentTurnScore(turnScore);
  };

  const renderDie = (value: number, index: number, isInCup: boolean, isQualifying = false) => {
    const DiceIcon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][value - 1];
    const buttonClass = isInCup 
      ? 'bg-gray-200 hover:bg-gray-300 text-black' 
      : isQualifying 
        ? 'bg-green-500 hover:bg-green-600 text-white'
        : 'bg-blue-500 hover:bg-blue-600 text-white';

    return (
      <Button 
        key={index} 
        onClick={() => isInCup ? moveDiceToScoring(index) : moveDiceToCup(index, isQualifying)}
        className={`m-2 p-2 ${buttonClass}`}
      >
        <DiceIcon className="h-8 w-8" />
      </Button>
    );
  };

  const moveDiceToScoring = (index: number) => {
    const die = cupDice[index];
    const newCupDice = [...cupDice];
    newCupDice.splice(index, 1);
    setCupDice(newCupDice);

    if ((die === 1 || die === 4) && qualifyingDice.length < 2) {
      setQualifyingDice(prev => [...prev, die]);
    } else {
      setScoringDice(prev => [...prev, die]);
    }
    setCanRoll(true);
  };

  const moveDiceToCup = (index: number, isQualifying: boolean) => {
    const sourceArray = isQualifying ? qualifyingDice : scoringDice;
    const setSourceArray = isQualifying ? setQualifyingDice : setScoringDice;
    
    const die = sourceArray[index];
    const newArray = [...sourceArray];
    newArray.splice(index, 1);
    setSourceArray(newArray);
    
    setCupDice(prev => [...prev, die]);
    setCanRoll(false);
  };

  const endTurn = () => {
    if (qualified) {
      onScore(currentTurnScore);
    }
    // Reset the board
    setCupDice([]);
    setScoringDice([]);
    setQualifyingDice([]);
    setCurrentTurnScore(0);
    setCanRoll(true);
    setQualified(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <Button 
          onClick={rollDice} 
          disabled={!canRoll || cupDice.length === 6}
        >
          Roll Dice
        </Button>
        <Button 
          onClick={endTurn}
          variant={qualified ? 'default' : 'ghost'}
          disabled={!qualified && scoringDice.length > 0}
        >
          End Turn
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Dice in Cup:</h3>
          <div className="flex flex-wrap justify-center">
            {cupDice.map((die, index) => renderDie(die, index, true))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Scoring Dice:</h3>
          <div className="flex flex-wrap justify-center">
            {scoringDice.map((die, index) => renderDie(die, index, false))}
          </div>
        </div>

        {qualifyingDice.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Qualifying Dice:</h3>
            <div className="flex flex-wrap justify-center">
              {qualifyingDice.map((die, index) => renderDie(die, index, false, true))}
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xl font-bold">Current Score: {currentTurnScore}</p>
        <p className={`text-lg ${qualified ? 'text-green-500' : 'text-red-500'}`}>
          {qualified ? 'QUALIFIED' : 'NOT QUALIFIED'}
        </p>
      </div>
    </div>
  );
}
