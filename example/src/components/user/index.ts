import template from './index.tpl';
import style from './index.css';

export default {
  template,
  style,
  props: {
    info: {}
  },

  data() {
    return {
      user: this.info
    };
  },

  watch: {
    info(v) {
      this.user = v;
    }
  },

  lifetimes: {
    // mounted() {
    //   setTimeout(() => {
    //     this.user = this.info;
    //   }, 5000);
    // }
  },

  methods: {
    onClick(e) {
      this.user = {...this.user, name: Date.now()}
      this.$emit('click', e);
    }
  }
}