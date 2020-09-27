import React, { useState } from 'react';
import useFetch from "use-http/dist";
import { VictoryLine, VictoryChart,createContainer, DomainTuple, VictoryTheme, VictoryScatter, VictoryVoronoiContainer, VictoryTooltip, VictoryBrushContainer, VictoryZoomContainerProps, VictoryVoronoiContainerProps, VictoryAxis, VictoryLabel } from 'victory';
import moment from 'moment';
import getStyles from "./ChartStyle";

interface IRankAtTime {
  rating: number,
  num_wins: number,
  num_losses: number,
  streak: number,
  drops: number,
  timestamp: number
}

const dataAvailable = (data:any) => {
  if(!data){
    return false;
  }
  let hasData = false;
  ['oneVone', 'team', 'dm', 'teamDm'].forEach((key) => {
    if(data[key] && data[key].length > 0){
      hasData = true;
    }
  });
  return hasData;
}

const dataTimestampsToDates = (data:IRankAtTime[]) => {
  return data.map((item:IRankAtTime) => {
    return {x: new Date(item.timestamp*1000), y: item.rating};
  });
}

interface IRankChartProps {
  steamId: string
}
const RankChart: React.FC<IRankChartProps> = ({steamId}) => {
  const [selectedDomain, setSelectedDomain] = useState<{x:DomainTuple, y: DomainTuple} | undefined>(undefined);
  const { loading, error, data = {oneVone: [], team: [], dm: [], teamDm: []} } = useFetch(`/rank-history?userId=${steamId}&leaderboard=3&count=100`, {}, [steamId]);
  const VictoryZoomVoronoiContainer = createContainer<VictoryZoomContainerProps, VictoryVoronoiContainerProps>("zoom", "voronoi");
  let plot = <></>;
  if(dataAvailable(data)){
    const xyDataOneVOne = dataTimestampsToDates(data.oneVone);
    const xyDataTeams = dataTimestampsToDates(data.team);
    const xyDataOneVOneDM = dataTimestampsToDates(data.dm);
    const xyDataTeamsDM = dataTimestampsToDates(data.teamDm);
    const styles = getStyles();
    plot = <div className="chart-wrap">
      <h2>Rank Over Time</h2>
      <VictoryChart
        theme={VictoryTheme.material}
        scale={{x: "time"}}
        domainPadding={20}
        padding={{top:10, bottom:30, left: 38, right: 0}}
        containerComponent={
          <VictoryZoomVoronoiContainer
            voronoiBlacklist={["line-1v1", "line-teams", "line-dm", "line-dmteams"]}
            zoomDimension="x"
            zoomDomain={selectedDomain}
            allowZoom={false}
            onZoomDomainChange={setSelectedDomain}
            labels={(point) => {
              const dateLabel = moment(point.datum.x).format('YYYY-MM-DD HH:mm');
              return `${dateLabel}: ${point.datum.y}`;
            }}
            labelComponent={<VictoryTooltip
              cornerRadius={0}
              constrainToVisibleArea={true}
              style={{
                "fontSize": 7,
              }}
              pointerLength={5}
              flyoutStyle={{
                fill: ({datum}) => {
                  const colors:any = {
                    "scatter-teams": styles.red,
                    "scatter-teamsdm": styles.yellow,
                    "scatter-1v1": styles.blue,
                    "scatter-1v1dm": styles.green
                  };
                  return colors[datum.childName] || styles.blue;
                },
                stroke: styles.black,
                strokeWidth: 0.5,
              }}/>}
          />
        }
      >
        <VictoryAxis style={styles.axis}/>
        <VictoryAxis dependentAxis style={styles.axis}/>
        <VictoryLine name="line-1v1" style={styles.oneVone} data={xyDataOneVOne}/>
        <VictoryScatter name="scatter-1v1" size={2.5} style={styles.oneVoneScatter} data={xyDataOneVOne} />
        <VictoryLine name="line-teams" style={styles.teams} data={xyDataTeams}/>
        <VictoryScatter name="scatter-teams" size={2.5} style={styles.teamsScatter} data={xyDataTeams} />
        <VictoryLine name="line-dm" style={styles.oneVoneDm} data={xyDataOneVOneDM}/>
        <VictoryScatter name="scatter-1v1dm" size={2.5} style={styles.oneVoneScatterDm} data={xyDataOneVOneDM} />
        <VictoryLine name="line-dmteams" style={styles.teamsDm} data={xyDataTeamsDM}/>
        <VictoryScatter name="scatter-teamsdm" size={2.5} style={styles.teamsScatterDm} data={xyDataTeamsDM} />
      </VictoryChart>
      <VictoryChart
        height={80}
        padding={{top:0, bottom:30, left: 38, right: 0}}
        domainPadding={5}
        theme={VictoryTheme.material}
        scale={{x: "time"}}
        containerComponent={
          <VictoryBrushContainer
            brushDimension="x"
            brushStyle={styles.brush}
            brushDomain={selectedDomain}
            onBrushDomainChange={setSelectedDomain}
          />
        }
      >
        <VictoryLine name="small-1v1" style={styles.oneVoneSmall} data={xyDataOneVOne}/>
        <VictoryLine name="small-teams" style={styles.teamsSmall} data={xyDataTeams}/>
        <VictoryLine name="small-1v1dm" style={styles.oneVoneSmallDm} data={xyDataOneVOneDM}/>
        <VictoryLine name="small-teamsdm" style={styles.teamsSmallDm} data={xyDataTeamsDM}/>
        <VictoryAxis style={styles.axis}/>
      </VictoryChart>
      <div className="legend">
        <div className="rm1v1">
          <div className="color"></div>
          <label>Random Map 1v1</label>
        </div>
        <div className="rmteam">
          <div className="color"></div>
          <label>Random Map Teams</label>
        </div>
        <div className="dm1v1">
          <div className="color"></div>
          <label>Death Match 1v1</label>
        </div>
        <div className="dmteam">
          <div className="color"></div>
          <label>Death Match 1v1</label>
        </div>
      </div>
    </div>

  }
  return <div className="profile">
    {error && 'Error!'}
    {loading && 'Loading...'}
    {plot}
  </div>;
}

export default RankChart;
