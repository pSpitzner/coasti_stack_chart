// Renders the Coasti logo and coordinates its hover state with the matrix background.
import * as d3 from "d3";
import { CoordinateSystem } from "./CoordinateSystem";
import { Tooltip } from "./Tooltip";

const iconFiles = import.meta.glob("../../icons/*.svg", {
    eager: true,
    import: "default",
    query: "?url",
}) as Record<string, string>;

const logoSource = iconFiles["/icons/coasti.svg"] ??
    Object.entries(iconFiles).find(([path]) => path.endsWith("/coasti.svg"))?.[1];

export interface LogoConfiguration {
    tooltipHeading?: string;
    tooltipText: string;
    x: number;
    y: number;
}

export interface LogoComponentOptions {
    tooltipHeading?: string;
    tooltipText: string;
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
        if (!logoSource) {
            return this;
        }

        const matrixPadding = 8;
        const logoWidth = 60;
        const logoHeight = 21;
        const matrixBackground = this.layer
            .append("g")
            .attr("class", "matrix-background-group")
            .append("rect")
            .attr("class", "matrix-background")
            .style("--logo-shift-x", "0px")
            .style("--logo-shift-y", "0px")
            .style("--logo-rotate-x", "0deg")
            .style("--logo-rotate-y", "0deg")
            .attr("x", this.coordinates.toSvgPosition(-matrixPadding, "x"))
            .attr("y", this.coordinates.toSvgPosition(-matrixPadding, "y"))
            .attr("width", this.coordinates.toSvgUnits(this.options.matrixWidth + matrixPadding * 2))
            .attr("height", this.coordinates.toSvgUnits(this.options.matrixHeight + matrixPadding * 2))
            .attr("rx", this.coordinates.toSvgUnits(3))
            .attr("ry", this.coordinates.toSvgUnits(3));

        const logo = this.layer
            .append("g")
            .attr("class", "logo-component")
            .style("--logo-shift-x", "0px")
            .style("--logo-shift-y", "0px")
            .style("--logo-rotate-x", "0deg")
            .style("--logo-rotate-y", "0deg")
            .attr("tabindex", 0)
            .attr("role", "group")
            .attr("aria-label", "Coasti logo");
        logo.append("image")
            .attr("class", "coasti-logo")
            .attr("href", logoSource)
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

        let interactionBounds: DOMRect | undefined;

        const resetTileTransform = () => {
            for (const tile of [logo, matrixBackground]) {
                tile
                    .style("--logo-shift-x", "0px")
                    .style("--logo-shift-y", "0px")
                    .style("--logo-rotate-x", "0deg")
                    .style("--logo-rotate-y", "0deg");
            }
        };

        const updateTileTransform = (event: PointerEvent) => {
            const bounds = interactionBounds;
            if (!bounds) {
                return;
            }

            const horizontalOffset = (event.clientX - (bounds.left + bounds.width / 2)) /
                (bounds.width / 2);
            const verticalOffset = (event.clientY - (bounds.top + bounds.height / 2)) /
                (bounds.height / 2);
            const clampedHorizontalOffset = Math.max(-1, Math.min(1, horizontalOffset));
            const clampedVerticalOffset = Math.max(-1, Math.min(1, verticalOffset));

            for (const tile of [logo, matrixBackground]) {
                tile
                    .style("--logo-shift-x", `${clampedHorizontalOffset * 3}px`)
                    .style("--logo-shift-y", `${clampedVerticalOffset * 3}px`)
                    .style("--logo-rotate-x", `${clampedVerticalOffset * -6}deg`)
                    .style("--logo-rotate-y", `${clampedHorizontalOffset * 6}deg`);
            }
        };

        const setHovered = (hovered: boolean, event?: PointerEvent) => {
            logo.classed("is-hovered", hovered);
            matrixBackground.classed("is-logo-hovered", hovered);
            if (!hovered) {
                resetTileTransform();
            }
            const canvas = logo.node()?.closest(".coasti-canvas");
            if (canvas) {
                d3.select(canvas).classed("has-logo-hovered", hovered);
            }
            if (hovered) {
                if (event) {
                    this.tooltip.show(
                        this.options.tooltipHeading,
                        this.options.tooltipText,
                        event,
                        -20,
                        28,
                    );
                } else if (logo.node()) {
                    this.tooltip.showForElement(
                        this.options.tooltipHeading,
                        this.options.tooltipText,
                        logo.node()!,
                    );
                }
            } else {
                this.tooltip.hide();
            }
        };

        logo
            .on("pointerenter", (event) => {
                interactionBounds = logo.node()?.getBoundingClientRect();
                setHovered(true, event);
                updateTileTransform(event);
            })
            .on("pointermove", (event) => {
                interactionBounds ??= logo.node()?.getBoundingClientRect();
                setHovered(true, event);
                updateTileTransform(event);
            })
            .on("pointerleave", () => {
                interactionBounds = undefined;
                setHovered(false);
            })
            .on("focus", () => {
                interactionBounds = undefined;
                resetTileTransform();
                setHovered(true);
            })
            .on("blur", () => {
                interactionBounds = undefined;
                setHovered(false);
            });

        return this;
    }
}
