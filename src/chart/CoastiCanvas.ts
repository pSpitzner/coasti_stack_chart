// Coordinates and renders the complete Coasti architecture canvas.
import * as d3 from "d3";
import { CoordinateSystem, type CanvasLayout, type CanvasPadding } from "./CoordinateSystem";
import { SvgComponent } from "./SvgComponent";
import { ArchitectureComponent, type ArchitectureComponentAnchor } from "./ArchitectureComponent";
import { Tooltip } from "./Tooltip";
import type { ComponentAnchor } from "../main";

const iconFiles = import.meta.glob("../../icons/*.svg", {
    eager: true,
    import: "default",
    query: "?url",
}) as Record<string, string>;

export class CoastiCanvas {
    private readonly coordinates: CoordinateSystem;
    private readonly wrapper: HTMLElement;
    private readonly layout: CanvasLayout;
    private readonly components: ComponentAnchor[];
    private readonly servers: ArchitectureComponentAnchor[];
    private readonly products: ArchitectureComponentAnchor[];
    private readonly padding: CanvasPadding;

    constructor(
        wrapper: HTMLElement,
        layout: CanvasLayout,
        dimensions: { scale: number; padding: CanvasPadding },
        components: ComponentAnchor[],
        servers: ArchitectureComponentAnchor[],
        products: ArchitectureComponentAnchor[],
    ) {
        this.wrapper = wrapper;
        this.layout = layout;
        this.components = components;
        this.servers = servers;
        this.products = products;
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

        // Extra dark rounded rectangle around the inner matrix content.
        const matrixPadding = 8;
        const logoWidth = 60;
        const logoHeight = 21;
        const logoGap = 3;
        svg.append("rect")
            .attr("class", "matrix-background")
            .attr("x", this.coordinates.toSvgPosition(-matrixPadding, "x"))
            .attr("y", this.coordinates.toSvgPosition(-matrixPadding, "y"))
            .attr("width", this.coordinates.toSvgUnits(this.layout.matrixWidth + matrixPadding * 2))
            .attr("height", this.coordinates.toSvgUnits(this.layout.matrixHeight + matrixPadding * 2))
            .attr("rx", this.coordinates.toSvgUnits(3))
            .attr("ry", this.coordinates.toSvgUnits(3));

        const logoSource = iconFiles["/icons/coasti.svg"] ??
            Object.entries(iconFiles).find(([path]) => path.endsWith("/coasti.svg"))?.[1];
        if (logoSource) {
            svg.append("image")
                .attr("class", "coasti-logo")
                .attr("href", logoSource)
                .attr("x", this.coordinates.toSvgPosition(-10, "x"))
                .attr("y", this.coordinates.toSvgPosition(-matrixPadding - logoHeight - logoGap, "y"))
                .attr("width", this.coordinates.toSvgUnits(logoWidth))
                .attr("height", this.coordinates.toSvgUnits(logoHeight))
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("role", "img")
                .attr("aria-label", "coasti logo");
        }

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

        return this;
    }
}
