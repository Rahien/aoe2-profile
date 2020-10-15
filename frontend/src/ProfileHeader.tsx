import React from 'react';
import {IPlayerInfoWrap} from "./Types";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import BMC from "./BuyMeACoffee";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import ReactCountryFlag from 'react-country-flag';


const ProfileHeader: React.FC<IPlayerInfoWrap> = ({playerInfo, gameMode, onGameModeChange}) => {
  function handleGameModeChange(_:any, menuItem:any){
    if(onGameModeChange){
      onGameModeChange(menuItem.props.value);
    }
  }

  return <div className="player-header">
    <div className="wrap-960">
      <div className="player-main">
        <a className="aoe2-profile" href="/">
          <FontAwesomeIcon icon={faChevronLeft}/>
        </a>
        <ReactCountryFlag
          svg
          cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/"
          cdnSuffix="svg"
          countryCode={playerInfo.country} />
        <div className="player-name">{playerInfo.name}</div>
      </div>
      <div className="flex">
        <BMC/>
        <Select
          value={gameMode}
          onChange={handleGameModeChange}
        >
          <MenuItem value="all">All Game Modes</MenuItem>
          <MenuItem value="oneVone">RM 1v1</MenuItem>
          <MenuItem value="team">RM Teams</MenuItem>
          <MenuItem value="dm">DM 1v1</MenuItem>
          <MenuItem value="teamDm">DM Teams</MenuItem>
        </Select>
      </div>

    </div>
  </div>;
}

export default ProfileHeader;