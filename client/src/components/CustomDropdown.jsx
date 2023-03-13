import { useState } from "react"
import { Link } from "react-router-dom"

export default function CustomDropdown({children,title}) {
    const [dropdown,setDropdown] = useState(false)
    return <>
    <div className="custom-dropdown">
        <Link to={"#"} className={"dropdown-toggler "+(dropdown ? 'toggle-active' : '')} onClick={()=>setDropdown(prevDropdown => !prevDropdown)}><span>{title}</span><span className='icon'>{dropdown ? '-' : '+'}</span></Link>
        <div className={"custom-drop-menu "+(dropdown ? 'show' : 'hide')}>
            {
                children
            }
        </div>
    </div>
    </>
}

