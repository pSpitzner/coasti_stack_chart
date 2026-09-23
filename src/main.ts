// Defines the chart layout, architecture data, and public mount API.
import "./style.css";
import { CoastiCanvas } from "./chart/CoastiCanvas";
import type { ArchitectureComponentAnchor } from "./chart/ArchitectureComponent";

type Millimetres = number;

export interface ComponentAnchor {
    id: string;
    tooltipHeading: string;
    tooltipText: string;
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
    serverWidth: 58,
    serverGap: 14,
    stackOffset: 58 + 14,
    stackWidth: dimensions.columnWidth * 3 + dimensions.largeGap * 2,
    stackHeight: 137,
    productGap: 10,
    productHeight: 24,
    canvasWidth:
        58 +
        14 +
        dimensions.columnWidth * 3 +
        dimensions.largeGap * 2,
    canvasHeight: 137 + 10 + 24,
    columns: {
        first: 58 + 14,
        center: 58 + 14 + dimensions.columnWidth + dimensions.largeGap,
        third: 58 + 14 + (dimensions.columnWidth + dimensions.largeGap) * 2,
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
        tooltipHeading: "Superset",
        tooltipText:
            "Provides the dashboards and charts that users explore. It reads the reporting models produced by the data pipeline.",
        x: layout.stackOffset,
        y: layout.rows.frontend,
        width: layout.stackWidth,
        height: dimensions.frontendHeight,
    },
    {
        id: "content_paket_with_text",
        tooltipHeading: "Content Package",
        tooltipText:
            "A reusable product that bundles ingestion, storage, transformations, orchestration, and Superset content into one installable unit.",
        x: layout.columns.first,
        y: layout.rows.transformation,
        width: dimensions.columnWidth,
        height: dimensions.transformationHeight,
    },
    {
        id: "vorsystem_with_text",
        tooltipHeading: "Source System",
        tooltipText:
            "Operational applications provide the raw data. Ingestion copies that data without changing it, keeping source systems isolated from BI workloads.",
        x: layout.columns.first,
        y: layout.rows.source,
        width: dimensions.columnWidth,
        height: dimensions.sourceHeight,
    },
    {
        id: "content_paket_wo_text",
        tooltipHeading: "More Products",
        tooltipText:
            "coasti scales horzitonally: Everyone can build an contribute products, following the same recipe.",
        x: layout.columns.third,
        y: layout.rows.transformation,
        width: dimensions.columnWidth,
        height: dimensions.transformationHeight,
    },
    {
        id: "vorsystem_wo_text",
        tooltipHeading: "More Source Systems",
        tooltipText:
            "coasti scales horzitonally: Everyone can build an contribute products, following the same recipe.",
        x: layout.columns.third,
        y: layout.rows.source,
        width: dimensions.columnWidth,
        height: dimensions.sourceHeight,
    },
    {
        id: "cp_frontend_content",
        tooltipHeading: "Frontend Content",
        tooltipText:
            "Contains Superset dashboards, charts, and datasets as versioned files. The installer loads them into Superset so deployments stay reproducible.",
        x: layout.columns.center,
        y: layout.rows.transformation,
        width: dimensions.columnWidth,
        height: 16,
    },
    {
        id: "cp_orchestration",
        tooltipHeading: "Orchestration",
        tooltipText:
            "Coordinates ingestion and transformation as one repeatable Python pipeline. A refresh can be run as a single command instead of manual steps.",
        x: layout.columns.center,
        y: layout.rows.transformation + 16 + dimensions.smallGap,
        width: 38,
        height: 16,
    },
    {
        id: "cp_transformation",
        tooltipHeading: "Transformation",
        tooltipText:
            "dbt models read raw Parquet files and produce clean reporting models. Superset consumes these models without depending on a specific compute engine.",
        x: layout.columns.center,
        y: layout.rows.transformation + (16 + dimensions.smallGap) * 2,
        width: 38,
        height: 16,
    },
    {
        id: "cp_ingestion",
        tooltipHeading: "Ingestion",
        tooltipText:
            "Fetches data from source systems and writes it as raw Parquet. Keeping ingestion separate preserves the original data for rebuilding models.",
        x: layout.columns.center,
        y: layout.rows.transformation + (16 + dimensions.smallGap) * 3,
        width: 38,
        height: 16,
    },
    {
        id: "cp_storage",
        tooltipHeading: "Storage",
        tooltipText:
            "Holds raw Parquet files on local storage or S3. It separates durable data from the transformation and presentation layers.",
        x: layout.columns.center + 38 + dimensions.smallGap,
        y: layout.rows.transformation + 16 + dimensions.smallGap,
        width: 24,
        height: 55,
    },
    {
        id: "fachverfahren",
        tooltipHeading: "Fachverfahren",
        tooltipText:
            "Operational source applications where business data is created. The backend reads from them during ingestion, while the frontend never connects directly.",
        x: layout.columns.center,
        y: layout.rows.source,
        width: 38,
        height: dimensions.sourceHeight,
    },
    {
        id: "fachverfahren_storage",
        tooltipHeading: "Source Storage",
        tooltipText:
            "A source-side data boundary for the Fachverfahren layer. Data is copied from here into the BI pipeline instead of repeatedly querying the operational system.",
        x: layout.columns.center + 38 + dimensions.smallGap,
        y: layout.rows.source,
        width: 24,
        height: dimensions.sourceHeight,
    },
];

