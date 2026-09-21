import * as d3 from 'd3'
import serverIcon from '../../icons/server-logo.svg'
import type { ServerDefinition } from './types'

interface ServerElementCallbacks {
  onActivate: (server: ServerDefinition, element: ServerElement, event?: PointerEvent) => void
  onDeactivate: () => void
}

export class ServerElement {
  private readonly definition: ServerDefinition
  private readonly group: d3.Selection<SVGGElement, unknown, null, undefined>
  private readonly callbacks: ServerElementCallbacks
  private readonly y: number

  constructor(
    layer: d3.Selection<SVGGElement, unknown, null, undefined>,
    definition: ServerDefinition,
    y: number,
    callbacks: ServerElementCallbacks,
  ) {
    this.definition = definition
    this.group = layer.append('g')
    this.callbacks = callbacks
    this.y = y
  }

  render(): this {
    this.group
      .attr('class', 'server-control')
      .attr('data-server', this.definition.id)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', `${this.definition.title} ${this.definition.subtitle}`)

    this.group.append('rect')
      .attr('class', 'server-backdrop')
      .attr('x', 214).attr('y', this.y - 74)
      .attr('width', 924).attr('height', 148).attr('rx', 24)
    this.group.append('rect')
      .attr('class', 'server-hit-area')
      .attr('x', 20).attr('y', this.y - 42)
      .attr('width', 190).attr('height', 84)
    this.group.append('line')
      .attr('class', 'server-rail')
      .attr('x1', 222).attr('x2', 222)
      .attr('y1', this.y - 66).attr('y2', this.y + 66)
    this.group.append('line')
      .attr('class', 'server-rail')
      .attr('x1', 1130).attr('x2', 1130)
      .attr('y1', this.y - 66).attr('y2', this.y + 66)
    this.group.append('image')
      .attr('class', 'server-logo')
      .attr('href', serverIcon)
      .attr('x', 30).attr('y', this.y - 25)
      .attr('width', 52).attr('height', 50)
      .attr('aria-hidden', 'true')
    this.group.append('text')
      .attr('class', 'server-title')
      .attr('x', 92).attr('y', this.y - 4)
      .text(`${this.definition.title}-`)
    this.group.append('text')
      .attr('class', 'server-subtitle')
      .attr('x', 92).attr('y', this.y + 17)
      .text(this.definition.subtitle)

    this.group.on('pointerenter', (event) => this.callbacks.onActivate(this.definition, this, event))
      .on('pointermove', (event) => this.callbacks.onActivate(this.definition, this, event))
      .on('focus', () => this.callbacks.onActivate(this.definition, this))
      .on('pointerleave', this.callbacks.onDeactivate).on('blur', this.callbacks.onDeactivate)
    return this
  }

  setActive(active: boolean): this {
    this.group.classed('is-active', active)
    return this
  }

  selection(): d3.Selection<SVGGElement, unknown, null, undefined> {
    return this.group
  }
}
