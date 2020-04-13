import template from './index.tpl';
import list from '../../data/user';
import Users from '../../components/users';

export default {
  template,

  components: {
    Users
  },

  data: {
    users: list,
    val: ''
  },

  lifetimes: {
    mounted() {
      setTimeout(() => {
        this.users = [].concat(this.users, this.users);
        // setTimeout(() => {
        //   this.users = this.users.slice(2);
        // }, 2000);
      }, 2000);
    }
  },

  methods: {
    onInput(e) {
      console.log(e);
      this.val = e.target.value;
    },
    onUserItemClick(...args) {
      console.log(args);
    }
  }
};