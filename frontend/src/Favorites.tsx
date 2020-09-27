import {CivIconWithLabel} from "./CivIcon";
import {MapIconWithLabel} from "./MapIcon";
import {IPlayerInfoWrap, IPlayerInfo, IWinCounts} from "./Types";
import React from "react";
import {combineWinCounts} from "./WinCounts";

function getFavoriteCiv(playerInfo: IPlayerInfo, gameMode: string | undefined){
  const combinedCounts = combineWinCounts(gameMode || "all", playerInfo.perCiv);
  return findKeyWithHighestPlayCount(combinedCounts) || "Franks";
}

function getFavoriteMap(playerInfo: IPlayerInfo, gameMode: string | undefined){
  const combinedCounts = combineWinCounts(gameMode || "all", playerInfo.perMap);
  return findKeyWithHighestPlayCount(combinedCounts) || "Arabia";
}

function findKeyWithHighestPlayCount(combinedCounts: IWinCounts){
  let maxCount = 0;
  let bestKey = null;
  Object.keys(combinedCounts).forEach((key) => {
    const playCount = combinedCounts[key].losses + combinedCounts[key].wins;
    if(playCount > maxCount){
      bestKey = key;
      maxCount = playCount;
    }
  });

  return bestKey;
}

const Favorites: React.FC<IPlayerInfoWrap> = ({playerInfo, gameMode}) => {
  const civ = getFavoriteCiv(playerInfo, gameMode);
  const map = getFavoriteMap(playerInfo, gameMode);

  return <div className="favorites flex">
    <div className="favorite-civ">
      <label>Favorite Civ</label>
      <CivIconWithLabel civ={civ}/>
    </div>
    <div className="favorite-map">
      <label>Favorite Map</label>
      <MapIconWithLabel map={map}/>
    </div>
  </div>
}

export default Favorites