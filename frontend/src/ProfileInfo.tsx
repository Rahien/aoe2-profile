import React, { useState } from 'react';
import CivIcon from "./CivIcon";
import {CivIconWithLabel} from "./CivIcon";
import RankChart from "./RankChart";

const ProfileInfo: React.FC = () => {
  const [steamId] = useState<string>("76561198006616324");

  return <div className="profile">
    <RankChart steamId={steamId}/>
    <CivIconWithLabel civ={"Franks"}/>
    <CivIcon civ={"Saracens"}/>
    <CivIcon civ={"Britons"}/>
    <CivIcon civ={"Lithuanians"}/>
    <CivIcon civ={"Incas"}/>
  </div>;
}

export default ProfileInfo;
