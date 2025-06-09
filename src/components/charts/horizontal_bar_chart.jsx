import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from '../tooltip';
import '../../styles/horizontal_bar_chart.css';

function HorizontalBarChart({ rawData, barThickness = 30 }) {
  const ref = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: '', value: '' });

  function prepareData(data) {
    const keys = Object.keys(Object.values(data)[0]);
    const cities = Object.entries(data).map(([city, values]) => {
      const parsed = {};
      keys.forEach(k => parsed[k] = +values[k]);
      return { city, ...parsed };
    });
    return { data: cities, keys };
  }

  function createSVG(container, width, totalHeight) {
    d3.select(container).select('svg').remove();

    return d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', totalHeight)
      .attr('viewBox', `0 0 ${width} ${totalHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  }

  useEffect(() => {
    const container = ref.current;
    const width = container.clientWidth;
    const margin = { top: 20, right: 30, bottom: 40, left: 85 };

    const { data, keys } = prepareData(rawData);

    const totalHeight = data.length * barThickness + margin.top + margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = totalHeight - margin.top - margin.bottom;

    const svg = createSVG(container, width, totalHeight);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(['#6A297B', '#EACFDF']);

    const y = d3.scaleBand()
      .domain(data.map(d => d.city))
      .range([0, innerHeight])
      .padding(0.2);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.sum(keys, k => d[k]))])
      .nice()
      .range([0, innerWidth]);

    const stacked = d3.stack().keys(keys)(data);

    const lines = g.append('g')
      .selectAll('g')
      .data(stacked)
      .join('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d.map(entry => ({ ...entry, key: d.key })))
      .join('rect')
      .attr('y', d => y(d.data.city))
      .attr('x', d => x(d[0]))
      .attr('height', y.bandwidth())
      .attr('width', 0)
      .on('mouseover', function(event, d) {
        const [xPos, yPos] = d3.pointer(event, container);
        setTooltip({
          visible: true,
          x: xPos + 10,
          y: yPos + 10,
          label: `${d.data.city}`,
          value: `<br><b>${d.key}:</b> ${d.data[d.key]}`
        });
        d3.select(this).attr('opacity', 0.7);
      })
      .on('mousemove', function(event) {
        const [xPos, yPos] = d3.pointer(event, container);
        setTooltip(t => ({ ...t, x: xPos + 10, y: yPos + 10 }));
      })
      .on('mouseout', function() {
        setTooltip(t => ({ ...t, visible: false }));
        d3.select(this).attr('opacity', 1);
      });
    
      lines.transition()
      .duration(1000)
      .attrTween('width', function(d) {
        const i = d3.interpolate(0, x(d[1]) - x(d[0]));
        return function(t) {
          return i(t);
        };
      });
    g.append('g').call(d3.axisLeft(y));
  }, [rawData, barThickness]);

  return (
    <div ref={ref} className="chart-container">
      <Tooltip {...tooltip} />
    </div>
  );
}

export default HorizontalBarChart;
