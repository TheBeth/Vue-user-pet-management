<template>
  <div>
    <div class="d-flex justify-center align-center">
      <h1>User Manager</h1>
    </div>

    <v-row justify="center" v-if="spinner">
      <v-dialog v-model="dialog">
        <base-loading></base-loading>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ attrs }">
          <v-btn
            color="blue brighten-4"
            dark
            v-bind="attrs"
            @click="dialog = true"
            :dialog="dialog"
          >
            New User
          </v-btn>
        </template>
        <form @submit.prevent="submitForm">
          <v-card class="w-500">
            <v-card-title>
              <span class="text-h4 align-center">Add new user</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Username*"
                      required
                      v-model="userName.value"
                      :rules="userNameRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="First Name*"
                      required
                      v-model="firstName.value"
                      :rules="firstNameRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Last Name*"
                      required
                      v-model="lastName.value"
                      :rules="lastNameRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      label="Age"
                      v-model.number="age.value"
                      type="number"
                    ></v-text-field>
                    <p class="err" v-if="!this.age.isValid">Age invalid</p>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
              <p class="err" v-if="!formIsValid">Form is Invalid</p>
            </v-card-text>

            <v-card-actions>
              <v-btn color="blue darken-1" text @click="clearValue">
                Clear
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text type="submit"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </v-dialog>
    </v-row>

    <v-snackbar
      v-model="snackNewUser"
      :timeout="3000"
      color="success"
      location="bottom right"
    >
      {{ snackMsg }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackNewUser = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <user-lists
      v-for="user in users"
      :key="user.id"
      :id="user.id"
      :userName="user.userName"
      :firstName="user.firstName"
      :lastName="user.lastName"
      :age="user.age"
    ></user-lists>
    <v-spacer></v-spacer>

    <v-col cols="12" sm="12" class="text-right">
      <v-btn
        large
        color="orange darken-2"
        icon="mdi-arrow-up"
        @click="scrollToTop"
      ></v-btn>
    </v-col>
  </div>
</template>

<script>
import UserLists from "../components/user/UserLists.vue";
import axios from "axios";
import BaseLoading from "@/UI/BaseLoading.vue";

export default {
  components: { UserLists, BaseLoading },
  data() {
    return {
      users: [],
      snackNewUser: false,
      dialog: false,
      firstName: {
        value: "",
        isValid: true,
      },
      lastName: {
        value: "",
        isValid: true,
      },
      userName: {
        value: "",
        isValid: true,
      },
      age: {
        value: "",
        isValid: true,
      },
      pet: {
        value: [],
        isValid: true,
      },
      formIsValid: true,
      firstNameRules: [(v) => !!v || "Name is required"],
      userNameRules: [(v) => !!v || "Username is required"],
      lastNameRules: [(v) => !!v || "Lastname is required"],
      spinner: false,
      snackMsg: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    clearValue() {
      this.firstName.value = "";
      this.lastName.value = "";
      this.userName.value = "";
      this.age.value = "";
      this.pet.value = [];
      this.fetchData();
    },
    formValiditor() {
      this.formIsValid = true;
      if (this.pet.value.length == 0) {
        this.pet.isValid = false;
        this.formIsValid = false;
      }
    },
    async submitForm() {
      try {
        this.spinner = true;
        const formData = {
          firstName: this.firstName.value,
          lastName: this.lastName.value,
          userName: this.userName.value,
          age: this.age.value,
        };
        const res = await axios.post("http://localhost:8000/users", formData);
        if (res) {
          this.snackNewUser = true;
          this.snackMsg = "User Created";
          this.dialog = false;
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (err) {
        this.snackMsg = err.response.data.message;
        this.snackNewUser = true;
      } finally {
        this.spinner = false;
      }
    },
    async fetchData() {
      this.spinner = true;
      try {
        const res = await axios.get("http://localhost:8000/users");
        const resData = res.data.Items;
        for (let i in resData) {
          let user = {
            id: resData[i].id,
            firstName: resData[i].firstName,
            userName: resData[i].userName,
            lastName: resData[i].lastName,
            age: resData[i].age,
            petName: resData[i].petName,
          };
          this.users.push(user);
        }

        this.users = this.users.sort((a, b) => {
          return a.id - b.id;
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.spinner = false;
      }
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style scoped>
h1 {
  margin: 10px auto;
}

.err {
  color: red;
}

.w-500 {
  width: 500px;
}
</style>
