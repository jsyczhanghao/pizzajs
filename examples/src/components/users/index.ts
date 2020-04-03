import template from './index.pxml';
import User from './user';

export default {
  template,
  components: {User},
  props: {
    list: []
  },

  lifecyles: {
    mounted() {
      this.$emit('click');
    }
  },

  methods: {
    onClickItem(item) {
      return this.onClick.bind(this, item);
    },

    onClick(...args) {
      this.$emit('click:item', ...args);
    }
  }
}