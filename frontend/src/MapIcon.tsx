import React  from 'react';

interface IMapIconProps {
  map: string
}

const mapPositions:string[] = [
  "acropolis",
  "alpine lakes",
  "arabia",
  "archipelago",
  "arena",
  "baltic",
  "black forest",
  "bog islands",
  "bogland",
  "budapest",
  "es canals",
  "es_capricous",
  "cenotes",
  "city of lakes",
  "coastal",
  "continental",
  "crater lake",
  "es dingos",
  "fortress",
  "four lakes",
  "ghost lake",
  "golden pit",
  "gold rush",
  "golden swamp",
  "es graveyards",
  "hamburger",
  "hideout",
  "highland",
  "hill fort",
  "islands",
  "kilimanjaro",
  "lombardia",
  "mangrove jungle",
  "mediterranean",
  "megarandom",
  "es metropolis",
  "migration",
  "mongolia",
  "mountain pass",
  "mountain ridge",
  "nile delta",
  "nomad",
  "oasis",
  "pacific islands",
  "es_paradise_island",
  "es pilgrims",
  "es prairie",
  "ravines",
  "rivers",
  "salt marsh",
  "sandbank",
  "scandinavia",
  "es_seasons",
  "serengeti",
  "es_sherwood_forest",
  "es shipwreck",
  "socotra",
  "steppe",
  "team islands",
  "es the unknown",
  "valley",
  "water nomad",
  "wolf hill",
  "yucatan"
]

const MapIcon: React.FC<IMapIconProps> = ({map}) => {

  let position = mapPositions.findIndex((item) => {
    return item == map.toLowerCase();
  });
  if(position < 0){
    position = 34;
  }
  const positionX = position % 10;
  const positionY = Math.floor(position/10);
  const style = {
    backgroundPositionY: `${positionY * -40}px`,
    backgroundPositionX: `${positionX * -40}px`
  }
  const classNames= `map-icon ${map}`;
  return <div className={classNames} style={style}></div>
};

const MapIconWithLabel: React.FC<IMapIconProps> = ({map}) => {
  return <div className="civ-icon-with-label">
    <MapIcon map={map}/>
    <label>{map}</label>
  </div>
};

export default MapIcon;

export {MapIconWithLabel};