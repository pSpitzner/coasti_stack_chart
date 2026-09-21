import * as d3 from 'd3'
import './style.css'
import { BuildingBlockElement } from './chart/BuildingBlockElement'
import { descriptions, flows, nodes, products, servers } from './chart/data'
import { FlowElement } from './chart/FlowElement'
import { ServerElement } from './chart/ServerElement'
import { TooltipElement } from './chart/TooltipElement'
import type { ChartNode, ServerDefinition } from './chart/types'

const width = 1240
const height = 760
const rowYPositions = [188, 362, 550]

type SvgLayer = d3.Selection<SVGGElement, unknown, null, undefined>

function renderDefinitions(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  const defs = svg.append('defs')
  const gradient = defs.append('linearGradient')
    .attr('id', 'block-gradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%')
  gradient.append('stop').attr('offset', '0%').attr('stop-color', '#e5f2fa')
  gradient.append('stop').attr('offset', '100%').attr('stop-color', '#bcd9ea')
  defs.append('marker')
    .attr('id', 'flow-arrow').attr('viewBox', '0 0 10 10')
    .attr('refX', 8).attr('refY', 5).attr('markerWidth', 5).attr('markerHeight', 5)
    .attr('orient', 'auto-start-reverse')
    .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', '#82aabd')
}

function renderStackFrame(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  svg.append('rect').attr('class', 'stack-frame').attr('x', 170).attr('y', 72).attr('width', 1000).attr('height', 640).attr('rx', 32)
  svg.append('text').attr('class', 'stack-label').attr('x', 194).attr('y', 106).text('COASTI STACK')
}

function renderProductColumns(layer: SvgLayer) {
  products.forEach((product, index) => {
    const x = 284 + index * 286
    layer.append('rect').attr('class', 'product-column').attr('x', x - 112).attr('y', 126).attr('width', 224).attr('height', 562).attr('rx', 20)
    layer.append('text').attr('class', 'product-subtitle').attr('x', x).attr('y', 103).text(product.subtitle)
    layer.append('text').attr('class', 'product-title').attr('x', x).attr('y', 132).text(product.title)
  })
}

function renderRowGuides(layer: SvgLayer) {
  rowYPositions.forEach((y) => layer.append('line').attr('x1', 250).attr('x2', 1114).attr('y1', y).attr('y2', y))
}

function renderServerElements(
  layer: SvgLayer,
  onActivate: (server: ServerDefinition, element: ServerElement, event?: PointerEvent) => void,
  onDeactivate: () => void,
) {
  return servers.map((server, index) => new ServerElement(layer, server, rowYPositions[index], { onActivate, onDeactivate }).render())
}

function renderFlowElements(layer: SvgLayer) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  flows.forEach((flow) => new FlowElement(layer, flow, nodeById).render())
}

function renderBuildingBlockElements(
  layer: SvgLayer,
  onActivate: (node: ChartNode, event?: PointerEvent) => void,
  onDeactivate: () => void,
) {
  return nodes.map((node) => new BuildingBlockElement(layer, node, { onActivate, onDeactivate }).render())
}

function clearInteraction(serverElements: ServerElement[], buildingElements: BuildingBlockElement[]) {
  serverElements.forEach((element) => element.setActive(false))
  buildingElements.forEach((element) => element.setDimmed(false).setActive(false))
  d3.selectAll<SVGElement, unknown>('.is-dimmed').classed('is-dimmed', false)
  d3.selectAll<SVGPathElement, unknown>('.flow-path').classed('is-active', false)
}

function dimChart(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  svg.selectAll<SVGElement, unknown>('.product-column, .product-title, .product-subtitle, .row-guides line, .flow-path, .server-control, .building-block').classed('is-dimmed', true)
}

function activateServer(server: ServerDefinition, activeElement: ServerElement, serverElements: ServerElement[], buildingElements: BuildingBlockElement[], svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, tooltip: TooltipElement, event?: PointerEvent) {
  dimChart(svg)
  serverElements.forEach((element) => element.setActive(element === activeElement))
  activeElement.selection().classed('is-dimmed', false)
  buildingElements.forEach((element) => element.setDimmed(element.selection().attr('data-server') !== server.id))
  buildingElements.filter((element) => element.selection().attr('data-server') === server.id).forEach((element) => element.setDimmed(false).setActive(true))
  if (event) tooltip.show(descriptions[server.id], event)
}

function activateBuildingBlock(node: ChartNode, buildingElements: BuildingBlockElement[], svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, tooltip: TooltipElement, event?: PointerEvent) {
  dimChart(svg)
  buildingElements.forEach((element) => element.setDimmed(true).setActive(false))
  const activeElement = buildingElements.find((element) => element.selection().attr('data-node') === node.id)
  activeElement?.setDimmed(false).setActive(true)
  d3.selectAll<SVGGElement, unknown>('.server-control').classed('is-active', false)
  d3.selectAll<SVGPathElement, unknown>('.flow-path').classed('is-active', function () {
    const path = d3.select(this)
    return path.attr('data-from') === node.id || path.attr('data-to') === node.id
  }).filter('.is-active').classed('is-dimmed', false)
  if (event) tooltip.show({ title: `${node.product.toUpperCase()} · ${node.server}`, body: node.description, eyebrow: node.iconAlt, icon: node.icon, iconAlt: node.iconAlt }, event)
}

function renderChart(wrapper: HTMLElement) {
  wrapper.innerHTML = `
    <div class="chart-shell">
      <div class="chart-stage">
        <svg class="coasti-chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="chart-title chart-description">
          <title id="chart-title">Interactive coasti stack architecture</title>
          <desc id="chart-description">Three product columns connected across frontend, backend, and source server rows.</desc>
        </svg>
        <div class="tooltip-layer" aria-hidden="true"></div>
      </div>
    </div>`

  const svg = d3.select<SVGSVGElement, unknown>(wrapper.querySelector('svg')!)
  const tooltip = new TooltipElement(wrapper.querySelector<HTMLElement>('.tooltip-layer')!)
  renderDefinitions(svg)
  renderStackFrame(svg)

  const productLayer = svg.append('g').attr('class', 'product-layer')
  renderProductColumns(productLayer)
  renderRowGuides(svg.append('g').attr('class', 'row-guides'))
  renderFlowElements(svg.append('g').attr('class', 'flow-layer'))

  const serverLayer = svg.append('g').attr('class', 'server-layer')
  const blockLayer = svg.append('g').attr('class', 'block-layer')
  let serverElements: ServerElement[] = []
  let buildingElements: BuildingBlockElement[] = []

  const deactivate = () => { clearInteraction(serverElements, buildingElements); tooltip.hide() }
  serverElements = renderServerElements(serverLayer, (server, element, event) => activateServer(server, element, serverElements, buildingElements, svg, tooltip, event), deactivate)
  buildingElements = renderBuildingBlockElements(blockLayer, (node, event) => activateBuildingBlock(node, buildingElements, svg, tooltip, event), deactivate)
}

export function mount(target: string | HTMLElement) {
  const wrapper = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!wrapper) throw new Error(`Coasti Stack mount target not found: ${String(target)}`)
  renderChart(wrapper)
}

declare global {
  interface Window { CoastiStack: { mount: typeof mount } }
}

window.CoastiStack = { mount }

const app = document.querySelector<HTMLElement>('#app')
if (app) mount(app)
