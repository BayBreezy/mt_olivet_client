<template>
  <div>
    <v-app-bar app class="px-md-5" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-icon>mdi-{{ !drawer ? "sort-variant" : "backburger" }}</v-icon>
      </v-app-bar-nav-icon>
      <v-spacer />
      <v-avatar v-if="userImage" id="userAvatar">
        <v-img :src="userImage"></v-img>
      </v-avatar>
      <v-avatar color="primary" v-else id="userAvatar">
        <v-icon color="white">mdi-account</v-icon>
      </v-avatar>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer">
      <v-card
        tile
        flat
        style="position: sticky; top: 0px;  z-index:9; margin-bottom:10px"
      >
        <h3 class="text-center py-5 font-weight-thin">
          Mt. Olivet
        </h3>
        <v-divider class="mx-2" />
      </v-card>
      <v-list flat nav>
        <template v-for="(n, i) in nav">
          <v-hover v-if="!n.items" v-slot="{ hover }" :key="`navItem-${i}`">
            <v-list-item
              link
              :to="n.link"
              active-class="activenav primary--text"
              :class="{ activenav: hover }"
            >
              <v-list-item-icon>
                <v-icon size="20" :color="hover ? 'primary' : ''">{{
                  n.icon
                }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ n.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-hover>
          <v-hover v-else v-slot="{ hover }" :key="`navItem-${i}`">
            <v-list-group
              no-action
              active-class="activenav primary--text"
              :prepend-icon="n.icon"
              append-icon="mdi-menu-down"
            >
              <template #activator>
                <v-list-item-content>
                  <v-list-item-title>{{ n.text }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                link
                :to="child.link"
                dense
                v-for="(child, k) in n.items"
                :key="`child-${k}-${child.text}`"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ child.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-hover>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-menu
      activator="#userAvatar"
      offset-y
      bottom
      left
      :close-on-content-click="false"
      transition="scroll-y-transition"
      max-width="400"
      v-model="profile"
    >
      <v-card>
        <v-list dense>
          <v-list-item>
            <v-list-item-avatar v-if="userImage">
              <v-img :src="userImage"></v-img>
            </v-list-item-avatar>
            <v-list-item-avatar color="primary" v-else>
              <v-icon color="white">mdi-account</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ User.username }}</v-list-item-title>
              <v-list-item-subtitle class="text-uppercase">{{
                User.role.name
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="my-2" />
          <v-list-item nuxt to="/admin/profile">
            <v-list-item-icon>
              <v-icon size="19">mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="Logout">
            <v-list-item-icon>
              <v-icon size="19">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="my-2" />
          <v-list-item link @click="$vuetify.theme.dark = !$vuetify.theme.dark">
            <v-list-item-icon>
              <v-icon size="19">mdi-theme-light-dark</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Dark Mode</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  computed: {
    User() {
      return this.$strapi.user;
    },
    userImage() {
      return this.$strapi.user.image
        ? `${process.env.STRAPI_URL}${this.$strapi.user.image.url}`
        : null;
    }
  },
  methods: {
    async Logout() {
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.logout();
        window.location.reload();
        this.$store.commit("utils/Set_Overlay", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "error",
          text: error
        });
      }
    }
  },
  data() {
    return {
      drawer: false,
      profile: false,
      nav: [
        {
          text: "Dashboard",
          icon: "mdi-view-dashboard",
          link: "/admin/dashboard"
        },
        {
          text: "Staff",
          icon: "mdi-teach",
          link: "/admin/staff"
        },
        {
          text: "Students",
          icon: "mdi-school",
          link: "/admin/student"
        },
        {
          text: "Courses",
          icon: "mdi-book-open-page-variant",
          link: "/admin/courses"
        },
        {
          text: "Attendance",
          icon: "mdi-calendar-today",
          items: [
            {
              text: "Staff",
              icon: "mdi-teach",
              link: "/admin/attendance/staff"
            },
            {
              text: "Student",
              icon: "mdi-school",
              link: "/admin/attendance/student"
            }
          ]
        },
        {
          text: "Events",
          icon: "mdi-calendar-star",
          link: "/admin/events"
        },
        {
          text: "Noticeboard",
          icon: "mdi-bullseye-arrow",
          link: "/admin/noticeboard"
        },
        {
          text: "File Hub",
          icon: "mdi-file-pdf-outline",
          link: "/admin/filehub"
        },
        {
          text: "Inventory",
          icon: "mdi-database",
          items: [
            {
              //Paper, pens, ink, markers, folder leaves etc
              text: "Training Materials",
              icon: "mdi-teach",
              link: "/admin/material"
            }
            // {
            //   //Keyboard, mouse, staplers, UPS etc
            //   text: "Loose tools",
            //   icon: "mdi-teach",
            //   link: "#"
            // },
            // {
            //   //bleach, sanitizer, soap, tissue, towels, masks
            //   text: "Sanitation",
            //   icon: "mdi-teach",
            //   link: "#"
            // },
            // {
            //   //Desks, computers, cabinets, chairs, printers etc..
            //   text: "Assets",
            //   icon: "mdi-school",
            //   link: "#"
            // }
          ]
        },
        {
          text: "Fees",
          icon: "mdi-currency-usd",
          link: "/admin/fees"
        }
      ]
    };
  }
};
</script>

<style></style>
