// Converts millimetre layout values into SVG coordinates and view boxes.
export interface CoordinateDimensions {
    scale: number;
    padding: CanvasPadding;
}

export interface CanvasPadding {
    // Space visible to the left of the inner matrix coordinate system.
    left: number;
    // Space visible to the right of the inner matrix coordinate system.
    right: number;
    // Space visible above the inner matrix coordinate system.
    top: number;
    // Space visible below the inner matrix coordinate system.
    bottom: number;
}

export interface CanvasLayout {
    // The inner matrix is the base canvas; outer canvas size is derived from it and padding.
    matrixWidth: number;
    matrixHeight: number;
}

export class CoordinateSystem {
    private readonly dimensions: CoordinateDimensions;
    // Translates the existing absolute anchor coordinates into matrix-relative coordinates.
    constructor(dimensions: CoordinateDimensions) {
        this.dimensions = dimensions;
    }

    toSvgUnits(millimetres: number): number {
        return millimetres * this.dimensions.scale;
    }

    toSvgPosition(millimetres: number, axis: "x" | "y"): number {
        const padding = axis === "x"
            ? this.dimensions.padding.left
            : this.dimensions.padding.top;
        return this.toSvgUnits(millimetres + padding);
    }

    canvasViewBox(layout: CanvasLayout): string {
        const paddedWidth =
            layout.matrixWidth +
            this.dimensions.padding.left +
            this.dimensions.padding.right;
        const paddedHeight =
            layout.matrixHeight +
            this.dimensions.padding.top +
            this.dimensions.padding.bottom;
        return `0 0 ${this.toSvgUnits(paddedWidth)} ${this.toSvgUnits(paddedHeight)}`;
    }
}
