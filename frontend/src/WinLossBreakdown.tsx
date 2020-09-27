import React from 'react';
import {IPlayerInfoWrap} from "./Types";
import CivTable from "./CivTable";
import {combineWinCounts} from "./WinCounts";

const WinLossBreakdown: React.FC<IPlayerInfoWrap> = ({playerInfo, gameMode}) => {
  const perCiv = combineWinCounts(gameMode || "all", playerInfo.perCiv);
  const perEnemyCiv = combineWinCounts(gameMode || "all", playerInfo.perEnemyCiv);
  return <div className="win-loss-breakdown">
    <h2>Win Percentage Per Civ</h2>
    <CivTable winCounts={perCiv} sortBy="played" resultLimit={10}/>

    <h2>Win Percentage Per Enemy</h2>
    <CivTable winCounts={perEnemyCiv} sortBy="win" resultLimit={10}/>
  </div>
}

export default WinLossBreakdown;