// React
import * as React from "react";

// Pondjs
import { TimeSeries, TimeRange, Event, IndexedEvent, TimeRangeEvent } from 'pondjs';

// =======================================================================================================
// Common Types ( some need to be merged, some need to be renamed)
// =======================================================================================================

type ComponentStyle<StyleType> = StyleType | styler | FunctionTemplate<string, string, StyleType>;

interface FunctionTemplate<PassType1, PassType2, ReturnType> { (arg1: PassType1, arg2: PassType2): ReturnType; }

export type D3InterpolationMode = "curveBasis" | "curveBasisOpen" | "curveBundle" | "curveCardinal" | "curveCardinalOpen" | "curveCatmullRom" | "curveCatmullRomOpen" | "curveLinear" | "curveMonotoneY" | "curveMonotoneX" | "curveNatural" | "curveRadial" | "curveStep" | "curveStepAfter" | "curveStepBefore";

export interface ElementStateStyling<T> {
    normal: T;
    highlighted: T;
    selected: T;
    muted: T;
}

export interface Info {
    label: string;
    value: any;
}

export interface TouchEvent {
    event: IndexedEvent;
    column: string
}

export interface InfoStyle {
    line: {
        stroke: string,
        cursor: string,
        pointerEvents: string
    };
    box: {
        fill: string,
        opacity: number,
        stroke: string,
        pointerEvents: string
    },
    dot: {
        fill: string
    }
}


// =======================================================================================================
//  ChartContainer component API
// =======================================================================================================

/**
 * The <ChartContainer> is the outer most element of a chart and is responsible for generating and arranging its sub-elements.
 * Specifically, it is a container for one or more <ChartRows> (each of which contains charts, axes etc) and in addition it manages the overall time range of the chart and so 
 * also is responsible for the time axis, which is always shared by all the rows. The time axis can be styled via the ChartContainer.
 * Here is an example:
 * 
 * <ChartContainer timeRange={audSeries.timerange()} width="800">
 *     <ChartRow>
 *         ...
 *     </ChartRow>
 *     <ChartRow>
 *         ...
 *     </ChartRow>
 * </ChartContainer>
 */
export interface ChartContainerProps extends React.Props<ChartContainer> {
    /**
     * A Pond TimeRange representing the begin and end time of the chart.
     */
    timeRange: TimeRange;

    /**
     * Should the time axis use a UTC scale or local
     */
    utc?: boolean;// (default: false)

    /**
     * Children of the ChartContainer should be ChartRows.
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The width of the chart.This library also includes a component that can be wrapped around a <ChartContainer>. 
     * The purpose of this is to inject a width prop into the ChartContainer so that it will fit the surrounding element. 
     * This is very handy when you need the chart to resize based on a responsive layout.
     */
    width?: number; // (default: 800)

    /**
     * Constrain the timerange to not move back in time further than this Date.
     */
    minTime?: Date;

    /**
     * Constrain the timerange to not move forward in time than this Date.A common example is setting this to the current time or the end time of a fixed set of data.
     */
    maxTime?: Date;

    /**
     * Boolean to turn on interactive pan and zoom behavior for the chart.
     */
    enablePanZoom?: boolean // (default: false)

    /**
     * If this is set the timerange of the chart cannot be zoomed in further than this duration, in milliseconds.This might be determined by the resolution of your data.
     */
    minDuration?: number;

    /**
     * Provides several options as to the format of the time axis labels.
     * In general the time axis will generate an appropriate time scale based on the timeRange prop and there is no need to set this.
     * However, four special options exist: setting format to "day", "month" or "year" will show only ticks on those, and every one of those intervals.
     * For example maybe you are showing a bar chart for October 2014 then setting the format to "day" will insure that a label is placed for each and every day.
     * The last option is "relative".This interprets the time as a duration.This is good for data that is specified relative to its start time, rather than as an actual date/ time.
     */
    format?: string;

    /**
     * Show grid lines for each time marker.
     */
    showGrid?: boolean; // (default: false)

    /**
     * Adjust the time axis style. This is an object of the form { labels, axis } where "label" and "axis" are objects themselves 
     */

    timeAxisStyle?: TimeAxisStyle; // default: { labels: { labelColor: "#8B7E7E", // Default label color labelWeight: 100, labelSize: 11 }, axis: { axisColor: "#C0C0C0", axisWidth: 1 } })

    /**
     * A Date specifying the position of the tracker line on the chart. 
     * It is common to take this from the onTrackerChanged callback so that the tracker followers the user's cursor, but it could be modified to snap to a point or to the nearest minute, for example.
     */
    trackerPosition?: Date;

    /**
     * Will be called when the user hovers over a chart.
     * The callback will be called with the timestamp (a Date object) of the position hovered over.
     * This maybe then used as the trackerPosition (see above), or to information data about the time hovered over within the greater page.
     * Commonly we might do something like this:
     *  <ChartContainer
            onTrackerChanged={ (tracker) => this.setState({ tracker }) }
            trackerPosition = { this.state.tracker }
        ... />
     */
    onTrackerChanged?: (tracker: Date) => void;

    /**
     * This will be called if the user pans and/ or zooms the chart.
     * The callback will be called with the new TimeRange.
     * This can be fed into the timeRange prop as well as used elsewhere on the greater page.
     * Typical use might look like this:
     *  <ChartContainer
            onTimeRangeChanged={ (timerange) => this.setState({ timerange }) }
            timeRange = { this.state.timerange }
        ... />
     */
    onTimeRangeChanged?: Function;

    /**
     * Called when the size of the chart changes.
     */
    onChartResize?: (width: number, height: number) => void;

    /**
     *
     */
    padding?: number; // (default: 0)

    /**
     * 
     */
    onBackgroundClick?: Function;
}
export interface ChartContainerState { }
export class ChartContainer extends React.Component<ChartContainerProps, ChartContainerState>{ }

// =======================================================================================================
//  AreaChart component API
// =======================================================================================================

/**
 * The <AreaChart> component is able to display single or multiple stacked areas above or below the axis. It used throughout the My ESnet Portal.
 * The <AreaChart> should be used within a <ChartContainer> structure, as this will construct the horizontal and vertical axis, and manage other elements. 
 */
export interface AreaChartProps extends React.Props<AreaChart>, IChartRowChildren {

    /**
     * What Pond TimeSeries data to visualize
     */
    series: TimeSeries;

    /**
     * Reference to the axis which provides the vertical scale for ## drawing. e.g. specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate". 
     */
    axis: string;

    /**
     * The series series columns mapped to stacking up and down. Has the format:
     "columns": {
         up: ["in", ...],
         down: ["out", ...]
     } 
     */
    columns?: { up: string[], down: string[] };

