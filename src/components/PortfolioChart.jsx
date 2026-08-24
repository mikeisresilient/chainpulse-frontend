import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function PortfolioChart({ data }) {
  const chartData = data.map((item) => ({
    timestamp: new Date(item.timestamp).getTime(),
    value: Number(item.value_usd),
  }));

  const formatCurrency = (value) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    }

    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    }

    return `$${value.toFixed(0)}`;
  };

  const formatDate = (timestamp) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(timestamp);
  };

  return (
    <div className="portfolio-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopOpacity={0.25} />

              <stop offset="100%" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} strokeDasharray="3 3" />

          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatDate}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
          />

          <YAxis
            domain={["dataMin - 1000000", "dataMax + 1000000"]}
            tickFormatter={formatCurrency}
            tickLine={false}
            axisLine={false}
            width={75}
          />

          <Tooltip
            labelFormatter={(timestamp) => formatDate(timestamp)}
            formatter={(value) => [
              `$${Number(value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              "Portfolio",
            ]}
          />

          <Area
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            fill="url(#portfolioGradient)"
            stroke="#60a5fa"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PortfolioChart;
