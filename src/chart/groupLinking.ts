// Keeps every element that shares a hover group in focus together.
import * as d3 from "d3";

export function setGroupLinked(
    canvas: Element | null | undefined,
    group: string | undefined,
    linked: boolean,
): void {
    if (!canvas || !group) {
        return;
    }
    d3.select(canvas)
        .selectAll<SVGGElement, unknown>(`[data-hover-group="${group}"]`)
        .classed("is-group-linked", linked);
}
