import {Link} from 'react-router-dom';
const Menu = () => {
    return (
        <ul className='menu'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/playground">Playground</Link></li>
            <li><Link to="/problems">Playground</Link></li>
        </ul>
    );
}

export default Menu;