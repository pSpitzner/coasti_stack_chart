// Creates and positions the shared HTML tooltip used by chart elements.
export class Tooltip {
    private readonly element: HTMLDivElement;

    constructor() {
        this.element = document.createElement("div");
        this.element.className = "component-tooltip";
        this.element.setAttribute("role", "tooltip");
        // Keep the tooltip outside transformed chart and slide containers so
        // viewport pointer coordinates remain in the same coordinate system.
        document.body.appendChild(this.element);
    }

    show(
        heading: string | undefined,
        text: string,
        event: PointerEvent,
        offsetX = 14,
        offsetY = 14,
    ): void {
        this.element.innerHTML = `${heading ? `<strong>${heading}</strong>` : ""}<span>${text}</span>`;
        this.element.style.left = `${event.clientX + offsetX}px`;
        this.element.style.top = `${event.clientY + offsetY}px`;
        this.element.classList.add("is-visible");
    }

    showForElement(
        heading: string | undefined,
        text: string,
        element: SVGGElement,
    ): void {
        const bounds = element.getBoundingClientRect();
        this.element.innerHTML = `${heading ? `<strong>${heading}</strong>` : ""}<span>${text}</span>`;
        this.element.style.left = `${bounds.right + 14}px`;
        this.element.style.top = `${bounds.top}px`;
        this.element.classList.add("is-visible");
    }

    hide(): void {
        this.element.classList.remove("is-visible");
    }
}
