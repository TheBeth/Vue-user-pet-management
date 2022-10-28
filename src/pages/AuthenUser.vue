<template>
  <div>
    <v-row justify="center">
      <form @submit.prevent="submitLogin">
        <v-card class="w-500" elevation="8">
          <v-card-title>
            <span class="text-h4 align-center mt-5">Login</span>
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
        const resData = res.data;
        console.log(res);
        if (resData.accessToken && resData.refreshToken && resData.idToken) {
          window.localStorage.setItem("token", resData.accessToken);
          window.localStorage.setItem("idToken", resData.idToken);
          window.localStorage.setItem("refreshToken", resData.refreshToken);
          this.$router.push("/user");
          if (window.localStorage.getItem("token")) {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
        if (resData.message === "New password is required") {
          this.errorMsg = "Reset Password";
          this.snackErr = true;
          this.$router.push("/resetPassword");
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.snackErr = true;
        if (err.response.data.name === "NotAuthorizedException") {
          this.errorMsg = err.response.data.name;
        } else {
          this.errorMsg = "Username or Password invalid";
        }
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
