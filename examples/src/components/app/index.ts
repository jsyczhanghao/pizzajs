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
      setTimeout(() => {
        this.users = list.slice(1);
      }, 1000);
    }
  },

  methods: {
    onUserItemClick(...args) {

      console.log(args);
    }
  }
};