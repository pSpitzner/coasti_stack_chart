// Converts millimetre layout values into SVG coordinates and view boxes.
export interface CoordinateDimensions {
    scale: number;
    padding: number;
}

export interface CanvasLayout {
    canvasWidth: number;
    canvasHeight: number;
}

export class CoordinateSystem {
    private readonly dimensions: CoordinateDimensions;

    constructor(dimensions: CoordinateDimensions) {
        this.dimensions = dimensions;
    }

    toSvgUnits(millimetres: number): number {
        return millimetres * this.dimensions.scale;
    }

    toSvgPosition(millimetres: number): number {
        return this.toSvgUnits(millimetres + this.dimensions.padding);
    }

    canvasViewBox(layout: CanvasLayout): string {
        const paddedWidth = layout.canvasWidth + this.dimensions.padding * 2;
        const paddedHeight = layout.canvasHeight + this.dimensions.padding * 2;
        return `0 0 ${this.toSvgUnits(paddedWidth)} ${this.toSvgUnits(paddedHeight)}`;
    }
}
