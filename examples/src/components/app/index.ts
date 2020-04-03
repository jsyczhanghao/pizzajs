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

  methods: {
    onUserItemClick(...args) {
      console.log(args);
    }
  }
};