import { GameSession } from '@/components/game/GameSession';

export default function GamePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <GameSession gameId={params.id} />
    </div>
  );
}
