export interface IPlayerInfo {
  name:  string,
  country: string,
  perCiv: { [id: string]: {[id:string]: {wins: number, losses: number}}},
  perMap: { [id: string]: {[id:string]: {wins: number, losses: number}}},
  perEnemyCiv: { [id: string]: {[id:string]: {wins: number, losses: number}}},
  totalMatchLength: { [id:string]:number },
  numberOfGames: { [id:string]:number }
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
