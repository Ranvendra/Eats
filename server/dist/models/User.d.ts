import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    userName: string;
    userEmail: string;
    password?: string;
    userPhone: string;
    userAddress: string;
    userCity: string;
    nickName: string;
    gender: string;
    country: string;
    language: string;
    timeZone: string;
    profilePicture: string;
    validatePassword(passwordInput: string): Promise<boolean>;
    getJWT(): string;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map