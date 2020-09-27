function getWinCountKeys(gameMode:string):string[]{
  const lookup:any = {
    'oneVone': '1v1 Random Map',
    'team': 'Team Random Map',
    'dm': '1v1 Death Match',
    'teamDm': 'Team Death Match'
  }
  if(gameMode === 'all'){
    return Object.values(lookup);
  }
  return [lookup[gameMode]];
}

export function combineWinCounts(gameMode:string, winCounts:{ [id: string]: {[id:string]: {wins: number, losses: number}}}){
  const keys = getWinCountKeys(gameMode);
  return sumWinCounts(keys.map((key) => {
    return winCounts[key] || {};
  }));
}
function sumWinCounts(winCountsList:{[id:string]: {wins: number, losses: number}}[]): {[id:string]: {wins: number, losses: number}} {
  const newWinCounts = {} as {[id:string]: {wins: number, losses: number}};
  winCountsList.forEach((winCounts) => {
    Object.keys(winCounts).forEach((key) => {
      if(!newWinCounts[key]){
        newWinCounts[key] = {wins: winCounts[key].wins, losses: winCounts[key].losses};
      }else{
        newWinCounts[key].wins = newWinCounts[key].wins + winCounts[key].wins;
        newWinCounts[key].losses = newWinCounts[key].losses + winCounts[key].losses;
      }
    });
  });
  return newWinCounts;
}
