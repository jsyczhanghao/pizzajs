import template from './index.pxml';
import list from '../../data/user';
import Users from '../users';

export default {
  template,

  components: {
    Users
  },

  data: {
    users: list
  },

  lifetimes: {
    mounted() {
      this.$nextTick(() => {
        console.log(1);
      })
      this.$nextTick(() => {
        console.log(3);
      })
      setTimeout(() => {
        this.users = list.slice(1);
        this.$nextTick(() => {
          console.log(2);
        });
      }, 5000);
    }
  },

  methods: {
    onUserItemClick(...args) {
      console.log(args);
    }
  }
};