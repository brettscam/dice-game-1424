import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayerAvatar } from '@/components/shared/PlayerAvatar';
import { DiceBoard } from '@/components/game/DiceBoard';
import { gameStorage, type GameSession as GameSessionType } from '@/lib/storage';

interface GameSessionProps {
  gameId: string;
}

export function GameSession({ gameId }: GameSessionProps) {
  const [game, setGame] = useState<GameSessionType | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    const loadedGame = gameStorage.getGame(gameId);
    setGame(loadedGame);
  }, [gameId]);

  if (!game) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <p>Game not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{game.name}</CardTitle>
          <div className="flex gap-2">
            {game.players.map((player) => (
              <div key={player.id} className="text-center">
                <PlayerAvatar name={player.name} />
                <p className="text-sm mt-1">{player.score}</p>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DiceBoard 
          onScore={(score) => {
            // We'll implement this later
          }} 
        />
      </CardContent>
    </Card>
  );
}