    /**
     * 
     */
    stack?: boolean; // (default: true)

    /**
     * The styles to apply to the underlying SVG lines. This is a mapping of column names to objects with style attributes, in the following format:
     * const style = {
     *     in: {
     *         line: {
     *             normal: {stroke: "steelblue", fill: "none", strokeWidth: 1},
     *             highlighted: {stroke: "#5a98cb", fill: "none", strokeWidth: 1},
     *             selected: {stroke: "steelblue", fill: "none", strokeWidth: 1},
     *             muted: {stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1}
     *         },
     *         area: {
     *             normal: {fill: "steelblue", stroke: "none", opacity: 0.75},
     *             highlighted: {fill: "#5a98cb", stroke: "none", opacity: 0.75},
     *             selected: {fill: "steelblue", stroke: "none", opacity: 0.75},
     *             muted: {fill: "steelblue", stroke: "none", opacity: 0.25}
     *         }
     *     },
     *     out: {
     *         ...
     *     }
     * };
     * 
     * <AreaChart style={style} ... />
     * 
     * Alternatively, you can pass in a Styler. For example:
     * 
     *  const upDownStyler = styler([
     *     {key: "in", color: "#C8D5B8"},
     *     {key: "out", color: "#9BB8D7"}
     *  ]);
     * <AreaChart columns={["in", "out"]} style={upDownStyler} ... />
     * 
     */
    style?: ComponentStyle<AreaChartStyle>;

    /**
     * Any of D3's interpolation modes. 
     */
    interpolation?: D3InterpolationMode;// (default: "curveLinear"

    /**
     * 
     */
    selection?: string;

    /**
     * 
     */
    onSelectionChange?: (column: string) => void;

    /**
     * 
     */
    highlight?: string;

    /**
     * 
     */
    onHighlightChange?: (column: string) => void;

    /**
     * 
     */
    fillOpacity?: number;
}

export interface AreaChartStyle {
    [key: string]:
    {
        line: ElementStateStyling<LineStyle>,
        area: ElementStateStyling<AreaStyle>
    };
}

export interface AreaStyle {
    fill?: string;
    stroke?: string;
    opacity?: number;
}

export interface AreaChartState { }
export class AreaChart extends React.Component<AreaChartProps, AreaChartState>{ }

// =======================================================================================================
//  BarChart component API
// =======================================================================================================

/**
 * Renders a barchart based on IndexedEvents within a TimeSeries.
 * This BarChart implementation is a little different that other time axis bar charts in that it will render across a the time range of the event rather than rendering to specific categories. 
 * As a result, a Aug-2014 bar will render between the Aug 2014 tick mark and the Sept 2014 tickmark.
 * The BarChart will render a single TimeSeries. You can specify the columns you want to render with the columns prop. Each column will be stacked on the other, in the order specified in the columns array.
 * The BarChart supports selection of individual bars. To control this use onSelectionChange to get a callback of selection changed. Your callback will be called with with the selection (and object containing the event and column). You can pass this back into the BarChart as selection. For example:
 *  <BarChart
 *      ...
 *      selection={this.state.selection}
 *      onSelectionChange={selection => this.setState({selection})} />
 * Similarly you can monitor which bar is being hovered over with the onHighlightChanged callback. This can be used to determine the info text to display. Info text will display a box (like a tooltip) with a line connecting it to the bar. You use the info prop to evoke this and to supply the text
 * for the info box. See the styling notes below for more information on this.
 * 
 * Styling
 * A BarChart supports per-column or per-event styling. 
 * Styles can be set for each of the four states that are possible for each event: normal, highlighted, selected and muted. To style per-column, supply an object. 
 * For per-event styling supply a function: (event, column) => {} The functon will return a style object.
 * See the style prop in the API documentation for more information. 
 * Separately the size of the bars can be controlled with the spacing and offset props. Spacing controls the gap between the bars. Offset moves the bars left or right by the given number of pixels. You can use this to place bars along side each other. 
 * Alternatively, you can give each column a fixed width using the size prop. In this case this size will be used over the size determined from the timerange of the event and the spacing.
 * The highlight info for each bar is also able to be styled using the infoStyle. This enables you to control the drawing of the box, connecting lines and dot. Using the infoWidth and infoHeight props you can control the size of the box, which is fixed. For the info inside the box, it's up to you:
 * it can either be a simple string or an array of {label, value} pairs.
 */
export interface BarChartProps extends React.Props<BarChart>, IChartRowChildren {
    /**
     * What Pond TimeSeries data to visualize. 
     */
    series: TimeSeries;

    /**
     * The distance in pixels to inset the bar chart from its actual timerange. 
     */
    spacing?: number; //  (default: 1.0)

    /**
     * The distance in pixels to offset the bar from its center position within the timerange it represents. 
     */
    offset?: number;// (default: 0)

    /**
     * A list of columns within the series that will be stacked on top of each other. 
     */
    columns?: string[];// (default: ["value"])

    /**
     * The style of the bar chart drawing (using SVG CSS properties). 
     * This is an object with a key for each column which is being drawn, per the columns prop. 
     * For each column a style is defined for each state the bar may be in. This style is the CSS properties for the underlying SVG , so most likely you'll define fill and opacity.
     * For example:
     *  style = {
     *     columnName: {
     *         normal: {
     *             fill: "steelblue",
     *             opacity: 0.8,
     *         },
     *         highlighted: {
     *             fill: "#a7c4dd",
     *             opacity: 1.0,
     *         },
     *         selected: {
     *             fill: "orange",
     *             opacity: 1.0,
     *         },
     *         muted: {
     *             fill: "grey",
     *             opacity: 0.5
     *         }
     *     }
     * }
     * You can also supply a function, which will be called with an event and column. 
     * The function should return an object containing the four states (normal, highlighted, selected and muted) and the corresponding CSS properties.
     */
    style?: ComponentStyle<BarChartStyle>;

    /**
     * The style of the info box and connecting lines. 
     */
    infoStyle?: InfoStyle;

    /**
     * The width of the hover info box 
     */
    infoWidth?: number;// (default: 90)

    /**
     * The height of the hover info box. 
     */
    infoHeight?: number;// (default: 30)

    /**
     * The values to show in the info box. This is an array of objects, with each object specifying the label and value to be shown in the info box. 
     */
    info?: Info[];

    /**
     * If size is specified, then the bar will be this number of pixels wide. This prop takes priority over "spacing".
     */
    size?: number;

    /**
     * The selected item, which will be rendered in the "selected" style. If a bar is selected, all other bars will be rendered in the "muted" style. See also onSelectionChange. 
     */
    selected?: TouchEvent;

