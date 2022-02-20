const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const MailService = require("./mail-service");

class UserService {
  async regictration(email, password) {
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      throw new Error(`User with this email (${email}) already exist`);
    }
    const hashPassword = await bcrypt(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({email, password: hashPassword});
    await MailService.sendActivationMail(email, activationLink)
  }
}

module.exports = new UserService;