import React from 'react';
import './App.scss';
import ProfileInfo from "./ProfileInfo";

function App() {
  return (
    <div className="App">
      <ProfileInfo/>

      <div className="wrap-960 game-content-useage-notice">Age of Empires II: HD© and Age of Empires II: Definitive Edition© Microsoft Corporation. AoE2-profile was created under Microsoft's <a href="https://www.xbox.com/en-US/developers/rules" target="_blank">"Game Content Usage Rules"</a> using assets from Age of Empires II: Definitive Edition, and it is not endorsed by or affiliated with Microsoft.</div>
      <div className="wrap-960 game-content-useage-notice">Special thanks to <a href="https://aoe2.net" target="_blank">aoe2.net</a> for making their API public. This project would not have been possible without them ❤️</div>
    </div>
  );
}

export default App;
