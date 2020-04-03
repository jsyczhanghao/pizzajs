import Pizza from '../../src/pizza';
import App from './components/app';

const instance = new Pizza({
  components: {
    App,
  },

  template: '<app />'
});

instance.$mount(document.getElementById('app'));