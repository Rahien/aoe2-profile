import React  from 'react';
import {IMatch, IMatchPlayer} from "./Types";
import CivIcon from "./CivIcon";
import ReactCountryFlag from 'react-country-flag';
import MapIcon from "./MapIcon";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';

interface IMatchProps {
  match: IMatch
}

const renderPlayer = (player:any, hideVictory?:boolean) => {
  const link = player.steam_id?`/profile/${player.steam_id}`:'';
  return <a className="player" key={player.name} href={link}>
    <div className="player-info">
      <ReactCountryFlag
        svg
        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/"
        cdnSuffix="svg"
        countryCode={player.country} />
      <label className="player-name">{player.name}</label>
      {player.won && !hideVictory?<FontAwesomeIcon icon={faMedal} />:null}
    </div>
    <div className="other-info">
      <div className="civ">
        <CivIcon civ={player.civ}/>
        <label>{player.civ}</label>
      </div>
      <div className="rating">
        <label>Rating:</label>
        <span>{player.rating}</span>
      </div>
    </div>

  </a>;
};


const build1v1Match = (match:IMatch) => {
  const player1 = match.players[0];
  const player2 = match.players[1];
  return <div className="match oneVone">
    {buildMatchHeader(match)}
    <div className="players">
      {renderPlayer(player1)}
      <div className="vs"></div>
      {renderPlayer(player2)}
    </div>
  </div>;
};

const buildMatchHeader = (match:IMatch) => {
  const matchTypes:{[id:string]: string} = {
    1: "Death Match 1v1",
    2: "Death Match Team",
    3: "Random Map 1v1",
    4: "Random Map Team"
  };
  const matchType = matchTypes[match.leaderboard_id];
  const started = moment(new Date(match.started*1000)).format('YYYY-MM-DD HH:mm');
  return <div className="match-type">
    <div className="match-name">{matchType}</div>
    <div className="match-date">
      {started}
    </div>
    <div className="match-map">
      <label>{match.map_type}</label>
      <MapIcon map={match.map_type}/>
    </div>
  </div>
}

const buildTeamsMatch = (match: IMatch) => {
  const teams:{[id:string]: IMatchPlayer[]} = {};
  match.players.forEach((player) => {
    let team = teams[player.team];
    if(!team){
      team = [];
      teams[player.team] = team;
    }
    team.push(player);
  });
  const teamBoxes = Object.values(teams).map((team, index) => {
    let won = false;
    const players = team.map((player) => {
      won = player.won;
      return renderPlayer(player, true);
    });
    return <div className="team" key={index}>
      <div className="teamName">
        <label>Team {index + 1}</label>
        <FontAwesomeIcon className={won?"shown":"hidden"} icon={faMedal}/>
      </div>
      <div className="players">
        {players}
      </div>
    </div>
  });
  return <div className="match teams">
    {buildMatchHeader(match)}
    <div className="team-list">
      {teamBoxes}
    </div>
  </div>;
};

const Match: React.FC<IMatchProps> = ({match}) => {
  if(match.players.length === 2){
    return build1v1Match(match);
  }
  return buildTeamsMatch(match);
};

export default Match;