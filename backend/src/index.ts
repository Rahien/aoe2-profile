import express from "express";
import axios from 'axios';
import { Request, Response, Application } from 'express';
const app:Application = express();
const port = process.env.PORT || 8080;

interface IRankParams {
  userId: string,
  count: bigint
}
interface IMatchStats {
  userId: string,
}

const getRankHistory: (req:Request) => Promise<any> = async (req) => {
  const params = req.query as unknown as IRankParams;
  const randomMap = 3;
  const teamRandomMap = 4;
  const result = await Promise.all([
    axios.get(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=${randomMap}&steam_id=${params.userId}&count=${params.count}`),
    axios.get(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=${teamRandomMap}&steam_id=${params.userId}&count=${params.count}`)
  ]);
  return {
    "oneVone": result[0].data || [],
    "team": result[1].data || []
  };
}

interface IWinLossDrillDown {
  [id:string]:{wins:number, losses:number}
}
interface IWinLossPerRatingDrillDown {
  [id:string]:IWinLossDrillDown
}

interface IMatch {
  leaderboard_id: number,
  started: number,
  finished:number,
  players: IMatchPlayer[],
  ranked: boolean,
  map_type: number
}

interface IMatchPlayer {
  steam_id?: string,
  name: string,
  country: string,
  civ: number,
  won: boolean
}

interface IIDtranslations {
  [id:string]: {id: number, string: string}[]
}

function ensureKey(dict:IWinLossDrillDown|IWinLossPerRatingDrillDown, key:string): void {
  dict[key] = dict[key] || {};
}

function ensurePath(dict:IWinLossPerRatingDrillDown, path: string):void {
  const [first,second] = path.split(".");
  ensureKey(dict, first);
  return ensureKey(dict[first], second);
}

const getMatchStats: (req:Request) => Promise<any> = async (req) => {
  const params = req.query as unknown as IMatchStats;
  const [matches, stringsResult] = await Promise.all([
    axios.get(`https://aoe2.net/api/player/matches?steam_id=${params.userId}&count=1000`),
    axios.get(`https://aoe2.net/api/strings`)
  ]);

  const strings = stringsResult.data as unknown as IIDtranslations;

  const winsPerCivPerLeaderboardId: IWinLossPerRatingDrillDown= {};
  const winsPerMapPerLeaderboardId: IWinLossPerRatingDrillDown = {};
  const winsPerEnemyCivPerLeaderboardId: IWinLossPerRatingDrillDown = {};
  const averageMatchLengthPerLeaderboardId:{[id:string]:number} = {};
  const gamesPerLeaderboardId:{[id:string]:number} = {};

  matches.data.forEach((match:IMatch) => {
    if(!match.ranked){
      return;
    }
    const leaderBoardId = match.leaderboard_id;
    const matchLength = match.finished - match.started;
    const mySpot = match.players.findIndex((player) => {
      return player.steam_id === params.userId;
    });
    const myPlayer = match.players[mySpot];
    const won = myPlayer.won;
    const civ = myPlayer.civ;
    const map = match.map_type;
    gamesPerLeaderboardId[leaderBoardId] = (gamesPerLeaderboardId[leaderBoardId] || 0) + 1;
    averageMatchLengthPerLeaderboardId[leaderBoardId] = (averageMatchLengthPerLeaderboardId[leaderBoardId] || 0) + matchLength;
    countWinOrLoss(won, leaderBoardId, civ, winsPerCivPerLeaderboardId);
    countWinOrLoss(won, leaderBoardId, map, winsPerMapPerLeaderboardId);
    const enemies = match.players.filter((_, index) => {
      return index !== mySpot;
    });
    enemies.forEach((enemy) => {
      countWinOrLoss(won, leaderBoardId, enemy.civ, winsPerEnemyCivPerLeaderboardId);
    });
  });

  return {
    perCiv: mapKeysToStrings(winsPerCivPerLeaderboardId, strings, ["leaderboard", "civ"]),
    perMap: mapKeysToStrings(winsPerMapPerLeaderboardId, strings, ["leaderboard", "map_type"]),
    perEnemyCiv: mapKeysToStrings(winsPerEnemyCivPerLeaderboardId, strings, ["leaderboard", "civ"]),
    totalMatchLength: mapKeysToStrings(averageMatchLengthPerLeaderboardId, strings, ['leaderboard']),
    numberOfGames: mapKeysToStrings(gamesPerLeaderboardId, strings, ['leaderboard'])
  };
}

function countWinOrLoss(won:boolean, leaderboard:number, differentiator:number, winLossCounter:IWinLossPerRatingDrillDown):void{
  const leaderboardStr = "" + leaderboard;
  const differentiatorStr = "" + differentiator;
  ensurePath(winLossCounter, `${leaderboardStr}.${differentiatorStr}`);
  const winsOrLosses = winLossCounter[leaderboardStr][differentiatorStr];
  winsOrLosses.wins = (winsOrLosses.wins || 0) + (won?1:0);
  winsOrLosses.losses = (winsOrLosses.losses || 0) + (won?0:1);
}

function mapKeysToStrings<T>(dict:{[id:string]:T}|any, strings: IIDtranslations, propertyNames: string[]): {[id:string]:T} {
  if(propertyNames.length === 0){
    return dict;
  }
  const [currentPropertyName, ...otherPropertyNames] = propertyNames;
  const toTranslate = dict as {[id:string]:T};
  const translated = {} as {[id:string]:T};
  Object.keys(toTranslate).map((key) => {
    const keyTranslation = strings[currentPropertyName].find((item) => {
      return ("" + item.id) === key;
    });
    translated[keyTranslation?.string || key] = mapKeysToStrings(toTranslate[key], strings, otherPropertyNames) as unknown as T;
  });
  return translated;
}

app.get( "/rank-history",  ( req: Request, res: Response ) => {
  getRankHistory(req).then((result) => {
    res.send(result);
  });
} );

app.get( "/match-stats",  ( req: Request, res: Response ) => {
  getMatchStats(req).then((result) => {
    res.send(result);
  });
} );

app.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ port }` );
} );