-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('person', 'ong', 'veterinary_clinic', 'other', 'public_agency', 'biologist');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'pending_verification', 'suspended');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('person', 'organization', 'institution');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('ngo', 'animal_shelter', 'veterinary_clinic', 'veterinary_hospital', 'animal_business', 'animal_service', 'private_institution', 'other');

-- CreateEnum
CREATE TYPE "InstitutionVerificationStatus" AS ENUM ('draft', 'pending_verification', 'under_review', 'approved', 'rejected', 'suspended');

-- CreateEnum
CREATE TYPE "JurisdictionType" AS ENUM ('national', 'state', 'municipal', 'regional', 'local');

-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('platform', 'organization', 'institution');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('invited', 'active', 'suspended', 'left');

-- CreateEnum
CREATE TYPE "CaseSource" AS ENUM ('citizen', 'ngo', 'veterinary', 'institution', 'system', 'import', 'api', 'partner');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('new', 'triage', 'under_review', 'assigned', 'in_progress', 'waiting_information', 'resolved', 'closed', 'cancelled', 'duplicate', 'invalid');

-- CreateEnum
CREATE TYPE "CaseCitizenStatus" AS ENUM ('registered_on_platform', 'awaiting_routing', 'routed', 'received', 'under_analysis', 'in_progress', 'resolved');

-- CreateEnum
CREATE TYPE "CasePriority" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "ReporterVisibility" AS ENUM ('public', 'restricted', 'confidential', 'anonymous');

-- CreateEnum
CREATE TYPE "DataClassification" AS ENUM ('public', 'internal', 'restricted', 'confidential', 'sensitive');

-- CreateEnum
CREATE TYPE "LocationPrecision" AS ENUM ('exact', 'approximate', 'city', 'region', 'hidden');

-- CreateEnum
CREATE TYPE "CaseCommentVisibility" AS ENUM ('internal', 'public');

-- CreateEnum
CREATE TYPE "CaseParticipantRole" AS ENUM ('reporter', 'assignee', 'observer', 'routed_institution', 'origin_organization', 'responder');

-- CreateEnum
CREATE TYPE "CaseRoutingReason" AS ENUM ('initial', 'no_competence', 'out_of_region', 'out_of_type', 'partnership', 'specialization', 'other');

-- CreateEnum
CREATE TYPE "IntegrationSyncStatus" AS ENUM ('pending', 'syncing', 'success', 'failed', 'retrying', 'disabled');

-- CreateEnum
CREATE TYPE "OtherRole" AS ENUM ('independent_protector', 'foster_home', 'volunteer', 'animal_professional', 'animal_business', 'community_member', 'other');

-- CreateEnum
CREATE TYPE "AvailableSpace" AS ENUM ('small_apartment', 'large_apartment', 'house_with_yard', 'farm');

-- CreateEnum
CREATE TYPE "AvailableTime" AS ENUM ('low', 'moderate', 'high');

-- CreateEnum
CREATE TYPE "PreferredSize" AS ENUM ('small', 'medium', 'large', 'any');

-- CreateEnum
CREATE TYPE "PreferredSpecies" AS ENUM ('dog', 'cat', 'other', 'any');

-- CreateEnum
CREATE TYPE "AnimalSpecies" AS ENUM ('dog', 'cat', 'other');

-- CreateEnum
CREATE TYPE "AnimalSize" AS ENUM ('small', 'medium', 'large');

-- CreateEnum
CREATE TYPE "AnimalStatus" AS ENUM ('available', 'in_process', 'adopted');

