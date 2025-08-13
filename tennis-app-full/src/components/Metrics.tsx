"use client";

/**
 * Metrics Components with Trend Indicators
 * 
 * This file contains various metric components that can display trend indicators
 * showing data changes over the last N days.
 * 
 * Key Components:
 * - TrendIndicator: A small chart component that shows trend data
 * - MetricsWithTrend: A complete metric card with integrated trend indicator
 * - Enhanced existing metrics with optional trend indicators
 * 
 * Usage Examples:
 * 
 * // Basic trend indicator
 * <TrendIndicator data={[45, 52, 48, 61, 55, 67, 72]} days={7} size="md" />
 * 
 * // Metric with trend data
 * <MetricsSimple
 *   title="2,450"
 *   subtitle="Total Revenue"
 *   trend="positive"
 *   change="+12.5%"
 *   trendData={[45, 52, 48, 61, 55, 67, 72]}
 *   trendDays={7}
 * />
 * 
 * // Standalone trend-focused metric
 * <MetricsWithTrend
 *   title="Daily Active Users"
 *   subtitle="Last 14 days"
 *   change="+15.2%"
 *   changeTrend="positive"
 *   trendData={[45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 79, 88, 85, 91]}
 *   trendDays={14}
 *   size="lg"
 * />
 */

import type { FC, ReactNode } from "react";
import { useId } from "react";
import { ArrowDown, ArrowDownRight, ArrowUp, ArrowUpRight, Copy01, Eye, Share01, TrendDown01, TrendUp01, Zap } from "./icons/untitled-ui-icons";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { CurveType } from "recharts/types/shape/Curve";
import type { Props as DotProps } from "recharts/types/shape/Dot";
import { Dropdown } from "./base/dropdown/dropdown";
import { FeaturedIcon } from "./foundations/featured-icon/featured-icon";
import { cx } from "../utils/cx";

const ActionsDropdown = () => (
    <Dropdown.Root>
        <Dropdown.DotsButton />

        <Dropdown.Popover className="w-min">
            <Dropdown.Menu>
                <Dropdown.Item icon={Eye}>
                    <span className="pr-4">View more</span>
                </Dropdown.Item>
                <Dropdown.Item icon={Share01}>
                    <span className="pr-4">Share</span>
                </Dropdown.Item>
                <Dropdown.Item icon={Copy01}>
                    <span className="pr-4">Copy link</span>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
);

interface MetricChangeIndicatorProps {
    type: "simple" | "trend" | "modern";
    trend: "positive" | "negative";
    value?: string;
    className?: string;
}

export const MetricChangeIndicator = ({ type, trend, value, className }: MetricChangeIndicatorProps) => {
    const icons = {
        positive: {
            simple: ArrowUp,
            trend: TrendUp01,
            modern: ArrowUpRight,
        },
        negative: {
            simple: ArrowDown,
            trend: TrendDown01,
            modern: ArrowDownRight,
        },
    };

    const Icon = icons[trend][type];

    return (
        <div
            className={cx(
                "flex items-center",
                type === "simple" ? "gap-0.5" : "gap-1",
                type === "modern" && "rounded-md bg-primary py-0.5 pr-2 pl-1.5 shadow-xs ring-1 ring-primary ring-inset",
                className,
            )}
        >
            <Icon
                className={cx(
                    "stroke-[3px] text-fg-success-secondary",
                    type === "modern" ? "size-3" : "size-4",
                    trend === "negative" ? "text-fg-error-secondary" : "text-fg-success-secondary",
                )}
            />
            <span
                className={cx(
                    "text-sm font-medium text-secondary",
                    type === "modern" ? "text-secondary" : trend === "negative" ? "text-error-primary" : "text-success-primary",
                )}
            >
                {value}
            </span>
        </div>
    );
};

export const MetricsSimple = ({
    title = "2,000",
    subtitle = "View 24 hours",
    type,
    trend,
    change,
    footer,
    className,
    trendData,
    trendDays = 7,
}: {
    title?: string;
    subtitle?: string;
    type: "simple" | "trend" | "modern";
    trend: "positive" | "negative";
    change?: string;
    footer?: ReactNode;
    className?: string;
    trendData?: number[];
    trendDays?: number;
}) => {
    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-2 px-4 py-5 md:px-5">
                <h3 className="text-sm font-medium text-tertiary">{subtitle}</h3>

                <div className="flex items-end gap-4">
                    <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                    <MetricChangeIndicator type={type} trend={trend} value={change} />
                </div>

                {trendData && (
                    <div className="mt-2">
                        <TrendIndicator data={trendData} days={trendDays} size="sm" />
                    </div>
                )}

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-4 md:px-5">{footer}</div>}
        </div>
    );
};

