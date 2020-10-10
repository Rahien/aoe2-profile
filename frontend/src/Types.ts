export interface IPlayerInfo {
  name:  string,
  country: string,
  perCiv: { [id: string]: IWinCounts},
  perMap: { [id: string]: IWinCounts},
  perEnemyCiv: { [id: string]: IWinCounts},
  totalMatchLength: { [id:string]:number },
  numberOfGames: { [id:string]:number },
  recentMatches: []
}

export interface IPlayerInfoWrap {
  playerInfo: IPlayerInfo,
  gameMode?: string,
  onGameModeChange?: (newGameType:string) => void
}

export interface IWinCounts {[id:string]: {wins: number, losses: number}}

export interface IWinCountsWrap {
  winCounts: IWinCounts,
  sortBy: string,
  resultLimit?: number
}

export interface IMatchPlayer {
  steam_id: string,
  name: string,
  clan: string,
  country: string,
  rating:number,
  color:number,
  team:number,
  civ: string,
  won: boolean
}

export interface IMatch {
  version:string,
  name:string
  map_type:string,
  leaderboard_id:string,
  started:number,
  finished: number,
  players: IMatchPlayer[]
}