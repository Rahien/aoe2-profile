import React, { useState } from 'react';
import RankChart from "./RankChart";
import useFetch from "use-http/dist";
import PlayerHeader from "./PlayerHeader";
import {IPlayerInfo} from "./Types";
import WinLossBreakdown from "./WinLossBreakdown";
import Loading from "./Loading";
import MapWinLossBreakdown from "./MapWinLossBreakdown";
import Favorites from "./Favorites";
import { useParams } from 'react-router-dom';
import RecentMatches from "./RecentMatches";

function buildStats(playerInfo: IPlayerInfo, gameMode: string){

  let totalGamesPlayed = 0;
  const lookup:any = {
    'oneVone': '1v1 Random Map',
    'team': 'Team Random Map',
    'dm': '1v1 Death Match',
    'teamDm': 'Team Death Match'
  }

  if(!gameMode || gameMode === "all"){
    Object.values(playerInfo.numberOfGames).forEach((count:number) => {
      totalGamesPlayed += count;
    });
  }else{
    totalGamesPlayed = playerInfo.numberOfGames[lookup[gameMode]];
  }
  const rm1v1 = playerInfo.numberOfGames['1v1 Random Map'] || 0;
  const rmteam = playerInfo.numberOfGames['Team Random Map'] || 0;
  const dm1v1 = playerInfo.numberOfGames['1v1 Death Match'] || 0;
  const dmteam = playerInfo.numberOfGames['Team Death Match'] || 0;
  let averageGameLength = 0;
  Object.values(playerInfo.totalMatchLength).forEach((length) => {
    return averageGameLength += length;
  });
  averageGameLength = averageGameLength / totalGamesPlayed;
  const averageGameLengthHours = Math.floor(averageGameLength / 3600);
  const averageGameLengthMinutes = Math.floor(averageGameLength / 60) % 60;
  const averageGameLengthSeconds = Math.floor(averageGameLength % 60);

  return <>
    <div className="games-played">
      <div className="games-played-total">
        <label>Total Games Tracked:</label>
        <span>{totalGamesPlayed}</span>
      </div>
      {gameMode === "all" ? <span className="games-detail">(RM 1v1: {rm1v1}, RM team: {rmteam}, DM 1v1: {dm1v1}, DM team: {dmteam})</span>: null}
    </div>

    <div className="average-game-length display-none">
      <label>Average Game Duration:</label>
      <span>{averageGameLengthHours > 0?averageGameLengthHours:""}:{averageGameLengthMinutes}:{averageGameLengthSeconds}</span>
    </div>
  </>
}

const ProfileInfo: React.FC = () => {
  let { id } = useParams();
  const steamId = id;
  const { loading, error, data = null } = useFetch(`/match-stats?userId=${steamId}`, {}, [steamId]);
  const [gameMode, setGameMode] = useState<string>('all');
  if(loading) {
    return <Loading/>
  }
  const playerInfo = data as unknown as IPlayerInfo;
  const header = <PlayerHeader playerInfo={playerInfo} gameMode={gameMode} onGameModeChange={setGameMode}/>;
  const winLossBreakdown = <WinLossBreakdown playerInfo={playerInfo} gameMode={gameMode}/>;
  const mapBreakdown = <MapWinLossBreakdown playerInfo={playerInfo} gameMode={gameMode}/>;

  return <div className="profile">
    {header}
    <div className="wrap-960 flex">
      <div className="main-panel">
        <div className='stats'>
          <h2>Stats</h2>
          {buildStats(playerInfo, gameMode)}
          <Favorites playerInfo={playerInfo} gameMode={gameMode}/>
        </div>
        <RankChart steamId={steamId} gameMode={gameMode}/>
      </div>

      {error && 'Error!'}
      {loading && <Loading/>}
      {winLossBreakdown}
    </div>
    <div className="wrap-960">
      <RecentMatches matches={playerInfo.recentMatches} gameMode={gameMode}/>
    </div>
    <div className="wrap-960">
      {mapBreakdown}
    </div>
  </div>;
}

export default ProfileInfo;
