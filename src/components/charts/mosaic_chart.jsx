import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from '../tooltip';

function MosaicChart({ data }) {
  const ref = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: '', value: '' });

  useEffect(() => {
    const container = ref.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 30, bottom: 40, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const paddingX = 4; // separació horitzontal entre columnes
    const paddingY = 2; // separació vertical entre rectangles

    d3.select(container).select('svg').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height])
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Eix Y: línia vertical i etiquetes
    g.append('line')
      .attr('x1', -5)
      .attr('y1', -15)
      .attr('x2', -5)
      .attr('y2', innerHeight + 5)
      .attr('stroke', '#9E4CAA')
      .attr('stroke-width', 2);

    g.append('text')
      .attr('x', -70)
      .attr('y', -20)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'hanging')
      .attr('fill', '#333')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-90)')
      .text('Sense Depressió');

    g.append('text')
      .attr('x', -190)
      .attr('y', -20)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'hanging')
      .attr('fill', '#333')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-90)')
      .text('Depressió');

    // Agrupem per categoria principal
    const categoryTotals = d3.rollups(
      data,
      v => d3.sum(v, d => d.value),
      d => d.category
    );

    const total = d3.sum(categoryTotals, d => d[1]);

    let xOffset = 0;

    // Escala de colors per categoria (per columna)
    const colors = d3.scaleOrdinal()
      .domain(categoryTotals.map(d => d[0]))
      .range(['#6A297B', '#EACFDF', '#B565A7', '#D8BFD8', '#7B3F00']);

    categoryTotals.forEach(([category, categoryTotal], i) => {
      const categoryData = data.filter(d => d.category === category);
      const widthFracTotal = (categoryTotal / total) * innerWidth;

      // Restem padding horitzontal, excepte a l'última columna
      const widthFrac = widthFracTotal - (i < categoryTotals.length - 1 ? paddingX : 0);

      let yOffset = 0;
      const categoryGroup = g.append('g');

      categoryData.forEach((d, idx) => {
        const heightFracTotal = (d.value / categoryTotal) * innerHeight;

        // Restem padding vertical excepte últim rectangle
        const heightFrac = heightFracTotal - (idx < categoryData.length - 1 ? paddingY : 0);

        categoryGroup.append('rect')
          .attr('x', xOffset)
          .attr('y', yOffset)
          .attr('width', widthFrac)
          .attr('height', heightFrac)
          .attr('fill', colors(category))
          .on('mouseover', (event) => {
            const [x, y] = d3.pointer(event, container);
            setTooltip({
              visible: true,
              x: x + 10,
              y: y + 10,
              label: `${d.category} - ${d.subcategory}`,
              value: `</br><b>Casos:</b> ${d.value}`
            });
          })
          .on('mousemove', (event) => {
            const [x, y] = d3.pointer(event, container);
            setTooltip(t => ({ ...t, x: x + 10, y: y + 10 }));
          })
          .on('mouseout', () => {
            setTooltip(t => ({ ...t, visible: false }));
          });

        yOffset += heightFracTotal; // sumem la mida total (inclòs padding)
      });

      xOffset += widthFracTotal; // sumem la mida total (inclòs padding)
    });

    // Eix X
    g.append('line')
      .attr('x1', -5)
      .attr('y1', innerHeight + 5)
      .attr('x2', innerWidth + 5)
      .attr('y2', innerHeight + 5)
      .attr('stroke', '#9E4CAA')
      .attr('stroke-width', 2);

    let cumX = 0;
    categoryTotals.forEach(([category, categoryTotal]) => {
      const widthFrac = (categoryTotal / total) * innerWidth;
      const centerX = cumX + widthFrac / 2;

      g.append('text')
        .attr('x', centerX)
        .attr('y', innerHeight + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#333')
        .style('font-size', '12px')
        .text(category);

      cumX += widthFrac;
    });

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

export default MosaicChart;