    /**
     * A callback that will be called when the selection changes. It will be called with an object containing the event and column. 
     */
    onSelectionChange?: (selected: TouchEvent) => void;

    /**
     *  The highlighted item, which will be rendered in the "highlighted" style. See also onHighlightChanged.
     */
    highlighted?: TouchEvent;

    /**
     * A callback that will be called when the hovered over bar changes. It will be called with an object containing the event and column. 
     */
    onHighlightChanged?: (highlighted: TouchEvent) => void;
}

export interface BarChartStyle {
    [key: string]: ElementStateStyling<BarStyle>;
}

export interface BarStyle {
    fill?: string;
    opacity?: number;
}

export interface BarChartState { }
export class BarChart extends React.Component<BarChartProps, BarChartState>{ }

// =======================================================================================================
//  Baseline component API
// =======================================================================================================

/**
 * The BaseLine component displays a simple horizontal line at a value.
 * For example the following code overlays Baselines for the mean and stdev of a series on top of another chart.
 * <ChartContainer timeRange={series.timerange()} >
 *     <ChartRow height="150">
 *         <YAxis id="price" label="Price ($)" min={series.min()} max={series.max()} width="60" format="$,.2f"/>
 *         <Charts>
 *             <LineChart axis="price" series={series} style={style}/>
 *             <Baseline axis="price" value={series.avg()} label="Avg" position="right"/>
 *             <Baseline axis="price" value={series.avg()-series.stdev()}/>
 *             <Baseline axis="price" value={series.avg()+series.stdev()}/>
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 */
export interface BaselineProps extends React.Props<Baseline>, IChartRowChildren {
    /**
     * Reference to the axis which provides the vertical scale for drawing. e.g. specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
     */
    axis: string;
    /**
     * The y-value to display the line at.
     */
    value?: number;// (default: 0)

    /**
     * The label to display with the axis.
     */
    label?: string // (default: "")

    /**
     * Whether to display the label on the "left" or "right". 
     */
    position?: "left" | "right"// (default : "left")

    /**
     * 
     */
    style?: BaseLineStyle;
}

export interface BaseLineStyle {
    label: {
        fill: string;
        fontWeight?: number;
        fontSize?: number;
        pointerEvents?: string;
    }
    line: {
        stroke: string;
        strokeWidth?: number;
        strokeDasharray?: string;
    }
}

export interface BaselineState { }
export class Baseline extends React.Component<BaselineProps, BaselineState>{ }

// =======================================================================================================
//  Brush component API
// =======================================================================================================

/**
 * Renders a brush with the range defined in the prop timeRange.
 */
export interface BrushProps extends React.Props<Brush>, IChartRowChildren {
    /**
     * The timerange for the brush. 
     * Typically you would maintain this as state on the surrounding page, since it would likely control another page element, such as the range of the main chart. 
     * See also onTimeRangeChanged() for receiving notification of the brush range being changed by the user.
     */
    timeRange?: TimeRange;

    /**
     * The brush is rendered as an SVG rect. You can specify the style of this rect using this prop.
     */
    style?: BrushStyle;

    /**
     * The size of the invisible side handles. Defaults to 6 pixels.
     */
    handleSize?: number;// (default: 6)

    /**
     *
     */
    allowSelectionClear?: boolean;// (default: false)

    /**
     * A callback which will be called if the brush range is changed by the user. 
     * It is called with a Pond TimeRange object. Note that if allowSelectionClear is set to true, then this can also be called when the user performs a simple click outside the brush area. 
     * In this case it will be called with null as the TimeRange. You can use this to reset the selection, perhaps to some initial range.
     */
    onTimeRangeChanged?: Function;

    /**
    * A callback which will be called once the range selection is complete.
    * This callback is fired from 'handleMouseUp()' function.
    *
    * This way brush can be used to modify timerange on the same graph.
    */
    onTimeRangeSelectComplete: () => void;
}

export interface BrushStyle {
    fill: string;
    fillOpacity: number;
    stroke: string;
    shapeRendering: string;
    cursor: string;
}

export interface BrushState { }
export class Brush extends React.Component<BrushProps, BrushState>{ }

// =======================================================================================================
//  ChartRow component API
// =======================================================================================================

/**
 * A ChartRow is a container for a set of YAxis and multiple charts which are overlaid on each other in a central canvas.
 * Here is an example where a single <ChartRow> is defined within the <ChartContainer>. Of course you can have any number of rows.
 * For this row we specify the one prop height as 200 pixels high.
 * Within the <ChartRow> we add:
 * <YAxis> elements for axes to the left of the chart
 * <Chart> block containing our central chart area
 * <YAxis> elements for our axes to the right of the charts
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis />
 *         <YAxis />
 *         <Charts>
 *             charts...
 *        </Charts>
 *         <YAxis />
 *     </ChartRow>
 * </ChartContainer>
 */
export interface ChartRowProps extends React.Props<ChartRow> {
    /**
     * The height of the row.
     */
    height?: number | string // (default: 100)

    /**
     *
     */
    trackerTimeFormat?: string; // (default: "%b %d %Y %X")

    /**
     *
     */
    enablePanZoom?: boolean; // (default: false)

    /**
     * If specified, values will passed into TimeTracker.info
     */
    trackerInfoValues?: Info[];

    /**
     * If trackerInfoValues is specified, value will passed into TimeTracker.infoHeight
     */
    trackerInfoHeight?: number;

    /**
     * If trackerInfoValues is specified, value will passed into TimeTracker.infoWidth
     */
    trackerInfoWidth?: number;
}
export interface ChartRowState { }
export class ChartRow extends React.Component<ChartRowProps, ChartRowState>{ }

export interface IChartRowChildren {
    axis: string;
}

// =======================================================================================================
//  Charts component API
// =======================================================================================================

/**
 * The <Charts> element is a grouping for charts within a row. It takes no props. Each chart within the group will be overlaid on top of each other.
 * Here is an example of two line charts within a <Charts> group:
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis/>
 *         <Charts>
 *             <LineChart axis="aud" series={audSeries} style={audStyle}/>
 *             <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
 *         </Charts>
 *         <YAxis/>
 *     </ChartRow>
 * </ChartContainer>
 * 
 * Making your own chart
 * Anything within this grouping is considered a chart, meaning it will have certain props injected into it. 
 * As a result you can easily implement your own chart by simply expecting to have these props available and rendering as such.
 * For your own chart, the render() method should return a SVG group <g> at the top level, and then your chart rendering within that.
 * In addition to any props you add to your chart, the following props are passed into each chart automatically:
 * timeScale: A d3 scale for the time axis which you can use to transform your data in the x direction
 * 
 * yScale: A d3 scale for the y-axis which you can use to transform your data in the y direction
 * 
 * transition: The time in ms it is expected the code will take to move from one state to another
 */
