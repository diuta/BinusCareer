import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { HorizontalAlignmentType, VerticalAlignmentType } from "recharts/types/component/DefaultLegendContent";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { LayoutType } from "recharts/types/util/types";

const formatValue = (value) => {
  if (typeof value === "number") {
    return new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 0,
        }).format(value)
      ?? value.toString();
  }
  return value;
};

const COLORS = [
  "#F3931B",
  "#81C7E9",
  "#0097DA",
  "#BCDBA2",
  "#F8C381",
  "#E57373",
  "#64B5F6",
  "#81C784",
  "#FFD54F",
  "#BA68C8",
  "#FF8A65",
  "#4DB6AC",
  "#9575CD",
  "#D4E157",
  "#A1887F",
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  boxScale
}) => {
  const offset = percent < 0.1
    ? (index % 2 === 0 ? 0.9 : 1.2)
    : 1.1;
  const radius = innerRadius + (outerRadius - innerRadius) * offset;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const boxWidth = (boxScale * 1.5) - 8;
  const boxHeight = boxScale;
  const fillColor = COLORS[index % COLORS.length];

  return (
    <g>
      <rect
        x={x - boxWidth / 2}
        y={y - boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        fill="#F2F2F2"
        style={{
          stroke: "#DDDFE2",
          strokeWidth: 1,
        }}
        rx={6}
        ry={6}
      />
      <text
        x={x}
        y={y}
        fill={fillColor}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: boxScale / 2.8,
          fontWeight: 'bold',
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

function CustomTooltip({ active, payload, label, data }: TooltipProps<ValueType, NameType> & { data: { name: string; value: number }[] }) {
  if (active && payload && payload.length > 0) {
    return (
      <div
        className="recharts-tooltip-wrapper"
        style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        <p>{payload[0].name}</p>
        <p>{formatValue(payload[0].value)} ({((payload[0].value as number/ data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(2)}%)</p>
      </div>
    );
  }

  return null;
}

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
  maxLegendItems?: number;
  legendLayout?: LayoutType;
  grid?: number;
}

function PieChartComp({ data, maxLegendItems, legendLayout = "vertical", grid = 2}: PieChartProps) {
  const [fontSize, setFontSize] = useState("14px");
  const [boxScale, setBoxScale] = useState(36);
  const [legendWidth, setLegendWidth] = useState(180);
  const [layoutAlign, verticalAlign, horizontalAlign]: [LayoutType, VerticalAlignmentType, HorizontalAlignmentType] =
    legendLayout === "horizontal" || window.innerWidth <= 600
      ? ["horizontal", "bottom", "center"]
      : [legendLayout, "middle", "right"];

  useEffect(() => {
    const updateLegendMaxWidth = () => {
      if (window.innerWidth <= 600) {
        setFontSize("11.5px");
        setLegendWidth(window.innerWidth*0.9);
        setBoxScale(28)
      } else if (window.innerWidth <= 1440) {
        setFontSize("11.5px");
        setLegendWidth(100);
        setBoxScale(28)
      } else {
        setFontSize("14px");
        setLegendWidth(180);
        setBoxScale(36);
      }
    };

    window.addEventListener("resize", updateLegendMaxWidth);
    updateLegendMaxWidth();

    return () => window.removeEventListener("resize", updateLegendMaxWidth);
  }, []);

  const renderSVG = (color: string) => (
    <svg width="14" height="14" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} viewBox="0 0 32 32">
      <path stroke="none" fill={color} d="M0,4h32v24h-32z"/>
    </svg>
  );

  const renderLegendText = (props) => {
    // eslint-disable-next-line react/prop-types
    const { payload } = props;
    const gridLayout = "auto ".repeat(grid);

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "inline-grid", gridTemplateColumns: gridLayout}}>
          {
            // eslint-disable-next-line react/prop-types
            payload.map((entry) => (
              <li style={{ marginRight: "12px" }}>
                {renderSVG(entry.color)}
                <span
                  style={{
                    fontSize,
                    whiteSpace: "normal",
                    maxWidth: legendWidth,
                    color: entry.color
                  }}
                >
                  {entry.value}
                </span>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }

  const innerRadius = "30%";
  const outerRadius = "75%";

  // Limit the legend data to maxLegendItems
  const limitedLegendData = data.slice(0, maxLegendItems).map(x => {
    if (x.name.includes("/")) {
      return { name: x.name.split("/").join(" / "), value: x.value }
    }
    return { name: x.name, value: x.value };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={limitedLegendData}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          label={(props) => renderCustomizedLabel({...props, boxScale})}
          labelLine={false}
          dataKey="value"
          startAngle={90}
          endAngle={450}
          minAngle={8}
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip data={data} />} />
        <Legend
          payload={limitedLegendData.map((entry, index) => ({
            value: entry.name,
            type: "rect",
            color: COLORS[index % COLORS.length],
          }))}
          iconType="rect"
          layout={layoutAlign}
          verticalAlign={verticalAlign}
          align={horizontalAlign}
          width={layoutAlign === "horizontal" ? undefined : (legendWidth * grid * 1.35) }
          height={layoutAlign === "horizontal" ? 96 : undefined }
          content={renderLegendText}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

PieChartComp.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  maxLegendItems: PropTypes.number,
  legendLayout: PropTypes.oneOf(["horizontal", "vertical"]),
  grid: PropTypes.number,
};

export default PieChartComp;
