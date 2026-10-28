// Defines the chart layout, architecture data, and public mount API.
import "./style.css";
import { CoastiCanvas } from "./chart/CoastiCanvas";
import type { ArchitectureComponentAnchor } from "./chart/ArchitectureComponent";
import type { CanvasPadding } from "./chart/CoordinateSystem";
import type { LogoConfiguration } from "./chart/LogoComponent";
import type { ComponentAnchor } from "./chart/SvgComponent";
import type { FlowSegment } from "./chart/FlowParticles";
import type { CombinedHoverRegionAnchor } from "./chart/CombinedHoverRegion";

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

// Brand logo on the top left, has some special hover and logic
export const logo: LogoConfiguration = {
    tooltipText:
        "coasti ist eine Software-Harmonie aus verschiedenen Open-Source-Komponenten. Im Kern definiert coasti einen Standard, um die Bauteile so zu strukturieren, dass sie gut zusammenarbeiten.<br/><br/>Um mehr zu erfahren, <b>hovere einfach über die Icons.</b>",
    x: -10,
    y: -32,
};

// The right-hand "Weitere Pakete" column stacks three boxes in the
// transformation region (16 + 3 + 35 + 3 + 16 = 73mm) and one box in the source
// region, mirroring the center product's small-gap rhythm.
const weiterePaketeTooltip =
    "coasti skaliert ganz natürlich in die Breite: Jede:r kann eigene Pakete bauen und beitragen. Die Komponenten eines Pakets lassen sich frei zusammenstellen. Als Starthilfe findet sich in unserem GitHub-Repo ein Beispiel für ein Content-Paket.";

