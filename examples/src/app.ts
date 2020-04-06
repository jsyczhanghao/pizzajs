import MiniClientPizza from '../../src/mini/client';

MiniClientPizza.listen(new Worker('./background.js'));
