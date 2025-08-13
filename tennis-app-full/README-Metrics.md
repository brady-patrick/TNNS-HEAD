# Metrics Component

A comprehensive React component library for displaying various types of metrics and charts, built with TypeScript, Tailwind CSS, and Recharts.

## Features

- **Multiple Metric Types**: Simple, icon-based, and chart-based metrics
- **Trend Indicators**: Positive/negative change indicators with different styles
- **Interactive Charts**: Area charts with customizable data and styling
- **Responsive Design**: Mobile-first responsive layouts
- **TypeScript Support**: Full type safety and IntelliSense
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Components

### Basic Metrics

#### `MetricsSimple`
A simple metric display with title, subtitle, and change indicator.

```tsx
<MetricsSimple
  title="2,450"
  subtitle="Total Revenue"
  type="simple"
  trend="positive"
  change="+12.5%"
/>
```

#### `MetricsIcon01`
Metric with a success icon and modern change indicator.

```tsx
<MetricsIcon01
  title="3,456"
  subtitle="Monthly Sales"
/>
```

#### `MetricsIcon02`
Metric with a brand icon and simple change indicator.

```tsx
<MetricsIcon02
  title="12.5K"
  subtitle="Page Views"
/>
```

#### `MetricsIcon03`
Metric with customizable icon and trend change indicator.

```tsx
<MetricsIcon03
  title="2,789"
  subtitle="New Customers"
  change="+18.2%"
  changeTrend="positive"
  icon={TrendUp01}
/>
```

#### `MetricsIcon04`
Compact metric with icon and modern change indicator.

```tsx
<MetricsIcon04
  title="95.8%"
  subtitle="Uptime"
  change="+0.2%"
  changeTrend="positive"
/>
```

### Chart Metrics

#### `MetricsChart01`
Metric with a small area chart showing trend data.

```tsx
<MetricsChart01
  title="Revenue Growth"
  subtitle="Last 30 days"
  change="+23.4%"
  trend="positive"
  chartData={customData}
/>
```

#### `MetricsChart02`
Metric with dual area charts and icon.

```tsx
<MetricsChart02
  title="User Engagement"
  subtitle="Weekly metrics"
  change="+8.7%"
  changeTrend="positive"
  icon={Eye}
/>
```

#### `MetricsChart03`
Metric with responsive area chart and customizable options.

```tsx
<MetricsChart03
  title="Conversion Rate"
  subtitle="Monthly performance"
  change="+12.1%"
  changeTrend="positive"
  changeDescription="vs last quarter"
  chartCurveType="monotone"
/>
```

#### `MetricsChart04`
Metric with header section and area chart.

```tsx
<MetricsChart04
  title="Customer Satisfaction"
  subtitle="NPS Score"
  change="+15.3%"
  changeTrend="positive"
  changeDescription="vs last year"
/>
```

## Props

### Common Props

- `title`: The main metric value
- `subtitle`: Description or context for the metric
- `className`: Additional CSS classes
- `footer`: Optional footer content
- `actions`: Whether to show the actions dropdown (default: true)

### Change Indicator Props

- `type`: "simple" | "trend" | "modern"
- `trend`: "positive" | "negative"
- `change`: The change value (e.g., "+12.5%")

### Chart Props

- `chartData`: Array of data points for the chart
- `chartColor`: Custom color for the chart
- `chartCurveType`: Chart curve type (e.g., "monotone", "linear")
- `chartAreaFill`: Custom fill for chart areas

## Usage Examples

### Basic Implementation

```tsx
import { MetricsSimple, MetricsIcon01, MetricsChart01 } from './components/Metrics';

function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricsSimple
        title="2,450"
        subtitle="Total Revenue"
        type="simple"
        trend="positive"
        change="+12.5%"
      />
      
      <MetricsIcon01
        title="3,456"
        subtitle="Monthly Sales"
      />
      
      <MetricsChart01
        title="Revenue Growth"
        subtitle="Last 30 days"
        change="+23.4%"
        trend="positive"
      />
    </div>
  );
}
```

### Custom Chart Data

```tsx
const customData = [
  { value: 10 },
  { value: 15 },
  { value: 12 },
  { value: 20 },
  { value: 18 },
  { value: 25 },
  { value: 30, highlight: true },
  { value: 28 },
  { value: 32 },
  { value: 35 }
];

<MetricsChart01
  title="Custom Chart"
  subtitle="With custom data"
  change="+45.2%"
  trend="positive"
  chartData={customData}
/>
```

## Dependencies

- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- Recharts (for charts)
- Lucide React (for icons)

## Installation

```bash
npm install recharts lucide-react
```

## Styling

The components use Tailwind CSS classes and expect certain design tokens to be available. You may need to customize the color scheme in your `tailwind.config.js` to match your design system.

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile and desktop
- Touch-friendly interactions

## Contributing

When adding new metric types or modifying existing ones:

1. Maintain consistent prop interfaces
2. Follow the established naming conventions
3. Include proper TypeScript types
4. Add responsive design considerations
5. Test with various data scenarios
