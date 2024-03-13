function populate(jwt, user, registration) {
  jwt.tenant = {};
  jwt.fullName = user.fullName;
  jwt.settings = user.data.settings ? user.data.settings : {};
}
