import { useState } from 'react'
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
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu