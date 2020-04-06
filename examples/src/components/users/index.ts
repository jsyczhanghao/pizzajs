import template from './index.pxml';
import User from '../user';

export default {
  template,
  components: {User},
  props: {
    list: []
  },

  data() {
    return {
      users: this.list
    };
  },

  lifetimes: {
    mounted() {
      setTimeout(() => {
        this.users = this.users.slice(2);
      }, 2000);
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