export const servers: ArchitectureComponentAnchor[] = [
    {
        id: "frontend-server",
        iconId: "server-logo",
        text: "Frontend-<br>Server",
        tooltipHeading: "Frontend Server",
        tooltipText:
            "Serves Superset dashboards and charts to end users. It receives prepared reporting data from the backend.",
        componentIds: ["superset"],
        x: 36,
        y: 6,
    },
    {
        id: "backend-server",
        iconId: "server-logo",
        text: "Backend-<br>Server",
        tooltipHeading: "Backend Server",
        tooltipText:
            "Runs ingestion, storage, transformations, and orchestration. It prepares reporting data without exposing source systems to the frontend.",
        componentIds: [
            "content_paket_with_text",
            "content_paket_wo_text",
            "cp_frontend_content",
            "cp_orchestration",
            "cp_transformation",
            "cp_ingestion",
            "cp_storage",
        ],
        x: 36,
        y: 62,
    },
    {
        id: "source-server",
        iconId: "server-logo-gray",
        text: "Source-<br>Server",
        tooltipHeading: "Source Server",
        tooltipText:
            "Hosts operational data used by the BI pipeline. The backend copies data from here during ingestion.",
        componentIds: [
            "vorsystem_with_text",
            "vorsystem_wo_text",
            "fachverfahren",
            "fachverfahren_storage",
        ],
        x: 36,
        y: 119,
    },
];

export const products: ArchitectureComponentAnchor[] = [
    {
        id: "first-product",
        iconId: "box",
        text: "",
        tooltipHeading: "Product Column",
        tooltipText:
            "A product combines the data and frontend building blocks for one reporting use case.",
        componentIds: ["content_paket_with_text", "vorsystem_with_text"],
        x: layout.columns.first + 24,
        y: layout.stackHeight + layout.productGap,
    },
    {
        id: "coasti-products",
        iconId: "box",
        text: "coasti products",
        tooltipHeading: "Coasti Products",
        tooltipText:
            "Coasti products package reusable data, transformation, orchestration, and frontend components.",
        componentIds: [
            "cp_frontend_content",
            "cp_orchestration",
            "cp_transformation",
            "cp_ingestion",
            "cp_storage",
            "fachverfahren",
            "fachverfahren_storage",
        ],
        x: layout.columns.center + 24,
        y: layout.stackHeight + layout.productGap,
        textPosition: "below",
        textAlign: "center",
    },
    {
        id: "third-product",
        iconId: "box",
        text: "",
        tooltipHeading: "Product Column",
        tooltipText:
            "A product combines the data and frontend building blocks for one reporting use case.",
        componentIds: ["content_paket_wo_text", "vorsystem_wo_text"],
        x: layout.columns.third + 24,
        y: layout.stackHeight + layout.productGap,
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
    new CoastiCanvas(wrapper, layout, dimensions, components, servers, products).render();
}

declare global {
    interface Window {
        CoastiStack: { mount: typeof mount };
    }
}

window.CoastiStack = { mount };
const app = document.querySelector<HTMLElement>("#app");
if (app) mount(app);
