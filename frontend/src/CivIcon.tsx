import React  from 'react';

interface ICivIconProps {
  civ: string
}

const civPositions:any = {
  "huns": {x: 0, y: 0},
  "tatars": {x: 1, y: 0},
  "byzantines": {x: 2, y: 0},
  "koreans": {x: 3, y:0},
  "japanese": {x: 4, y:0},
  "mongols": {x: 5, y:0},
  "saracens": {x: 6, y:0},
  "franks": {x: 0, y: 1},
  "portuguese": {x: 1, y: 1},
  "berbers": {x: 2, y: 1},
  "slavs": {x: 3, y: 1},
  "vietnamese": {x: 4, y: 1},
  "britons": {x: 5, y: 1},
  "mayans": {x: 6, y: 1},
  "bulgarians": {x: 0, y: 2},
  "spanish": {x: 1, y: 2},
  "khmer": {x: 2, y: 2},
  "celts": {x: 3, y: 2},
  "ethiopians": {x: 4, y: 2},
  "italians": {x: 5, y: 2},
  "cumans": {x: 6, y: 2},
  "vikings": {x: 0, y: 3},
  "aztecs": {x: 1, y: 3},
  "chinese": {x: 2, y: 3},
  "incas": {x: 3, y: 3},
  "malians": {x: 4, y: 3},
  "indians": {x: 5, y: 3},
  "burmese": {x: 6, y: 3},
  "turks": {x: 0, y: 4},
  "goths": {x: 1, y: 4},
  "malay": {x: 2, y: 4},
  "lithuanians": {x: 3, y: 4},
  "persians": {x: 4, y: 4},
  "teutons": {x: 5, y: 4},
  "magyars": {x: 6, y: 4}
};

const CivIcon: React.FC<ICivIconProps> = ({civ}) => {
  const position = civPositions[civ.toLowerCase()];
  const style = {
    backgroundPositionY: `${position.y * -37}px`,
    backgroundPositionX: `${position.x * -37}px`
  }
  const classNames= `civ-icon ${civ}`;
  return <div className={classNames} style={style}></div>
};

const CivIconWithLabel: React.FC<ICivIconProps> = ({civ}) => {
  return <div className="civ-icon-with-label">
    <CivIcon civ={civ}/>
    <label>{civ}</label>
  </div>
};

export default CivIcon;

export {CivIconWithLabel};