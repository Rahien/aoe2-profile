import React, { useState } from 'react';
import useFetch from "use-http/dist";
import {IncomingOptions} from "use-http/dist/types";
import { VictoryLine, VictoryChart,createContainer, DomainTuple, VictoryTheme, VictoryScatter, VictoryVoronoiContainer, VictoryTooltip, VictoryBrushContainer, VictoryZoomContainerProps, VictoryVoronoiContainerProps, VictoryAxis, VictoryLabel } from 'victory';
import moment from 'moment';
import getStyles from "./ChartStyle";
import CivIcon from "./CivIcon";
import {CivIconWithLabel} from "./CivIcon";

interface IRankAtTime {
  rating: number,
  num_wins: number,
  num_losses: number,
  streak: number,
  drops: number,
  timestamp: number
}

const dataAvailable = (data: {oneVone:IRankAtTime[], team:IRankAtTime[]}) => {
  return data && (data.oneVone.length > 0 || data.team.length > 0);
}

const dataTimestampsToDates = (data:IRankAtTime[]) => {
  return data.map((item:IRankAtTime) => {
    return {x: new Date(item.timestamp*1000), y: item.rating};
  });
}

const ProfileInfo: React.FC = () => {
  const [steamId] = useState<string>("76561198006616324");
  const [selectedDomain, setSelectedDomain] = useState<{x:DomainTuple, y: DomainTuple} | undefined>(undefined);
  const options: IncomingOptions = {
  }
  const { loading, error, data = {oneVone: [], team: []} } = useFetch(`/rank-history?userId=${steamId}&leaderboard=3&count=100`, options, [steamId]);
  const VictoryZoomVoronoiContainer = createContainer<VictoryZoomContainerProps, VictoryVoronoiContainerProps>("zoom", "voronoi");
  let plot = <></>;
  if(dataAvailable(data)){
    const xyDataOneVOne = dataTimestampsToDates(data.oneVone);
    const xyDataTeams = dataTimestampsToDates(data.team);
    const styles = getStyles();
    plot = <div className="chart-wrap">
      <VictoryChart
        theme={VictoryTheme.material}
        scale={{x: "time"}}
        domainPadding={20}
        padding={{top:50, bottom:50, left: 50, right: 0}}
        containerComponent={
          <VictoryZoomVoronoiContainer
            voronoiBlacklist={["line-1v1", "line-teams"]}
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
                  return datum.childName === "scatter-teams"? styles.red : styles.blue
                },
                stroke: styles.white,
                strokeWidth: 0.5,
              }}/>}
          />
        }
      >
        <VictoryLabel x={10} y={10} style={styles.oneVoneLabel}
                      text={"One v. One Rating"}
        />
        <VictoryLabel x={10} y={30} style={styles.teamsLabel}
                      text={"Teams Rating"}
        />

        <VictoryLine name="line-1v1" style={styles.oneVone} data={xyDataOneVOne}/>
        <VictoryScatter name="scatter-1v1" size={2.5} style={styles.oneVoneScatter} data={xyDataOneVOne} />
        <VictoryLine name="line-teams" style={styles.teams} data={xyDataTeams}/>
        <VictoryScatter name="scatter-teams" size={2.5} style={styles.teamsScatter} data={xyDataTeams} />
      </VictoryChart>
      <VictoryChart
        height={80}
        padding={{top:0, bottom:50, left: 50, right: 0}}
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
        <VictoryAxis/>
      </VictoryChart>
    </div>

  }
  return <div className="profile">
    {error && 'Error!'}
    {loading && 'Loading...'}
    {plot}

    <CivIconWithLabel civ={"Franks"}/>
    <CivIcon civ={"Saracens"}/>
    <CivIcon civ={"Britons"}/>
    <CivIcon civ={"Lithuanians"}/>
    <CivIcon civ={"Incas"}/>
  </div>;
}

export default ProfileInfo;
