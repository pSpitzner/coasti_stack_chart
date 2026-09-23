// Coordinates and renders the complete Coasti architecture canvas.
import * as d3 from "d3";
import { CoordinateSystem, type CanvasLayout, type CanvasPadding } from "./CoordinateSystem";
import { SvgComponent, type ComponentAnchor } from "./SvgComponent";
import { ArchitectureComponent, type ArchitectureComponentAnchor } from "./ArchitectureComponent";
import { LogoComponent, type LogoConfiguration } from "./LogoComponent";
import { Tooltip } from "./Tooltip";

export class CoastiCanvas {
    private readonly coordinates: CoordinateSystem;
    private readonly wrapper: HTMLElement;
    private readonly layout: CanvasLayout;
    private readonly components: ComponentAnchor[];
    private readonly servers: ArchitectureComponentAnchor[];
    private readonly products: ArchitectureComponentAnchor[];
    private readonly logoConfiguration: LogoConfiguration | undefined;
    private readonly padding: CanvasPadding;

    constructor(
        wrapper: HTMLElement,
        layout: CanvasLayout,
        dimensions: { scale: number; padding: CanvasPadding },
        components: ComponentAnchor[],
        servers: ArchitectureComponentAnchor[],
        products: ArchitectureComponentAnchor[],
        logoConfiguration: LogoConfiguration | undefined,
    ) {
        this.wrapper = wrapper;
        this.layout = layout;
        this.components = components;
        this.servers = servers;
        this.products = products;
        this.logoConfiguration = logoConfiguration;
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
            .attr("width", this.coordinates.toSvgUnits(
                this.layout.matrixWidth +
                this.padding.left + this.padding.right,
            ))
            .attr("height", this.coordinates.toSvgUnits(
                this.layout.matrixHeight +
                this.padding.top + this.padding.bottom,
            ));

        const tooltip = new Tooltip(this.wrapper);
        if (this.logoConfiguration) {
            new LogoComponent(
                svg.append("g").attr("class", "logo-layer"),
                this.coordinates,
                tooltip,
                {
                    tooltipHeading: this.logoConfiguration.tooltipHeading,
                    tooltipText: this.logoConfiguration.tooltipText,
                    matrixWidth: this.layout.matrixWidth,
                    matrixHeight: this.layout.matrixHeight,
                    x: this.logoConfiguration.x,
                    y: this.logoConfiguration.y,
                },
            ).render();
        }
        this.renderComponents(svg, tooltip);
        return this;
    }

    private renderComponents(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, tooltip: Tooltip): void {
        const componentLayer = svg.append("g").attr("class", "component-layer");
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
        const serverLayer = svg
            .append("g")
            .attr("class", "architecture-component-layer server-layer");
        this.servers.forEach((anchor) => {
            new ArchitectureComponent(
                serverLayer,
                anchor,
                this.coordinates,
                tooltip,
                componentLayer,
            ).render();
        });
        const productLayer = svg
            .append("g")
            .attr("class", "architecture-component-layer product-layer");
        this.products.forEach((anchor) => {
            new ArchitectureComponent(
                productLayer,
                anchor,
                this.coordinates,
                tooltip,
                componentLayer,
            ).render();
        });
    }
}
