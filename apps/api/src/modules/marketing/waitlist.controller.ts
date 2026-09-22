import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { CreateWaitlistDto } from "./create-waitlist.dto";
import { WaitlistService } from "./waitlist.service";

@Controller("marketing")
export class WaitlistController {
  constructor(private readonly waitlist: WaitlistService) {}

  @Post("waitlist")
  @HttpCode(201)
  create(@Body() body: CreateWaitlistDto) {
    return this.waitlist.createLead(body);
  }
}
