import coastiIcon from '../../icons/coasti.svg'
import dbtIcon from '../../icons/dbt-logo.svg'
import duckdbIcon from '../../icons/duckdb/DuckDB_icon-darkmode.svg'
import hamiltonIcon from '../../icons/hamilton-logo.svg'
import connectorIcon from '../../icons/lf-connector.svg'
import haushaltPlusIcon from '../../icons/lf-haushaltplus.svg'
import supersetIcon from '../../icons/superset-logo.svg'
import type { ChartNode, FlowDefinition, ProductDefinition, ServerDefinition, TooltipContent } from './types'

export const products: ProductDefinition[] = [
  { id: 'erp', title: 'ERP / Fachverfahren', subtitle: 'Product 01' },
  { id: 'hh', title: 'H&H / Infoma', subtitle: 'Product 02' },
  { id: 'more', title: '… N', subtitle: 'Product N' },
]

export const servers: ServerDefinition[] = [
  { id: 'frontend', title: 'Frontend', subtitle: 'Server' },
  { id: 'backend', title: 'Backend', subtitle: 'Server' },
  { id: 'source', title: 'Source', subtitle: 'Server' },
]

export const nodes: ChartNode[] = products.flatMap((product, productIndex) => {
  const x = 284 + productIndex * 286
  return [
    {
      id: `${product.id}-frontend`, product: product.id, server: 'frontend',
      title: '', description: 'A schematic frontend building block for this product.', icon: product.id === 'more' ? coastiIcon : supersetIcon, iconAlt: product.id === 'more' ? 'Coasti' : 'Apache Superset', x, y: 188,
    },
    {
      id: `${product.id}-orchestration`, product: product.id, server: 'backend',
      title: '', description: 'Coordinates processing and makes reusable capabilities available.', icon: hamiltonIcon, iconAlt: 'Hamilton', x, y: 334,
    },
    {
      id: `${product.id}-transformation`, product: product.id, server: 'backend',
      title: '', description: 'Transforms incoming information into the coasti standard.', icon: dbtIcon, iconAlt: 'dbt', x, y: 390,
    },
    {
      id: `${product.id}-ingestion`, product: product.id, server: 'source',
      title: '', description: 'Receives information from the connected source system.', icon: product.id === 'erp' ? haushaltPlusIcon : connectorIcon, iconAlt: product.id === 'erp' ? 'H&H HaushaltPlus' : 'Connector', x, y: 522,
    },
    {
      id: `${product.id}-storage`, product: product.id, server: 'source',
      title: '', description: 'Stores prepared information for downstream components.', icon: duckdbIcon, iconAlt: 'DuckDB', x, y: 578,
    },
  ]
})

export const flows: FlowDefinition[] = products.flatMap((product) => [
  { from: `${product.id}-ingestion`, to: `${product.id}-transformation`, label: 'ingested data' },
  { from: `${product.id}-transformation`, to: `${product.id}-storage`, label: 'standardized data' },
  { from: `${product.id}-storage`, to: `${product.id}-orchestration`, label: 'available data' },
  { from: `${product.id}-orchestration`, to: `${product.id}-frontend`, label: 'frontend content' },
])

export const descriptions: Record<string, TooltipContent> = {
  chart: {
    title: 'coasti stack',
    body: 'Explore the schematic architecture. Hover a server on the left to highlight everything it hosts, or hover an empty building block for a closer explanation.',
    eyebrow: 'Architecture',
    icon: coastiIcon,
    iconAlt: 'Coasti',
  },
  frontend: { title: 'Frontend Server', body: 'Presents the coasti stack to users and serves frontend content for each product.', eyebrow: 'Server row', icon: supersetIcon, iconAlt: 'Apache Superset' },
  backend: { title: 'Backend Server', body: 'Coordinates reusable functions, transformations, and services shared by the product columns.', eyebrow: 'Server row', icon: hamiltonIcon, iconAlt: 'Hamilton' },
  source: { title: 'Source Server', body: 'Connects source systems to ingestion and storage components.', eyebrow: 'Server row', icon: connectorIcon, iconAlt: 'Connector' },
}
