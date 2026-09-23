// Renders a diffuse particle stream along supplied matrix-relative flow segments.
import * as d3 from "d3";
import { CoordinateSystem } from "./CoordinateSystem";

export interface FlowPoint {
    x: number;
    y: number;
}

export interface FlowSegment {
    start: FlowPoint;
    end: FlowPoint;
    baseColor: string;
    sourceWidth?: number;
    targetWidth?: number;
    particleCount?: number;
}

export class FlowParticles {
    private readonly layer: d3.Selection<SVGGElement, unknown, null, undefined>;
    private readonly coordinates: CoordinateSystem;
    private readonly segments: FlowSegment[];
    private timer: d3.Timer | undefined;

    constructor(
        layer: d3.Selection<SVGGElement, unknown, null, undefined>,
        coordinates: CoordinateSystem,
        segments: FlowSegment[],
    ) {
        this.layer = layer;
        this.coordinates = coordinates;
        this.segments = segments;
    }

    render(): this {
        const particles = this.segments.flatMap((segment) => {
            const startX = this.coordinates.toSvgPosition(segment.start.x, "x");
            const startY = this.coordinates.toSvgPosition(segment.start.y, "y");
            const endX = this.coordinates.toSvgPosition(segment.end.x, "x");
            const endY = this.coordinates.toSvgPosition(segment.end.y, "y");
            const bend = Math.abs(endY - startY) * 0.35;
            const sourceWidth = this.coordinates.toSvgUnits(segment.sourceWidth ?? 0);
            const targetWidth = this.coordinates.toSvgUnits(segment.targetWidth ?? 0);
            const controlWidth = Math.max(sourceWidth, targetWidth) * 0.45;
            const baseColor = d3.hsl(segment.baseColor);
            if (!baseColor) {
                throw new Error(`Invalid flow particle color: ${segment.baseColor}`);
            }
            return d3.range(segment.particleCount ?? 48).map(() => {
                const startVariation = (Math.random() - 0.5) * sourceWidth;
                const firstControlVariation = (Math.random() - 0.5) * controlWidth;
                const secondControlVariation = (Math.random() - 0.5) * controlWidth;
                const endVariation = (Math.random() - 0.5) * targetWidth;
                const particleColor = d3
                    .hsl(
                        baseColor.h + (Math.random() - 0.5) * 18,
                        Math.max(
                            0,
                            Math.min(1, baseColor.s + (Math.random() - 0.5) * 0.16),
                        ),
                        Math.max(
                            0,
                            Math.min(1, baseColor.l + (Math.random() - 0.5) * 0.2),
                        ),
                    )
                    .formatHex();
                const path = this.layer
                    .append("path")
                    .attr("class", "flow-particle-path")
                    .attr(
                        "d",
                        `M ${startX + startVariation} ${startY} C ${startX + firstControlVariation} ${startY - bend}, ${endX + secondControlVariation} ${endY + bend}, ${endX + endVariation} ${endY}`,
                    )
                    .node();
                const particle = this.layer
                    .append("circle")
                    .attr("class", "flow-particle")
                    .attr("r", 2.2 + Math.random() * 2.8)
                    .attr("fill", particleColor)
                    .node();

                if (!path || !particle) {
                    throw new Error("Unable to create flow particle.");
                }

                return {
                    path,
                    particle,
                    offset: Math.random(),
                    speed: 0.00011 + Math.random() * 0.00008,
                    opacity: 0.65 + Math.random() * 0.3,
                };
            });
        });

        this.timer = d3.timer((elapsedMilliseconds) => {
            particles.forEach(({ path, particle, offset, speed, opacity }) => {
                const progress = (elapsedMilliseconds * speed + offset) % 1;
                const point = path.getPointAtLength(progress * path.getTotalLength());
                d3.select(particle)
                    .attr("cx", point.x)
                    .attr("cy", point.y)
                    .attr("opacity", opacity);
            });
        });

        return this;
    }

    destroy(): void {
        this.timer?.stop();
    }
}
