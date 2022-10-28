<template>
  <header>
    <ul>
      <div v-if="token">
        <li>
          <router-link to="/user"><h3>Manage User</h3></router-link>
        </li>
        <li>
          <router-link to="/pet"><h3>Manage Pet</h3></router-link>
        </li>
      </div>
      <li class="right" v-if="token">
        <a>
          <h3 @click="signOut">Sign Out</h3>
        </a>
      </li>
      <li class="right" v-else>
        <router-link to="/signin">
          <h3>Sign In</h3>
        </router-link>
      </li>
    </ul>
  </header>
</template>

<script>
export default {
  data() {
    return {
      token: window.localStorage.getItem("token"),
    };
  },
  methods: {
    signOut() {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("idToken");
      window.localStorage.removeItem("refreshToken");
      this.$router.replace("/signin");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
  },
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  margin: auto 10px;
}
a {
  color: #000000;
  text-decoration: none;
}
a:hover {
  background-color: #33a170;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
  height: 4rem;
}
li {
  float: left;
  align-content: center;
}
li a {
  display: block;
  color: white;
  text-align: center;
  padding: 18px 16px;
  text-decoration: none;
  height: 50%;
}
.right {
  float: right;
  cursor: pointer;
}
</style>
