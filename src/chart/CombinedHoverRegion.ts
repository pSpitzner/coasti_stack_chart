// Turns several building blocks, optionally together with architecture icons,
// plus the gaps between them into one continuous hover target. The highlight,
// flows, and tooltip stay active while the pointer moves across the whole area.
import * as d3 from "d3";
import { CoordinateSystem } from "./CoordinateSystem";
import { Tooltip } from "./Tooltip";
import { setGroupLinked } from "./groupLinking";
import type { ComponentAnchor } from "./SvgComponent";
import type { ArchitectureComponentAnchor } from "./ArchitectureComponent";

export interface CombinedHoverRegionAnchor {
    id: string;
    // Building blocks that make up the region. Their combined bounding box
    // defines the hit area, including the gaps between them.
    componentIds: string[];
    // Architecture icons (servers, product markers) to include as well. Their
    // rendered hit area is used, so labels are covered too.
    architectureComponentIds?: string[];
    // Components that are focused (but not part of the hit area) while the
    // region is hovered, e.g. the shared Superset frontend.
    linkedComponentIds?: string[];
    // Hover group that stays active while the pointer is anywhere in the region.
    group: string;
    // Single tooltip for the whole region. Members do not define their own.
    tooltipHeading?: string;
    tooltipText: string;
}

interface RegionBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

const defaultArchitectureIconWidth = 17;
const defaultArchitectureIconHeight = 12;

export class CombinedHoverRegion {
    private readonly layer: d3.Selection<SVGGElement, unknown, null, undefined>;
    private readonly componentLayer: d3.Selection<SVGGElement, unknown, null, undefined>;
    private readonly region: CombinedHoverRegionAnchor;
    private readonly components: ComponentAnchor[];
    private readonly architectureComponents: ArchitectureComponentAnchor[];
    private readonly coordinates: CoordinateSystem;
    private readonly tooltip: Tooltip;

    constructor(
        layer: d3.Selection<SVGGElement, unknown, null, undefined>,
        componentLayer: d3.Selection<SVGGElement, unknown, null, undefined>,
        region: CombinedHoverRegionAnchor,
        components: ComponentAnchor[],
        architectureComponents: ArchitectureComponentAnchor[],
        coordinates: CoordinateSystem,
        tooltip: Tooltip,
    ) {
        this.layer = layer;
        this.componentLayer = componentLayer;
        this.region = region;
        this.components = components;
        this.architectureComponents = architectureComponents;
        this.coordinates = coordinates;
        this.tooltip = tooltip;
    }

    render(): this {
        const bounds: RegionBounds[] = [];

        this.region.componentIds
            .map((id) => this.components.find((component) => component.id === id))
            .filter((component): component is ComponentAnchor => Boolean(component))
            .forEach((component) => {
                bounds.push({
                    x: this.coordinates.toSvgPosition(component.x, "x"),
                    y: this.coordinates.toSvgPosition(component.y, "y"),
                    width: this.coordinates.toSvgUnits(component.width),
                    height: this.coordinates.toSvgUnits(component.height),
                });
            });

        const architectureMembers = (this.region.architectureComponentIds ?? [])
            .map((id) =>
                this.architectureComponents.find((component) => component.id === id),
            )
            .filter(
                (component): component is ArchitectureComponentAnchor =>
                    Boolean(component),
            );
        architectureMembers.forEach((component) => {
            const area = this.architectureArea(component);
            if (area) {
                bounds.push(area);
            }
        });

        if (bounds.length === 0) {
            return this;
        }

        const linkedComponentIds = new Set(this.region.linkedComponentIds ?? []);

        const left = Math.min(...bounds.map((bound) => bound.x));
        const top = Math.min(...bounds.map((bound) => bound.y));
        const right = Math.max(...bounds.map((bound) => bound.x + bound.width));
        const bottom = Math.max(...bounds.map((bound) => bound.y + bound.height));

        const rect = this.layer
            .append("rect")
            .attr("class", "component-hover-region")
            .attr("x", left)
            .attr("y", top)
            .attr("width", right - left)
            .attr("height", bottom - top)
            .attr("data-component", this.region.id)
            .attr("data-hover-group", this.region.group)
            .attr("role", "group")
            .attr("aria-label", this.region.tooltipText);

        const setHovered = (hovered: boolean) => {
            // The region behaves like an architecture hover: the group and any
            // linked components stay in focus while the rest of the chart blurs.
            // `has-hovered` is deliberately not set: its blur rule does not
            // exempt `is-architecture-linked` components such as Superset.
            this.componentLayer.classed("has-architecture-hovered", hovered);
            const canvas = this.layer.node()?.closest(".coasti-canvas");
            if (canvas) {
                d3.select(canvas).classed("has-architecture-hovered", hovered);
            }
            setGroupLinked(canvas, this.region.group, hovered);
            if (linkedComponentIds.size > 0) {
                this.componentLayer
                    .selectAll<SVGGElement, unknown>(".component")
                    .filter(function () {
                        return linkedComponentIds.has(
                            this.getAttribute("data-component") ?? "",
                        );
                    })
                    .classed("is-architecture-linked", hovered);
            }
            if (!hovered) {
                this.tooltip.hide();
            }
        };

        const showTooltip = (event: PointerEvent) => {
            this.tooltip.show(
                this.region.tooltipHeading,
                this.region.tooltipText,
                event,
                -20,
                28,
            );
        };

        rect
            .on("pointerenter", (event: PointerEvent) => {
                setHovered(true);
                showTooltip(event);
            })
            .on("pointermove", (event: PointerEvent) => showTooltip(event))
            .on("pointerleave", () => setHovered(false));

        return this;
    }

    // Uses the rendered hit area of an architecture icon so its label is
    // covered as well, falling back to the icon box before layout is ready.
    private architectureArea(
        component: ArchitectureComponentAnchor,
    ): RegionBounds | undefined {
        const svg = this.layer.node()?.ownerSVGElement;
        const group = svg?.querySelector<SVGGElement>(
            `[data-architecture-component="${component.id}"]`,
        );
        const hitArea = group?.querySelector<SVGRectElement>(
            ".architecture-component-hit-area",
        );
        if (hitArea) {
            return {
                x: Number(hitArea.getAttribute("x")),
                y: Number(hitArea.getAttribute("y")),
                width: Number(hitArea.getAttribute("width")),
                height: Number(hitArea.getAttribute("height")),
            };
        }
        return {
            x: this.coordinates.toSvgPosition(component.x, "x"),
            y: this.coordinates.toSvgPosition(component.y, "y"),
            width: this.coordinates.toSvgUnits(
                component.iconWidth ?? defaultArchitectureIconWidth,
            ),
            height: this.coordinates.toSvgUnits(
                component.iconHeight ?? defaultArchitectureIconHeight,
            ),
        };
    }
}
