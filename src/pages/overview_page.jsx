import '../styles/overview_page_style.css'
import DropdownMenu from '../components/dropdown_component';
import PieChart from '../components/charts/pie_chart';
import HorizontalBarChart from '../components/charts/horizontal_bar_chart';
import IndiaMap from '../components/charts/india_map';
const DEV = false;

function OverviewPage({data}) {
  return (
    <div className="gradient-container">
      <header className="header">
        <DropdownMenu />
      </header>
      <div className="horizontal-layout main-layout">
        <div className="vertical-layout">
          <div className="horizontal-layout inner-layout">
            <div className="content-box">
              <h3 className="chart-title">Presència de la depressió</h3>
              <PieChart rawData={data['depression-rates']} />
            </div>
            <div className="content-box">
              <h3 className="chart-title">Pensaments de suicidi</h3>
              <PieChart rawData={data['suicidal-thougths-rates']} />
            </div>
          </div>
            <div className="content-box">
              <h3 className="chart-title">Index de depressió en les ciutats</h3>
              <HorizontalBarChart rawData={data['city-depression']}/>
            </div>
        </div>
        <div className="content-box">
          <h3 className="chart-title">Geo-representació de la depressió en les ciutats</h3>
              <IndiaMap cityData={data['city-depression']} geoJsonUrl={(DEV ? '' : '/mental-health-care') + '/data/india_state.geojson'}/>
        </div>
      </div>
    </div>
  )
}

export default OverviewPage;
