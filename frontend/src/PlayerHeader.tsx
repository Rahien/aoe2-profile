import React from 'react';
import {IPlayerInfoWrap} from "./IPlayerInfo";

const PlayerHeader: React.FC<IPlayerInfoWrap> = ({playerInfo}) => {
  let totalGamesPlayed = 0;

  Object.values(playerInfo.numberOfGames).forEach((count:number) => {
    totalGamesPlayed += count;
  });
  return <div className="player-header">
    <div className="player-name">{playerInfo.name}</div>
    <div className="player-country">{playerInfo.country}</div>
    <div className="games-played">{totalGamesPlayed}</div>
  </div>;
}

export default PlayerHeader;