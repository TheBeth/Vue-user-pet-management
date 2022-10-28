<template>
  <div>
    <v-row justify="center">
      <form @submit.prevent="submitReset">
        <v-card class="w-500" elevation="8">
          <v-card-title>
            <span class="text-h4 align-center mt-5">Reset Password</span>
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
                    v-model="OldPassword"
                    label="Old Password*"
                    required
                    hint="At least 8 password"
                    :append-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showOld ? 'text' : 'password'"
                    @click:append="showOld = !showOld"
                    counter
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="NewPassword"
                    label="New Password*"
                    required
                    hint="At least 8 password, 1 Upper, 1 Lower, 1 Spacific"
                    :append-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showNew ? 'text' : 'password'"
                    @click:append="showNew = !showNew"
                    counter
                    :rules="[passwordValidate]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="ConfirmNewPassword"
                    label="Confirm New Password*"
                    required
                    :append-icon="showNewCon ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showNewCon ? 'text' : 'password'"
                    @click:append="showNewCon = !showNewCon"
                    counter
                    :rules="[matchingPasswords]"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text type="submit" :loading="loading"
              >Reset Password</v-btn
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
        <v-btn variant="text" @click="snackErr = false"> X </v-btn>
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
      OldPassword: "",
      NewPassword: "",
      ConfirmNewPassword: "",
      showOld: false,
      showNew: false,
      showNewCon: false,
      loading: false,
      errorMsg: "",
      snackErr: false,
    };
  },
  methods: {
    async submitReset() {
      try {
        let formData = {
          userName: this.userName,
          password: this.OldPassword,
          newPassword: this.NewPassword,
        };
        const res = await axios.post(
          "http://localhost:8000/users/login",
          formData
        );
        if (res) {
          this.$router.push("/signin");
        }
      } catch (err) {
        this.snackErr = true;
        this.errorMsg = err.response.data.name;
      }
    },
    passwordValidate() {
      const validate = new RegExp(
        // eslint-disable-next-line
        /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&])(?=.*[a-zA-Z]).{8,}$/
      );
      if (validate.test(this.NewPassword)) {
        return true;
      } else {
        return "At least 8 letter , Max 16 letter, 1 Upper, 1 Lower, 1 Spacific";
      }
    },
    matchingPasswords() {
      if (this.NewPassword === this.ConfirmNewPassword) {
        return true;
      } else {
        return "Passwords does not match.";
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
