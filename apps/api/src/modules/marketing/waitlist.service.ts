import { BadRequestException, Injectable } from "@nestjs/common";
import { WaitlistProfileType } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { CreateWaitlistDto } from "./create-waitlist.dto";

@Injectable()
export class WaitlistService {
  constructor(private readonly prisma: PrismaService) {}

  async createLead(dto: CreateWaitlistDto): Promise<{ ok: true }> {
    if (!dto.lgpdConsent) {
      throw new BadRequestException({
        error: {
          code: "LGPD_REQUIRED",
          message: "lgpd_consent_required",
        },
      });
    }

    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.waitlistEntry.findUnique({
      where: { email },
    });

    // Idempotent success when the same email is already on the waitlist.
    if (existing) {
      return { ok: true };
    }

    await this.prisma.waitlistEntry.create({
      data: {
        name: dto.name.trim(),
        email,
        profileType: dto.profileType as WaitlistProfileType,
        city: dto.city?.trim() || null,
        state: dto.state?.trim() || null,
        lgpdConsentAt: new Date(),
        privacyPolicyVersion: dto.privacyPolicyVersion?.trim() || "v1-draft",
      },
    });

    return { ok: true };
  }
}