export const MetricsIcon01 = ({
    title = "2,000",
    subtitle = "View 24 hours",
    footer,
    className,
}: {
    title?: string;
    subtitle?: string;
    footer?: ReactNode;
    className?: string;
}) => {
    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <FeaturedIcon color="success" theme="light" icon={TrendUp01} size="lg" />

                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-tertiary">{subtitle}</h3>

                    <div className="flex items-end gap-4">
                        <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                        <MetricChangeIndicator type="modern" trend="positive" value="100%" />
                    </div>
                </div>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-4 md:px-5">{footer}</div>}
        </div>
    );
};

export const MetricsIcon02 = ({
    title = "2,000",
    subtitle = "View 24 hours",
    footer,
    className,
}: {
    title?: string;
    subtitle?: string;
    footer?: ReactNode;
    className?: string;
}) => {
    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <div className="flex items-center gap-3">
                    <FeaturedIcon color="brand" theme="light" size="lg" icon={Zap} />
                    <h3 className="text-md font-semibold text-primary">{subtitle}</h3>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                    <div className="flex gap-2">
                        <MetricChangeIndicator type="simple" trend="positive" value="100%" />
                        <span className="text-sm font-medium text-tertiary">vs last month</span>
                    </div>
                </div>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-4 md:px-5">{footer}</div>}
        </div>
    );
};

export const MetricsIcon03 = ({
    icon = TrendUp01,
    title = "2,000",
    subtitle = "View 24 hours",
    change = "100%",
    changeTrend = "positive",
    actions = true,
    className,
    footer,
    trendData,
    trendDays = 7,
}: {
    icon?: FC<{ className?: string }>;
    title?: string;
    subtitle?: string;
    change?: string;
    changeTrend?: "positive" | "negative";
    actions?: boolean;
    footer?: ReactNode;
    className?: string;
    trendData?: number[];
    trendDays?: number;
}) => {
    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <FeaturedIcon color="gray" theme="modern" icon={icon || TrendUp01} size="lg" />

                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-tertiary">{subtitle}</h3>

                    <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                        <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                        <div className="flex gap-2">
                            <MetricChangeIndicator type="trend" trend={changeTrend} value={change} />
                            <span className="text-sm font-medium text-tertiary">vs last month</span>
                        </div>
                    </div>

                    {trendData && (
                        <div className="mt-2">
                            <TrendIndicator data={trendData} days={trendDays} size="sm" />
                        </div>
                    )}
                </div>

                {actions && (
                    <div className="absolute top-4 right-4 md:top-5 md:right-5">
                        <ActionsDropdown />
                    </div>
                )}
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-3 pr-4 md:p-4 md:pr-5">{footer}</div>}
        </div>
    );
};

