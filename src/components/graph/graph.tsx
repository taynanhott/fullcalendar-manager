import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
    className?: string;
    components: {
        options: {
            chart: {
                id:
                    | "area"
                    | "line"
                    | "donut"
                    | "bar"
                    | "pie"
                    | "radialBar"
                    | "scatter"
                    | "bubble"
                    | "heatmap"
                    | "candlestick"
                    | "boxPlot"
                    | "radar"
                    | "polarArea"
                    | "rangeBar"
                    | "rangeArea"
                    | "treemap"
                    | undefined;
                foreColor?: string;
            };
            xaxis?: {
                categories: string[];
            };
            responsive?: {
                breakpoint?: number;
                options?: {
                    legend?: {
                        position?: "bottom" | "right";
                    };
                };
            }[];
            labels?: string[];
            colors?: string[];
            legend?: {
                position?: "bottom" | "left" | "right" | "top";
                show?: boolean;
            };
            dataLabels?: {
                enabled?: boolean;
                style?: {
                    colors: string[];
                };
            };
            fill?: {
                colors: string[];
            };
        };
        series:
            | number[]
            | {
                  name: string;
                  data: number[];
              }[];
        height?: number;
    }[];
}

function Graph({ className, components }: Props) {
    return (
        <>
            {components.map((component) => (
                <Chart
                    key={component.options.chart.id}
                    className={className}
                    options={component.options}
                    series={component.series}
                    type={component.options.chart.id}
                    height={component.height}
                />
            ))}
        </>
    );
}

export default Graph;
