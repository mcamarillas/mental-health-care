import '../styles/overview_page_style.css'
import DropdownMenu from '../components/dropdown_component';
import PieChart from '../components/charts/pie_chart';
import SankeyChart from '../components/charts/sankey_chart';
import MosaicChart from '../components/charts/mosaic_chart';


const mosaicData = [
  { category: 'Depressió', subcategory: 'Positius', value: 2000 },
  { category: 'Depressió', subcategory: 'Negatius', value: 11565 },
  { category: 'Pensaments Suïcides', subcategory: 'Positius', value: 17656 },
  { category: 'Pensaments Suïcides', subcategory: 'Negatius', value: 10245 },
  { category: '5', subcategory: 'Positius', value: 10245 },
  { category: '5', subcategory: 'Negatius', value: 7656 }
];

function ExplorationPage({data}) {
  return (
    <div className="gradient-container">
      <header className="header">
        <DropdownMenu />
      </header>
      <div className="horizontal-layout main-layout">
        <div className="vertical-layout">
            <div className="content-box">
              <h3 className="chart-title">De l'alimentació a la depressió</h3>
              <SankeyChart data={data['sankey-depression1']} />
            </div>
            <div className="content-box">
              <h3 className="chart-title">Del son a la depressió</h3>
              <MosaicChart data={data['mossaic1']} />
            </div>
        </div>
        <div className="vertical-layout">
            <div className="content-box">
              <h3 className="chart-title">Incidència de depressió segons l’alimentació</h3>
              <SankeyChart data={data['sankey-depression2']} />
            </div>
            <div className="content-box">
              <h3 className="chart-title">Incidència de depressió segons les hores de son</h3>
              <MosaicChart data={data['mossaic2']} />
            </div>
        </div>
      </div>
    </div>
  )
}

export default ExplorationPage;
