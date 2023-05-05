import { UnauthorizedError, expressjwt } from "express-jwt";
import Logger from "../../utils/logger";
import config from "../../../config/app-config";
import {
  Forbidden,
  HasToReset,
  InternalServerError,
  Unauthorized,
} from "../error/http-error";
import {
  ResourceForbiddenError,
  UserHasToResetError,
} from "../../../modules/users/domain";
import * as dotenv from "dotenv";
dotenv.config();

const authorize = (roles: number[] = []) => {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressjwt({ secret: config.JWT_SECRET!, algorithms: ["HS256"] }),

    async (req: any, res: any, next: any) => {
      try {
        if (req.auth.hasToReset && req.path !== "/reset/") {
          throw new UserHasToResetError();
        }
        if (roles.length && !roles.includes(req.auth.role)) {
          throw new ResourceForbiddenError();
        }

        next();
      } catch (error) {
        if (error instanceof UserHasToResetError) {
          Logger.warn(
            `:${req.socket.remoteAddress} : ${req.email} : hasToReset : Reset password required`
          );
          res.send(HasToReset(error.message));
        } else if (error instanceof ResourceForbiddenError) {
          Logger.error(
            `:${req.socket.remoteAddress} : Acceso a recurso no autorizado`
          );
          res.send(Forbidden(error.message));
        } else if (error instanceof UnauthorizedError) {
          Logger.error(
            `:${req.socket.remoteAddress} : ${req.email} : unauthorized : Invalid token`
          );
          res.send(Unauthorized(error.message));
        } else {
          Logger.error(
            `:${req.socket.remoteAddress} : ${req.email} : Internal server error`
          );
          res.send(InternalServerError(error));
        }
      }
    },
  ];
};

export default authorize;
