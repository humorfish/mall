declare var APP_VERSION: string;
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Location, LocationStrategy, HashLocationStrategy} from '@angular/common';

import {colorSets} from '../../providers/utils/color-sets';

import {barChart, lineChartSeries, GenerateData, GenerateGraph, treemap, single, multi, countries, bubble} from './data';
import chartGroups from './chartTypes';

const monthName = new Intl.DateTimeFormat('en-us', { month: 'short' });
const weekdayName = new Intl.DateTimeFormat('en-us', { weekday: 'short' });

@Component({
    selector: 'chart-page',
    providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./chart.scss'],
    templateUrl: 'chart.html'
})
export class ChartComp implements OnInit
{
    constructor(public location: Location)
    {
        Object.assign(this, {
            single,
            multi,
            countries,
            chartGroups,
            colorSets,
            graph: GenerateGraph(50),
            bubble,
            plotData: this.GeneratePlotData(),
            treemap
          });
    }

    version = APP_VERSION;

    MultiFormat(value: number)
    {
        if (value < 1000)
            return `${value.toFixed(2)}ms`;

        value /= 1000;
        if (value < 60)
            return `${value.toFixed(2)}s`;

        value /= 60;
        if (value < 60)
            return `${value.toFixed(2)}mins`;

        value /= 60;
            return `${value.toFixed(2)}hrs`;
    }

    theme = 'dark';
    chartType: string;
    chartGroups: any[];
    chart: any;
    realTimeData: boolean = false;
    countries: any[];
    single: any[];
    multi: any[];
    dateData: any[];
    dateDataWithRange: any[];
    calendarData: any[];
    statusData: any[];
    sparklineData: any[];
    timelineFilterBarData: any[];
    graph: { links: any[], nodes: any[] };
    bubble: any;
    linearScale: boolean = false;
    range: boolean = false;

    view: any[];
    width: number = 700;
    height: number = 300;
    fitContainer: boolean = false;

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    legendTitle = 'Legend';
    showXAxisLabel = true;
    tooltipDisabled = false;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'GDP Per Capita';
    showGridLines = true;
    innerPadding = '10%';
    barPadding = 8;
    groupPadding = 16;
    roundDomains = false;
    maxRadius = 10;
    minRadius = 3;
    showSeriesOnHover = true;
    roundEdges: boolean = true;
    animations: boolean = true;
    xScaleMin: any;
    xScaleMax: any;
    yScaleMin: number;
    yScaleMax: number;

    curves: any = {
        Basis: shape.curveBasis,
        'Basis Closed': shape.curveBasisClosed,
        Bundle: shape.curveBundle.beta(1),
        Cardinal: shape.curveCardinal,
        'Cardinal Closed': shape.curveCardinalClosed,
        'Catmull Rom': shape.curveCatmullRom,
        'Catmull Rom Closed': shape.curveCatmullRomClosed,
        Linear: shape.curveLinear,
        'Linear Closed': shape.curveLinearClosed,
        'Monotone X': shape.curveMonotoneX,
        'Monotone Y': shape.curveMonotoneY,
        Natural: shape.curveNatural,
        Step: shape.curveStep,
        'Step After': shape.curveStepAfter,
        'Step Before': shape.curveStepBefore,
        default: shape.curveLinear
    };

    // line interpolation
    curveType: string = 'Linear';
    curve: any = this.curves[this.curveType];
    interpolationTypes = [
        'Basis', 'Bundle', 'Cardinal', 'Catmull Rom', 'Linear', 'Monotone X',
        'Monotone Y', 'Natural', 'Step', 'Step After', 'Step Before'
    ];

    closedCurveType: string = 'Linear Closed';
    closedCurve: any = this.curves[this.closedCurveType];
    closedInterpolationTypes = [
        'Basis Closed', 'Cardinal Closed', 'Catmull Rom Closed', 'Linear Closed'
    ];

    colorSets: any;
    colorScheme: any;
    schemeType: string = 'ordinal';
    selectedColorScheme: string;
    rangeFillOpacity: number = 0.15;

    // Override colors for certain values
    // customColors: any[] = [
    //   {
    //     name: 'Germany',
    //     value: '#0000ff'
    //   }
    // ];
    // pie
    showLabels = true;
    explodeSlices = false;
    doughnut = false;
    arcWidth = 0.25;

    // line, area
    autoScale = true;
    timeline = false;

    // margin
    margin: boolean = false;
    marginTop: number = 40;
    marginRight: number = 40;
    marginBottom: number = 40;
    marginLeft: number = 40;

    // gauge
    gaugeMin: number = 0;
    gaugeMax: number = 100;
    gaugeLargeSegments: number = 10;
    gaugeSmallSegments: number = 5;
    gaugeTextValue: string = '';
    gaugeUnits: string = 'alerts';
    gaugeAngleSpan: number = 240;
    gaugeStartAngle: number = -120;
    gaugeShowAxis: boolean = true;
    gaugeValue: number = 50; // linear gauge value
    gaugePreviousValue: number = 70;

