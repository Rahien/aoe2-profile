import React from 'react';
import './App.scss';
import ProfileInfo from "./ProfileInfo";
import SelectUserId from "./SelectUserId";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/profile/:id">
            <ProfileInfo/>
          </Route>
          <Route path="/">
            <SelectUserId />
          </Route>
        </Switch>
      </Router>

      <div className="wrap-960 game-content-useage-notice">Age of Empires II: HD© and Age of Empires II: Definitive Edition© Microsoft Corporation. AoE2-profile was created under Microsoft's <a href="https://www.xbox.com/en-US/developers/rules" target="_blank" rel="noopener noreferrer">"Game Content Usage Rules"</a> using assets from Age of Empires II: Definitive Edition, and it is not endorsed by or affiliated with Microsoft.</div>
      <div className="wrap-960 game-content-useage-notice">Special thanks to <a href="https://aoe2.net" target="_blank" rel="noopener noreferrer">aoe2.net</a> for making their API public. This project would not have been possible without them ❤️</div>
    </div>
  );
}

export default App;
