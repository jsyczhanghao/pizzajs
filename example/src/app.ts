import Pizza from '../../src';
import Home from './pages/home';

new Pizza(Home).$mount(document.getElementById('app1'));

// new Pizza(Home).$mount(document.getElementById('app2'));