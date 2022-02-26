const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const tokenService = require("./token-service");
const MailService = require("./mail-service");
const UserDto = require("../dtos/user-dto");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      throw new Error(`User with this email (${email}) already exist`);
    }
    const hashPassword = await bcrypt(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({email, password: hashPassword});
    await MailService.sendActivationMail(email, activationLink);

    const userDto = new UserDto(user); // id, isActivated, email
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }
}

module.exports = new UserService;