    // Combo Chart
    barChart: any[] = barChart;
    lineChartSeries: any[] = lineChartSeries;
    lineChartScheme: any = {
        name: 'coolthree',
        selectable: true,
        group: 'Ordinal',
        domain: [
        '#01579b', '#7aa3e5', '#a8385d', '#00bfa5'
        ]
    };

    comboBarScheme: any = {
        name: 'singleLightBlue',
        selectable: true,
        group: 'Ordinal',
        domain: [
        '#01579b'
        ]
    };

    showRightYAxisLabel: boolean = true;
    yAxisLabelRight: string = 'Utilization';

    // demos
    totalSales = 0;
    salePrice = 100;
    personnelCost = 100;

    mathText = '3 - 1.5*sin(x) + cos(2*x) - 1.5*abs(cos(x))';
    mathFunction: (o: any) => any;

    treemap: any[];
    treemapPath: any[] = [];
    sumBy: string = 'Size';

    // Reference lines
    showRefLines: boolean = true;
    showRefLabels: boolean = true;

    // Supports any number of reference lines.
    refLines = [
        { value: 42500, name: 'Maximum' },
        { value: 37750, name: 'Average' },
        { value: 33000, name: 'Minimum' }
    ];

    ngOnInit()
    {
        const state = this.location.path(true);
        this.SelectChart(state.length ? state : 'bar-vertical');

        setInterval(this.UpdateData.bind(this), 1000);

        if (!this.fitContainer)
        {
            this.ApplyDimensions();
        }

        // this.mathFunction = this.getFunction();

        //         Object.assign(this, {
        //         single,
        //         multi,
        //         countries,
        //         chartGroups,
        //         colorSets,
        //         graph: generateGraph(50),
        //         bubble,
        //         plotData: this.generatePlotData(),
        //         treemap
        //         });

        //         this.treemapProcess();

        //         this.dateData = generateData(5, false);
        //         this.dateDataWithRange = generateData(2, true);
        //         this.setColorScheme('cool');
        //         this.calendarData = this.getCalendarData();
        //         this.statusData = this.getStatusData();
        //         this.sparklineData = generateData(1, false, 30);
        //         this.timelineFilterBarData = timelineFilterBarData();


        //     get dateDataWithOrWithoutRange() {
        //         if (this.range) {
        //         return this.dateDataWithRange;
        //         } else {
        //         return this.dateData;
        //         }
        //     }
    }

    UpdateData()
    {
        if (!this.realTimeData)
            return;

        this.gaugeValue = this.gaugeMin + Math.floor(Math.random() * (this.gaugeMax - this.gaugeMin));

        const country = this.countries[Math.floor(Math.random() * this.countries.length)];
        const add = Math.random() < 0.7;
        const remove = Math.random() < 0.5;

        if (remove)
        {
            if (this.single.length > 1)
            {
                const index = Math.floor(Math.random() * this.single.length);
                this.single.splice(index, 1);
                this.single = [...this.single];
            }

            if (this.multi.length > 1)
            {
                const index = Math.floor(Math.random() * this.multi.length);
                this.multi.splice(index, 1);
                this.multi = [...this.multi];
            }

            if (this.bubble.length > 1)
            {
                const index = Math.floor(Math.random() * this.bubble.length);
                this.bubble.splice(index, 1);
                this.bubble = [...this.bubble];
            }

            if (this.graph.nodes.length > 1)
            {
                const index = Math.floor(Math.random() * this.graph.nodes.length);
                const value = this.graph.nodes[index].value;
                this.graph.nodes.splice(index, 1);
                const nodes = [ ...this.graph.nodes ];

                const links = this.graph.links.filter(link => {
                return link.source !== value && link.source.value !== value &&
                    link.target !== value && link.target.value !== value;
                });
                this.graph = { links, nodes };
            }
        }

        if (add)
        {
            // single
            const entry = {
                name: country.name,
                value: Math.floor(10000 + Math.random() * 50000)
            };
            this.single = [...this.single, entry];

            // multi
            const multiEntry = {
                name: country.name,
                series: [{
                name: '1990',
                value: Math.floor(10000 + Math.random() * 50000)
                }, {
                name: '2000',
                value: Math.floor(10000 + Math.random() * 50000)
                }, {
                name: '2010',
                value: Math.floor(10000 + Math.random() * 50000)
                }]
            };

            this.multi = [...this.multi, multiEntry];

            // graph
            const node = { value: country.name };
            const nodes = [ ...this.graph.nodes, node];
            const link = {
                source: country.name,
                target: nodes[Math.floor(Math.random() * (nodes.length - 1))].value,
            };
            const links = [ ...this.graph.links, link];
            this.graph = { links, nodes };

            // bubble
            const bubbleYear = Math.floor((2010 - 1990) * Math.random() + 1990);
            const bubbleEntry = {
                name: country.name,
                series: [{
                name: '' + bubbleYear,
                x: new Date(bubbleYear, 0, 1),
                y: Math.floor(30 + Math.random() * 70),
                r: Math.floor(30 + Math.random() * 20),
                }]
            };

            this.bubble = [...this.bubble, bubbleEntry];

            this.statusData = this.GetStatusData();
        }

        const date = new Date(Math.floor(1473700105009 +  Math.random() * 1000000000));
        for (const series of this.dateData)
        {
            series.series.push({
                name: date,
                value: Math.floor(2000 + Math.random() * 5000)
            });
        }
        this.dateData = [...this.dateData];

        this.dateDataWithRange = GenerateData(2, true);

        if (this.chart.inputFormat === 'calendarData')
            this.calendarData = this.GetCalendarData();
    }

