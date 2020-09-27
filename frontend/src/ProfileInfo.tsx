import React, { useState } from 'react';
import RankChart from "./RankChart";
import useFetch from "use-http/dist";
import PlayerHeader from "./PlayerHeader";
import {IPlayerInfo} from "./Types";
import WinLossBreakdown from "./WinLossBreakdown";
import Loading from "./Loading";
import MapTable from "./MapTable";
import {CivIconWithLabel} from "./CivIcon";
import {MapIconWithLabel} from "./MapIcon";

const ProfileInfo: React.FC = () => {
  const [steamId] = useState<string>("76561198006616324");
  const { loading, error, data = null } = useFetch(`/match-stats?userId=${steamId}`, {}, [steamId]);
  const [gameMode, setGameMode] = useState<string>('all');
  if(!data) {
    return <Loading/>
  }
  const playerInfo = data as unknown as IPlayerInfo;
  const header = <PlayerHeader playerInfo={playerInfo} gameMode={gameMode} onGameModeChange={setGameMode}/>;
  const winLossBreakdown = <WinLossBreakdown playerInfo={playerInfo}/>;
  const mapBreakdown = <MapTable winCounts={playerInfo.perMap['1v1 Random Map']} sortBy="played"/>;
  let totalGamesPlayed = 0;

  Object.values(playerInfo.numberOfGames).forEach((count:number) => {
    totalGamesPlayed += count;
  });
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


  return <div className="profile">
    {header}
    <div className="wrap-960 flex">
      <div className="main-panel">
        <div className='stats'>
          <h2>Stats</h2>
          <div className="games-played">
            <div className="games-played-total">
              <label>Total Games Tracked:</label>
              <span>{totalGamesPlayed}</span>
            </div>
            <span className="games-detail">(RM 1v1: {rm1v1}, RM team: {rmteam}, DM 1v1: {dm1v1}, DM team: {dmteam})</span>
          </div>
          <div className="average-game-length display-none">
            <label>Average Game Duration:</label>
            <span>{averageGameLengthHours > 0?averageGameLengthHours:""}:{averageGameLengthMinutes}:{averageGameLengthSeconds}</span>
          </div>
          <div className="favorites flex">
            <div className="favorite-civ">
              <label>Favorite Civ</label>
              <CivIconWithLabel civ="Franks"/>
            </div>
            <div className="favorite-map">
              <label>Favorite Map</label>
              <MapIconWithLabel map="Arabia"/>
            </div>
          </div>
        </div>
        <RankChart steamId={steamId} gameMode={gameMode}/>
      </div>

      {error && 'Error!'}
      {loading && 'Loading...'}
      {winLossBreakdown}
    </div>
    <div className="wrap-960">
      <h2>Win Percentage Per Map</h2>
      {mapBreakdown}
    </div>
  </div>;
}

export default ProfileInfo;
