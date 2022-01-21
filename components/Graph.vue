<template>
  <div>
    <div class="chart" id="chartdiv"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export default defineComponent({
  name: 'graph',
  props: {
    title: String, 
    data: Array
  },
  computed: {
    graphData(){
      let _data: {[key: string]: any} = {};
      this.data.forEach((d: {[key: string]: any})=>_data[d.date] = d);

      let gData: {[key: string]: any} = {};
      let months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      months.forEach((days, i) => {
        let month = i+1;
        for (let day = 1; day <= days; day++) {
          let dateWithoutYear = `${month}/${day}`;
          let item: {[key: string]: any} = {};
          for (let year = 2019; year <= 2021; year++) {
            let dateStr = `${year}/${month}/${day}`;
            let dummyItem = _data[dateStr] || {date: dateStr, crowdingAt8: null, congestionAt21And23: null, crowdingAt15: null, numberOfNewPositiveCases: 0};
            item['dateStr'] = dummyItem.date;
            item['date'] = new Date(dummyItem.date).getTime();
            item['dateObj'] = new Date(dummyItem.date);
            item['crowdingAt8_'+year] = dummyItem.crowdingAt8;
            item['congestionAt21And23_'+year] = dummyItem.congestionAt21And23;
            item['crowdingAt15_'+year] = dummyItem.crowdingAt15
            item['numberOfNewPositiveCases_'+year] = dummyItem.numberOfNewPositiveCases;
            item['numberOfNewPositiveCases'] = (item['numberOfNewPositiveCases'] || 0) + dummyItem.numberOfNewPositiveCases
          }
          gData[dateWithoutYear] = item;
        }
      });
      return Object.values(gData);
    }
  },
  mounted() {

    let root = am5.Root.new("chartdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout
    }));

    chart.get("colors").set("step", 2);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

    // Y axis #1
    let valueAxisRenderer = am5xy.AxisRendererY.new(root, {
      opposite: false,
      // pan: "zoom"
    });

    let valueAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: valueAxisRenderer,
      // maxDeviation: 1,
      // extraMin: 0.2 // gives some extra space
      min: 0,
      max: 1
    }));

    // Y axis #2
    let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {
      opposite: true,
      // pan: "zoom"
    });

    let volumeAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: volumeAxisRenderer,
      // height: am5.percent(25),
      layer: 5,
      centerY: am5.p100,
      y: am5.p100,
      min: 0,
      max: 1000
    }));

    volumeAxis.axisHeader.set("paddingTop", 10);

    // X axis
    let dateAxisRenderer = am5xy.AxisRendererX.new(root, {});

    dateAxisRenderer.labels.template.setAll({
      minPosition: 0.01,
      maxPosition: 0.99
    });

    let dateAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      groupData: true,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      gridIntervals: [
        { timeUnit: "day", count: 1 },
        { timeUnit: "day", count: 2 },
        { timeUnit: "day", count: 3 },
        { timeUnit: "day", count: 4 },
        { timeUnit: "day", count: 5 },
        { timeUnit: "week", count: 1 },
        { timeUnit: "week", count: 2 },
        { timeUnit: "month", count: 1 }
      ],
      renderer: dateAxisRenderer
    }));

    dateAxis.set("tooltip", am5.Tooltip.new(root, {
      themeTags: ["axis"]
    }));
    dateAxis.get("dateFormats")["day"] = "MM/dd";
    dateAxis.get("dateFormats")["week"] = "MM/dd";
    dateAxis.get("dateFormats")["month"] = "MMM";
    dateAxis.get("dateFormats")["year"] = "MM/dd";
    dateAxis.get("periodChangeDateFormats")["day"] = "MM/dd";
    dateAxis.get("periodChangeDateFormats")["week"] = "MM/dd";
    dateAxis.get("periodChangeDateFormats")["month"] = "MMM";
    dateAxis.get("periodChangeDateFormats")["year"] = "MM/dd";

    // Add series
    let lines: {[key: string]: any} = {
      congestionAt21And23: {
        name: '歓楽街の人出（21時と28時の差）_',
        color: '#3f51b5'
      },
      crowdingAt8: {
        name: '主要地点の人出（8時）_',
        color: '#ffc107'
      },
      crowdingAt15: {
        name: '主要地点の人出（15時）_',
        color: '#4caf50'
      }
    };
    let lineSerieses: am5xy.LineSeries[] = [];
    for (let year = 2019; year <= 2021; year++) {
      Object.keys(lines).forEach(key=>{
        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        let series = chart.series.push(am5xy.LineSeries.new(root, {
          name: lines[key].name+" "+year,
          valueYField: key+"_"+year,
          // calculateAggregates: true,
          // valueYShow: "valueYChangeSelectionPercent",
          valueXField: "date",
          xAxis: dateAxis,
          yAxis: valueAxis,
          // legendValueText: "{valueY}",
          stroke: am5.color(lines[key].color),
          fill: am5.color(lines[key].color)
        }));
        series.strokes.template.setAll({
          strokeWidth: (year-2018)*1.5,
          strokeDasharray: year == 2019 ? [10,5] : null
        });

        // Add series tooltips
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Tooltips
        let valueTooltip = series.set("tooltip", am5.Tooltip.new(root, {
          getFillFromSprite: false,
          getStrokeFromSprite: true,
          getLabelFillFromSprite: true,
          autoTextColor: false,
          pointerOrientation: "horizontal",
          labelText: "{name}: {valueY}"
        }));
        valueTooltip.get("background").set("fill", root.interfaceColors.get("background"));

        lineSerieses.push(series);
      })
    }

    let volumeSeries = chart.series.unshift(am5xy.ColumnSeries.new(root, {
      name: "新規陽性者数",
      fill: am5.color('#9e9e9e'),
      stroke: am5.color('#9e9e9e'),
      valueYField: "numberOfNewPositiveCases",
      valueXField: "date",
      valueYGrouped: "sum",
      xAxis: dateAxis,
      yAxis: volumeAxis,
      // legendValueText: "{valueY}",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));
    volumeSeries.columns.template.setAll({
      width: am5.percent(40),
      strokeWidth: 0.2,
      strokeOpacity: 1,
      stroke: am5.color(0xffffff)
    });

    // Add legend to axis header
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-headers/
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legendNew = chart.topAxesContainer.children.push(am5.Legend.new(root, {}));
    legendNew.markers.template.setAll({
      width: 40,
      height: 8
    });
    legendNew.data.setAll([volumeSeries]);

    let legendCrowd = chart.topAxesContainer.children.push(am5.Legend.new(root, {
      width: 1072,
      layout: am5.GridLayout.new(root, {
        maxColumns: 3,
        fixedWidthGrid: false
      })
    }));
    legendCrowd.markers.template.setAll({
      width: 40,
      height: 8
    });

    chart.topAxesContainer.children.push(am5.Label.new(root, {
      text: "※Click on any item in the legend to show or hide the graph.",
      fontSize: 12,
      fontWeight: "400",
      x: am5.p100,
      centerX: am5.p100
    }));

    let tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      pointerOrientation: "up"
    });
    tooltip.label.setAll({
      fontSize: 12,
      fontWeight: "400",
    })
    tooltip.get("background").setAll({
      fill: am5.color(0xe9e9e9),
      stroke: am5.color(0x000000),
    });
    legendNew.itemContainers.template.setAll({
      tooltipText: "※Click to show or hide the graph.",
      tooltipX: am5.p50,
      tooltipY: am5.p100,
      tooltip: tooltip
    });
    legendCrowd.itemContainers.template.setAll({
      tooltipText: "※Click to show or hide the graph.",
      tooltipX: am5.p50,
      tooltipY: am5.p100,
      tooltip: tooltip
    });

    // When legend item container is hovered, dim all the series except the hovered one
    legendCrowd.itemContainers.template.events.on("pointerover", function(e) {
      let itemContainer = e.target;
      // As series list is data of a legend, dataContext is series
      let series = itemContainer.dataItem.dataContext;

      lineSerieses.forEach((chartSeries: am5xy.LineSeries) => {
        if (chartSeries != series) {
          chartSeries.strokes.template.setAll({
            strokeOpacity: 0.1,
          });
        }
      })
    })

    // When legend item container is unhovered, make all series as they are
    legendCrowd.itemContainers.template.events.on("pointerout", function(e) {
      let itemContainer = e.target;
      let series = itemContainer.dataItem.dataContext;

      lineSerieses.forEach((chartSeries: am5xy.LineSeries) => {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 1,
        });
      });
    })

    legendCrowd.data.setAll(lineSerieses);

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    chart.set("cursor", am5xy.XYCursor.new(root, {}));


    //ScrollBar
    let sbRight = chart.rightAxesContainer.children.push(am5.Scrollbar.new(root, {
      orientation: "vertical"
    }));
    let sbTop = chart.topAxesContainer.children.push(am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));

    chart.set("scrollbarX", sbTop);
    chart.set("scrollbarY", sbRight);


    lineSerieses.forEach(ls=>ls.data.setAll(this.graphData));

    volumeSeries.data.setAll(this.graphData);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);

  },
})
</script>
 
<style scoped>
.chart {
  width: 1073px;
  height: 500px;
}

</style>
