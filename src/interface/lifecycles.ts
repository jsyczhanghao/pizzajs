export default interface Lifecyles {
  created?();
  mounted?();
  updated?();
  destroyed?();
}