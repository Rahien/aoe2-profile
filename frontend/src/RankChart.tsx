import React, { useState } from 'react';
import useFetch from "use-http/dist";
import { VictoryLine, VictoryChart,createContainer, DomainTuple, VictoryTheme, VictoryScatter, VictoryTooltip, VictoryBrushContainer, VictoryZoomContainerProps, VictoryVoronoiContainerProps, VictoryAxis } from 'victory';
import moment from 'moment';
import getStyles from "./ChartStyle";
import Loading from "./Loading";

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
  steamId: string,
  gameMode: string
}

function buildDataSeries(data: any , gameMode:string): {name: string, data: { x: Date; y: number }[]}[]{
  let keys = [gameMode]
  if(gameMode === "all"){
    keys = ['oneVone', 'team', 'dm', 'teamDm'];
  }
  return keys.map((key) => {
    if(!data[key] || data[key].length === 0){
      return null;
    }
    return {data: dataTimestampsToDates(data[key]), name: key};
  }).filter((item) => {
    return !!item;
  }) as {name: string, data: { x: Date; y: number }[]}[];
}

function buildMainCharts(dataSeries: {name: string, data: { x: Date; y: number }[]}[], styles:any){
  return dataSeries.map(({data, name}) => {
    const lineName = `line-${name}`;
    const scatterName = `scatter-${name}`;
    return [
      <VictoryLine key={lineName} name={lineName} style={styles[name]} data={data}/>,
      <VictoryScatter key={scatterName} name={scatterName} size={2.5} style={styles[`${name}Scatter`]} data={data} />
    ]
  }).flat();
}

function buildSmallCharts(dataSeries: {name: string, data: { x: Date; y: number }[]}[], styles: any){
  return dataSeries.map(({data, name}) => {
    const lineName = `small-${name}`;
    return <VictoryLine key={lineName} name={lineName} style={styles[`${name}Small`]} data={data}/>
  });
}

function buildLegend(dataSeries: {name: string, data: { x: Date; y: number }[]}[], styles: any){
  const translations:{[id:string]:string} = {
    "oneVone": "Random Map 1v1",
    "team": "Random Map Team",
    "dm": "Death Match 1v1",
    "teamDm": "Death Match Team"
  }
  return dataSeries.map(({name}) => {
    const className = `legend-item ${name}`;
    return <div className={className} key={name}>
      <div className="color"></div>
      <label>{translations[name]}</label>
    </div>
  });
}

const RankChart: React.FC<IRankChartProps> = ({steamId, gameMode}) => {
  const [selectedDomain, setSelectedDomain] = useState<{x:DomainTuple, y: DomainTuple} | undefined>(undefined);
  let { loading, error, data = {oneVone: [], team: [], dm: [], teamDm: []} } = useFetch(`/rank-history?userId=${steamId}&leaderboard=3&count=1000`, {}, [steamId]);
  const VictoryZoomVoronoiContainer = createContainer<VictoryZoomContainerProps, VictoryVoronoiContainerProps>("zoom", "voronoi");
  let plot = <></>;
  if(dataAvailable(data)){
    const dataSeries = buildDataSeries(data, gameMode);
    const styles = getStyles();
    const mainCharts = buildMainCharts(dataSeries, styles);
    const smallCharts = buildSmallCharts(dataSeries, styles);
    const legend = buildLegend(dataSeries, styles);
    plot = <div className="chart-wrap">
      <h2>Rank Over Time</h2>
      <VictoryChart
        theme={VictoryTheme.material}
        scale={{x: "time"}}
        domainPadding={20}
        padding={{top:10, bottom:30, left: 38, right: 0}}
        containerComponent={
          <VictoryZoomVoronoiContainer
            voronoiBlacklist={["line-oneVone", "line-team", "line-dm", "line-teamDm"]}
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
                    "scatter-team": styles.red,
                    "scatter-teamDm": styles.yellow,
                    "scatter-oneVone": styles.blue,
                    "scatter-dm": styles.green
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
        {mainCharts}
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
        {smallCharts}
        <VictoryAxis style={styles.axis}/>
      </VictoryChart>
      <div className="legend">
        {legend}
      </div>
    </div>

  }
  return <div className="profile">
    {error && 'Error!'}
    {loading && <Loading/>}
    {plot}
  </div>;
}

export default RankChart;
