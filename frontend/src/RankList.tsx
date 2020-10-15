import React, { useState } from "react";
import useFetch from "use-http/dist";
import Loading from "./Loading";
import PlayerListItem from "./PlayerListItem";
import {IPlayerListItem} from "./Types";


const RankList: React.FC = () => {
  const [leaderboardId, setLeaderboardId] = useState(3);
  let { loading, error, data = [] } = useFetch<IPlayerListItem[]>(`/rank-list?leaderboardId=${leaderboardId}`, {}, [leaderboardId]);

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
    return <PlayerListItem key={index} player={player} noRank={true}/>;
  });

  return <div className="select-user wrap-960">
    {table}
  </div>
};

export default RankList;

