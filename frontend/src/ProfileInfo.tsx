import React, { useState } from 'react';
import CivIcon from "./CivIcon";
import {CivIconWithLabel} from "./CivIcon";
import RankChart from "./RankChart";
import useFetch from "use-http/dist";
import {IncomingOptions} from "use-http/dist/types";
import PlayerHeader from "./PlayerHeader";
import IPlayerInfo from "./IPlayerInfo";

const ProfileInfo: React.FC = () => {
  const [steamId] = useState<string>("76561198006616324");
  const { loading, error, data = null } = useFetch(`/match-stats?userId=${steamId}`, {}, [steamId]);
  let header = null;
  if(data){
    const playerInfo = data as unknown as IPlayerInfo;
    header = <PlayerHeader playerInfo={playerInfo}/>
  }

  return <div className="profile">
    {header}
    <RankChart steamId={steamId}/>

    {error && 'Error!'}
    {loading && 'Loading...'}

    <CivIconWithLabel civ={"Franks"}/>
    <CivIcon civ={"Saracens"}/>
    <CivIcon civ={"Britons"}/>
    <CivIcon civ={"Lithuanians"}/>
    <CivIcon civ={"Incas"}/>
  </div>;
}

export default ProfileInfo;
