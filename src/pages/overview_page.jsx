import '../styles/overview_page_style.css'
import DropdownMenu from '../components/dropdown_component';
import PieChart from '../components/charts/pie_chart';

function OverviewPage({data}) {
  console.log(data['depression-rates'])
  return (
    <div className="gradient-container">
      <header className="header">
        <DropdownMenu />
      </header>
      <div className="horizontal-layout main-layout">
        <div className="vertical-layout">
          <div className="horizontal-layout inner-layout">
            <div className="content-box">
              <h3 className="chart-title">Depression Rates</h3>
              <PieChart rawData={data['depression-rates']} />
            </div>
            <div className="content-box">
              <h3 className="chart-title">Suicidal Thoughts Rates</h3>
              <PieChart rawData={data['suicidal-thougths-rates']} />
            </div>
          </div>
            <div className="content-box">Box 3</div>
        </div>
        <div className="content-box">Box 4</div>
      </div>
    </div>
  )
}

export default OverviewPage;
