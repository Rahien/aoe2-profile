import React from 'react';
import {IPlayerInfoWrap} from "./Types";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import BMC from "./BuyMeACoffee";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'


const ProfileHeader: React.FC<IPlayerInfoWrap> = ({gameMode, onGameModeChange}) => {
  function handleGameModeChange(_:any, menuItem:any){
    if(onGameModeChange){
      onGameModeChange(menuItem.props.value);
    }
  }

  return <div className="player-header">
    <div className="wrap-960">
      <a className="aoe2-profile" href="/">
        <FontAwesomeIcon icon={faHome}/>
        AoE2 Profile
      </a>
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