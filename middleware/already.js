export default function({ $strapi, redirect, store }) {
  if ($strapi.user) {
    if ($strapi.user.role && $strapi.user.role.type.match("student")) {
      //Redirect to student dashboard
    }
    if ($strapi.user.role && $strapi.user.role.type.match("admin")) {
      //Redirect to admin dashboard
      store.commit("utils/Set_Snack", {
        show: true,
        color: "success",
        text: "Welcome back."
      });
      redirect("/admin/dashboard");
    }
  }
}