export interface ChartsProps extends React.Props<Charts> { }
export interface ChartsState { }
export class Charts extends React.Component<ChartsProps, ChartsState>{ }

// =======================================================================================================
//  EventChart component API
// =======================================================================================================

/**
 * Renders an event view that shows the supplied set of events along a time axis. 
 * The events should be supplied as a Pond TimeSeries. That series may contain regular Events, TimeRangeEvents or IndexedEvents.
 */
export interface EventChartProps extends React.Props<EventChart>, IChartRowChildren {
    /**
     * What Pond TimeSeries data to visualize.
     */
    series: TimeSeries;

    /**
     * The height in pixels for the event bar. 
     */
    size?: number;// (default: 30)

    /**
     * The distance in pixels to inset the bar chart from its actual timerange 
     */
    spacing?: number;// (default: 0)

    /**
     * A function that should return the style of the event box 
     */
    style?: (event: string, state: string) => any;
}
export interface EventChartState { }
export class EventChart extends React.Component<EventChartProps, EventChartState>{ }

// =======================================================================================================
//  EventMarker component API
// =======================================================================================================

/**
 * Renders a marker at a specific event on the chart. 
 * You can also override either the x or y position, so this allows you to position a timestamped label or timestamped list of label/value pairs anywhere on a chart.
 */
export interface EventMarkerProps extends React.Props<EventMarker>, IChartRowChildren {
    /**
     * What Pond Event to mark
     */
    event: Event | IndexedEvent | TimeRangeEvent;

    /**
     * Which column in the Event to use.
     */
    column?: string; // (default: "value")

    /**
     * The style of the info box and connecting lines
     */
    infoStyle?: InfoStyle;

    /**
     * The width of the hover info box
     */
    infoWidth?: number;// (default: 90)

    /**
     * The height of the hover info box
     */
    infoHeight?: number;//(default: 25)

    /**
     * The values to show in the info box. This is either an array of objects, with each object specifying the label and value to be shown in the info box, or a simple string label
     */
    info?: string | Info[];

    /**
     *
     */
    markerRadius?: number;// (default: 2)

    /**
     *
     */
    offsetX?: number;// (default: 0)

    /**
     *
     */
    offsetY?: number;// (default: 0)
}
export interface EventMarkerState { }
export class EventMarker extends React.Component<EventMarkerProps, EventMarkerState>{ }

// =======================================================================================================
//  HorizontalBarChart component API
// =======================================================================================================

/**
 * The HorizontalBarChart takes a list of TimeSeries objects and displays a bar chart visualization summarizing those. 
 * As an example, let's say we have a set of export interfaces, which together carry the entire network traffic to a particular location. We want to see which export interfaces contribute the most to the total traffic.
 * To display this we render the HorizontalBarChart in our page:
 *
 * <HorizontalBarChart
 *     display="range"
 *     seriesList={export interfaces}
 *     columns={["out", "in"]}
 *     top={5} sortBy="max"
 *     timestamp={this.state.tracker}
 *     format={formatter}
 *     selected={this.state.selected}
 *     onSelectionChanged={this.handleSelectionChange}
 *     selectionColor="#37B6D3"
 *     style={[{fill: "#1F78B4"}, {fill: "#FF7F00"}]} />
 * 
 * Our first prop display tells the component how to draw the bars. In this case we use the "range", which will draw from min to max (with additional drawing to show 1 stdev away from the center).
 * Next we specify the seriesList itself. This should be an array of Pond TimeSeries objects.
 * The columns prop tells us which columns within the TimeSeries should be displayed as a bar. In this case we have in and out traffic columns, so we'll get two bars for each series.
 * top and sortBy are used to order and trim the list of TimeSeries. Here we order by the max values in the specified columns, then just display the top 5.
 * The timestamp lets the component know the current value. You could display the last timestamp in the series, or perhaps a time being interacted with in the UI.
 * The format can either be a d3 format string of a function. In this case we have our own formatter function to display values:
 * function formatter(value) {
 *     const prefix = d3.formatPrefix(value);
 *     return `${prefix.scale(value).toFixed()} ${prefix.symbol}bps`;
 * }
 * 
 * Selection is handled with selected, which gives the name of the TimeSeries currently selected. 
 * If the user selects a different row the callback passed to onSelectionChanged will be called with the name of the TimeSeries represented in the newly selected row. We also specify a color to mark the selected item with the selectionColor prop.
 * Next we specify the style. This is the css style of each column's bars. Typically you would just want to specify the fill color. Each bar is a svg rect.
 */
export interface HorizontalBarChartProps extends React.Props<HorizontalBarChart>, IChartRowChildren {
    /**
     * Sort by either "max", "avg" or "name"
     */
    display?: "avg" | "max" | "range"; // (default: "avg")

    /**
     * A list of TimeSeries objects to visualize
     */
    seriesList: TimeSeries[];

    /**
     * Columns in each timeseries to display
     */
    columns?: string[];// (default: ["value"])

    /**
     * Sort by either "name", "max", or "avg".
     */
    sortBy?: "name" | "max" | "avg"; // (default: "max")

    /**
     * Display only the top n
     */
    top?: number;

    /**
     * The height or thickness of each bar.
     */
    size?: number;// (default: 14)

    /**
     * The spacing between each bar (column) of the series.
     */
    spacing?: number;// (default: 2)

    /**
     * The spacing above and below each series.
     */
    padding?: number;//(default: 5)

    /**
     * The width of the label area.
     */
    labelWidth?: number;// (default: 240)

    /**
     * Callback for when the selection changes.The callback function will be called with the name of the TimeSeries selected.
     */
    onSelectionChanged?: (column: string) => void;

    /**
     * Specify which TimeSeries is selected by providing the name of the selected series.
     */
    selected?: string;

    /**
     * Color to mark the selected row with.
     */
    selectionColor?: string; // (default: "steelblue")

    /**
     * Renders the series name as a link and calls this callback function when it is clicked.
     */
    onNavigate?: Function;

    /**
     * Color to render the series name if navigate is enabled.
     */
    navigateColor?: string;// (default: "steelblue")

    /**
     * The format is used to format the display text for the bar.It can be specified as a d3 format string (such as ".2f") or a function. The function will be called with the value and should return a string.
     */
    format?: string | Function;

