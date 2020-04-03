import template from './user.pxml';

export default {
  template,
  props: {
    info: {}
  },

  methods: {
    onClick(e) {
      this.$emit('click', e);
    }
  }
}