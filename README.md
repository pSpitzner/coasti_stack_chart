# Coasti Stack Chart

Interactive native D3/SVG rendering of the Coasti architecture diagram.

The chart uses server rows and product columns. Hovering a server highlights all of its building blocks across the product columns. Hovering a building block highlights its connected flows and shows placeholder explanatory text.

## Development

Install dependencies:

```sh
npm install
```

Start the Vite development server:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Embedding

The interactive chart is also available as a module. Import `mount` and provide
an HTML element. The existing SVG rendering, hover relationships, tooltips,
blur effects, and logo interaction are all included:

```ts
import { mount } from "./src";

const chartElement = document.querySelector<HTMLElement>("#coasti-stack-chart");
if (chartElement) mount(chartElement);
```

For a Slidev presentation, call the module from a mounted Vue component:

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { mount } from "../coasti_stack_chart/src";

onMounted(() => {
  const chartElement = document.querySelector<HTMLElement>("#coasti-stack-chart");
  if (chartElement) mount(chartElement);
});
</script>

<div id="coasti-stack-chart"></div>
```

The module imports the chart stylesheet automatically. Use a unique element id
if more than one chart is present in the presentation.

The compiled JavaScript exposes a global mount function. Host the contents of `dist/` on a static site, then add a wrapper element and load the generated JavaScript module:

```html
<div id="coasti-stack-chart"></div>
<script type="module" src="/assets/index-XXXXXXXX.js"></script>
<script type="module">
  window.CoastiStack.mount('#coasti-stack-chart');
</script>
```

Replace `index-XXXXXXXX.js` with the generated filename in `dist/assets/`. The imported stylesheet is loaded by the module automatically.

The mount function also accepts an element directly:

```js
window.CoastiStack.mount(document.querySelector('#coasti-stack-chart'));
```

GitHub-rendered README files do not execute arbitrary JavaScript. For an interactive README link, host the built chart on GitHub Pages or another static site and link to that page from the README.

## Structure

- `src/main.ts` — chart coordinator, layout helpers, interactions, and embedding API
- `src/chart/data.ts` — products, servers, nodes, flows, and supplied icon assignments
- `src/chart/ServerElement.ts` — class-based server-row control
- `src/chart/BuildingBlockElement.ts` — class-based interactive building block
- `src/chart/FlowElement.ts` — class-based animated SVG connector
- `src/chart/TooltipElement.ts` — mouse-positioned tooltip with icon and text content
- `src/chart/types.ts` — shared chart element types
- `src/style.css` — visual styling, hover states, flow animation, responsive behavior, and reduced-motion support
- `icons/` — supplied product, server, connector, transformation, storage, and frontend assets used by the chart
- `coasti_stack.svg` — exported SVG reference artwork
- `coasti_stack.pdf` — original schematic reference