export const MetricsIcon04 = ({
    icon = TrendUp01,
    title = "2,000",
    subtitle = "View 24 hours",
    change = "100%",
    changeTrend = "positive",
    actions = true,
    footer,
    className,
}: {
    icon?: FC<{ className?: string }>;
    title?: string;
    subtitle?: string;
    change?: string;
    changeTrend?: "positive" | "negative";
    actions?: boolean;
    footer?: ReactNode;
    className?: string;
}) => {
    return (
        <div className={cx("min-w-70 rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:flex-row md:px-5">
                <FeaturedIcon color="gray" theme="modern" icon={icon} size="md" />

                <div className="flex w-full flex-col gap-2">
                    <h3 className="text-sm font-semibold text-tertiary">{subtitle}</h3>

                    <div className="flex w-full flex-wrap items-center justify-between gap-4">
                        <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>

                        <MetricChangeIndicator type="modern" trend={changeTrend} value={change} />
                    </div>
                </div>

                {actions && (
                    <div className="absolute top-4 right-4 md:top-5 md:right-5">
                        <ActionsDropdown />
                    </div>
                )}
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-3 pr-4 md:p-4 md:pr-5">{footer}</div>}
        </div>
    );
};

const CustomizedDot = (props: DotProps & { payload?: { highlight?: boolean }; dotColor?: string }) => {
    if (!props.payload?.highlight) {
        return null;
    }

    const size = 20;

    return (
        <svg
            x={Number(props.cx) - size / 2}
            y={Number(props.cy) - size / 2}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            className={cx("text-fg-success-secondary", props.dotColor)}
        >
            <rect x="1.75" y="1.625" width="17.25" height="17.25" rx="8.625" className="stroke-current" strokeOpacity={0.2} strokeWidth="2" />
            <rect x="6.125" y="6" width="8.5" height="8.5" rx="4.25" className="fill-bg-primary stroke-current" strokeWidth="2" />
        </svg>
    );
};

const lineData = [
    { value: 10 },
    { value: 15 },
    { value: 12 },
    { value: 20 },
    { value: 18 },
    { value: 25 },
    { value: 30 },
    { value: 28 },
    { value: 32 },
    { value: 35 },
    { value: 40, highlight: true },
    { value: 32 },
    { value: 40 },
    { value: 50 },
    { value: 55 },
];

export const MetricsChart01 = ({
    title = "2,000",
    subtitle = "View 24 hours",
    change = "100%",
    changeDescription = "vs last month",
    actions = true,
    chartData = lineData,
    trend = "positive",
    footer,
    className,
    trendData,
    trendDays = 7,
}: {
    title?: string;
    subtitle?: string;
    change?: string;
    changeDescription?: string;
    actions?: boolean;
    trend?: "positive" | "negative";
    chartData?: { value: number; highlight?: boolean }[];
    footer?: ReactNode;
    className?: string;
    trendData?: number[];
    trendDays?: number;
}) => {
    const id = useId();

    const chartColor = trend === "positive" ? "text-fg-success-secondary" : "text-fg-error-secondary";

    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-5 px-4 py-5 md:px-5">
                <h3 className="text-md font-semibold text-primary">{subtitle}</h3>

                <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-3">
                        <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                        <div className="flex gap-2">
                            <MetricChangeIndicator type="simple" trend={trend} value={change} />
                            <span className="text-sm font-medium text-tertiary">{changeDescription}</span>
                        </div>
                        {trendData && (
                            <div className="mt-1">
                                <TrendIndicator data={trendData} days={trendDays} size="sm" />
                            </div>
                        )}
                    </div>

                    <AreaChart
                        height={56}
                        width={112}
                        data={chartData}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="currentColor" className={chartColor} stopOpacity="1" />
                                <stop offset="95%" stopColor="currentColor" className={chartColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <Area
                            isAnimationActive={false}
                            className={chartColor}
                            dataKey="value"
                            type="monotone"
                            stroke="currentColor"
                            strokeWidth={2}
                            fill={`url(#gradient-${id})`}
                            fillOpacity={0.2}
                            dot={<CustomizedDot dotColor={chartColor} />}
                        />
                    </AreaChart>
                </div>

                {actions && (
                    <div className="absolute top-4 right-4 md:top-5 md:right-5">
                        <ActionsDropdown />
                    </div>
                )}
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-4 md:px-5">{footer}</div>}
        </div>
    );
};

const lineData2 = [
    { a: 10, b: 0 },
    { a: 5, b: 30 },
    { a: 30, b: 20 },
    { a: 20, b: 35 },
];

export const MetricsChart02 = ({
    icon = Eye,
    title = "2,000",
    subtitle = "View 24 hours",
    change = "100%",
    changeTrend = "positive",
    footer,
    className,
}: {
    icon?: FC<{ className?: string }>;
    title?: string;
    subtitle?: string;
    change?: string;
    changeTrend?: "positive" | "negative";
    footer?: ReactNode;
    className?: string;
}) => {
    const id = useId();
    const chartColor = changeTrend === "positive" ? "text-fg-success-secondary" : "text-fg-error-secondary";

    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <div className="flex items-center gap-3">
                    <FeaturedIcon color="gray" theme="modern" size="lg" icon={icon} />
                    <h3 className="text-md font-semibold text-primary">{subtitle}</h3>
                </div>

                <div className="flex items-end justify-between gap-4">
                    <div className="flex items-start gap-2">
                        <p className="flex-1 text-display-sm font-semibold text-primary lg:text-display-md">{title}</p>
                        <MetricChangeIndicator type="trend" trend={changeTrend} value={change} />
                    </div>

                    <AreaChart
                        height={56}
                        width={128}
                        data={lineData2}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="currentColor" className={chartColor} stopOpacity="1" />
                                <stop offset="95%" stopColor="currentColor" className={chartColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <Area
                            className={chartColor}
                            dataKey="a"
                            type="monotone"
                            strokeWidth={0}
                            fill="currentColor"
                            fillOpacity={0.2}
                            isAnimationActive={false}
                        />
                        <Area dataKey="b" type="monotone" strokeWidth={0} fill={`url(#gradient-${id})`} fillOpacity={0.2} isAnimationActive={false} />
                    </AreaChart>
                </div>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-3 pr-4 md:p-4 md:pr-5">{footer}</div>}
        </div>
    );
};

const lineData3 = [{ value: 0 }, { value: 9 }, { value: 6 }, { value: 15 }];

export const MetricsChart03 = ({
    title = "2,000",
    subtitle = "View 24 hours",
    type = "trend",
    change,
    changeTrend,
    changeDescription,
    chartColor,
    chartAreaFill,
    chartCurveType,
    chartData = lineData3,
    footer,
    className,
}: {
    title?: string;
    subtitle?: string;
    type?: "simple" | "trend" | "modern";
    change: string;
    changeTrend: "positive" | "negative";
    changeDescription?: string;
    chartColor?: string;
    chartAreaFill?: string;
    chartCurveType?: CurveType;
    chartData?: { value: number }[];
    footer?: ReactNode;
    className?: string;
}) => {
    const id = useId();

    chartColor = chartColor ?? (changeTrend === "positive" ? "text-fg-success-secondary" : "text-fg-error-secondary");

    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-tertiary">{subtitle}</h3>

                    <div className="flex items-center gap-4">
                        <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                        <div className="flex gap-2">
                            <MetricChangeIndicator type={type} trend={changeTrend} value={change} />
                            {changeDescription && <span className="text-sm font-medium text-tertiary">{changeDescription}</span>}
                        </div>
                    </div>
                </div>

                <ResponsiveContainer height={72}>
                    <AreaChart
                        data={chartData}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="currentColor" className={chartColor} stopOpacity="1" />
                                <stop offset="95%" stopColor="currentColor" className={chartColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <Area
                            isAnimationActive={false}
                            className={chartColor}
                            dataKey="value"
                            type={chartCurveType || "monotone"}
                            stroke="currentColor"
                            strokeWidth={2}
                            fill={chartAreaFill || `url(#gradient-${id})`}
                            fillOpacity={0.2}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-3 pr-4 md:p-4 md:pr-5">{footer}</div>}
        </div>
    );
};

export const MetricsChart04 = ({
    title,
    subtitle,
    type = "trend",
    change,
    changeTrend,
    changeDescription,
    chartColor = "text-fg-success-secondary",
    chartAreaFill,
    chartCurveType,
    chartData = lineData3,
    footer,
    className,
}: {
    title: string;
    subtitle: string;
    type?: "simple" | "trend" | "modern";
    change: string;
    changeTrend: "positive" | "negative";
    changeDescription?: string;
    chartColor?: string;
    chartAreaFill?: string;
    chartCurveType?: CurveType;
    chartData?: { value: number }[];
    footer?: ReactNode;
    className?: string;
}) => {
    const id = useId();

    chartColor = chartColor ?? (changeTrend === "positive" ? "text-fg-success-secondary" : "text-fg-error-secondary");

    return (
        <div className={cx("flex flex-col overflow-hidden rounded-xl bg-secondary_subtle shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="mb-0.5 px-4 pt-3 pb-2 md:px-5">
                <h3 className="text-sm font-semibold text-primary">{subtitle}</h3>
            </div>
            <div className="relative flex flex-col gap-4 rounded-xl bg-primary px-4 py-5 shadow-xs ring-1 ring-secondary ring-inset md:gap-5 md:px-5">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <p className="text-display-sm font-semibold text-primary">{title}</p>
                        <div className="flex gap-2">
                            <MetricChangeIndicator type={type} trend={changeTrend} value={change} />
                            {changeDescription && <span className="text-sm font-medium text-tertiary">{changeDescription}</span>}
                        </div>
                    </div>
                </div>

                <ResponsiveContainer height={56}>
                    <AreaChart
                        data={chartData}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                        className={chartColor}
                    >
                        <defs>
                            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="currentColor" className={chartColor} stopOpacity="1" />
                                <stop offset="95%" stopColor="currentColor" className={chartColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <Area
                            isAnimationActive={false}
                            className={chartColor}
                            dataKey="value"
                            type={chartCurveType || "monotone"}
                            stroke="currentColor"
                            strokeWidth={2}
                            fill={chartAreaFill || `url(#gradient-${id})`}
                            fillOpacity={0.2}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>
            {footer && <div className="flex items-center justify-end py-3 pr-4 pl-3 md:pr-5 md:pl-4">{footer}</div>}
        </div>
    );
};

interface TrendIndicatorProps {
    data: number[];
    days?: number;
    size?: "sm" | "md" | "lg";
    className?: string;
}

// Utility functions for trend calculations
export const calculateTrendStats = (data: number[], days: number) => {
    const recentValues = data.slice(-days);
    const startValue = recentValues[0];
    const endValue = recentValues[recentValues.length - 1];
    const change = endValue - startValue;
    const changePercent = startValue !== 0 ? (change / startValue) * 100 : 0;
    const trend = change >= 0 ? "positive" : "negative";
    
    return {
        trend,
        change,
        changePercent: Math.abs(changePercent),
        startValue,
        endValue,
        recentValues
    };
};

export const TrendIndicator = ({ data, days = 7, size = "md", className, showStats = true }: TrendIndicatorProps & { showStats?: boolean }) => {
    const sizeClasses = {
        sm: "h-8 w-16",
        md: "h-10 w-20", 
        lg: "h-12 w-24"
    };

    const strokeWidth = size === "sm" ? 1 : size === "md" ? 1.5 : 2;
    
    // Calculate trend statistics
    const stats = calculateTrendStats(data, days);
    const chartColor = stats.trend === "positive" ? "text-fg-success-secondary" : "text-fg-error-secondary";
    
    // Normalize data to fit in the chart area
    const min = Math.min(...stats.recentValues);
    const max = Math.max(...stats.recentValues);
    const range = max - min || 1;
    const normalizedData = stats.recentValues.map(value => ({
        value: ((value - min) / range) * 100
    }));

    return (
        <div className={cx("flex items-center gap-2", className)}>
            <div className={sizeClasses[size]}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={normalizedData}
                        margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
                    >
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            fill="currentColor"
                            fillOpacity={0.2}
                            isAnimationActive={false}
                            className={chartColor}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {showStats && (
                <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-secondary">
                        Last {days} days
                    </span>
                    <span className={cx(
                        "text-xs font-semibold",
                        stats.trend === "positive" ? "text-success-primary" : "text-error-primary"
                    )}>
                        {stats.trend === "positive" ? "↗" : "↘"} {stats.changePercent.toFixed(1)}%
                    </span>
                </div>
            )}
        </div>
    );
};

export const MetricsWithTrend = ({
    title = "2,000",
    subtitle = "View 24 hours",
    change = "100%",
    changeTrend = "positive",
    trendData = [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 79, 88, 85, 91],
    trendDays = 14,
    size = "md",
    footer,
    className,
}: {
    title?: string;
    subtitle?: string;
    change?: string;
    changeTrend?: "positive" | "negative";
    trendData?: number[];
    trendDays?: number;
    size?: "sm" | "md" | "lg";
    footer?: ReactNode;
    className?: string;
}) => {
    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-tertiary">{subtitle}</h3>
                    <ActionsDropdown />
                </div>

                <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-3">
                        <p className="text-display-sm font-semibold text-primary">{title}</p>
                        <MetricChangeIndicator type="modern" trend={changeTrend} value={change} />
                    </div>
                    
                    <TrendIndicator data={trendData} days={trendDays} size={size} />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-4 md:px-5">{footer}</div>}
        </div>
    );
};

export const TrendIndicatorExamples = () => {
    const dailyData = [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 79, 88, 85, 91];
    const weeklyData = [67, 72, 68, 75, 82, 79, 88];
    const monthlyData = [1200, 1350, 1280, 1420, 1380, 1550, 1620, 1580, 1680, 1750, 1720, 1850];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary rounded-lg border border-secondary">
                    <h4 className="text-sm font-medium text-secondary mb-2">Small Trend (7 days)</h4>
                    <TrendIndicator data={weeklyData} days={7} size="sm" />
                </div>
                
                <div className="p-4 bg-primary rounded-lg border border-secondary">
                    <h4 className="text-sm font-medium text-secondary mb-2">Medium Trend (14 days)</h4>
                    <TrendIndicator data={dailyData} days={14} size="md" />
                </div>
                
                <div className="p-4 bg-primary rounded-lg border border-secondary">
                    <h4 className="text-sm font-medium text-secondary mb-2">Large Trend (30 days)</h4>
                    <TrendIndicator data={monthlyData} days={30} size="lg" />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary rounded-lg border border-secondary">
                    <h4 className="text-sm font-medium text-secondary mb-2">Chart Only (No Stats)</h4>
                    <TrendIndicator data={dailyData} days={14} size="md" showStats={false} />
                </div>
                
                <div className="p-4 bg-primary rounded-lg border border-secondary">
                    <h4 className="text-sm font-medium text-secondary mb-2">Custom Styling</h4>
                    <TrendIndicator 
                        data={dailyData} 
                        days={14} 
                        size="md" 
                        className="bg-secondary_subtle p-2 rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};
