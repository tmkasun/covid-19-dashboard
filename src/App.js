import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Papa from "papaparse";
import sampleData from "./tests/data";
import TimeSelector from "./libs/TimeSelector"

import LineChart from "./libs/LineChart";
import PieChart from "./libs/PieChart";
import BarChart from "./libs/BarChart";
import Base from "./libs/Base";
import "./styles.css";
import VaxMap from './libs/VaxMap'

console.clear();
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
/**
 *
 * https://echarts.apache.org/examples/en/editor.html?c=pie-simple
 *
 * curl   -H "Accept: application/vnd.github.v3+json"   https://api.github.com/repos/nuuuwan/covid19/contents/?ref=data -o response.json
 *
 * testing
 *
 * curl   -H "Accept: application/json"   https://raw.githubusercontent.com/nuuuwan/covid19/data/covid19.epid.vaxs.20210129.json -o response.json
 *
 * http://www.epid.gov.lk/web/index.php?option=com_content&view=article&id=225&lang=en
 */

const App = () => {
    const [lineChartOptions, setLineChartOptions] = useState(null);
    const [pieChartOptions, setPieChartOptions] = useState(null);
    const [dataType, setDataType] = useState("total");
    const [githubData, setGithubData] = useState(null);
    const [lastXDays, setLastXDays] = useState(0);
    const [cumTotal, setCumTotal] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        const asyncFun = async () => {
            const response = await fetch(
                "https://raw.githubusercontent.com/nuuuwan/covid19/data/covid19.epid.vaxs.latest.tsv"
            );
            const jsonData = await response.text();
            const parsedData = await Papa.parse(jsonData);
            setGithubData(parsedData.data);
        };
        // setGithubData(sampleData.data);
        asyncFun();
    }, []);
    useEffect(() => {
        if (!githubData) {
            return;
        }
        const columns = githubData[0].slice(2);
        const cumulativeData = {};
        const cumulativeTotalDoses = {};
        const cumulativeWithoutTotalDoses = {};
        const cumulativeWithoutTotalDoses1 = {};
        const cumulativeWithoutTotalDoses2 = {};
        let index = 0;
        for (let column of columns) {
            if (column.startsWith("cum_")) {
                cumulativeData[column] = index;
                if (!column.includes("total")) {
                    cumulativeWithoutTotalDoses[column] = index;
                    if (column.includes("_dose1")) {
                        cumulativeWithoutTotalDoses1[column] = index;
                    }
                    if (column.includes("_dose2")) {
                        cumulativeWithoutTotalDoses2[column] = index;
                    }
                }
            }
            if (column.startsWith("cum_total")) {
                cumulativeTotalDoses[column] = index;
            }
            index += 1;
        }
        let _selection = cumulativeTotalDoses;

        if (dataType === "Dose1") {
            _selection = cumulativeWithoutTotalDoses1;
        }
        if (dataType === "dose2") {
            _selection = cumulativeWithoutTotalDoses2;
        }
        const selection = {};
        for (const [key, value] of Object.entries(_selection)) {
            selection[
                key.replace("cum_", "").split("_").join(" ").capitalize()
            ] = value;
        }
        const dataLength = githubData.length - 1;
        const dataSet =
            lastXDays === 0 ?
                githubData.slice(0, -1) :
                githubData.slice(dataLength - lastXDays, -1);
        setLastUpdated(dataSet[dataLength - 1]);
        const yAxisData = {};
        const xAxisData = [];
        const pieData = [];
        const MAX = 1999;
        let dataIndex = 0;
        for (let row of dataSet) {
            if (dataIndex >= MAX) {
                break;
            }
            xAxisData.push(row[1]);
            if (dataIndex === dataSet.length - 1) {
                const populationComparisonData = {
                    cum_total_dose1: row[cumulativeTotalDoses.cum_total_dose1 + 2],
                    cum_total_dose2: row[cumulativeTotalDoses.cum_total_dose2 + 2]
                };
                setCumTotal(populationComparisonData);
            }
            for (const [key, value] of Object.entries(selection)) {
                if (dataIndex === dataSet.length - 1) {
                    pieData.push({ value: row[value + 2], name: key });
                }
                if (yAxisData[key]) {
                    yAxisData[key].data.push(row[value + 2]);
                } else {
                    yAxisData[key] = {
                        name: key,
                        type: "line",
                        emphasis: {
                            focus: "series"
                        },
                        data: [row[value + 2]]
                    };
                }
            }

            dataIndex += 1;
        }

        let opts = {
            title: {},
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    label: {
                        backgroundColor: "#6a7985"
                    }
                }
            },
            legend: {
                data: Object.keys(selection).map((k) =>
                    k.replace("cum_", "").split("_").join(" ")
                )
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            xAxis: [{
                type: "category",
                boundaryGap: false,
                data: xAxisData
            }],
            yAxis: [{
                type: "value"
            }],
            series: Object.values(yAxisData)
        };

        const pieOpts = {
            title: {
                text: "Covid-19 vaccination progress",
                subtext: "Sri Lanka",
                left: "center"
            },
            tooltip: {
                trigger: "item"
            },
            legend: {
                orient: "vertical",
                left: "left"
            },
            series: [{
                name: "Vaccinated",
                type: "pie",
                radius: "50%",
                data: pieData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                }
            }]
        };
        setPieChartOptions(pieOpts);
        setLineChartOptions(opts);
    }, [lastXDays, githubData, dataType]);

    return (
        <Base
            lastUpdated={lastUpdated}
            setLastXDays={setLastXDays}
            lastXDays={lastXDays}
            isLoading={!githubData}
            dataType={dataType}
            setDataType={setDataType}
        >
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
            >
                <Grid sm={12} md={12} item>
                    {cumTotal && <BarChart data={cumTotal} />}
                </Grid>
                <Grid sm={12} md={6} item>
                    <TimeSelector />
                    {lineChartOptions && <LineChart id="c1" options={lineChartOptions} />}
                </Grid>
                <Grid sm={12} md={6} item>
                    {pieChartOptions && <PieChart options={pieChartOptions} />}
                </Grid>
                <Grid item sm={12}>
                    <VaxMap />
                </Grid>
            </Grid>
        </Base>
    );
};

export default App;