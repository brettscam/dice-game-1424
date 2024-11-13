
export interface GameSession {
  id: string;
  name: string;
  code: string;
  createdAt: number;
  expiresAt: number;
  players: Player[];
  currentTurn: number;
  status: 'waiting' | 'in-progress' | 'completed';
}

export interface Player {
  id: string;
  name: string;
  score: number;
  status: 'joined' | 'playing' | 'completed';
}

class GameStorage {
  private readonly STORAGE_KEY = 'dice_game_sessions';
  private readonly SESSION_DURATION = 72 * 60 * 60 * 1000; // 72 hours

  createGame(name: string): GameSession {
    const id = crypto.randomUUID();
    const now = Date.now();
    const session: GameSession = {
      id,
      name,
      code: this.generateGameCode(),
      createdAt: now,
      expiresAt: now + this.SESSION_DURATION,
      players: [],
      currentTurn: 0,
      status: 'waiting'
    };

    this.saveSession(session);
    return session;
  }

  private generateGameCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  getGame(id: string): GameSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === id) || null;
  }

  saveSession(session: GameSession): void {
    const sessions = this.getAllSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
  }

  private getAllSessions(): GameSession[] {
    try {
      const sessions = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      return sessions.filter(session => Date.now() <= session.expiresAt);
    } catch {
      return [];
    }
  }

  getActiveGames(): GameSession[] {
    return this.getAllSessions().filter(session => 
      session.status !== 'completed' && 
      Date.now() <= session.expiresAt
    );
  }

  addPlayer(gameId: string, playerName: string): Player | null {
    const session = this.getGame(gameId);
    if (!session) return null;

    const player: Player = {
      id: crypto.randomUUID(),
      name: playerName,
      score: 0,
      status: 'joined'
    };

    session.players.push(player);
    this.saveSession(session);
    return player;
  }
}

export const gameStorage = new GameStorage();
