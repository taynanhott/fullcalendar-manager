"use client"

import Graph from "@/components/graph/graph";
import Loading from "@/components/ui/loading";
import Sidebar from "@/components/ui/sidebar";
import { useState } from "react";

export default function Dashboard() {
    const [loading] = useState(false);
    
    const graficoSimples = [
        {
            options: {
                chart: {
                    id: "bar" as const,
                    foreColor: "#000000",
                },
                xaxis: {
                    categories: ["1ª semana", "2ª semana", "3ª semana", "4ª semana"],
                },
                fill: {
                    colors: ["#000000"],
                },
                colors: ["#000000"],
                dataLabels: {
                    enabled: false,
                    formatter: function (val: number) {
                        return val.toFixed(2);
                    },
                },
            },
            series: [
                {
                    name: "Valor semanal",
                    data: [
                        3,
                        4,
                        2,
                        1,
                    ],
                },
            ],
            height: 200,
        },
    ];

    return (
        <>
            <div className="p-4 mt-0 lg:mt-20">
                <Graph components={graficoSimples} />
                <Sidebar />
                <Loading active={loading} />
            </div>
        </>
    );
}