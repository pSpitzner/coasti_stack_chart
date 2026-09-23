import "./style.css";
import { CoastiCanvas } from "./chart/CoastiCanvas";

type Millimetres = number;

export interface ComponentAnchor {
    id: string;
    x: Millimetres;
    y: Millimetres;
    width: Millimetres;
    height: Millimetres;
}

export const dimensions = {
    // Width of one product column in the reference drawing.
    columnWidth: 65,
    // Horizontal gap between the three product columns.
    largeGap: 8,
    // Gap inside the center-column sublayout.
    smallGap: 3,
    // Height of the center transformation/content row.
    transformationHeight: 73,
    // Height of the source/fachverfahren row.
    sourceHeight: 24,
    // Height of the shared Superset frontend row.
    frontendHeight: 24,
    // Vertical gap between the three main rows.
    rowGap: 8,
    // Conversion factor from millimetres to SVG coordinate units.
    scale: 4,
    // Empty space around the complete diagram before the first component starts.
    padding: 16,
};

export const layout = {
    canvasWidth: dimensions.columnWidth * 3 + dimensions.largeGap * 2,
    canvasHeight:
        dimensions.frontendHeight +
        dimensions.rowGap +
        dimensions.transformationHeight +
        dimensions.rowGap +
        dimensions.sourceHeight,
    columns: {
        first: 0,
        center: dimensions.columnWidth + dimensions.largeGap,
        third: (dimensions.columnWidth + dimensions.largeGap) * 2,
    },
    rows: {
        frontend: 0,
        transformation: dimensions.frontendHeight + dimensions.rowGap,
        source:
            dimensions.frontendHeight +
            dimensions.rowGap +
            dimensions.transformationHeight +
            dimensions.rowGap,
    },
};

// Keep the diagram editable through this list. Coordinates are millimetres,
// so changing a block's position does not require reasoning about pixels.
export const components: ComponentAnchor[] = [
    {
        id: "superset",
        x: 0,
        y: layout.rows.frontend,
        width: layout.canvasWidth,
        height: dimensions.frontendHeight,
    },
    {
        id: "content_paket_with_text",
        x: layout.columns.first,
        y: layout.rows.transformation,
        width: dimensions.columnWidth,
        height: dimensions.transformationHeight,
    },
    {
        id: "vorsystem_with_text",
        x: layout.columns.first,
        y: layout.rows.source,
        width: dimensions.columnWidth,
        height: dimensions.sourceHeight,
    },
    {
        id: "content_paket_wo_text",
        x: layout.columns.third,
        y: layout.rows.transformation,
        width: dimensions.columnWidth,
        height: dimensions.transformationHeight,
    },
    {
        id: "vorsystem_wo_text",
        x: layout.columns.third,
        y: layout.rows.source,
        width: dimensions.columnWidth,
        height: dimensions.sourceHeight,
    },
    {
        id: "cp_frontend_content",
        x: layout.columns.center,
        y: layout.rows.transformation,
        width: dimensions.columnWidth,
        height: 16,
    },
    {
        id: "cp_orchestration",
        x: layout.columns.center,
        y: layout.rows.transformation + 16 + dimensions.smallGap,
        width: 38,
        height: 16,
    },
    {
        id: "cp_transformation",
        x: layout.columns.center,
        y: layout.rows.transformation + (16 + dimensions.smallGap) * 2,
        width: 38,
        height: 16,
    },
    {
        id: "cp_ingestion",
        x: layout.columns.center,
        y: layout.rows.transformation + (16 + dimensions.smallGap) * 3,
        width: 38,
        height: 16,
    },
    {
        id: "cp_storage",
        x: layout.columns.center + 38 + dimensions.smallGap,
        y: layout.rows.transformation + 16 + dimensions.smallGap,
        width: 24,
        height: 55,
    },
    {
        id: "fachverfahren",
        x: layout.columns.center,
        y: layout.rows.source,
        width: 38,
        height: dimensions.sourceHeight,
    },
    {
        id: "fachverfahren_storage",
        x: layout.columns.center + 38 + dimensions.smallGap,
        y: layout.rows.source,
        width: 24,
        height: dimensions.sourceHeight,
    },
];

export function mount(target: string | HTMLElement) {
    const wrapper =
        typeof target === "string"
            ? document.querySelector<HTMLElement>(target)
            : target;
    if (!wrapper)
        throw new Error(`Coasti Stack mount target not found: ${String(target)}`);
    wrapper.replaceChildren();
    new CoastiCanvas(wrapper, layout, dimensions, components).render();
}

declare global {
    interface Window {
        CoastiStack: { mount: typeof mount };
    }
}

window.CoastiStack = { mount };
const app = document.querySelector<HTMLElement>("#app");
if (app) mount(app);
