import express from "express";
import axios from 'axios';
import { Request, Response, Application } from 'express';
const app:Application = express();
const port = process.env.PORT || 8080;
import path from 'path';

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
  const dm = 1;
  const teamDm = 2;
  const result = await Promise.all([
    axios.get(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=${randomMap}&steam_id=${params.userId}&count=${params.count}`),
    axios.get(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=${teamRandomMap}&steam_id=${params.userId}&count=${params.count}`),
    axios.get(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=${dm}&steam_id=${params.userId}&count=${params.count}`),
    axios.get(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=${teamDm}&steam_id=${params.userId}&count=${params.count}`)
  ]);

  const toCache = {
    "oneVone": result[0].data || [],
    "team": result[1].data || [],
    "dm": result[2].data || [],
    "teamDm": result[3].data || []

  };
  return toCache;
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
  team: number;
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

function ensurePath(dict:IWinLossPerRatingDrillDown, propertyPath: string):void {
  const [first,second] = propertyPath.split(".");
  ensureKey(dict, first);
  return ensureKey(dict[first], second);
}

let stringsCache:IIDtranslations = null;

const getMatchStats: (req:Request) => Promise<any> = async (req) => {
  const params = req.query as unknown as IMatchStats;
  const start = new Date();
  let strings = stringsCache;
  if(strings === null){
    strings = (await axios.get(`https://aoe2.net/api/strings`)).data as unknown as IIDtranslations;
    stringsCache = strings
  }
  const matches = await axios.get(`https://aoe2.net/api/player/matches?game=aoe2de&start=0&steam_id=${params.userId}&count=1000`);
  // @ts-ignore
  const end = new Date() - start;
  // tslint:disable-next-line:no-console
  console.info('Execution time: %dms', end)

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
    const mySpot = match.players.findIndex((currentPlayer) => {
      return currentPlayer.steam_id === params.userId;
    });
    const myPlayer = match.players[mySpot];
    const won = myPlayer.won;
    const civ = myPlayer.civ;
    const myTeam = myPlayer.team;
    const map = match.map_type;
    gamesPerLeaderboardId[leaderBoardId] = (gamesPerLeaderboardId[leaderBoardId] || 0) + 1;
    averageMatchLengthPerLeaderboardId[leaderBoardId] = (averageMatchLengthPerLeaderboardId[leaderBoardId] || 0) + matchLength;
    countWinOrLoss(won, leaderBoardId, civ, winsPerCivPerLeaderboardId);
    countWinOrLoss(won, leaderBoardId, map, winsPerMapPerLeaderboardId);
    const enemies = match.players.filter((otherPlayer) => {
      return otherPlayer.team !== myTeam;
    });
    enemies.forEach((enemy) => {
      countWinOrLoss(won, leaderBoardId, enemy.civ, winsPerEnemyCivPerLeaderboardId);
    });
  });

  const lastMatch = matches.data[0];
  const player = lastMatch.players.find((currentPlayer:IMatchPlayer ) => {
    return currentPlayer.steam_id === params.userId;
  });

  const toCache = {
    name: player.name,
    country: player.country,
    perCiv: mapKeysToStrings(winsPerCivPerLeaderboardId, strings, ["leaderboard", "civ"]),
    perMap: mapKeysToStrings(winsPerMapPerLeaderboardId, strings, ["leaderboard", "map_type"]),
    perEnemyCiv: mapKeysToStrings(winsPerEnemyCivPerLeaderboardId, strings, ["leaderboard", "civ"]),
    totalMatchLength: mapKeysToStrings(averageMatchLengthPerLeaderboardId, strings, ['leaderboard']),
    numberOfGames: mapKeysToStrings(gamesPerLeaderboardId, strings, ['leaderboard']),
    recentMatches: translateMatches(matches.data.slice(0, 5), strings)
  };
  return toCache;
}

function translateMatches(matches: any, strings: IIDtranslations){
  matches.forEach((match:any) => {
    match.map_type = strings.map_type.find((map) => {
      return map.id === match.map_type;
    }).string;
    match.players.forEach((player:any) => {
       player.civ = strings.civ.find((civ) => {
         return civ.id === player.civ;
       }).string;
    });
  });
  return matches;
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

interface ISearchUserParams {
  userName: string
}
interface IPlayerInfo {
  rating: number,
  steam_id: string,
  name: string,
  clan: string,
  country: string,
  games: number
  last_match: number
}

const searchLeaderBoard = async function(leaderboardId: number, search: string){
  const players = await axios.get(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=${leaderboardId}&search=${search}&count=100`);
  const idToPlayer:{[id:string]:IPlayerInfo} = {};
  players.data.leaderboard.forEach((player:IPlayerInfo) => {
    idToPlayer[player.steam_id] = player;
  });
  return idToPlayer
}

const mergeLeaderboardSearches = function(leaderboardResults: { [playerId: string]: IPlayerInfo }[]){
  const merged:{ [playerId: string]: any } = {};
  leaderboardResults.forEach((result, leaderboardId) => {
    Object.keys(result).map((playerId) => {
      let mergedPlayer = merged[playerId];
      let player = result[playerId];
      if(!mergedPlayer){
        mergedPlayer = {
          steam_id: player.steam_id,
          name: player.name,
          clan: player.clan,
          country: player.country,
          games: player.games,
          last_match: player.last_match
        }
        merged[playerId] =  mergedPlayer;
      }else{
        mergedPlayer.games += player.games;
        mergedPlayer.last_match = Math.max(mergedPlayer.last_match, player.last_match);
      }
      mergedPlayer['rating_'+(leaderboardId+1)] = player.rating;
    });
  });
  return merged;
}

const searchUser: (req:Request) => Promise<any> = async (req) => {
  const params = req.query as unknown as ISearchUserParams;
  const search = params.userName;
  const leaderboardsToSearch = [1, 2, 3, 4];
  const leaderboardResults = await Promise.all(leaderboardsToSearch.map((id) => {
    return searchLeaderBoard(id, search);
  }));

  const merged = mergeLeaderboardSearches(leaderboardResults);
  return Object.values(merged).filter((item) => {
    return !!item.steam_id;
  });
}

interface IRankParams {
  leaderboardId?: number
}

const getRanks: (req:Request) => Promise<any> = async (req) => {
  const params = req.query as unknown as IRankParams;
  const players = await axios.get(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=${params.leaderboardId || 3}&count=20`);
  return players.data.leaderboard;
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

app.get( "/search-user",  ( req: Request, res: Response ) => {
  searchUser(req).then((result) => {
    res.send(result);
  });
} );

app.get( "/rank-list",  ( req: Request, res: Response ) => {
  getRanks(req).then((result) => {
    res.send(result);
  });
} );

app.use(express.static('public'))

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ port }` );
} );