    ApplyDimensions()
    {
        this.view = [this.width, this.height];
    }

    ToggleFitContainer(event: any)
    {
        this.fitContainer = event;

        if (this.fitContainer)
        {
            this.view = undefined;
        }
        else
        {
            this.ApplyDimensions();
        }
    }

    SelectChart(chartSelector: any)
    {
        this.chartType = chartSelector = chartSelector.replace('/', '');
        this.location.replaceState(this.chartType);

        for (const group of this.chartGroups)
        {
            this.chart = group.charts.find((x: any) => x.selector === chartSelector);
            if (this.chart)
                break;
        }

        this.linearScale = false;
        this.yAxisLabel = 'GDP Per Capita';
        this.xAxisLabel = 'Country';

        this.width = 700;
        this.height = 300;

        Object.assign(this, this.chart.defaults);

        if (!this.fitContainer)
            this.ApplyDimensions();
    }

    Select(data: any)
    {
        console.log('Item clicked', data);
    }

    GetInterpolationType(curveType: any)
    {
        return this.curves[curveType] || this.curves['default'];
    }

    SetColorScheme(name: any)
    {
        this.selectedColorScheme = name;
        this.colorScheme = this.colorSets.find((s: any) => s.name === name);
    }

    OnLegendLabelClick(entry: any)
    {
        console.log('Legend clicked', entry);
    }

    GetCalendarData(): any[]
    {
        // today
        const now = new Date();
        const todaysDay = now.getDate();
        const thisDay = new Date(now.getFullYear(), now.getMonth(), todaysDay);

        // Monday
        const thisMonday = new Date(thisDay.getFullYear(), thisDay.getMonth(), todaysDay - thisDay.getDay() + 1);
        const thisMondayDay = thisMonday.getDate();
        const thisMondayYear = thisMonday.getFullYear();
        const thisMondayMonth = thisMonday.getMonth();

        // 52 weeks before monday
        const calendarData = [];
        const getDate = (d: any) => new Date(thisMondayYear, thisMondayMonth, d);
        for (let week = -52; week <= 0; week++)
        {
            const mondayDay = thisMondayDay + (week * 7);
            const monday = getDate(mondayDay);

            // one week
            const series = [];
            for (let dayOfWeek = 7; dayOfWeek > 0; dayOfWeek--)
            {
                const date = getDate(mondayDay - 1 + dayOfWeek);

                // skip future dates
                if (date > now) {
                continue;
                }

                // value
                const value = (dayOfWeek < 6) ? (date.getMonth() + 1) : 0;

                series.push({
                date,
                name: weekdayName.format(date),
                value
                });
            }

            calendarData.push({
                name: monday.toString(),
                series
            });
        }

        return calendarData;
    }

    CalendarAxisTickFormatting(mondayString: string)
    {
        const monday = new Date(mondayString);
        const month = monday.getMonth();
        const day = monday.getDate();
        const year = monday.getFullYear();
        const lastSunday = new Date(year, month, day - 1);
        const nextSunday = new Date(year, month, day + 6);
        return (lastSunday.getMonth() !== nextSunday.getMonth()) ? monthName.format(nextSunday) : '';
    }

    CalendarTooltipText(c: any): string
    {
        return `
            <span class="tooltip-label">${c.label} • ${c.cell.date.toLocaleDateString()}</span>
            <span class="tooltip-val">${c.data.toLocaleString()}</span>
        `;
    }

    PieTooltipText(data: any): string
    {
        const label = this.FormatLabel(data.name);
        const val = this.FormatLabel(data.value);

        return `
        <span class="tooltip-label">${label}</span>
        <span class="tooltip-val">$${val}</span>
        `;
    }

