export default function getStyles()
{
  const BLUE_COLOR = "#3f48cc";
  const RED_COLOR = "#ec1d26";
  const GREEN_COLOR = "#0afc05";
  const YELLOW_COLOR = "#fbfd15";
  const WHITE_COLOR = "#ffffff";
  const BLACK_COLOR = "#000000";

  return {
    red: RED_COLOR,
    blue: BLUE_COLOR,
    green: GREEN_COLOR,
    yellow: YELLOW_COLOR,
    white: WHITE_COLOR,
    black: BLACK_COLOR,
    axis: {
      tickLabels: {
        fontSize: 10
      }
    },
    oneVoneLabel: {
      fill: BLUE_COLOR,
      fontFamily: "inherit",
      fontSize: 12,
      fontStyle: "italic"
    },
    dmLabel: {
      fill: GREEN_COLOR,
      fontFamily: "inherit",
      fontSize: 12,
      fontStyle: "italic"
    },
    oneVone: {
      data: {stroke: BLUE_COLOR, strokeWidth: 2}
    },
    oneVoneSmall: {
      data: {stroke: BLUE_COLOR, strokeWidth: 1}
    },
    oneVoneScatter: {
      data: {fill: BLUE_COLOR}, labels: {fill:BLACK_COLOR}
    },
    dm: {
      data: {stroke: GREEN_COLOR, strokeWidth: 2}
    },
    dmSmall: {
      data: {stroke: GREEN_COLOR, strokeWidth: 1}
    },
    dmScatter: {
      data: {fill: GREEN_COLOR}, labels: {fill:BLACK_COLOR}
    },

    teamLabel: {
      fill: RED_COLOR,
      fontFamily: "inherit",
      fontSize: 12,
      fontStyle: "italic"
    },
    team: {
      data: {stroke: RED_COLOR, strokeWidth: 2}
    },
    teamSmall: {
      data: {stroke: RED_COLOR, strokeWidth: 1}
    },
    teamScatter: {
      data: {fill: RED_COLOR}, labels: {fill: BLACK_COLOR}
    },
    teamDmLabel: {
      fill: YELLOW_COLOR,
      fontFamily: "inherit",
      fontSize: 12,
      fontStyle: "italic"
    },
    teamDm: {
      data: {stroke: YELLOW_COLOR, strokeWidth: 2}
    },
    teamDmSmall: {
      data: {stroke: YELLOW_COLOR, strokeWidth: 1}
    },
    teamDmScatter: {
      data: {fill: YELLOW_COLOR}, labels: {fill: BLACK_COLOR}
    },
    brush: {
      fill: WHITE_COLOR,
      opacity: 0.2
    }
  };
};