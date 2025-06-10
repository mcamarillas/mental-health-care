import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import Tooltip from '../tooltip';

function SankeyChart({ data }) {
  const ref = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: '', value: '' });

  useEffect(() => {
    const container = ref.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const margin = { top: 20, right: 40, bottom: 20, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(container).select('svg').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height])
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const sankeyLayout = sankey()
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[0, 0], [innerWidth, innerHeight]]);

    const { nodes, links } = sankeyLayout({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d })),
    });
    
    const colors = [
      '#6A297B', '#EACFDF', '#C399D3', '#F1DDE6',
      '#9A5DA1', '#C785B6', '#E6BFD3', '#F7E5F2',
    ];
    const colorScale = d3.scaleOrdinal(colors);

    g.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => colorScale(d.index))
      .on('mouseover', (event, d) => {
        const [x, y] = d3.pointer(event, container);
        setTooltip({
          visible: true,
          x: x + 10,
          y: y + 10,
          label: d.name,
          value: `</br><b>Valor total:</b> ${d.value}`
        });
      })
      .on('mousemove', (event) => {
        const [x, y] = d3.pointer(event, container);
        setTooltip(t => ({ ...t, x: x + 10, y: y + 10 }));
      })
      .on('mouseout', () => setTooltip(t => ({ ...t, visible: false })));

    g.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.4)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => colorScale(d.source.index))
      .attr('stroke-width', d => Math.max(1, d.width))
      .on('mouseover', (event, d) => {
        const [x, y] = d3.pointer(event, container);
        setTooltip({
          visible: true,
          x: x + 10,
          y: y + 10,
          label: `${d.source.name} → ${d.target.name}`,
          value: `</br><b>Valor:</b> ${d.value}`
        });
      })
      .on('mousemove', (event) => {
        const [x, y] = d3.pointer(event, container);
        setTooltip(t => ({ ...t, x: x + 10, y: y + 10 }));
      })
      .on('mouseout', () => setTooltip(t => ({ ...t, visible: false })));

    g.append('g')
      .style('font', '12px sans-serif')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < innerWidth / 2 ? 'start' : 'end')
      .text(d => d.name);

  }, [data]);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Tooltip {...tooltip} />
    </div>
  );
}

export default SankeyChart;
