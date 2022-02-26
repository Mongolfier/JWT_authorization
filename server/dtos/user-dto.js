module.exports = class UserDto {
  email;
  id;
  isActivated;

  constructor(model) {
    this.email = model.mail;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
}