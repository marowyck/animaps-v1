import { Controller, Get } from "@nestjs/common";

/**
 * Identity auth (register/login/refresh) lands in a follow-up Wave 2 slice.
 * Module exists so the modular layout is discoverable from day one.
 */
@Controller("auth")
export class IdentityController {
  @Get("status")
  status() {
    return {
      ok: true,
      implemented: false,
      message: "identity_auth_not_implemented",
    };
  }
}
