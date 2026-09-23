// Defines the chart layout, architecture data, and public mount API.
import "./style.css";
import { CoastiCanvas } from "./chart/CoastiCanvas";
import type { ArchitectureComponentAnchor } from "./chart/ArchitectureComponent";
import type { CanvasPadding } from "./chart/CoordinateSystem";

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
    // Extra viewBox space outside the inner matrix. With all values at zero,
    // only the inner matrix components remain visible; surrounding architecture
    // icons, the logo, and the matrix background edge are clipped.
    padding: {
        // Reveals the server icons placed to the left of the matrix.
        left: 90,
        // Adds breathing room beyond the matrix's right edge.
        right: 24,
        // Reveals the logo and the matrix background edge above the matrix.
        top: 48,
        // Reveals the product icons below the matrix.
        bottom: 48,
    } satisfies CanvasPadding,
};

export const layout = {
    // The inner matrix is the rectangular area containing the product building
    // blocks: Superset, content packages, transformations, storage, and source
    // systems. It excludes the surrounding server/product icons, the logo, and
    // the dark background margin. Its top-left corner is coordinate (0, 0).
    matrixWidth: dimensions.columnWidth * 3 + dimensions.largeGap * 2,
    matrixHeight: 137,
    // Vertical gap between the matrix rows and the product icons.
    productGap: 14,
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
        tooltipHeading: "Superset",
        tooltipText:
            "Provides the dashboards and charts that users explore. It reads the reporting models produced by the data pipeline.",
        x: 0,
        y: layout.rows.frontend,
        width: layout.matrixWidth,
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
        height: dimensions.transformationHeight - 16 - dimensions.smallGap,
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
        x: -36,
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
        x: -36,
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
        x: -36,
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
        y: layout.matrixHeight + layout.productGap,
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
        y: layout.matrixHeight + layout.productGap,
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
        y: layout.matrixHeight + layout.productGap,
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
