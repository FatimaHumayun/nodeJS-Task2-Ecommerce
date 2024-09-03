class UserDTO {
  //passing name and email as an obj to constructor params
  //Using because don't want to use/show my password
  constructor({ name, email }) {
    this.name = name;
    this.email = email;
  }
}
module.exports = UserDTO;