    /**
     * A single child which will be rendered when the item is selected.
     * The child will have a couple of additional props injected onto it when rendered:
     *  series - the TimeSeries of the row being rendered
     *  timestamp - the current timestamp being shown
     */
    children?: React.ReactNode;

    /**
     *
     */
    style?: { fill: string, [key: string]: any }[];


    /**
     * 
     */
    timestamp?: Date;

}
export interface HorizontalBarChartState { }
export class HorizontalBarChart extends React.Component<HorizontalBarChartProps, HorizontalBarChartState>{ }

// =======================================================================================================
//  LabelAxis component API
// =======================================================================================================

/**
 * Renders a 'axis' that display a label for a data channel and a max and average value 
 * +----------------+-----+------- ... 
 * | Traffic | 120 | | Max 100 Gbps | 
 * | Chart ... | Avg 26 Gbps | 0 
 * | +----------------+-----+------- ...
 */
export interface LabelAxisProps extends React.Props<LabelAxis>, IChartRowChildren {
    /**
     * The label to show as the axis.
     */
    label: string;

    /**
     * Show or hide the max/min values that appear alongside the label
     */
    hideScale?: boolean;// (default: false)

    /**
     * Supply a list of label value pairs to render within the LabelAxis. This expects an array of objects. 
     * Each object is of the form: {label: "Speed", value: "26.2 mph"}.
     */
    values?: { label: string, value: string }[];// (default: [])

    /**
     * Width to provide the values
     */
    valWidth?: number;// (default: 40)

    /**
     * Max value of the axis scale
     */
    max: number;

    /**
     * Min value of the axis scale
     */
    min: number;

    /**
     * If values are numbers, use this format string
     */
    format?: string;// (default: ".2f")

    /**
     * The width of the axis
     */
    width?: number;
}
export interface LabelAxisState { }
export class LabelAxis extends React.Component<LabelAxisProps, LabelAxisState>{ }

// =======================================================================================================
//  Legend component API
// =======================================================================================================

/**
 * Legends are simple to define.
 * 
 * First specify the styles you want each item to have. This is either the CSS that should be appied to rendered symbol. Or you can provide a Styler object. See below for full styling details.
 * const style = Styler([
 *     {key: "aud", color: "steelblue", width: 1, dashed: true},
 *     {key: "euro", color: "#F68B24", width: 2}
 * ]);
 * 
 * Next build a list of categories you want in the legend.
 *
 * const categories = [
 *     {key: "aust", label: "AUD", value: "1.52", disabled: true},
 *     {key: "usa", label: "USD", value: "1.43", disabled: false}
 * ];
 * 
 * For each category to display you must provide a key, a label and if it should be displayed disabled or not.
 * Then render the legend, with type either "line", "swatch" or "dot":
 * <Legend type="line" style={style} categories={categories} />
 * Optionally you can also display a value below the label. This is useful when hovering over another chart on the page, or to display the current value of live data. You can see this defined in the above categories.
 * The legend can also be supplied with callback functions which will tell you if the user has clicked or hovered over on one of the legend items. You can use this to sync highlighting and selection to a chart.
 * 
 * Styling
 * There are three methods of styling a legend:
 *
 * using a Styler object
 * using an object containing inline styles
 * using a function which returns an inline style
 * A Styler object can be supplied directly to the style prop of the legend. This is the simplest approach, since you can usually just use the same Styler as you use for your chart.
 * Supplying an object to the style prop gives you more control than the Styler, since you can provide the actual CSS properties for each element of the legend. The format for the object is:
 * {
 *     columnName1: {
 *             symbol: {
 *                 normal: {...styleSymbol},
 *                 highlighted: {...styleSymbol},
 *                 selected: {...styleSymbol},
 *                 muted: {...styleSymbol}
 *             },
 *             label: {
 *                 normal: {...labelStyle},
 *                 highlighted: {...labelStyle},
 *                 selected: {...labelStyle},
 *                 muted: {...labelStyle}
 *             },
 *             value: {
 *                 normal: {...valueStyle},
 *                 highlighted: {...valueStyle},
 *                 selected: {...valueStyle},
 *                 muted: {...valueStyle}
 *             }
 *     },
 *     columnName2 : {
 *         ...
 *     },
 *     ...
 *  }
 * 
 *  - symbolStyle is the CSS properties for the symbol, which is either a swatch, dot or line. For a line, you'd want to provide the SVG <line> properties, for a swatch you'd providethe SVG <rect> properties and for a dot the <ellipse> properties.
 *  - labelStyle is the main label for the legend item. It is a SVG <text> element, so you can control the font properties.
 *  - valueStyle is the optional value. As with the labelStyle you this is an SVG <text> element.
 *
 * Finally, you can provide a function to the `style` prop. This is similar to providing an object, except your function will be called with the columnName and you should return the map containing symbol, label and value styles.
 * 
 */
export interface LegendProps extends React.Props<Legend> {

    /**
     * The overall style of the legend items, either a color "swatch", a colored "line", or a "dot".
     */
    type?: "swatch" | "line" | "dot";// (default: "swatch")


    /**
     * Alignment of the legend within the available space. Either left or right.
     */
    align?: "left" | "right";// (default: "left"

    /**
     *
     */
    style: any | Function | styler;

    /**
     * The categories array specifies details and style for each item in the legend. For each item:
     *      "key" - (required) the name by which the legend will be known
     *      "label" - (required) the displayed label
     *      "style" - the swatch, dot, or line style. Typically you'd just specify {backgroundColor: "#1f77b4"}
     *      "labelStyle" - the label style
     *      "disabled" - a disabled state
     * 
     * const categories = [
     *    {key: "aust", label: "AUD", disabled: this.state.disabled["aust"], style: {backgroundColor: "#1f77b4"}},
     *    {key: "usa", label: "USD", disabled: this.state.disabled["usa"], style: {backgroundColor: "#aec7e8"}}
     * ];
     */
    categories: LegendCategories[];

    /**
     * Callback which will be called when the use enables/disables the legend item by clicking on it. The callback will be called with the key and the new disabled state.
     */
    onChange?: Function;

    /**
     *
     */
    labelStyle?: LabelStyle;

    /**
     *
     */
    width?: number;// (default: 16)

    /**
     *
     */
    height?: number;// (default: 16

    /**
     *  Highlighted key category
     */
    highlight?: string;

    /**
     * 
     */
    onHighlightChange?: (key: string) => void;

    /**
     *  Selected key category
     */
    selection?: string;

    /**
     * 
     */
    onSelectionChange?: (key: string) => void;
}

export interface LegendCategories {
    key: string;
    label: string;
    disabled?: boolean;
    style?: any;
    labelStyle?: LabelStyle;
    value?: any;
}

