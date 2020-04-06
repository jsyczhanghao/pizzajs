import template from './index.pxml';
import style from './index.css';

export default {
  template,
  style,
  props: {
    info: {}
  },

  methods: {
    onClick(e) {
      console.log(e);
      //this.$emit('click', e);
    }
  }
}