    FormatLabel(label: any): string
    {
        if (label instanceof Date)
        {
            label = label.toLocaleDateString();
        }
        else
        {
            label = label.toLocaleString();
        }

        return label;
    }

    DollarValueFormat(c: any): string
    {
        return `\$${c.value.toLocaleString()}`;
    }

    GetStatusData()
    {
        const sales = Math.round(1E4 * Math.random());
        const dur = 36E5 * Math.random();
        return this.CalcStatusData(sales, dur);
    }

    CalcStatusData(sales = this.statusData[0].value, dur = this.statusData[2].value)
    {
        const ret = sales * this.salePrice;
        const cost = sales * dur / 60 / 60 / 1000 * this.personnelCost;
        const ROI = (ret - cost) / cost;
        return [
        {
            name: 'Sales',
            value: sales
        },
        {
            name: 'Gross',
            value: ret,
            extra: { format: 'currency' }
        },
        {
            name: 'Avg. Time',
            value: dur,
            extra: { format: 'time' }
        },
        {
            name: 'Cost',
            value: cost,
            extra: { format: 'currency' }
        },
        {
            name: 'ROI',
            value: ROI,
            extra: { format: 'percent' }
        }
        ];
    }

    StatusValueFormat(c: any): string
    {
        switch (c.data.extra ? c.data.extra.format : '')
        {
        case 'currency':
            return `\$${Math.round(c.value).toLocaleString()}`;

        case 'time':
            return this.MultiFormat(c.value);

        case 'percent':
            return `${Math.round(c.value * 100)}%`;

        default:
            return c.value.toLocaleString();
        }
    }

    CurrencyFormatting(c: any): string
    {
        return `\$${Math.round(c.value).toLocaleString()}`;
    }

    GdpLabelFormatting(c: any): string
    {
        return `${c.label}<br/><small class="number-card-label">GDP Per Capita</small>`;
    }

    StatusLabelFormat(c: any): string
    {
        return `${c.label}<br/><small class="number-card-label">This week</small>`;
    }

    GeneratePlotData(): any
    {
        if (!this.mathFunction)
            return [];

        const twoPi = 2 * Math.PI;
        const length = 25;
        const series = Array.apply(null, { length })
            .map((d: any, i: number) => {
                const x = i / (length - 1);
                const t = x * twoPi;
                return {
                    name: ~~(x * 360),
                    value: this.mathFunction(t)
                };
            });

        return [{
            name: this.mathText,
            series
        }];
    }

    GetFunction(text = this.mathText)
    {
        try
        {
            text = `with (Math) { return ${this.mathText} }`;
            const fn = new Function('x', text).bind(Math);
            return (typeof fn(1) === 'number') ? fn : null;
        }
        catch (err)
        {
            return null;
        }
    }

    TreemapProcess(sumBy = this.sumBy)
    {
        this.sumBy = sumBy;
        const children = treemap[0];
        const value = (sumBy === 'Size') ? sumChildren(children) : countChildren(children);
        this.treemap = [children];
        this.treemapPath = [{name: 'Top', children: [children], value }];

        function sumChildren(node: any): number
        {
            return node.value = node.size || d3.sum(node.children, sumChildren);
        }

        function countChildren(node: any): number
        {
            return node.value = node.children ? d3.sum(node.children, countChildren) : 1;
        }
    }

    TreemapSelect(item: any)
    {
        let node;
        if (item.children)
        {
            const idx = this.treemapPath.indexOf(item);
            this.treemapPath.splice(idx + 1);
            this.treemap = this.treemapPath[idx].children;
            return;
        }

        node = this.treemap.find(d => d.name === item.name);
        if (node.children)
        {
            this.treemapPath.push(node);
            this.treemap = node.children;
        }
    }

    GetFlag(country: string)
    {
        return this.countries.find(c => c.name === country).emoji;
    }

    OnFilter(event: any)
    {
        console.log('timeline filter', event);
    }

    /*
    **
    Combo Chart
    **
    [yLeftAxisScaleFactor]="yLeftAxisScale" and [yRightAxisScaleFactor]="yRightAxisScale"
    exposes the left and right min and max axis values for custom scaling, it is probably best to
    scale one axis in relation to the other axis but for flexibility to scale either the left or
    right axis bowth were exposed.
    **
    */

    YLeftAxisScale(min: number, max: number): any
    {
        return {min: `${min}`, max: `${max}`};
    }

    YRightAxisScale(min: number, max: number): any
    {
        return {min: `${min}`, max: `${max}`};
    }

    YLeftTickFormat(data: any): string
    {
        return `${data.toLocaleString()}`;
    }

    YRightTickFormat(data: any): string
    {
        return `${data}%`;
    }
    /*
    **
    End of Combo Chart
    **
    */

    OnSelect(event: any)
    {
        console.log(event);
    }
}
