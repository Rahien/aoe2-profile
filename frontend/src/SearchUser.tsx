import React, { useState } from 'react';
import SelectUser from "./SelectUser";


const SearchUser: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [userToSearch, setUserToSearch] = useState<string>("");
  const disabled = !userName || userName.trim().length < 3;
  function handleKeyDown(event:any){
    if (event.key === 'Enter') {
      findUser();
    }
  }
  function findUser(){
    setUserToSearch(userName);
    console.log('searching');
  }

  let userList = <div className="message">Search a user to view the profile for</div>;

  if(userToSearch && userToSearch.length >= 3){
    userList = <SelectUser userName={userToSearch}/>;
  }

  return <div className="find-user">
    <div className="logo">AoE2 Profile</div>
    {userList}
    <div className="username-input">
      <label>User</label>
      <input value={userName} onKeyDown={handleKeyDown} onChange={(event) => setUserName(event.target.value)}/>
      <button disabled={disabled} onClick={findUser}>Search</button>
    </div>

    <div className="fine-print">
      We don't store any information you provide on our servers, this is purely a graphical frontend for the aoe2.net APIs
    </div>
  </div>
}

export default SearchUser;