export interface LegendStyle {
    symbol?: ElementStateStyling<SymbolStyle>;
    label?: ElementStateStyling<LabelStyle>;
    value?: ElementStateStyling<ValueStyle>;
}

export interface LabelStyle {
    color?: string;
    cursor?: string;
    fontSize?: string;
    paddingRight?: number;
    opacity?: number;
}

export interface ValueStyle {
    color?: string;
    cursor?: string;
    fontSize?: string;
    opacity?: number;
}

export interface SymbolStyle {
    cursor?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    opacity?: number;
}

export interface LegendState { }
export class Legend extends React.Component<LegendProps, LegendState>{ }

// =======================================================================================================
//  LineChart component API
// =======================================================================================================

/**
 * The <LineChart> component is able to display multiple columns of a TimeSeries as separate line charts.
 * The <LineChart> should be used within <ChartContainer> etc., as this will construct the horizontal and vertical axis, and manage other elements.
 * Here is an example of two columns of a TimeSeries being plotted with the <LineChart>:
 *     <ChartContainer timeRange={this.state.timerange} >
 *         <ChartRow height="200">
 *             <YAxis id="y" label="Price ($)" min={0.5} max={1.5} format="$,.2f" />
 *             <Charts>
 *                 <LineChart
 *                     axis="y"
 *                     breakLine={false}
 *                     series={currencySeries}
 *                     columns={["aud", "euro"]}
 *                     style={style}
 *                     interpolation="curveBasis" />
 *             </Charts>
 *         </ChartRow>
 *     </ChartContainer>
 */
export interface LineChartProps extends React.Props<LineChart>, IChartRowChildren {
    /**
     * What Pond TimeSeries data to visualize
     */
    series: TimeSeries;

    /**
     * Reference to the axis which provides the vertical scale for drawing. e.g. specifying axis="trafficRate" would refer the y-scale of the YAxis with id="trafficRate".
     */
    axis: string;

    /**
     * Which columns from the series to draw.
     */
    columns?: string[]; // (default: ["value"]

    /**
     * The styles to apply to the underlying SVG lines. 
     * This is a mapping of column names to objects with style attributes, in the following format:
     *  const lineStyles =  {
     *      value: {
     *          stroke: "steelblue",
     *          strokeWidth: 1,
     *          strokeDasharray: "4,2"
     *      }
     *  };
     *  <LineChart style={lineStyles} ... />
     * 
     *  Alternatively, you can pass in a Styler. For example:
     * 
     * 
     * const currencyStyle =  Styler([ {key: "aud", color: "steelblue", width: 1, dashed: true}, {key: "euro", color: "#F68B24", width: 2} ]);
     * <LineChart columns={["aud", "euro"]} style={currencyStyle} ... />
     */
    style?: ComponentStyle<LineChartStyle>;

    /**
     *
     */
    interpolation?: D3InterpolationMode; // (default: "curveLinear")

    /**
     * The determines how to handle bad/missing values in the supplied TimeSeries. 
     * A missing value can be null or NaN.
     * If breakLine is set to true then the line will be broken on either side of the bad value(s). 
     * If breakLine is false (the default) bad values are simply removed and the adjoining points are connected.
     */
    breakLine?: boolean; // (default: true

    /**
     * The selected item, which will be rendered in the "selected" style. If a line is selected, all other lines will be rendered in the "muted" style. See also onSelectionChange.
     */
    selected?: string;

    /**
     * A callback that will be called when the selection changes. It will be called with the column corresponding to the line being clicked.
     */
    onSelectionChange?: (column: string) => void;

    /**
     * The highlighted column, which will be rendered in the "highlighted" style. See also onHighlightChanged.
     */
    highlighted?: string;

    /**
     * A callback that will be called when the hovered over line changes. It will be called with the corresponding column.
     */
    onHighlightChanged?: (column: string) => void;

    /**
     *
     */
    smooth?: boolean; // (default: true)
}

interface LineChartStyle {
    [key: string]: ElementStateStyling<LineStyle>;
}

export interface LineStyle {
    fill?: string;
    stroke?: string;
    opacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
}

export interface LineChartState { }
export class LineChart extends React.Component<LineChartProps, LineChartState>{ }
// =======================================================================================================
//  Resizable component API
// =======================================================================================================

/**
 * This takes a single child and inserts a prop 'width' on it that is the current width of the this container. 
 * This is handy if you want to surround a chart or other svg diagram and have this drive the chart width. 
 */
export interface ResizableProps extends React.Props<Resizable> {
    style?: any;
    className?: string;
}
export interface ResizableState { }
export class Resizable extends React.Component<ResizableProps, ResizableState>{ }

// =======================================================================================================
//  ScatterChart  component API
// =======================================================================================================

/**
 * The <ScatterChart > widget is able to display multiple columns of a series scattered across a time axis.
 * The ScatterChart should be used within <ChartContainer> etc., as this will construct the horizontal and vertical axis, and manage other elements. As with other charts, this lets them be stacked or overlaid on top of each other.
 * A custom info overlay lets you hover over the data and examine points. Points can be selected or highlighted.
 * <ChartContainer timeRange={series.timerange()}>
 *     <ChartRow height="150">
 *         <YAxis id="wind" label="Wind gust (mph)" labelOffset={-5}
 *                min={0} max={series.max()} width="100" type="linear" format=",.1f"/>
 *         <Charts>
 *             <ScatterChart axis="wind" series={series} style={{color: "steelblue", opacity: 0.5}} />
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * 
 * Styling
 * A scatter chart supports per-column or per-event styling. Styles can be set for each of the four states that are possible for each event: normal, highlighted, selected or muted. To style per-column, supply an object. For per-event styling supply a function: (event, column) => {} The functon will
 * return a style object. See the style prop in the API documentation for more information.
 * Separately the size of the dots can be controlled with the radius prop. This can either be a fixed value (e.g. 2.0), or a function. If a function is supplied it will be called as (event, column) => {} and should return the size.
 * The hover info for each point is also able to be styled using the info style. This enables you to control the drawing of the box and connecting lines. Using the infoWidth and infoHeight props you can control the size of the box, which is fixed.
 */
export interface ScatterChartProps extends React.Props<ScatterChart>, IChartRowChildren {
    /**
     * What Pond TimeSeries data to visualize.
     */
    series: TimeSeries;

    /**
     * Which columns of the series to render
     */
    columns?: string[];// (default: ["value"]) // Type: array of array of strings

    /**
     * Reference to the axis which provides the vertical scale for drawing. e.g. specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
     */
    axis: string;

