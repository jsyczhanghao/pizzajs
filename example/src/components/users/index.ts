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
      show: true,
      users: this.list,
      q: 0
    };
  },

  watch: {
    // users(now, old) {
    //   console.log(now, old);
    // },

    list(now, old) {
      //console.log(now, old);
    }
  },

  lifetimes: {
    updated() {
      console.log('update');
    },

    mounted() {
      setTimeout(() => {
          this.show = false;
          // this.q = 1;

          // setTimeout(() => {
          //   this.show = true;
          // }, 5000);
      }, 5000);
      // setTimeout(() => {
      //   let start = Date.now();
      //   this.users = this.users.slice(1);
      //   this.users = this.users.slice(1);
      // }, 3000);
    }
  },

  methods: {
    onClickItem(item) {
      this.$emit('click:item', 1, 2, 3);
      //return this.onClick.bind(this, item);
    },

    onClick(...args) {
      this.$emit('click:item', ...args);
    }
  }
}