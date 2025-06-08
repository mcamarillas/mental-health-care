import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from '../tooltip';

function PieChart({ rawData }) {
  const ref = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: '', value: '' });

  useEffect(() => {
    const container = ref.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const radius = Math.min(width, height) / 2 - 10;

    const data = Object.entries(rawData).map(([label, value]) => ({
        label,
        value
    }));

    // Neteja només l'SVG anterior
    d3.select(container).select('svg').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);


    const colors = ['#9E4CAA', '#EACFDF'];
    const color = d3.scaleOrdinal(colors);
    const pie = d3.pie().value(d => d.value);
    const data_ready = pie(data);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const arcHover = d3.arc().innerRadius(0).outerRadius(radius + 10);

    svg.selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(200).attr('d', arcHover);
        const [x, y] = d3.pointer(event, container);
        setTooltip({
          visible: true,
          x: x + 10,
          y: y + 10,
          label: `${d.data.label}:`,
          value:`${d.data.value}`
        });
      })
      .on('mousemove', function (event) {
        const [x, y] = d3.pointer(event, container);
        setTooltip(tooltip => ({
          ...tooltip,
          x: x + 10,
          y: y + 10
        }));
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('d', arc);
        setTooltip(t => ({ ...t, visible: false }));
      });
  }, [rawData]);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '2rem',
        boxSizing: 'border-box'
      }}
    >
      <Tooltip {...tooltip} />
    </div>
  );
}

export default PieChart;