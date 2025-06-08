import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from '../tooltip';

function PieChart({ rawData }) {
  const ref = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: '', value: '' });

  function prepareData(rawData) {
    return Object.entries(rawData).map(([label, value]) => ({
      label,
      value
    }));
  }

  function createSVG(container, width, height) {
    d3.select(container).select('svg').remove();

    return d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
  }

  function drawArcs(svg, data_ready, arc, arcHover, color, container) {
    const paths = svg.selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(200).attr('d', arcHover);
        const [x, y] = d3.pointer(event, container);
        setTooltip({
          visible: true,
          x: x + 10,
          y: y + 10,
          label: `${d.data.label}:`,
          value: `${d.data.value}`
        });
      })
      .on('mousemove', function(event) {
        const [x, y] = d3.pointer(event, container);
        setTooltip(t => ({
          ...t,
          x: x + 10,
          y: y + 10
        }));
      })
      .on('mouseout', function() {
        d3.select(this).transition().duration(200).attr('d', arc);
        setTooltip(t => ({ ...t, visible: false }));
      });

    paths.transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(
          { startAngle: 0, endAngle: 0 },
          d
        );
        return function(t) {
          return arc(interpolate(t));
        };
      });
  }

  useEffect(() => {
    const container = ref.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const radius = Math.min(width, height) / 2 - 20;

    const data = prepareData(rawData);
    const svg = createSVG(container, width, height);

    const colors = ['#6A297B', '#EACFDF'];
    const color = d3.scaleOrdinal(colors);
    const pie = d3.pie().value(d => d.value);
    const data_ready = pie(data);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const arcHover = d3.arc().innerRadius(0).outerRadius(radius + 10);

    drawArcs(svg, data_ready, arc, arcHover, color, container);
  }, [rawData]);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '80%',
        height: '80%',
        margin: 'auto',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Tooltip {...tooltip} />
    </div>
  );
}

export default PieChart;
