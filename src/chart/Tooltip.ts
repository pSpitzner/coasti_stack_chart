export class Tooltip {
    private readonly element: HTMLDivElement;

    constructor(wrapper: HTMLElement) {
        this.element = document.createElement("div");
        this.element.className = "component-tooltip";
        this.element.setAttribute("role", "tooltip");
        wrapper.appendChild(this.element);
    }

    show(heading: string, text: string, event: PointerEvent): void {
        this.element.innerHTML = `<strong>${heading}</strong><span>${text}</span>`;
        this.element.style.left = `${event.clientX + 14}px`;
        this.element.style.top = `${event.clientY + 14}px`;
        this.element.classList.add("is-visible");
    }

    showForElement(
        heading: string,
        text: string,
        element: SVGGElement,
    ): void {
        const bounds = element.getBoundingClientRect();
        this.element.innerHTML = `<strong>${heading}</strong><span>${text}</span>`;
        this.element.style.left = `${bounds.right + 14}px`;
        this.element.style.top = `${bounds.top}px`;
        this.element.classList.add("is-visible");
    }

    hide(): void {
        this.element.classList.remove("is-visible");
    }
}