    /**
     * The radius of the points in the scatter chart.
     * 
     * If this is a number it will be used as the radius for every point. If this is a function it will be called for each event.
     * The function is called with the event and the column name and must return a number.
     * 
     * For example this function will use the radius column of the event:
     * 
     * const radius = (event, column) => {
     *    return event.get("radius");
     * }
     */
    radius?: number | styler | FunctionTemplate<IndexedEvent, string, number>;// (default: 2.0)

    /**
     * The style of the scatter chart drawing (using SVG CSS properties). 
     * This is an object with a key for each column which is being plotted, per the columns prop. 
     * Each of those keys has an object as its value which has keys which are style properties for an SVG and the value to use.
     * 
     * For example:
     * 
     * style = {
     *     columnName: {
     *         normal: {
     *             fill: "steelblue",
     *             opacity: 0.8,
     *         },
     *         highlighted: {
     *             fill: "#a7c4dd",
     *             opacity: 1.0,
     *         },
     *         selected: {
     *             fill: "orange",
     *             opacity: 1.0,
     *         },
     *         muted: {
     *             fill: "grey",
     *             opacity: 0.5
     *         }
     *     }
     * }
     * You can also supply a function, which will be called with an event and column. 
     * The function should return an object containing the 4 states (normal, highlighted, selected and muted) and the corresponding CSS properties.
     */
    style?: ComponentStyle<ScatterChartStyle>;

    /**
     * The style of the info box and connecting lines.
     */
    infoStyle?: InfoStyle;

    /**
     * The width of the hover info box.
     */
    infoWidth?: number; // (default: 90)

    /**
     * The height of the hover info box
     */
    infoHeight?: number; // (default: 30)

    /**
     * The values to show in the info box. This is an array of objects, with each object specifying the label and value to be shown in the info box.
     */
    info?: Info[];

    /**
     * The selected dot, which will be rendered in the "selected" style. If a dot is selected, all other dots will be rendered in the "muted" style. See also onSelectionChange.
     */
    selected?: TouchEvent;

    /**
     * A callback that will be called when the selection changes. It will be called with an object containing the event and column.
     */
    onSelectionChange?: (ev: TouchEvent) => void;

    /**
     * The highlighted dot, as an object containing the event and column, which will be rendered in the "highlighted" style. See also onHighlightChanged.
     */
    highlighted?: TouchEvent;

    /**
     * A callback that will be called when the hovered over dot changes. It will be called with an object containing the event and column.
     */
    onHighlightChanged?: (ev: TouchEvent) => void;

    /**
     * 
     */
    onMouseNear?: (ev: TouchEvent) => void;
}

export interface ScatterChartStyle {
    [key: string]: ElementStateStyling<ScatterStyle>;
}

export interface ScatterStyle {
    fill?: string;
    opacity?: number;
}


export interface ScatterChartState { }
export class ScatterChart extends React.Component<ScatterChartProps, ScatterChartState>{ }

// =======================================================================================================
//  TimeAxis component API
// =======================================================================================================

/**
 * Renders a horizontal time axis. The TimeAxis is generally rendered by the so you do not have to create one of these yourself.
 */
export interface TimeAxisProps extends React.Props<TimeAxis> {
    /**
     *
     */
    showGrid?: boolean; // (default: false)

    /**
     * default: { 
     *      labels: { 
     *          labelColor: "#8B7E7E", // Default label color 
     *          labelWeight: 100, 
     *          labelSize: 11
     *           },
     *       axis: { 
     *          axisColor: "#C0C0C0" 
     *      } 
     *  }
     */
    style?: TimeAxisStyle; // 
}

export interface TimeAxisStyle {
    labels: {
        labelColor: string,
        labelWeight: number,
        labelSize: number
    },
    axis: {
        axisColor: string,
        axisWidth: number
    }
}
export interface TimeAxisState { }
export class TimeAxis extends React.Component<TimeAxisProps, TimeAxisState>{ }

// =======================================================================================================
//  TimeMarker component API
// =======================================================================================================

/**
 *
 */
export interface TimeMarkerProps extends React.Props<TimeMarker> {
    /**
     *
     */
    time?: Date;

    /**
     * The values to show in the info box. This is either an array of objects, with each object specifying the label and value to be shown in the info box, or a simple string label
     */
    info?: Info[] | string;

    /**
     * The style of the info box and connecting lines
     */
    infoStyle?: InfoStyle;

    /**
     * The width of the hover info box
     */
    infoWidth?: number; // (default: 90)

    /**
     * The height of the hover info box
     */
    infoHeight?: number; // (default: 25)

    /**
     * Display the info box at all. If you don't have any values to show and just want a line and a time (for example), you can set this to false.
     */
    showInfoBox?: boolean; // (default: true)

    /**
     * You can show the info box without the corresponding time marker. Why would you do this? I don't know. Actually, I do. You might use the ChartContainer tracker mechanism to show the line across multiple rows, then add a TimeMarker selectively to each row.
     */
    showLine?: boolean; // (default: true)

    /**
     * You can hide the time displayed above the info box. You might do this because it is already displayed elsewhere in your UI. Or maybe you just don't like it.
     */
    showTime?: boolean; // (default: true)

    /**
     * The time format (d3 time format) used for display of the time above the info box.
     */
    timeFormat?: string

}
export interface TimeMarkerState { }
export class TimeMarker extends React.Component<TimeMarkerProps, TimeMarkerState>{ }

// =======================================================================================================
//  TimeRangeMarker component API
// =======================================================================================================

/**
 * Renders a band with extents defined by the supplied TimeRange.
 */
export interface TimeRangeMarkerProps extends React.Props<TimeRangeMarker> {
    /**
     * 
     */
    timerange: TimeRange;

    /**
     * 
     */
    style?: TimeRangeMarkerStyle; // (default: {fill: "rgba(70, 130, 180, 0.25);"})

    /**
     * 
     */
    spacing?: number; // (default: 1)

    /**
     * 
     */
    offset?: number; // (default: 0)
}
export interface TimeRangeMarkerStyle { fill: string; }
export interface TimeRangeMarkerState { }
export class TimeRangeMarker extends React.Component<TimeRangeMarkerProps, TimeRangeMarkerState>{ }

// =======================================================================================================
//  ValueAxis component API
// =======================================================================================================

/**
 * Renders a 'axis' that display a label for a current tracker value
 *  ----+----------------+
 *      |     56.2G      |
 *      |      bps       |
 *      |                |
 *  ----+----------------+
 *     EXPERIMENTAL
 */
export interface ValueAxisProps extends React.Props<ValueAxis> {
    /**
     * 
     */
    width?: number;

    /**
     * 
     */
    height?: number;

    /**
     * 
     */
    value?: string;

