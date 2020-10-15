import React from "react";
import moment from 'moment';
import {IPlayerListItem} from "./Types";
import ReactCountryFlag from 'react-country-flag';
interface IPlayerListItemProps {
  player: IPlayerListItem,
  noRank?: boolean
}
const PlayerListItem: React.FC<IPlayerListItemProps> = ({player, noRank}) => {
  let rank = null;
  if(!noRank){
    rank = <div className="ratings">
      <div className="rating_1">
        <label>1v1 DM:</label>
        <span>{player.rating_1 || "-"}</span>
      </div>
      <div className="rating_2">
        <label>Team DM:</label>
        <span>{player.rating_2 || "-"}</span>
      </div>
      <div className="rating_3">
        <label>1v1 RM:</label>
        <span>{player.rating_3 || "-"}</span>
      </div>
      <div className="rating_4">
        <label>Team RM:</label>
        <span>{player.rating_4 || "-"}</span>
      </div>
    </div>
  }
  return <a className="player-row wrap" href={`/profile/${player.steam_id}`}>
    <div className="main-info">
      <ReactCountryFlag
        svg
        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/"
        cdnSuffix="svg"
        countryCode={player.country} />
      <div className="name">{player.name}</div>
      <div className="games-info">
        <div className="games">
          <label>Number of Games:</label>
          <span>{player.games}</span>
        </div>
        <div className="last-game">
          <label>Last Game:</label>
          <span>{moment(new Date(player.last_match * 1000)).format('YYYY-MM-DD')}</span>
        </div>
      </div>
    </div>
    {rank}
  </a>;
};

export default PlayerListItem;

