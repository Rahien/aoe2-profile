import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';


const SelectUserId: React.FC = () => {
  const [steamId, setSteamId] = useState("");
  const history = useHistory();
  function goToProfile(){
    history.push(`/profile/${steamId}`);
  }
  function handleKeyDown(event:any){
    if (event.key === 'Enter') {
      goToProfile();
    }
  }
  return <div className="find-user">
    <div className="logo">AoE2 Profile</div>
    <div className="message">Enter your SteamID to view your Age Of Empires 2 statistics</div>
    <div className="username-input">
      <label>SteamID</label>
      <input value={steamId} onKeyDown={handleKeyDown} onChange={(event) => setSteamId(event.target.value)} placeholder="76561198006616324"/>
      <button disabled={!steamId} onClick={goToProfile}>View Profile</button>
    </div>

    <div className="fine-print">
      We don't store any information you provide on our servers, this is purely a graphical frontend for the aoe2.net APIs
    </div>
  </div>
}

export default SelectUserId;
