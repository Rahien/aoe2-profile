import React from "react";
import useFetch from "use-http/dist";
import Loading from "./Loading";
import ReactCountryFlag from 'react-country-flag';
import moment from 'moment';

interface ISelectUserProps {
  userName: string
}
interface PlayerListItem {
  rating_1: number,
  rating_2: number,
  rating_3: number,
  rating_4: number,
  steam_id: string,
  name: string,
  clan: string,
  country: string,
  games: number
  last_match: number
}

const SelectUser: React.FC<ISelectUserProps> = ({userName}) => {
  let { loading, error, data = [] } = useFetch<PlayerListItem[]>(`/search-user?userName=${userName}`, {}, [userName]);

  if(loading){
    return <Loading/>;
  }

  if(error){
    return <div className="message error">Something went wrong while looking for users... please try again later.</div>;
  }

  if(!data || data.length === 0){
    return <div className="message">No users found...</div>;
  }

  const table = data.map((player, index) => {
    return <a className="player-row wrap" key={index} href={`/profile/${player.steam_id}`}>
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
      <div className="ratings">
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
    </a>;
  });

  return <div className="select-user wrap-960">
    {table}
  </div>
};

export default SelectUser;