// Keep the diagram editable through this list. Coordinates are millimetres,
// so changing a block's position does not require reasoning about pixels.
export const components: ComponentAnchor[] = [
    {
        id: "superset",
        tooltipHeading: "Superset",
        tooltipText:
            "Grafische Oberfläche für Endnutzer:innen. Hier können vorgefertige Berichte angezeigt oder neue erstellt werden. Dient auch als Berichtsportal, sodass Berichte aus verschiedenen Content-Paketen gesammelt an einem Ort angezeigt werden.<br/>Superset hat ausschließlich Zugriff auf aufbereitete BI-Daten aus den Content-Paketen, nicht auf die Rohdaten des Fachverfahrens.",
        x: 0,
        y: layout.rows.frontend,
        width: layout.matrixWidth,
        height: dimensions.frontendHeight,
    },
    {
        id: "content_paket_with_text",
        tooltipHeading: "Content-Paket",
        tooltipText:
            "Vollständiges Paket für ein bestimmtes Fachverfahren, das BI-Logiken gebündelt bereitstellt. Enthält alle Schritte von der Daten-Anbindung bis zum visuellen Dashboard und kann direkt eingesetzt werden.<br/>Bezieht Rohdaten aus dem Vorsystem und stellt aufbereitete Daten für Superset bereit.",
        x: layout.columns.first,
        y: layout.rows.transformation,
        width: dimensions.columnWidth,
        height: dimensions.transformationHeight,
    },
    {
        id: "vorsystem_with_text",
        tooltipHeading: "Vorsystem",
        tooltipText:
            "Vorsysteme oder Fachverfahren werden zur täglichen Sachbearbeitung verwendet. Hier entstehen die Rohdaten, die als Grundlage für das BI-Content-Paket dienen.",
        x: layout.columns.first,
        y: layout.rows.source,
        width: dimensions.columnWidth,
        height: dimensions.sourceHeight,
    },
    {
        id: "weitere_0",
        x: layout.columns.third,
        y: layout.rows.transformation,
        width: dimensions.columnWidth,
        height: 16,
        group: "product-3",
    },
    {
        id: "weitere_1",
        x: layout.columns.third,
        y: layout.rows.transformation + 16 + dimensions.smallGap,
        width: dimensions.columnWidth,
        height: dimensions.transformationHeight - 16 * 2 - dimensions.smallGap * 2,
        group: "product-3",
    },
    {
        id: "weitere_2",
        x: layout.columns.third,
        y: layout.rows.transformation + dimensions.transformationHeight - 16,
        width: dimensions.columnWidth,
        height: 16,
        group: "product-3",
    },
    {
        id: "weitere_3",
        x: layout.columns.third,
        y: layout.rows.source,
        width: dimensions.columnWidth,
        height: dimensions.sourceHeight,
        group: "product-3",
    },
    {
        id: "cp_frontend_content",
        tooltipHeading: "Frontend Content",
        tooltipText:
            "Zentrale Idee des coasti-Stacks ist, dass alle Inhalte als Quellcode vorliegen, der versionskontrolliert werden kann. So stellen Content-Pakete ihre Berichte als einfache YAML-Dateien bereit, die direkt in Superset importiert werden können.",
        x: layout.columns.center,
        y: layout.rows.transformation,
        width: dimensions.columnWidth,
        height: 16,
    },
    {
        id: "cp_orchestration",
        tooltipHeading: "Orchestrierung",
        tooltipText:
            "Steuert den internen Ablauf des Content-Pakets.<br/>Z.B. sollten Transformationen nur ausgeführt werden, wenn die Rohdaten auch erfolgreich kopiert wurden. Die Auswahl des Orchestrierungs-Tools ist den Entwickler:innen des Content-Pakets überlassen. Oft kommt Apache Hamilton zum Einsatz.",
        x: layout.columns.center,
        y: layout.rows.transformation + 16 + dimensions.smallGap,
        width: 38,
        height: 16,
    },
    {
        id: "cp_transformation",
        tooltipHeading: "Transformation",
        tooltipText:
            "Kernstück des Content-Pakets. Hier ist die BI-Logik implementiert: Rohdaten werden bereinigt, verknüpft und aggregiert. Am Ende entstehen aufbereitete Kennzahlen und Dimensionen als Quelldaten für Berichte.",
        x: layout.columns.center,
        y: layout.rows.transformation + (16 + dimensions.smallGap) * 2,
        width: 38,
        height: 16,
    },
    {
        id: "cp_ingestion",
        tooltipHeading: "Ingestion",
        tooltipText:
            "In der sogenannten „Ingestion“ wird eine Teilmenge der Rohdaten vom Fachverfahren in eine dedizierte Datenbank kopiert. Dies geschieht meist in Nachtläufen, sodass der Betrieb des Fachverfahrens vom Content-Paket unbeeinflusst bleibt.",
        x: layout.columns.center,
        y: layout.rows.transformation + (16 + dimensions.smallGap) * 3,
        width: 38,
        height: 16,
    },
    {
        id: "cp_storage",
        tooltipHeading: "Storage",
        tooltipText:
            "Enthält sowohl eine Kopie der benötigten Rohdaten als auch die aufbereiteten BI-Daten. Viele Content-Pakete nutzen eine leichtgewichtige DuckDB, die keinen dedizierten Server benötigt.",
        x: layout.columns.center + 38 + dimensions.smallGap,
        y: layout.rows.transformation + 16 + dimensions.smallGap,
        width: 24,
        height: dimensions.transformationHeight - 16 - dimensions.smallGap,
    },
    {
        id: "fachverfahren",
        tooltipHeading: "Fachverfahren",
        tooltipText:
            "Die meisten Fachverfahren bestehen aus einer Benutzeroberfläche und legen ihre Daten in einer Datenbank ab. Beispiele für Fachverfahren sind HuH (Haushalt), Lämmkomm Lissa (Soziales), Prosoz (Jugend).",
        x: layout.columns.center,
        y: layout.rows.source,
        width: 38,
        height: dimensions.sourceHeight,
    },
    {
        id: "fachverfahren_storage",
        tooltipHeading: "Source Storage",
        tooltipText:
            "Die Datenbank der Fachverfahren liegt häufig auf eigenen Servern und spiegelt tagesaktuell den Stand der Sachbearbeitung wider. Content-Pakete greifen ausschließlich lesend zu und beschränken sich auf eine Teilmenge der Daten.",
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
            "weitere_0",
            "weitere_1",
            "weitere_2",
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
            "weitere_3",
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
        text: "coasti Produkt 1",
        tooltipHeading: "Coasti Produkte",
        tooltipText:
            "Ein coasti-Produkt kombiniert die Daten und Frontend-Bausteine für einen bestimmten Anwendungsfall und setzt in der Regel auf einem bestehenden Fachverfahren auf.",
        componentIds: ["content_paket_with_text", "vorsystem_with_text", "superset"],
        x: layout.columns.first + 24,
        y: layout.matrixHeight + layout.productGap,
        textPosition: "below",
        textAlign: "center",
    },
    {
        id: "second-product",
        iconId: "box",
        text: "coasti Produkt 2",
        tooltipHeading: "Coasti Produkte",
        tooltipText:
            "Ein coasti-Produkt kombiniert die Daten- und Frontend-Bausteine für einen bestimmten Anwendungsfall und setzt in der Regel auf einem bestehenden Fachverfahren auf.",
        componentIds: [
            "cp_frontend_content",
            "cp_orchestration",
            "cp_transformation",
            "cp_ingestion",
            "cp_storage",
            "fachverfahren",
            "fachverfahren_storage",
            "superset",
        ],
        x: layout.columns.center + 24,
        y: layout.matrixHeight + layout.productGap,
        textPosition: "below",
        textAlign: "center",
    },
    {
        id: "third-product",
        iconId: "box",
        text: "coasti Produkt 3",
        componentIds: ["weitere_0", "weitere_1", "weitere_2", "weitere_3", "superset"],
        group: "product-3",
        x: layout.columns.third + 24,
        y: layout.matrixHeight + layout.productGap,
        textPosition: "below",
        textAlign: "center",
    },
];

