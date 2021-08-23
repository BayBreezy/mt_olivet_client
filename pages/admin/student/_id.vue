<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <v-card style="box-shadow: rgab(0,0,0,0.2)" elevation="2" class="pa-3">
          <v-avatar size="100" class="mx-auto d-block">
            <v-img :src="user.image ? userImage() : '/icon.png'"></v-img>
          </v-avatar>
          <v-card-text class="">
            <p class="font-weight-bold text-center ">
              {{ user.firstname }} {{ user.lastname }}
            </p>
            <p class="text-caption text-center ">
              Email:
              <a class="text-decoration-none" :href="`mailto:${user.email}`">{{
                user.email
              }}</a>
            </p>
            <v-list dense flat>
              <v-list-item-group
                mandatory
                active-class="activemenu primary--text"
                v-model="tab"
              >
                <v-list-item v-for="(m, i) in menu" :key="`menuItem-${i}`">
                  <v-list-item-title>{{ m }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-window v-model="tab" touchless vertical>
          <v-window-item
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
            <ProfilePersonal @PersonalUpdated="$nuxt.refresh()" :user="user" />
          </v-window-item>
          <!-- Address -->
          <v-window-item
            transition="fade-transition"
            reverse-transition="fade-transition"
          >
            <v-btn
              @click="addAddrDialog = true"
              outlined
              class="text-capitalize ml-3"
            >
              Add New
            </v-btn>
            <ProfileAddAddress
              @CloseAddAddress="addAddrDialog = false"
              @AddressAdded="$nuxt.refresh()"
              :addAddrDialog="addAddrDialog"
              :id="user.id"
            />
            <br />

            <v-row class="pa-2">
              <template v-for="(a, i) in user.addresses">
                <v-col :key="`address${i}-${a.id}`" cols="11" sm="6" md="4">
                  <ProfileAddress
                    @PersonalUpdated="$nuxt.refresh()"
                    :address="a"
                  />
                </v-col>
              </template>
            </v-row>
          </v-window-item>
          <!-- Contact -->
          <v-window-item
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
            <ProfileContact @ContactUpdated="$nuxt.refresh()" :user="user" />
          </v-window-item>
          <!-- Assigned Courses -->
          <v-window-item
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
            <v-btn
              @click="assignCourseDialog = true"
              outlined
              class="text-capitalize ml-3"
            >
              Assign New
            </v-btn>
            <ProfileAssignCourseStudent
              @CloseAssignC="assignCourseDialog = false"
              @CourseAssigned="$nuxt.refresh()"
              :id="user.id"
              :courses="courses"
              :assignCourseDialog="assignCourseDialog"
            />
            <br />
            <v-row class="pa-2">
              <template v-for="(a, i) in coursesAssigned">
                <v-col
                  :key="`coursesAssigned${i}-${a.id}`"
                  cols="11"
                  sm="6"
                  md="4"
                >
                  <ProfileCoursesThought
                    @CourseUpdated="$nuxt.refresh()"
                    :coursesThought="a"
                  />
                </v-col>
              </template>
            </v-row>
          </v-window-item>
          <!-- Staff Attendance -->
          <v-window-item
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
            <v-btn
              @click="staffAttDialog = true"
              outlined
              class="text-capitalize ml-3"
            >
              Add
            </v-btn>
            <br />
            <ProfileStudentAttendance
              @StaffAttendanceRemoved="$nuxt.refresh()"
              :attendance="attendance"
            />
            <ProfileAddStudentAtt
              :courses="courses"
              :id="user.id"
              :staffAttDialog="staffAttDialog"
              @CloseStaffAddAtt="staffAttDialog = false"
              @StaffAttendanceUpdated="$nuxt.refresh()"
            />
          </v-window-item>
          <!-- Emergency contacts -->
          <v-window-item
            transition="fade-transition"
            reverse-transition="fade-transition"
          >
            <v-btn
              @click="addEmergency = true"
              outlined
              class="text-capitalize ml-3"
            >
              Add
            </v-btn>
            <ProfileAddEmergency
              @CloseAddEmergency="addEmergency = false"
              @EmergencyAdded="$nuxt.refresh()"
              :addEmergency="addEmergency"
              :id="user.id"
            />
            <br />

            <v-row class="pa-2">
              <template v-for="(a, i) in user.emergency_contacts">
                <v-col
                  :key="`emergency_contact${i}-${a.id}`"
                  cols="11"
                  sm="6"
                  md="4"
                >
                  <ProfileEmergency :emergency="a" />
                </v-col>
              </template>
            </v-row>
          </v-window-item>
          <!-- Next of Kin -->
          <v-window-item
            transition="fade-transition"
            reverse-transition="fade-transition"
          >
            <v-btn @click="addNok = true" outlined class="text-capitalize ml-3">
              Add
            </v-btn>
            <ProfileAddNOK
              @CloseAddNOK="addNok = false"
              @NOKAdded="$nuxt.refresh()"
              :addNok="addNok"
              :id="user.id"
            />
            <br />

            <v-row class="pa-2">
              <template v-for="(a, i) in user.kins">
                <v-col :key="`kins${i}-${a.id}`" cols="11" sm="6" md="4">
                  <ProfileNextOfKin :nok="a" />
                </v-col>
              </template>
            </v-row>
          </v-window-item>
          <!-- Education -->
          <v-window-item
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
            <v-btn
              @click="addEduDialog = true"
              outlined
              class="text-capitalize"
            >
              Add
            </v-btn>
            <ProfileAddEducation
              @EducationAdded="$nuxt.refresh()"
              @CloseAddEdu="addEduDialog = false"
              :addEduDialog="addEduDialog"
              :id="user.id"
            />
            <br />
            <br />
            <ProfileEducation
              :id="user.id"
              @EducationRemoved="$nuxt.refresh()"
              :educations="user.educations"
            />
          </v-window-item>
          <!-- Qualification -->
          <v-window-item
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
            <v-btn
              @click="addQualificationDialog = true"
              outlined
              class="text-capitalize"
            >
              Add
            </v-btn>
            <ProfileAddQualification
              @QualificationAdded="$nuxt.refresh()"
              @CloseAddQual="addQualificationDialog = false"
              :addQualificationDialog="addQualificationDialog"
              :id="user.id"
            />
            <br />
            <br />
            <ProfileQualification
              :id="user.id"
              @QualificationRemoved="$nuxt.refresh()"
              :qualifications="user.qualifications"
            />
          </v-window-item>
          <!-- Contact -->
          <v-window-item
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
            <ProfileSocial @SocialUpdated="$nuxt.refresh()" :user="user" />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "admin",
  async asyncData({ $strapi, params }) {
    try {
      let u = await $strapi.findOne("users", params.id);
      let courses = await $strapi.find("courses");
      let attendance = await $strapi.find("student-attendances", {
        "student.id": params.id
      });

      let coursesAssigned = await $strapi.find("student-courses", {
        "student.id": params.id
      });
      return { user: u, coursesAssigned, courses, attendance };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      tab: 0,
      addAddrDialog: false,
      assignCourseDialog: false,
      staffAttDialog: false,
      addEmergency: false,
      addNok: false,
      addEduDialog: false,
      addQualificationDialog: false,
      menu: [
        "Personal",
        "Address",
        "Contact",
        "Courses",
        "Attendance",
        "Emergency Contact",
        "Next of Kin",
        "Education",
        "Qualification",
        "Social"
      ]
    };
  },
  methods: {
    /**
     * Used to return the user's image
     */
    userImage() {
      let i = "";
      if (this.user && this.user.image) {
        i = `${process.env.STRAPI_URL}${this.user.image.url}`;
      }
      return i;
    }
  }
};
</script>

<style scoped>
.activemenu {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.12);
}
</style>
