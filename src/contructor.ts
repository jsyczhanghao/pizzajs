let constructor: any;

export default {
  set(F) {
    return constructor = F;
  },

  get() {
    return constructor;
  }
};