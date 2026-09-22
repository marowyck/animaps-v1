import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  check() {
    return {
      ok: true,
      service: "@animaps/api",
      database: this.prisma.isConnected() ? "up" : "down",
      ts: new Date().toISOString(),
    };
  }
}
