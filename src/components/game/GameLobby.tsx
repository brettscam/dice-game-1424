import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlayerAvatar } from '@/components/shared/PlayerAvatar';
import { Copy, Check } from 'lucide-react';
import { gameStorage, type GameSession } from '@/lib/storage';

export function GameLobby() {
  // ... previous state variables ...
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // ... previous useEffect and functions ...

  const copyGameCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      {/* ... previous CardHeader ... */}
      
      <CardContent>
        {/* ... previous create/join game forms ... */}

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
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">Code: {game.code}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyGameCode(game.code)}
                      >
                        {copiedCode === game.code ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
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
