import React from 'react';
import {IPlayerInfoWrap} from "./Types";
import {combineWinCounts} from "./WinCounts";
import MapTable from "./MapTable";

const MapWinLossBreakdown: React.FC<IPlayerInfoWrap> = ({playerInfo, gameMode}) => {
  const perMap = combineWinCounts(gameMode || "all", playerInfo.perMap);
  return <>
    <h2>Win Percentage Per Map</h2>
    <MapTable winCounts={perMap} sortBy="played"/>;
  </>
}

export default MapWinLossBreakdown;