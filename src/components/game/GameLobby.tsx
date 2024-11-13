import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlayerAvatar } from '@/components/shared/PlayerAvatar';
import { gameStorage, type GameSession } from '@/lib/storage';

export function GameLobby() {
  const router = useRouter();
  const [games, setGames] = useState<GameSession[]>([]);
  const [showNewGame, setShowNewGame] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false);
  const [gameName, setGameName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    // Load active games on mount and every 5 seconds
    loadGames();
    const interval = setInterval(loadGames, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadGames = () => {
    const activeGames = gameStorage.getActiveGames();
    setGames(activeGames);
  };

  const createGame = () => {
    if (!gameName.trim() || !playerName.trim()) return;
    
    const game = gameStorage.createGame(gameName);
    const player = gameStorage.addPlayer(game.id, playerName);
    
    if (player) {
      router.push(`/game/${game.id}`);
    }
  };

  const joinGame = () => {
    if (!gameCode.trim() || !playerName.trim()) return;
    
    const game = gameStorage.getActiveGames().find(g => g.code === gameCode.toUpperCase());
    if (game) {
      const player = gameStorage.addPlayer(game.id, playerName);
      if (player) {
        router.push(`/game/${game.id}`);
      }
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>1-4-24 Dice Game</CardTitle>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowNewGame(true);
                setShowJoinGame(false);
              }}
            >
              Create Game
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowJoinGame(true);
                setShowNewGame(false);
              }}
            >
              Join Game
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {showNewGame && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Create New Game</h3>
            <div className="space-y-2">
              <Input
                placeholder="Game Name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
              <Input
                placeholder="Your Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <Button onClick={createGame}>Create</Button>
            </div>
          </div>
        )}

        {showJoinGame && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Join Game</h3>
            <div className="space-y-2">
              <Input
                placeholder="Game Code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              />
              <Input
                placeholder="Your Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <Button onClick={joinGame}>Join</Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Games</h2>
          {games.length === 0 ? (
            <p className="text-gray-500">No active games</p>
          ) : (
            <div className="grid gap-4">
              {games.map((game) => (
                <div 
                  key={game.id} 
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{game.name}</h3>
                    <p className="text-sm text-gray-500">Code: {game.code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {game.players.map((player) => (
                        <PlayerAvatar 
                          key={player.id} 
                          name={player.name} 
                          size="sm"
                          className="border-2 border-white"
                        />
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/game/${game.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
