export default function getStyles()
{
  const BLUE_COLOR = "#3f48cc";
  const RED_COLOR = "#ec1d26";
  const WHITE_COLOR = "#ffffff";

  return {
    red: RED_COLOR,
    blue: BLUE_COLOR,
    white: WHITE_COLOR,
    oneVoneLabel: {
      fill: BLUE_COLOR,
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
      data: {fill: BLUE_COLOR}, labels: {fill:WHITE_COLOR}
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
      data: {fill: RED_COLOR}, labels: {fill: WHITE_COLOR}
    },
    brush: {
      fill: WHITE_COLOR,
      opacity: 0.2
    }
  };
};