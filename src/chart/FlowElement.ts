import * as d3 from 'd3'
import type { ChartNode, FlowDefinition } from './types'

export class FlowElement {
  private readonly flow: FlowDefinition
  private readonly source: ChartNode
  private readonly target: ChartNode
  private readonly layer: d3.Selection<SVGGElement, unknown, null, undefined>

  constructor(
    layer: d3.Selection<SVGGElement, unknown, null, undefined>,
    flow: FlowDefinition,
    nodeById: Map<string, ChartNode>,
  ) {
    const source = nodeById.get(flow.from)
    const target = nodeById.get(flow.to)
    if (!source || !target) throw new Error(`Flow references an unknown node: ${flow.from} -> ${flow.to}`)

    this.layer = layer
    this.flow = flow
    this.source = source
    this.target = target
  }

  render(): this {
    this.layer.append('path')
      .attr('class', 'flow-path')
      .attr('data-from', this.flow.from)
      .attr('data-to', this.flow.to)
      .attr('d', this.path())
      .attr('aria-label', this.flow.label)
    return this
  }

  private path(): string {
    const startY = this.source.y < this.target.y ? this.source.y + 29 : this.source.y - 29
    const endY = this.source.y < this.target.y ? this.target.y - 29 : this.target.y + 29
    const middleY = (startY + endY) / 2
    return `M ${this.source.x} ${startY} C ${this.source.x} ${middleY}, ${this.target.x} ${middleY}, ${this.target.x} ${endY}`
  }
}
