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
    oneVoneLabelDm: {
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
    oneVoneDm: {
      data: {stroke: GREEN_COLOR, strokeWidth: 2}
    },
    oneVoneSmallDm: {
      data: {stroke: GREEN_COLOR, strokeWidth: 1}
    },
    oneVoneScatterDm: {
      data: {fill: GREEN_COLOR}, labels: {fill:BLACK_COLOR}
    },

    teamsLabel: {
      fill: RED_COLOR,
      fontFamily: "inherit",
      fontSize: 12,
      fontStyle: "italic"
    },
    teams: {
      data: {stroke: RED_COLOR, strokeWidth: 2}
    },
    teamsSmall: {
      data: {stroke: RED_COLOR, strokeWidth: 1}
    },
    teamsScatter: {
      data: {fill: RED_COLOR}, labels: {fill: BLACK_COLOR}
    },
    teamsLabelDm: {
      fill: YELLOW_COLOR,
      fontFamily: "inherit",
      fontSize: 12,
      fontStyle: "italic"
    },
    teamsDm: {
      data: {stroke: YELLOW_COLOR, strokeWidth: 2}
    },
    teamsSmallDm: {
      data: {stroke: YELLOW_COLOR, strokeWidth: 1}
    },
    teamsScatterDm: {
      data: {fill: YELLOW_COLOR}, labels: {fill: BLACK_COLOR}
    },
    brush: {
      fill: WHITE_COLOR,
      opacity: 0.2
    }
  };
};