export const flowSegments: FlowSegment[] = [
    // first product
    {
        start: { x: 32.5, y: 113 },
        end: { x: 32.5, y: 100 },
        baseColor: "#969390",
        anchorIds: ["vorsystem_with_text", "content_paket_with_text", "first-product"],
        sourceWidth: 50,
        targetWidth: 10,
        particleCount: 64,
    },
    {
        start: { x: 32.5, y: 35 },
        end: { x: 32.5, y: 22 },
        baseColor: "#4fb1ce",
        anchorIds: ["content_paket_with_text", "superset", "first-product"],
        sourceWidth: 10,
        targetWidth: 60,
        particleCount: 64,
    },

    // second product
    {
        start: { x: 105.5, y: 113 },
        end: { x: 105.5, y: 100 },
        baseColor: "#969390",
        anchorIds: ["second-product"],
        sourceWidth: 50,
        targetWidth: 10,
        particleCount: 32,
    },
    {
        start: { x: 105.5, y: 35 },
        end: { x: 105.5, y: 22 },
        baseColor: "#4fb1ce",
        anchorIds: ["superset", "second-product"],
        sourceWidth: 10,
        targetWidth: 60,
        particleCount: 40,
    },
    // we overlay two streams with lower counts to change the shape a bit
    {
        start: { x: 105.5, y: 113 },
        end: { x: 105.5, y: 65 },
        baseColor: "#969390",
        anchorIds: ["second-product"],
        sourceWidth: 50,
        targetWidth: 20,
        particleCount: 32,
    },
    {
        start: { x: 105.5, y: 90 },
        end: { x: 105.5, y: 22 },
        baseColor: "#4fb1ce",
        anchorIds: ["superset", "second-product"],
        sourceWidth: 30,
        targetWidth: 60,
        particleCount: 40,
    },

    // third product, mirroring the second product's flow so it spans the full
    // column height instead of a thin band
    {
        start: { x: 178.5, y: 113 },
        end: { x: 178.5, y: 100 },
        baseColor: "#969390",
        anchorIds: ["third-product"],
        sourceWidth: 50,
        targetWidth: 10,
        particleCount: 32,
    },
    {
        start: { x: 178.5, y: 35 },
        end: { x: 178.5, y: 22 },
        baseColor: "#4fb1ce",
        anchorIds: ["superset", "third-product"],
        sourceWidth: 10,
        targetWidth: 60,
        particleCount: 40,
    },
    // we overlay two streams with lower counts to change the shape a bit
    {
        start: { x: 178.5, y: 113 },
        end: { x: 178.5, y: 65 },
        baseColor: "#969390",
        anchorIds: ["third-product"],
        sourceWidth: 50,
        targetWidth: 20,
        particleCount: 32,
    },
    {
        start: { x: 178.5, y: 90 },
        end: { x: 178.5, y: 22 },
        baseColor: "#4fb1ce",
        anchorIds: ["superset", "third-product"],
        sourceWidth: 30,
        targetWidth: 60,
        particleCount: 40,
    },

    // detailed hovers on content package boxes
    {
        // fachverfahren_storage -> cp_storage
        start: { x: 126, y: 113 },
        end: { x: 126, y: 97 },
        baseColor: "#969390",
        anchorIds: ["cp_ingestion", "fachverfahren_storage", "cp_storage"],
        sourceWidth: 18,
        targetWidth: 18,
        particleCount: 24,
    },
    {
        // fachverfahren -> fachverfahren_storage
        start: { x: 108, y: 125 },
        end: { x: 117, y: 125 },
        baseColor: "#969390",
        anchorIds: ["fachverfahren", "fachverfahren_storage"],
        sourceWidth: 4,
        targetWidth: 4,
        sourceHeight: 24,
        targetHeight: 24,
        particleCount: 40,
    },
        {
            // cp_storage -> superset
            start: { x: 126, y: 51 },
            end: { x: 126, y: 22 },
            baseColor: "#4fb1ce",
            anchorIds: ["cp_storage"],
            sourceWidth: 10,
            targetWidth: 30,
            particleCount: 64,
        },
];

// The right-hand column behaves as one hover target: the boxes and the gaps
// between them keep the group highlighted and show one continuous tooltip.
// The tooltip switches to the specific box while the pointer is over it.
export const hoverRegions: CombinedHoverRegionAnchor[] = [
    {
        id: "weitere-column",
        group: "product-3",
        componentIds: ["weitere_0", "weitere_1", "weitere_2", "weitere_3"],
        architectureComponentIds: ["third-product"],
        linkedComponentIds: ["superset"],
        tooltipHeading: "Weitere Pakete",
        tooltipText: weiterePaketeTooltip,
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
    new CoastiCanvas(
        wrapper,
        layout,
        dimensions,
        components,
        servers,
        products,
        logo,
        flowSegments,
        hoverRegions,
    ).render();
}

declare global {
    interface Window {
        CoastiStack: { mount: typeof mount };
    }
}

window.CoastiStack = { mount };
