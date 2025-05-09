import PropTypes from "prop-types";
import { useEffect,useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const formatValue = (value) => {
  if (typeof value === "number") {
    return new Intl.NumberFormat("id-ID", {
          maximumFractionDigits: 0,
        }).format(value)
      ?? value.toString();
  }
  return value;
};

function CustomTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length > 0) {
    return (
      <div 
        className="recharts-tooltip-wrapper" 
        style={{ 
          backgroundColor: "white", 
          border: "1px solid #ddd", 
          paddingLeft:"10px", 
          paddingRight:"10px" 
        }}
      >
        <p style={{margin:"10px 0"}}>{`${payload[0].payload.name}`}</p>
        <p style={{margin:"10px 0", color: `${payload[0].color}`, fill: `${payload[0].color}`}}>{`${payload[0].name} : ${formatValue(payload[0].value)}`}</p>
        <p style={{margin:"10px 0", color: `${payload[1].color}`, fill: `${payload[0].color}`}}>{`${payload[1].name} : ${formatValue(payload[1].value)}`}</p>
      </div>
    );
  }

  return null;
}

function ByUpdatedDataChart({ data }) {
  const [fontSize, setFontSize] = useState("14px");
  const [legendWidth, setLegendWidth] = useState(100);

  useEffect(() => {
    const updateLegendMaxWidth = () => {
      if (window.innerWidth <= 1440) {
        setFontSize("11.5px");
        setLegendWidth(100);
      } else {
        setFontSize("14px");
        setLegendWidth(180);
      }
    };

    window.addEventListener("resize", updateLegendMaxWidth);
    updateLegendMaxWidth();

    return () => window.removeEventListener("resize", updateLegendMaxWidth);
  }, []);

  const renderLegendText = (value) => (
    <span
      style={{
        fontSize,
        whiteSpace: "normal",
        maxWidth: legendWidth,
      }}
    >
      {value}
    </span>
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={400}
        height={200}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip/>}/>
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          formatter={renderLegendText}
          wrapperStyle={{
            paddingLeft: "4px",
          }}
        />
        <Bar dataKey="totalAlumni" fill="#F18700" name="Total Alumni" />
        <Bar dataKey="totalUpdated" fill="#028ED5" name="Total Updated" />
      </BarChart>
    </ResponsiveContainer>
  );
}

ByUpdatedDataChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      totalAlumni: PropTypes.number.isRequired,
      totalUpdated: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ByUpdatedDataChart;
