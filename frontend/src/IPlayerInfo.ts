export default interface IPlayerInfo {
  name:  { [id: string]: {[id:string]: {won: number, lost: number}}},
  country: { [id: string]: {[id:string]: {won: number, lost: number}}},
  perCiv: { [id: string]: {[id:string]: {won: number, lost: number}}},
  perMap: { [id: string]: {[id:string]: {won: number, lost: number}}},
  perEnemyCiv: { [id: string]: {[id:string]: {won: number, lost: number}}},
  totalMatchLength: { [id:string]:number },
  numberOfGames: { [id:string]:number }
}

export interface IPlayerInfoWrap {
  playerInfo: IPlayerInfo
}