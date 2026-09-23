import * as d3 from "d3";
import { CoordinateSystem } from "./CoordinateSystem";
import { Tooltip } from "./Tooltip";
import type { ComponentAnchor } from "../main";

const svgFiles = import.meta.glob("../../components/*.svg", {
    eager: true,
    import: "default",
    query: "?url",
}) as Record<string, string>;

function sourceFor(componentId: string): string {
    const filePath = Object.keys(svgFiles).find((path) =>
        path.endsWith(`/${componentId}.svg`),
    );

    if (!filePath) {
        throw new Error(`No SVG component found for ${componentId}.svg`);
    }

    return svgFiles[filePath];
}

export class SvgComponent {
    private readonly group: d3.Selection<SVGGElement, unknown, null, undefined>;
    private readonly layer: d3.Selection<SVGGElement, unknown, null, undefined>;
    private readonly anchor: ComponentAnchor;
    private readonly coordinates: CoordinateSystem;
    private readonly tooltip: Tooltip;
    private readonly tooltipHeading: string;
    private readonly tooltipText: string;

    constructor(
        layer: d3.Selection<SVGGElement, unknown, null, undefined>,
        anchor: ComponentAnchor,
        coordinates: CoordinateSystem,
        tooltip: Tooltip,
        tooltipHeading: string,
        tooltipText: string,
    ) {
        this.anchor = anchor;
        this.coordinates = coordinates;
        this.layer = layer;
        this.tooltip = tooltip;
        this.tooltipHeading = tooltipHeading;
        this.tooltipText = tooltipText;
        this.group = layer.append("g");
    }

    render(): this {
        const x = this.coordinates.toSvgPosition(this.anchor.x);
        const y = this.coordinates.toSvgPosition(this.anchor.y);
        const width = this.coordinates.toSvgUnits(this.anchor.width);
        const height = this.coordinates.toSvgUnits(this.anchor.height);

        this.group
            .attr("class", "component")
            .attr("data-component", this.anchor.id)
            .style("--component-x", `${x}px`)
            .style("--component-y", `${y}px`)
            .style("--component-width", `${width}px`)
            .style("--component-height", `${height}px`);

        this.group
            .append("image")
            .attr("class", "component-image")
            .attr("href", sourceFor(this.anchor.id))
            .attr("width", width)
            .attr("height", height)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("role", "img")
            .attr("aria-label", this.anchor.id);

        const setHovered = (hovered: boolean, event?: PointerEvent) => {
            this.group.classed("is-hovered", hovered);
            this.layer.classed("has-hovered", hovered);
            if (hovered) {
                if (event) this.tooltip.show(
                    this.tooltipHeading,
                    this.tooltipText,
                    event,
                    -20,
                    28,
                );
                else if (this.group.node()) this.tooltip.showForElement(this.tooltipHeading, this.tooltipText, this.group.node()!);
            } else {
                this.tooltip.hide();
            }
        };

        this.group
            .on("pointerenter", (event) => setHovered(true, event))
            .on("pointermove", (event) => setHovered(true, event))
            .on("pointerleave", () => setHovered(false))
            .on("focus", () => setHovered(true))
            .on("blur", () => setHovered(false));

        return this;
    }
}
