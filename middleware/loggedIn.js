export default function({ $strapi, redirect, store }) {
  if (!$strapi.user) {
    store.commit("utils/Set_Snack", {
      show: true,
      color: "info",
      text: "Please log in to continue."
    });
    redirect("/");
  }
}
