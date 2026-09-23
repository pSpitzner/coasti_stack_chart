import * as d3 from "d3";
import { CoordinateSystem } from "./CoordinateSystem";
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
    private readonly anchor: ComponentAnchor;
    private readonly coordinates: CoordinateSystem;

    constructor(
        layer: d3.Selection<SVGGElement, unknown, null, undefined>,
        anchor: ComponentAnchor,
        coordinates: CoordinateSystem,
    ) {
        this.anchor = anchor;
        this.coordinates = coordinates;
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
            .attr("transform", `translate(${x}, ${y})`);

        this.group
            .append("image")
            .attr("class", "component-image")
            .attr("href", sourceFor(this.anchor.id))
            .attr("width", width)
            .attr("height", height)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("role", "img")
            .attr("aria-label", this.anchor.id);

        return this;
    }
}
