import React from "react";
import useFetch from "use-http/dist";
import Loading from "./Loading";
import {IPlayerListItem} from "./Types";
import PlayerListItem from "./PlayerListItem";

interface ISelectUserProps {
  userName: string
}

const SelectUser: React.FC<ISelectUserProps> = ({userName}) => {

  let { loading, error, data = [] } = useFetch<IPlayerListItem[]>(`/search-user?userName=${userName}`, {}, [userName]);

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
    return <PlayerListItem key={index} player={player}/>;
  });

  return <div className="select-user wrap-960">
    {table}
  </div>
};

export default SelectUser;

