import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/dropdown.css'

function DropdownMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="dropdown">
      <button className="menu-button" onClick={() => setOpen(!open)}>
        ☰ Menu
      </button>

      {open && (
        <div className="dropdown-content">
          <Link to="/mental-health-care/overview" onClick={() => setOpen(false)}>Resum</Link>
          <Link to="/mental-health-care/healthy-habits" onClick={() => setOpen(false)}>Hàbits Saludables</Link>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu