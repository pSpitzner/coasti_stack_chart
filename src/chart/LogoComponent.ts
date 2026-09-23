// Renders the Coasti logo and coordinates its hover state with the matrix background.
import * as d3 from "d3";
import { CoordinateSystem } from "./CoordinateSystem";
import { Tooltip } from "./Tooltip";

export interface LogoComponentOptions {
    source: string;
    matrixWidth: number;
    matrixHeight: number;
    x: number;
    y: number;
}

export class LogoComponent {
    private readonly layer: d3.Selection<SVGGElement, unknown, null, undefined>;
    private readonly coordinates: CoordinateSystem;
    private readonly tooltip: Tooltip;
    private readonly options: LogoComponentOptions;

    constructor(
        layer: d3.Selection<SVGGElement, unknown, null, undefined>,
        coordinates: CoordinateSystem,
        tooltip: Tooltip,
        options: LogoComponentOptions,
    ) {
        this.layer = layer;
        this.coordinates = coordinates;
        this.tooltip = tooltip;
        this.options = options;
    }

    render(): this {
        const matrixPadding = 8;
        const logoWidth = 60;
        const logoHeight = 21;
        const matrixBackground = this.layer
            .append("g")
            .attr("class", "matrix-background-group")
            .append("rect")
            .attr("class", "matrix-background")
            .attr("x", this.coordinates.toSvgPosition(-matrixPadding, "x"))
            .attr("y", this.coordinates.toSvgPosition(-matrixPadding, "y"))
            .attr("width", this.coordinates.toSvgUnits(this.options.matrixWidth + matrixPadding * 2))
            .attr("height", this.coordinates.toSvgUnits(this.options.matrixHeight + matrixPadding * 2))
            .attr("rx", this.coordinates.toSvgUnits(3))
            .attr("ry", this.coordinates.toSvgUnits(3));

        const logo = this.layer
            .append("g")
            .attr("class", "logo-component")
            .attr("tabindex", 0)
            .attr("role", "group")
            .attr("aria-label", "Coasti logo");
        logo.append("image")
            .attr("class", "coasti-logo")
            .attr("href", this.options.source)
            .attr("x", this.coordinates.toSvgPosition(this.options.x, "x"))
            .attr("y", this.coordinates.toSvgPosition(this.options.y, "y"))
            .attr("width", this.coordinates.toSvgUnits(logoWidth))
            .attr("height", this.coordinates.toSvgUnits(logoHeight))
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("role", "img")
            .attr("aria-label", "coasti logo");
        logo.append("rect")
            .attr("class", "logo-component-hit-area")
            .attr("x", this.coordinates.toSvgPosition(this.options.x, "x") - 2)
            .attr("y", this.coordinates.toSvgPosition(this.options.y, "y") - 2)
            .attr("width", this.coordinates.toSvgUnits(logoWidth) + 4)
            .attr("height", this.coordinates.toSvgUnits(logoHeight) + 4)
            .attr("fill", "transparent");

        const setHovered = (hovered: boolean, event?: PointerEvent) => {
            logo.classed("is-hovered", hovered);
            matrixBackground.classed("is-logo-hovered", hovered);
            const canvas = logo.node()?.closest(".coasti-canvas");
            if (canvas) {
                d3.select(canvas).classed("has-logo-hovered", hovered);
            }
            if (hovered) {
                if (event) {
                    this.tooltip.show(
                        "Coasti",
                        "The Coasti platform architecture.",
                        event,
                        -20,
                        28,
                    );
                } else if (logo.node()) {
                    this.tooltip.showForElement(
                        "Coasti",
                        "The Coasti platform architecture.",
                        logo.node()!,
                    );
                }
            } else {
                this.tooltip.hide();
            }
        };

        logo
            .on("pointerenter", (event) => setHovered(true, event))
            .on("pointermove", (event) => setHovered(true, event))
            .on("pointerleave", () => setHovered(false))
            .on("focus", () => setHovered(true))
            .on("blur", () => setHovered(false));

        return this;
    }
}
