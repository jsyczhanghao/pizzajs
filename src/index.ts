import Pizza from './pizza';
import contructor from './contructor';
import helper from './helper';

contructor.set(Pizza);

export {
  Pizza,
  contructor as PizzaContructor,
  helper
};

export default Pizza;