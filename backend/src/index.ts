import express from "express";
import axios from 'axios';
import { Request, Response, Application } from 'express';
const app:Application = express();
const port = process.env.PORT || 8080;

interface IRankParams {
  userId: string,
  leaderboard: string,
  count: bigint
}

const getRankHistory: (req:any) => Promise<any> = async (req:Request) => {
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

app.get( "/rank-history",  ( req: Request, res: Response ) => {
  getRankHistory(req).then((result) => {
    res.send(result);
  });
} );

app.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ port }` );
} );