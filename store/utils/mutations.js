export default {
  /**
   * Mutation used to set the overlay
   */
  Set_Overlay(state, data) {
    state.showOverlay = data;
  },
  /**
   * Used to show or hide snack bar with message
   * @param {Object} data Object
   */
  Set_Snack(state, data) {
    state.showSnackText = data.show;
    state.snackText = data.text;
    state.snackColor = data.color;
  }
};
