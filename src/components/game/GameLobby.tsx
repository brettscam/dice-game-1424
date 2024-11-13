
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayerAvatar } from '@/components/shared/PlayerAvatar';

export function GameLobby() {
  return (
    <Card className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">1-4-24 Dice Game</h1>
        <Button variant="outline">Create New Game</Button>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Games</h2>
        <div className="grid gap-4">
          {/* We'll add game list items here */}
        </div>
      </div>
    </Card>
  );
}
