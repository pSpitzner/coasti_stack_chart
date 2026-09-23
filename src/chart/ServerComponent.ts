import * as d3 from "d3";
import { CoordinateSystem } from "./CoordinateSystem";
import { Tooltip } from "./Tooltip";

const iconFiles = import.meta.glob("../../icons/*.svg", {
    eager: true,
    import: "default",
    query: "?url",
}) as Record<string, string>;

export type ServerTextPosition = "left" | "right" | "above" | "below";
export type ServerTextAlign = "left" | "center" | "right";

export interface ServerAnchor {
    id: string;
    iconId: string;
    text: string;
    tooltipHeading: string;
    tooltipText: string;
    componentIds: string[];
    x: number;
    y: number;
    iconWidth?: number;
    iconHeight?: number;
    textPosition?: ServerTextPosition;
    textAlign?: ServerTextAlign;
    textGap?: number;
}

const defaultServerOptions = {
    iconWidth: 17,
    iconHeight: 12,
    textPosition: "left" as ServerTextPosition,
    textAlign: "right" as ServerTextAlign,
    textGap: 4,
};

function sourceFor(iconId: string): string {
    const filePath = Object.keys(iconFiles).find((path) =>
        path.endsWith(`/${iconId}.svg`),
    );

    if (!filePath) {
        throw new Error(`No server icon found for ${iconId}.svg`);
    }

    return iconFiles[filePath];
}

export class ServerComponent {
    private readonly group: d3.Selection<SVGGElement, unknown, null, undefined>;
    private readonly anchor: ServerAnchor;
    private readonly coordinates: CoordinateSystem;
    private readonly tooltip: Tooltip;
    private readonly componentLayer: d3.Selection<SVGGElement, unknown, null, undefined>;

    constructor(
        layer: d3.Selection<SVGGElement, unknown, null, undefined>,
        anchor: ServerAnchor,
        coordinates: CoordinateSystem,
        tooltip: Tooltip,
        componentLayer: d3.Selection<SVGGElement, unknown, null, undefined>,
    ) {
        this.anchor = anchor;
        this.coordinates = coordinates;
        this.tooltip = tooltip;
        this.componentLayer = componentLayer;
        this.group = layer.append("g");
    }

    render(): this {
        const x = this.coordinates.toSvgPosition(this.anchor.x);
        const y = this.coordinates.toSvgPosition(this.anchor.y);
        const iconWidth = this.coordinates.toSvgUnits(
            this.anchor.iconWidth ?? defaultServerOptions.iconWidth,
        );
        const iconHeight = this.coordinates.toSvgUnits(
            this.anchor.iconHeight ?? defaultServerOptions.iconHeight,
        );
        const textGap = this.coordinates.toSvgUnits(
            this.anchor.textGap ?? defaultServerOptions.textGap,
        );
        const iconCenterX = x + iconWidth / 2;
        const iconCenterY = y + iconHeight / 2;
        const text = this.group
            .append("text")
            .attr("class", "server-component-text")
            .style("--server-text-size", "18px");

        const textLines = this.anchor.text.split(/<br\s*\/?\s*>/i);
        textLines.forEach((line, index) => {
            text.append("tspan")
                .attr("dy", index === 0 ? 0 : "1.2em")
                .text(line);
        });

        this.group
            .attr("class", "server-component")
            .attr("data-server", this.anchor.id)
            .attr("role", "group")
            .attr("aria-label", this.anchor.text);

        this.group
            .append("image")
            .attr("class", "server-component-icon")
            .attr("href", sourceFor(this.anchor.iconId))
            .attr("x", x)
            .attr("y", y)
            .attr("width", iconWidth)
            .attr("height", iconHeight)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("role", "img")
            .attr("aria-label", `${this.anchor.text} icon`);

        switch (this.anchor.textPosition ?? defaultServerOptions.textPosition) {
            case "left":
                text.attr("x", x - textGap).attr("y", iconCenterY)
                    .attr("text-anchor", textAnchor(this.anchor.textAlign ?? defaultServerOptions.textAlign))
                    .attr("dominant-baseline", "middle");
                text.selectAll("tspan").attr("dy", (_, index) =>
                    index === 0 ? "-0.6em" : "1.2em",
                );
                break;
            case "right":
                text.attr("x", x + iconWidth + textGap).attr("y", iconCenterY)
                    .attr("text-anchor", textAnchor(this.anchor.textAlign ?? "left"))
                    .attr("dominant-baseline", "middle");
                text.selectAll("tspan").attr("dy", (_, index) =>
                    index === 0 ? "-0.6em" : "1.2em",
                );
                break;
            case "above":
                text.attr("x", iconCenterX).attr("y", y - textGap)
                    .attr("text-anchor", textAnchor(this.anchor.textAlign ?? "center"))
                    .attr("dominant-baseline", "auto");
                break;
            case "below":
                text.attr("x", iconCenterX).attr("y", y + iconHeight + textGap)
                    .attr("text-anchor", textAnchor(this.anchor.textAlign ?? "center"))
                    .attr("dominant-baseline", "hanging");
                break;
        }

            text.selectAll("tspan").attr("x", text.attr("x"));

        const bounds = this.group.node()?.getBBox();
        if (bounds) {
            this.group
                .append("rect")
                .attr("class", "server-component-hit-area")
                .attr("x", bounds.x - 2)
                .attr("y", bounds.y - 2)
                .attr("width", bounds.width + 4)
                .attr("height", bounds.height + 4)
                .attr("fill", "transparent");
        }

            const setHovered = (hovered: boolean, event?: PointerEvent) => {
                this.group.classed("is-hovered", hovered);
                const serverLayer = this.group.node()?.parentElement;
                if (serverLayer) {
                    d3.select(serverLayer).classed("has-server-hovered", hovered);
                }
                this.componentLayer.classed("has-server-hovered", hovered);
                const linkedComponentIds = this.anchor.componentIds;
                this.componentLayer
                    .selectAll<SVGGElement, unknown>(".component")
                    .classed("is-server-linked", function () {
                        return hovered && linkedComponentIds.includes(
                            this.getAttribute("data-component") ?? "",
                        );
                    });
                if (hovered) {
                    if (event) {
                        this.tooltip.show(
                            this.anchor.tooltipHeading,
                            this.anchor.tooltipText,
                            event,
                            -140,
                            28,
                        );
                    } else if (this.group.node()) {
                        this.tooltip.showForElement(
                            this.anchor.tooltipHeading,
                            this.anchor.tooltipText,
                            this.group.node()!,
                        );
                    }
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

function textAnchor(alignment: ServerTextAlign): "start" | "middle" | "end" {
    return alignment === "left"
        ? "start"
        : alignment === "right"
            ? "end"
            : "middle";
}
