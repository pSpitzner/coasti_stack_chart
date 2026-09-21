import * as d3 from 'd3'
import type { ChartNode } from './types'

interface BuildingBlockCallbacks {
  onActivate: (node: ChartNode, event?: PointerEvent) => void
  onDeactivate: () => void
}

export class BuildingBlockElement {
  private readonly node: ChartNode
  private readonly group: d3.Selection<SVGGElement, unknown, null, undefined>
  private readonly callbacks: BuildingBlockCallbacks

  constructor(
    layer: d3.Selection<SVGGElement, unknown, null, undefined>,
    node: ChartNode,
    callbacks: BuildingBlockCallbacks,
  ) {
    this.node = node
    this.group = layer.append('g')
    this.callbacks = callbacks
  }

  render(): this {
    this.group
      .attr('class', 'building-block')
      .attr('data-node', this.node.id)
      .attr('data-server', this.node.server)
      .attr('transform', `translate(${this.node.x - 89}, ${this.node.y - 29})`)
      .style('--block-x', `${this.node.x - 89}px`)
      .style('--block-y', `${this.node.y - 29}px`)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', `${this.node.product} ${this.node.server} ${this.node.iconAlt} building block`)

    this.group.append('rect')
      .attr('class', 'building-surface')
      .attr('width', 178).attr('height', 58).attr('rx', 14)
    this.group.append('image')
      .attr('class', 'building-icon')
      .attr('href', this.node.icon)
      .attr('x', 14).attr('y', 8)
      .attr('width', 150).attr('height', 42)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('aria-hidden', 'true')

    this.group.on('pointerenter', (event) => this.callbacks.onActivate(this.node, event))
      .on('pointermove', (event) => this.callbacks.onActivate(this.node, event))
      .on('focus', () => this.callbacks.onActivate(this.node))
      .on('pointerleave blur', this.callbacks.onDeactivate)
    return this
  }

  setDimmed(dimmed: boolean): this {
    this.group.classed('is-dimmed', dimmed)
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