-- CreateEnum
CREATE TYPE "AdoptionStatus" AS ENUM ('requested', 'under_review', 'approved', 'rejected', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "OccurrenceType" AS ENUM ('abandonment', 'mistreatment', 'vehicle_collision', 'wildlife_sighting', 'lost_animal', 'found_animal');

-- CreateEnum
CREATE TYPE "OccurrenceStatus" AS ENUM ('open', 'in_progress', 'resolved', 'invalid');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('organization_verified', 'veterinary_verified', 'user_type_changed', 'account_deleted', 'data_exported', 'occurrence_validated', 'institution_verified', 'institution_suspended', 'case_created', 'case_status_changed', 'case_assigned', 'case_routed', 'role_granted', 'membership_changed');

-- CreateEnum
CREATE TYPE "OccurrenceReportReason" AS ENUM ('spam', 'duplicate', 'false_information', 'inappropriate_content');

-- CreateEnum
CREATE TYPE "WaitlistProfileType" AS ENUM ('person', 'ong', 'veterinary_clinic', 'other', 'institution');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('web', 'mobile_ios', 'mobile_android', 'unknown');

-- CreateEnum
CREATE TYPE "PushPlatform" AS ENUM ('ios', 'android');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('user_registered', 'organization_verified', 'veterinary_verified', 'adoption_requested', 'adoption_completed', 'animal_registered_for_matching', 'new_compatible_animal_available', 'occurrence_created', 'occurrence_status_changed', 'occurrence_resolved', 'generic');

-- CreateEnum
CREATE TYPE "UserIntentionKind" AS ENUM ('adopt', 'pet_owner', 'help_animals', 'report', 'lost_animal', 'found_animal', 'community', 'explore', 'volunteer', 'foster_home', 'independent_protector', 'animal_professional', 'lost_pet_owner', 'found_pet_reporter', 'other');

-- CreateEnum
CREATE TYPE "LocationPermission" AS ENUM ('granted', 'denied', 'not_requested');

-- CreateEnum
CREATE TYPE "VerificationKind" AS ENUM ('selfie', 'institutional');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'processing', 'approved', 'rejected', 'retry_required');

