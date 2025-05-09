import PropTypes from "prop-types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function BarChartComp({ data, currencySeparator }) {
  // Function to format values based on currencySeparator prop
  const formatValue = (value) => {
    if (typeof value === "number") {
      return currencySeparator
        ? new Intl.NumberFormat("id-ID", {
            maximumFractionDigits: 2,
          }).format(value)
        : value.toString();
    }
    return value;
  };

  const isEmptyData = !data || data.every((entry) => entry.value === 0);

  const fallbackData = [{ name: "No Data", value: 0 }];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={isEmptyData ? fallbackData : data}
        margin={{
          top: 20,
          right: 30,
          left: 60,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value) => formatValue(value)}
          tick={{ fontSize: 14 }}
          // domain={[0, 50_000_000_000]}
        />
        <Tooltip formatter={(value) => `IDR ${formatValue(value)}`} />
        <Bar dataKey="value" fill="#F18700" />
      </BarChart>
    </ResponsiveContainer>
  );
}

BarChartComp.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  currencySeparator: PropTypes.bool,
};

BarChartComp.defaultProps = {
  currencySeparator: false,
};

export default BarChartComp;
