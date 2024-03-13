function populate(jwt, user, registration) {
  jwt.roles = registration.roles;
  jwt.settings = user.data.settings ? user.data.settings : {};
}
