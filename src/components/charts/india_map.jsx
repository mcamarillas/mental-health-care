import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import Tooltip from '../tooltip';

function IndiaMap({ cityData, geoJsonUrl }) {
  const ref = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: '', value: '' });

  useEffect(() => {
    const container = ref.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    d3.select(container).select('svg').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const projection = d3.geoMercator()
      .center([80, 22])
      .scale(1000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    d3.json(geoJsonUrl).then(geoData => {
      svg.append('g')
        .selectAll('path')
        .data(geoData.features)
        .join('path')
        .attr('d', path)
        .attr('fill', '#eee')
        .attr('stroke', '#aaa');

      const allTotals = Object.values(cityData).map(d => +d.Positiu + +d.Negatiu);
      const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(allTotals)])
        .range([2, 22]);

      const colorScale = d3.scaleLinear()
        .domain([0.53, 0.68])
        .range(['#EACFDF', '#6A297B']);

      Object.entries(cityData).forEach(([city, data]) => {
        const [lon, lat] = data.coordinates.map(parseFloat);
        const total = +data.Positiu + +data.Negatiu;
        const ratio = +data.Positiu / total;

        const [x, y] = projection([lon, lat]);

        svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', radiusScale(total))
          .attr('fill', colorScale(ratio))
          .attr('stroke', '#333')
          .attr('opacity', 0.8)
          .on('mouseover', (event) => {
            setTooltip({
              visible: true,
              x: event.offsetX + 10,
              y: event.offsetY + 10,
              label: `${city}`,
              value: `</br> <b>Positius:</b> ${data.Positiu}</br> <b>Negatius:</b> ${data.Negatiu}`
            });
          })
          .on('mousemove', (event) => {
            setTooltip(t => ({
              ...t,
              x: event.offsetX + 10,
              y: event.offsetY + 10,
            }));
          })
          .on('mouseout', () => {
            setTooltip(t => ({ ...t, visible: false }));
          });
      });
    });
  }, [cityData, geoJsonUrl]);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '575px',
        position: 'relative'
      }}
    >
      <Tooltip {...tooltip} />
    </div>
  );
}

export default IndiaMap;
