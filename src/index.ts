import Pizza from './pizza';
import contructor from './contructor';
import helper from './helper';
import config from './config';
contructor.set(Pizza);

export {
  Pizza,
  contructor as PizzaContructor,
  helper,
  config
};

export default Pizza;