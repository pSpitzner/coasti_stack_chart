import type { TooltipContent } from './types'

export class TooltipElement {
  private readonly wrapper: HTMLElement
  private readonly element: HTMLDivElement

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper
    this.element = document.createElement('div')
    this.element.className = 'mouse-tooltip'
    this.element.setAttribute('role', 'tooltip')
    this.element.setAttribute('aria-hidden', 'true')
    wrapper.append(this.element)
  }

  show(content: TooltipContent, event: PointerEvent): this {
    this.element.replaceChildren()
    this.element.append(this.createIcon(content), this.createCopy(content))
    this.element.classList.add('is-visible')
    this.element.setAttribute('aria-hidden', 'false')
    this.move(event)
    return this
  }

  move(event: PointerEvent): this {
    const wrapperBounds = this.wrapper.getBoundingClientRect()
    const tooltipBounds = this.element.getBoundingClientRect()
    const padding = 14
    const left = Math.min(
      event.clientX - wrapperBounds.left + padding,
      wrapperBounds.width - tooltipBounds.width - padding,
    )
    const top = Math.min(
      event.clientY - wrapperBounds.top + padding,
      wrapperBounds.height - tooltipBounds.height - padding,
    )
    this.element.style.transform = `translate(${Math.max(padding, left)}px, ${Math.max(padding, top)}px)`
    return this
  }

  hide(): this {
    this.element.classList.remove('is-visible')
    this.element.setAttribute('aria-hidden', 'true')
    return this
  }

  private createIcon(content: TooltipContent): HTMLDivElement {
    const iconContainer = document.createElement('div')
    iconContainer.className = 'mouse-tooltip-icon'
    if (!content.icon) return iconContainer

    const icon = document.createElement('img')
    icon.src = content.icon
    icon.alt = content.iconAlt ?? ''
    iconContainer.append(icon)
    return iconContainer
  }

  private createCopy(content: TooltipContent): HTMLDivElement {
    const copy = document.createElement('div')
    copy.className = 'mouse-tooltip-copy'
    if (content.eyebrow) {
      const eyebrow = document.createElement('span')
      eyebrow.className = 'mouse-tooltip-eyebrow'
      eyebrow.textContent = content.eyebrow
      copy.append(eyebrow)
    }
    const title = document.createElement('strong')
    title.textContent = content.title
    const body = document.createElement('p')
    body.textContent = content.body
    copy.append(title, body)
    return copy
  }
}