    /**
     * 
     */
    detail?: string;
}
export interface ValueAxisState { }
export class ValueAxis extends React.Component<ValueAxisProps, ValueAxisState>{ }

// =======================================================================================================
//  ValueList component API
// =======================================================================================================

/**
 * Renders a list of values in svg
 *  +----------------+
 *  | Max 100 Gbps   |
 *  | Avg 26 Gbps    |
 *  +----------------+
 */
export interface ValueListProps extends React.Props<ValueList> {
    /**
     *
     */
    align?: "center" | "left"; // (default: "center")

    /**
     * An array of label value pairs to render.
     */
    values: ValueListValue[];

    /**
     * The width of the rectangle to render into
     */
    width?: number; // (default: 100)

    /**
     * The height of the rectangle to render into
     */
    height?: number; // (default: 100)

    /**
     *
     */
    pointerEvents?: string; // (default: "none")

    /**
     *
     */
    style?: ValueListStyle; // (default: {fill: "#FEFEFE", stroke: "#DDD", opacity: 0.8})
}

export interface ValueListValue {
    label?: string;
    value: string | number;
}

export interface ValueListStyle {
    fill?: string;
    stroke?: string;
    opacity?: number;
}

export interface ValueListState { }
export class ValueList extends React.Component<ValueListProps, ValueListState>{ }

// =======================================================================================================
//  YAxis component API
// =======================================================================================================

/**
 * The YAxis widget displays a vertical axis to the left or right of the charts.A YAxis always appears within a ChartRow, from which it gets its height and positioning.You can have more than one
 * axis per row.
 *     Here's a simple YAxis example:
 * <YAxis
 *     id="price-axis"
 *     label="Price (USD)"
 *     min={0} max={100}
 *     width="60"
 *     type="linear"
 *     format="$,.2f" />
 * 
 * Visually you can control the axis label, its size via the width prop, its format, and type of scale (linear).
 * Each axis also defines a scale through a min and max prop.Charts may then refer to the axis by by citing the axis id in their axis prop.Those charts will then use the axis scale for their y-scale.
 * 
 * Here is an example of two line charts that each have their own axis:
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis id="aud" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
 *         <Charts>
 *             <LineChart axis="aud" series={audSeries} style={audStyle}/>
 *             <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
 *         </Charts>
 *         <YAxis id="euro" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
 *     </ChartRow>
 * </ChartContainer>
 * Note that there are two <YAxis> components defined here, one before the <Charts> block and one after.
 * This defines that the first axis will appear to the left of the charts and the second will appear after the charts. Each of the line charts uses its axis prop to identify the axis ("aud" or "euro") it will use for its vertical scale.
 */
export interface YAxisProps extends React.Props<YAxis> {
    /**
     * A name for the axis which can be used by a chart to reference the axis.
     */
    id: string;

    /**
     * The label to be displayed alongside the axis.
     */
    label?: string;

    /**
     * The scale type: linear, power, or log.
     */
    type?: "linear" | "power" | "log"; // (default: "linear")

    /**
     * Minimum value, which combined with "max", define the scale of the axis.
     */
    min: number; // (default: 0)

    /**
     * Maximum value, which combined with "min" define the scale of the axis.
     */
    max: number; // (default: 1)

    /**
     * The transition time for moving from one scale to another
     */
    transition?: number; // (default: 100)

    /**
     * The width of the axis
     */
    width?: number | string; // (default: 80)

    /**
     * d3.format for the axis labels.e.g.format = "$,.2f"
     */
    format?: string; // (default: ".2s")

    /**
     * If the chart should be rendered to with the axis on the left or right.
     * If you are using the axis in a ChartRow, you do not need to provide this.
     */
    align?: "left" | "right"; // (default: "left")

    /**
     *
     */
    absolute?: boolean; // (default: false)

    /**
     *
     */
    labelOffset?: number; // (default: 0)

    /**
     *
     */
    style?: YAxisStyle;
}

export interface YAxisStyle {
    labels: {
        labelColor: string,
        labelWeight: number,
        labelSize: number
    };
    axis: {
        axisColor: string
    }
}

export interface YAxisState { }
export class YAxis extends React.Component<YAxisProps, YAxisState>{ }

// =======================================================================================================
//  Styler
// =======================================================================================================

/**
 * For our Style we want to represent two things:
 *
 *   1. The overall style of an AreaChart should be consistent across a site
 *   2. The specific style of a columnName (e.g. "pressure") should be consistent
 *
 * The overall style is implemented with methods specific to
 * each chart type or entity:
 *
 *   - lineChartStyle()
 *   - areaChartStyle()
 *   - legendStyle()
 *   - etc
 *
 * These will render out an object that can be passed into the
 * charts themselves and will control the visual appearance,
 * keyed by columnName. This abstracts away the SVG details of the
 * underlying DOM elements.
 *
 * For the specific style we define here three out of the box parameters
 * by which one column can be different from another when rendered:
 *   - color
 *   - width (of a line)
 *   - dashed or not
 *
 */
export declare class styler {

    /**
     * The columns define the style associated with a particular
     * quantity, such as "inTraffic" or "temperature". The columns
     * are an array, with each element being either a string, or
     * and object defining the style.
     *
     *  * Using a string makes the assumption that you want to use a
     * color scheme, so you need to define that if you don't want the
     * default. A color will be then assigned to each column based
     * on the scheme. The string is the column name.
     *
     *  * In the second case of providing an object, you define properties
     * of the style yourself. Each object should contain a "key" property
     * which is the column name and optionally the `width` and `dashed`
     * property. If you don't supply the color, then the color
     * will come from the scheme.
     *
     */
    constructor(columns: {
        key: string,
        color: string,
        selected?: string,
        dashed?: boolean,
        width?: number
    }[] | string[], scheme?: string); // scheme default value is "Paired"

    /**
     * 
     */
    numColumns(): number;

    /**
     * Returns the color scheme with the appropiate number of colors.
     * If there are more columns than the largest set in the scheme then
     * just the largest scheme set will be returned.
     * @param  {number} columnCount The number of columns to apply the scheme to
     * @return {array}              An array with the scheme colors in it.
     */
    colorLookup(columnCount: number): string[];

    /**
     * 
     */
    legendStyle(column: string, event: string): LegendStyle;

    /**
     * 
     */
    areaChartStyle(): AreaChartStyle;

    /**
     * 
     */
    lineChartStyle(): LineChartStyle;

    /**
     * 
     */
    barChartStyle(): BarChartStyle;

    /**
     * 
     */
    scatterChartStyle(): ScatterChartStyle;

    /**
     * 
     */
    axisStyle(column: string): { labelColor: string };
}