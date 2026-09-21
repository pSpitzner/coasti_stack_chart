import type * as d3 from 'd3'

export type ServerId = 'frontend' | 'backend' | 'source'

export interface ProductDefinition {
  id: string
  title: string
  subtitle: string
}

export interface ServerDefinition {
  id: ServerId
  title: string
  subtitle: string
}

export interface ChartNode {
  id: string
  product: string
  server: ServerId
  title: string
  description: string
  icon: string
  iconAlt: string
  x: number
  y: number
}

export interface FlowDefinition {
  from: string
  to: string
  label: string
}

export interface TooltipContent {
  title: string
  body: string
  eyebrow?: string
  icon?: string
  iconAlt?: string
}

export type ChartSelection = d3.Selection<SVGGElement, unknown, null, undefined>
export type ChartNodeSelection = d3.Selection<SVGGElement, ChartNode, SVGGElement, unknown>
