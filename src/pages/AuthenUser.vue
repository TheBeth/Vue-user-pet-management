<template>
  <div>
    <v-row justify="center">
      <form @submit.prevent="submitLogin">
        <v-card class="w-500" elevation="8">
          <v-card-title>
            <span class="text-h3 align-center mt-5">Login</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Username*" required v-model="userName">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    label="Password*"
                    required
                    hint="At least 8 password"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    @click:append="show = !show"
                    counter
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text type="submit" :loading="loading"
              >Login</v-btn
            >
          </v-card-actions>
        </v-card>
      </form>
    </v-row>

    <v-snackbar
      v-model="snackErr"
      :timeout="3000"
      color="error"
      location="bottom right"
    >
      {{ errorMsg }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackErr = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
// import UserPool from "../middlewares/Userpool.js";
// import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
export default {
  data() {
    return {
      userName: "",
      password: "",
      show: false,
      loading: false,
      errorMsg: "",
      snackErr: false,
    };
  },
  methods: {
    async submitLogin() {
      try {
        this.loading = true;
        const res = await axios.post("http://localhost:8000/users/login", {
          userName: this.userName,
          password: this.password,
        });
        console.log(res);
        const resData = res.data;
        console.log(resData);
        window.localStorage.setItem("token", resData);
        if (window.localStorage.getItem("token")) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }

        // const user = new CognitoUser({
        //   Username: this.userName,
        //   Pool: UserPool,
        // });
        // const AuthDetail = new AuthenticationDetails({
        //   Username: this.userName,
        //   Password: this.password,
        // });
        // user.authenticateUser(AuthDetail, {
        //   onSuccess(data) {
        //     console.log("Success ", data);
        //     window.localStorage.setItem("token", data.accessToken.jwtToken);
        //     console.log(window.localStorage.getItem("token"));
        //     if (data) {
        //       setTimeout(() => {
        //         window.location.reload();
        //       }, 1500);
        //     }
        //   },
        //   onFailure(data) {
        //     console.log("Failure", data.message);
        //     alert(data.message);
        //     this.errorMsg = data.message;
        //   },
        //   newPasswordRequired(data) {
        //     console.log("New Password Require ", data);
        //   },
        // });
        this.$router.push("/user");
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.errorMsg = "Username or Password invalid";
        this.snackErr = true;
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.w-500 {
  width: 500px;
  margin-top: 50px;
}
</style>
