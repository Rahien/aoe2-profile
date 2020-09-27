import React from 'react';
import {IPlayerInfoWrap} from "./Types";
import ReactCountryFlag from 'react-country-flag';

const PlayerHeader: React.FC<IPlayerInfoWrap> = ({playerInfo}) => {
  return <div className="player-header">
    <div className="wrap-960">
      <div className="player-main">
        <ReactCountryFlag
          svg
          cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/"
          cdnSuffix="svg"
          countryCode={playerInfo.country} />
        <div className="player-name">{playerInfo.name}</div>
      </div>
      <div className="aoe2-profile">AoE2 Profile</div>
    </div>
  </div>;
}

export default PlayerHeader;