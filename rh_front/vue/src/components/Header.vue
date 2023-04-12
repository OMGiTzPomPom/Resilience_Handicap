<template>
<nav id="header" class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
      <router-link to="/" class="navbar-brand">RH</router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
          <router-link to="/users" class="nav-link">Users</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
      </div>
    </div>
  </div>
</nav>
</template>

<style scoped>
#header {
    
}
</style>