-- CreateEnum
CREATE TYPE "PrivacyVisibility" AS ENUM ('public', 'matches', 'private');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('google');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password_hash" TEXT,
    "user_type" "UserType" NOT NULL,
    "account_type" "AccountType",
    "avatar_url" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'active',
    "phone" TEXT,
    "city" TEXT,
    "state" TEXT,
    "lgpd_consent" BOOLEAN NOT NULL DEFAULT false,
    "lgpd_consent_at" TIMESTAMP(3),
    "privacy_policy_version" TEXT,
    "guidelines_accepted_at" TIMESTAMP(3),
    "email_verified_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_profiles" (
    "user_id" UUID NOT NULL,
    "available_space" "AvailableSpace",
    "available_time" "AvailableTime",
    "has_previous_experience" BOOLEAN NOT NULL DEFAULT false,
    "has_other_pets" BOOLEAN NOT NULL DEFAULT false,
    "preferred_size" "PreferredSize",
    "preferred_species" "PreferredSpecies",
    "is_rescuer" BOOLEAN NOT NULL DEFAULT false,
    "tax_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "organization_profiles" (
    "user_id" UUID NOT NULL,
    "company_tax_id" TEXT,
    "trade_name" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "social_links" JSONB,
    "city" TEXT,
    "state" TEXT,
    "area_of_operation" TEXT,
    "animal_types_served" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "has_shelter" BOOLEAN NOT NULL DEFAULT false,
    "does_adoptions" BOOLEAN NOT NULL DEFAULT false,
    "does_rescues" BOOLEAN NOT NULL DEFAULT false,
    "accepts_volunteers" BOOLEAN NOT NULL DEFAULT false,
    "accepts_donations" BOOLEAN NOT NULL DEFAULT false,
    "service_area_radius_km" DECIMAL(10,2),
    "service_capacity" INTEGER,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "veterinary_profiles" (
    "user_id" UUID NOT NULL,
    "company_tax_id" TEXT,
    "trade_name" TEXT,
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "address" TEXT,
    "services_offered" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "business_hours" TEXT,
    "is_24h" BOOLEAN NOT NULL DEFAULT false,
    "emergency_care" BOOLEAN NOT NULL DEFAULT false,
    "home_service" BOOLEAN NOT NULL DEFAULT false,
    "animals_served" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veterinary_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "other_profiles" (
    "user_id" UUID NOT NULL,
    "other_role" "OtherRole",
    "notes" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "other_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_intentions" (
    "user_id" UUID NOT NULL,
    "intention" "UserIntentionKind" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_intentions_pkey" PRIMARY KEY ("user_id","intention")
);

-- CreateTable
CREATE TABLE "interests" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_interests" (
    "user_id" UUID NOT NULL,
    "interest_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interests_pkey" PRIMARY KEY ("user_id","interest_id")
);

-- CreateTable
CREATE TABLE "animal_preferences" (
    "user_id" UUID NOT NULL,
    "species" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sex" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "vaccination" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "neutered" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "special_needs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "compatibility" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "energy_level" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "environment" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animal_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "kind" "VerificationKind" NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "provider" TEXT,
    "provider_ref" TEXT,
    "media_url" TEXT,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_locations" (
    "user_id" UUID NOT NULL,
    "permission" "LocationPermission" NOT NULL DEFAULT 'not_requested',
    "city" TEXT,
    "state" TEXT,
    "neighborhood" TEXT,
    "approx_latitude" DECIMAL(8,3),
    "approx_longitude" DECIMAL(8,3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_locations_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_profile_fields" (
    "user_id" UUID NOT NULL,
    "field_key" TEXT NOT NULL,
    "value" TEXT,
    "visibility" "PrivacyVisibility" NOT NULL DEFAULT 'private',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profile_fields_pkey" PRIMARY KEY ("user_id","field_key")
);

-- CreateTable
CREATE TABLE "auth_identities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "provider_subject" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "user_id" UUID NOT NULL,
    "in_app" BOOLEAN NOT NULL DEFAULT true,
    "email" BOOLEAN NOT NULL DEFAULT true,
    "push" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "animals" (
    "id" UUID NOT NULL,
    "organization_id" UUID,
    "person_id" UUID,
    "veterinary_id" UUID,
    "name" TEXT NOT NULL,
    "species" "AnimalSpecies" NOT NULL,
    "breed" TEXT,
    "estimated_age" TEXT,
    "size" "AnimalSize",
    "temperament" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "health_history" TEXT,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "AnimalStatus" NOT NULL DEFAULT 'available',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_favorites" (
    "user_id" UUID NOT NULL,
    "animal_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animal_favorites_pkey" PRIMARY KEY ("user_id","animal_id")
);

-- CreateTable
CREATE TABLE "adoptions" (
    "id" UUID NOT NULL,
    "animal_id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "organization_id" UUID,
    "compatibility_score" DECIMAL(5,2),
    "status" "AdoptionStatus" NOT NULL DEFAULT 'requested',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adoptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occurrences" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "type" "OccurrenceType" NOT NULL,
    "description" TEXT,
    "location" geography(Point, 4326) NOT NULL,
    "city" TEXT,
    "neighborhood" TEXT,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "OccurrenceStatus" NOT NULL DEFAULT 'open',
    "validated_by" UUID,
    "claim_token_hash" TEXT,
    "geo_consent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occurrence_followers" (
    "occurrence_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "occurrence_followers_pkey" PRIMARY KEY ("occurrence_id","user_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "payload" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "client_type" "ClientType" NOT NULL DEFAULT 'unknown',
    "device_id" TEXT,
    "user_agent" TEXT,
    "revoked_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_push_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "platform" "PushPlatform" NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_push_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist_entries" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_type" "WaitlistProfileType" NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "lgpd_consent_at" TIMESTAMP(3) NOT NULL,
    "privacy_policy_version" TEXT,
    "converted_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "action" "AuditAction" NOT NULL,
    "target_type" TEXT,
    "target_id" UUID,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occurrence_reports" (
    "id" UUID NOT NULL,
    "occurrence_id" UUID NOT NULL,
    "reported_by" UUID,
    "reason" "OccurrenceReportReason" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "occurrence_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "owner_user_id" UUID,
    "organization_type" "OrganizationType" NOT NULL,
    "trade_name" TEXT NOT NULL,
    "legal_name" TEXT,
    "description" TEXT,
    "company_tax_id" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "social_links" JSONB,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'BR',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_types" (
    "id" TEXT NOT NULL,
    "label_key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institution_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutions" (
    "id" UUID NOT NULL,
    "institution_type_id" TEXT NOT NULL,
    "official_name" TEXT NOT NULL,
    "public_name" TEXT NOT NULL,
    "description" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'BR',
    "email" TEXT,
    "email_domain" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "social_links" JSONB,
    "address" TEXT,
    "responsible_department" TEXT,
    "data_responsible_area" TEXT,
    "verification_status" "InstitutionVerificationStatus" NOT NULL DEFAULT 'draft',
    "verified_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_departments" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "parent_department_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_teams" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "department_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_members" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "department_id" UUID,
    "team_id" UUID,
    "status" "MembershipStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_jurisdictions" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "jurisdiction_type" "JurisdictionType" NOT NULL,
    "value" TEXT NOT NULL,
    "country" TEXT DEFAULT 'BR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institution_jurisdictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_capabilities" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "case_type_id" TEXT NOT NULL,
    "accepts" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institution_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_report_policies" (
    "institution_id" UUID NOT NULL,
    "anonymous_reports" BOOLEAN NOT NULL DEFAULT true,
    "required_fields" JSONB,
    "accepted_case_type_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "routing_rules" JSONB,
    "response_visibility" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_report_policies_pkey" PRIMARY KEY ("institution_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "scope" "RoleScope" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "user_platform_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_platform_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'BR',
    "neighborhood" TEXT,
    "postal_code" TEXT,
    "formatted_address" TEXT,
    "precision" "LocationPrecision" NOT NULL DEFAULT 'approximate',
    "privacy_level" "DataClassification" NOT NULL DEFAULT 'restricted',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_types" (
    "id" TEXT NOT NULL,
    "label_key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" UUID NOT NULL,
    "reference_number" TEXT NOT NULL,
    "case_type_id" TEXT NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'new',
    "citizen_status" "CaseCitizenStatus" NOT NULL DEFAULT 'registered_on_platform',
    "priority" "CasePriority" NOT NULL DEFAULT 'medium',
    "source" "CaseSource" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "location_id" UUID,
    "reporter_id" UUID,
    "organization_id" UUID,
    "institution_id" UUID,
    "assigned_user_id" UUID,
    "assigned_team_id" UUID,
    "reporter_visibility" "ReporterVisibility" NOT NULL DEFAULT 'restricted',
    "classification" "DataClassification" NOT NULL DEFAULT 'internal',
    "occurrence_id" UUID,
    "claim_token_hash" TEXT,
    "geo_consent_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_status_history" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "from_status" "CaseStatus",
    "to_status" "CaseStatus" NOT NULL,
    "from_citizen_status" "CaseCitizenStatus",
    "to_citizen_status" "CaseCitizenStatus",
    "actor_id" UUID,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_assignments" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "user_id" UUID,
    "team_id" UUID,
    "assigned_by" UUID,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "case_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_routing" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "from_institution_id" UUID,
    "to_institution_id" UUID,
    "reason" "CaseRoutingReason" NOT NULL DEFAULT 'initial',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_routing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_comments" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "author_id" UUID,
    "body" TEXT NOT NULL,
    "visibility" "CaseCommentVisibility" NOT NULL DEFAULT 'internal',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_attachments" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "mime_type" TEXT,
    "kind" TEXT DEFAULT 'photo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_participants" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "user_id" UUID,
    "role" "CaseParticipantRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_exports" (
    "id" UUID NOT NULL,
    "requested_by_id" UUID,
    "institution_id" UUID,
    "format" TEXT NOT NULL,
    "purpose" TEXT,
    "filters" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_connections" (
    "id" UUID NOT NULL,
    "institution_id" UUID,
    "name" TEXT NOT NULL,
    "provider" TEXT,
    "status" "IntegrationSyncStatus" NOT NULL DEFAULT 'pending',
    "config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_logs" (
    "id" UUID NOT NULL,
    "connection_id" UUID NOT NULL,
    "status" "IntegrationSyncStatus" NOT NULL,
    "message" TEXT,
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integration_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "users_account_type_idx" ON "users"("account_type");

-- CreateIndex
CREATE INDEX "verification_requests_user_id_kind_created_at_idx" ON "verification_requests"("user_id", "kind", "created_at");

-- CreateIndex
CREATE INDEX "auth_identities_user_id_idx" ON "auth_identities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_identities_provider_provider_subject_key" ON "auth_identities"("provider", "provider_subject");

-- CreateIndex
CREATE INDEX "animals_status_idx" ON "animals"("status");

-- CreateIndex
CREATE INDEX "animals_species_size_idx" ON "animals"("species", "size");

-- CreateIndex
CREATE INDEX "animals_deleted_at_idx" ON "animals"("deleted_at");

-- CreateIndex
CREATE INDEX "animal_favorites_animal_id_idx" ON "animal_favorites"("animal_id");

-- CreateIndex
CREATE INDEX "adoptions_animal_id_status_idx" ON "adoptions"("animal_id", "status");

-- CreateIndex
CREATE INDEX "adoptions_person_id_idx" ON "adoptions"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "adoptions_animal_id_person_id_key" ON "adoptions"("animal_id", "person_id");

-- CreateIndex
CREATE UNIQUE INDEX "occurrences_claim_token_hash_key" ON "occurrences"("claim_token_hash");

-- CreateIndex
CREATE INDEX "occurrences_status_type_idx" ON "occurrences"("status", "type");

-- CreateIndex
CREATE INDEX "occurrences_created_at_idx" ON "occurrences"("created_at");

-- CreateIndex
CREATE INDEX "occurrences_city_neighborhood_idx" ON "occurrences"("city", "neighborhood");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_created_at_idx" ON "notifications"("user_id", "read", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_device_id_idx" ON "refresh_tokens"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_token_hash_key" ON "email_verification_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "device_push_tokens_token_key" ON "device_push_tokens"("token");

-- CreateIndex
CREATE INDEX "device_push_tokens_user_id_idx" ON "device_push_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_entries_email_key" ON "waitlist_entries"("email");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_entries_converted_user_id_key" ON "waitlist_entries"("converted_user_id");

-- CreateIndex
CREATE INDEX "waitlist_entries_created_at_idx" ON "waitlist_entries"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit_logs"("actor_id", "created_at");

-- CreateIndex
CREATE INDEX "occurrence_reports_occurrence_id_idx" ON "occurrence_reports"("occurrence_id");

-- CreateIndex
CREATE INDEX "organizations_organization_type_idx" ON "organizations"("organization_type");

-- CreateIndex
CREATE INDEX "organizations_verified_idx" ON "organizations"("verified");

-- CreateIndex
CREATE INDEX "organization_members_user_id_idx" ON "organization_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_organization_id_user_id_key" ON "organization_members"("organization_id", "user_id");

-- CreateIndex
CREATE INDEX "institutions_institution_type_id_idx" ON "institutions"("institution_type_id");

-- CreateIndex
CREATE INDEX "institutions_verification_status_idx" ON "institutions"("verification_status");

-- CreateIndex
CREATE INDEX "institution_departments_institution_id_idx" ON "institution_departments"("institution_id");

-- CreateIndex
CREATE INDEX "institution_teams_institution_id_idx" ON "institution_teams"("institution_id");

-- CreateIndex
CREATE INDEX "institution_members_user_id_idx" ON "institution_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "institution_members_institution_id_user_id_key" ON "institution_members"("institution_id", "user_id");

-- CreateIndex
CREATE INDEX "institution_jurisdictions_institution_id_jurisdiction_type_idx" ON "institution_jurisdictions"("institution_id", "jurisdiction_type");

-- CreateIndex
CREATE INDEX "institution_jurisdictions_value_idx" ON "institution_jurisdictions"("value");

-- CreateIndex
CREATE UNIQUE INDEX "institution_capabilities_institution_id_case_type_id_key" ON "institution_capabilities"("institution_id", "case_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_key_key" ON "roles"("key");

-- CreateIndex
CREATE INDEX "roles_scope_idx" ON "roles"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "permissions_domain_idx" ON "permissions"("domain");

-- CreateIndex
CREATE INDEX "locations_city_state_idx" ON "locations"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "cases_reference_number_key" ON "cases"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "cases_claim_token_hash_key" ON "cases"("claim_token_hash");

-- CreateIndex
CREATE INDEX "cases_status_priority_idx" ON "cases"("status", "priority");

-- CreateIndex
CREATE INDEX "cases_citizen_status_idx" ON "cases"("citizen_status");

-- CreateIndex
CREATE INDEX "cases_case_type_id_idx" ON "cases"("case_type_id");

-- CreateIndex
CREATE INDEX "cases_institution_id_status_idx" ON "cases"("institution_id", "status");

-- CreateIndex
CREATE INDEX "cases_occurrence_id_idx" ON "cases"("occurrence_id");

-- CreateIndex
CREATE INDEX "cases_created_at_idx" ON "cases"("created_at");

-- CreateIndex
CREATE INDEX "case_status_history_case_id_created_at_idx" ON "case_status_history"("case_id", "created_at");

-- CreateIndex
CREATE INDEX "case_assignments_case_id_created_at_idx" ON "case_assignments"("case_id", "created_at");

-- CreateIndex
CREATE INDEX "case_routing_case_id_created_at_idx" ON "case_routing"("case_id", "created_at");

-- CreateIndex
CREATE INDEX "case_comments_case_id_created_at_idx" ON "case_comments"("case_id", "created_at");

-- CreateIndex
CREATE INDEX "case_attachments_case_id_idx" ON "case_attachments"("case_id");

-- CreateIndex
CREATE INDEX "case_participants_case_id_idx" ON "case_participants"("case_id");

-- CreateIndex
CREATE INDEX "data_exports_created_at_idx" ON "data_exports"("created_at");

-- CreateIndex
CREATE INDEX "integration_logs_connection_id_created_at_idx" ON "integration_logs"("connection_id", "created_at");

-- AddForeignKey
ALTER TABLE "person_profiles" ADD CONSTRAINT "person_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_profiles" ADD CONSTRAINT "organization_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veterinary_profiles" ADD CONSTRAINT "veterinary_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "other_profiles" ADD CONSTRAINT "other_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_intentions" ADD CONSTRAINT "user_intentions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_preferences" ADD CONSTRAINT "animal_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profile_fields" ADD CONSTRAINT "user_profile_fields_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_identities" ADD CONSTRAINT "auth_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_veterinary_id_fkey" FOREIGN KEY ("veterinary_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_favorites" ADD CONSTRAINT "animal_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_favorites" ADD CONSTRAINT "animal_favorites_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_validated_by_fkey" FOREIGN KEY ("validated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrence_followers" ADD CONSTRAINT "occurrence_followers_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "occurrences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrence_followers" ADD CONSTRAINT "occurrence_followers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_push_tokens" ADD CONSTRAINT "device_push_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_converted_user_id_fkey" FOREIGN KEY ("converted_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrence_reports" ADD CONSTRAINT "occurrence_reports_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "occurrences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrence_reports" ADD CONSTRAINT "occurrence_reports_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_institution_type_id_fkey" FOREIGN KEY ("institution_type_id") REFERENCES "institution_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_departments" ADD CONSTRAINT "institution_departments_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_departments" ADD CONSTRAINT "institution_departments_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "institution_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_teams" ADD CONSTRAINT "institution_teams_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_teams" ADD CONSTRAINT "institution_teams_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "institution_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "institution_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "institution_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_jurisdictions" ADD CONSTRAINT "institution_jurisdictions_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_capabilities" ADD CONSTRAINT "institution_capabilities_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_capabilities" ADD CONSTRAINT "institution_capabilities_case_type_id_fkey" FOREIGN KEY ("case_type_id") REFERENCES "case_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_report_policies" ADD CONSTRAINT "institution_report_policies_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_platform_roles" ADD CONSTRAINT "user_platform_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_platform_roles" ADD CONSTRAINT "user_platform_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_case_type_id_fkey" FOREIGN KEY ("case_type_id") REFERENCES "case_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_assigned_user_id_fkey" FOREIGN KEY ("assigned_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "occurrences"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_status_history" ADD CONSTRAINT "case_status_history_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_status_history" ADD CONSTRAINT "case_status_history_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_assignments" ADD CONSTRAINT "case_assignments_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_assignments" ADD CONSTRAINT "case_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_assignments" ADD CONSTRAINT "case_assignments_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "institution_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_routing" ADD CONSTRAINT "case_routing_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_routing" ADD CONSTRAINT "case_routing_from_institution_id_fkey" FOREIGN KEY ("from_institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_routing" ADD CONSTRAINT "case_routing_to_institution_id_fkey" FOREIGN KEY ("to_institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_comments" ADD CONSTRAINT "case_comments_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_comments" ADD CONSTRAINT "case_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_attachments" ADD CONSTRAINT "case_attachments_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_participants" ADD CONSTRAINT "case_participants_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_participants" ADD CONSTRAINT "case_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_exports" ADD CONSTRAINT "data_exports_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_connections" ADD CONSTRAINT "integration_connections_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_logs" ADD CONSTRAINT "integration_logs_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "integration_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
