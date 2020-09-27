import React from 'react';
import {IPlayerInfoWrap} from "./Types";
import CivTable from "./CivTable";

const WinLossBreakdown: React.FC<IPlayerInfoWrap> = ({playerInfo}) => {
  return <div className="win-loss-breakdown">
    <h2>Win Percentage Per Civ</h2>
    <CivTable winCounts={playerInfo.perCiv["1v1 Random Map"]} sortBy="played" resultLimit={10}/>

    <h2>Win Percentage Per Enemy</h2>
    <CivTable winCounts={playerInfo.perEnemyCiv["1v1 Random Map"]} sortBy="win" resultLimit={10}/>
  </div>
}

export default WinLossBreakdown;