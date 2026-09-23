import * as d3 from "d3";
import { CoordinateSystem, type CanvasLayout } from "./CoordinateSystem";
import { SvgComponent } from "./SvgComponent";
import { ServerComponent, type ServerAnchor } from "./ServerComponent";
import { Tooltip } from "./Tooltip";
import type { ComponentAnchor } from "../main";

export class CoastiCanvas {
    private readonly coordinates: CoordinateSystem;
    private readonly wrapper: HTMLElement;
    private readonly layout: CanvasLayout;
    private readonly components: ComponentAnchor[];
    private readonly servers: ServerAnchor[];
    private readonly padding: number;

    constructor(
        wrapper: HTMLElement,
        layout: CanvasLayout,
        dimensions: { scale: number; padding: number },
        components: ComponentAnchor[],
        servers: ServerAnchor[],
    ) {
        this.wrapper = wrapper;
        this.layout = layout;
        this.components = components;
        this.servers = servers;
        this.padding = dimensions.padding;
        this.coordinates = new CoordinateSystem(dimensions);
    }

    render(): this {
        const svg = d3
            .select(this.wrapper)
            .append("svg")
            .attr("class", "coasti-canvas")
            .attr("viewBox", this.coordinates.canvasViewBox(this.layout))
            .attr("role", "img")
            .attr("aria-label", "Coasti stack component layout");

        svg.append("rect")
            .attr("class", "canvas-background")
            .attr("width", this.coordinates.toSvgUnits(this.layout.canvasWidth + this.padding * 2))
            .attr("height", this.coordinates.toSvgUnits(this.layout.canvasHeight + this.padding * 2));

        const componentLayer = svg.append("g").attr("class", "component-layer");
        const tooltip = new Tooltip(this.wrapper);
        this.components.forEach((anchor) => {
            new SvgComponent(
                componentLayer,
                anchor,
                this.coordinates,
                tooltip,
                anchor.tooltipHeading,
                anchor.tooltipText,
            ).render();
        });
        const serverLayer = svg.append("g").attr("class", "server-layer");
        this.servers.forEach((anchor) => {
            new ServerComponent(
                serverLayer,
                anchor,
                this.coordinates,
                tooltip,
                componentLayer,
            ).render();
        });

        return this;
    }
}
