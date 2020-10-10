import React  from 'react';
import Match from "./Match";

interface IRecentMatchesProps {
  matches: [],
  gameMode?: string
}

const RecentMatches: React.FC<IRecentMatchesProps> = ({matches, gameMode}) => {
  const matchItems = matches.map((match:any) => {
    return <Match key={match.started} match={match}/>;
  });
  return <div className="recent-matches">
    <h2>Recent Matches</h2>
    {matchItems}
  </div>
};

export default RecentMatches;