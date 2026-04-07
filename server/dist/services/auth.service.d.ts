declare class AuthService {
    signupUser(userData: any): Promise<import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    loginUser(identifier: string, passwordInput: string): Promise<{
        user: import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models/User").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        token: string;
    }>;
}
export default AuthService;
//# sourceMappingURL=auth.service.d.ts.map