import template from './index.tpl';
import User from '../user';

export default {
  template,
  components: {
    UserItem: User
  },
  props: {
    list: []
  },

  data() {
    return {
      users: this.list
    };
  },

  watch: {
    // users(now, old) {
    //   console.log(now, old);
    // },

    list(now, old) {
      console.log(now, old);
    }
  },

  lifetimes: {
    updated() {
      console.log('update');
    },

    mounted() {
      // setTimeout(() => {
      //   let start = Date.now();
      //   this.users = this.users.slice(1);
      //   this.users = this.users.slice(1);
      // }, 3000);
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