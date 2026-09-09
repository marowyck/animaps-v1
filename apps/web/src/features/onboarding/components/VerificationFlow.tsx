"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, FileCheck2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import {
  VerificationStatusBadge,
  type VerificationStatus,
} from "@/components/VerificationStatusBadge";
import {
  ErrorState,
  LoadingState,
  SuccessState,
} from "@/components/StateBlocks";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { mockVerifySelfie } from "@/features/verification/mockVerifySelfie";
import { OnboardingLayout } from "../OnboardingLayout";
import { useOnboarding } from "../OnboardingProvider";
import { useOnboardingNavigation } from "../useOnboardingNavigation";

type VerificationFlowProps = {
  mode?: "selfie" | "institutional";
};

export function VerificationFlow({ mode }: VerificationFlowProps) {
  const { userType } = useOnboarding();
  const resolvedMode =
    mode === "institutional" ||
    userType === "ONG" ||
    userType === "VETERINARY_CLINIC"
      ? "institutional"
      : "selfie";

  if (resolvedMode === "institutional") {
    return <InstitutionalVerification />;
  }

  return <SelfieVerification />;
}

function InstitutionalVerification() {
  const t = useT();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation("verification");
  const status = draft.institutionalVerificationStatus;
  const copy = t.onboarding.verification.institutional;

  const submit = () => {
    dispatch({
      type: "setInstitutionalVerification",
      status: "processing",
    });
    window.setTimeout(() => {
      dispatch({
        type: "setInstitutionalVerification",
        status: "pending",
      });
      nav.goNext({ complete: true });
    }, 800);
  };

  return (
    <OnboardingLayout
      step="verification"
      title={copy.title}
      subtitle={copy.subtitle}
      onContinue={submit}
      continueLabel={copy.submitLabel}
      showSkip
      onSkip={() => nav.goNext({ complete: true })}
    >
      <Card className="mx-auto flex max-w-lg flex-col items-center gap-4 p-6 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-pastel-green text-brand-green">
          <FileCheck2 className="size-7" aria-hidden />
        </span>
        <VerificationStatusBadge
          status={status as VerificationStatus}
          label={t.onboarding.verification.status[status as VerificationStatus]}
        />
        <p className="text-sm text-ink-muted">{copy.pendingBody}</p>
      </Card>
    </OnboardingLayout>
  );
}

function SelfieVerification() {
  const t = useT();
  const { toast } = useToast();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation("verification");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(
    draft.selfiePreviewUrl,
  );

  const status = draft.selfieStatus;
  const statusLabel =
    t.onboarding.verification.status[status as VerificationStatus];

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const openCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      toast({ message: t.onboarding.verification.cameraDenied, tone: "error" });
    }
  };

  const captureSelfie = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92),
    );
    stopCamera();
    if (!blob) return;
    const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    setLocalPreview(url);
    dispatch({ type: "setSelfie", status: "processing", previewUrl: url });
    const result = await mockVerifySelfie(file);
    dispatch({ type: "setSelfie", status: result });
  };

  const finish = () => {
    stopCamera();
    nav.goNext({ complete: true });
  };

  return (
    <OnboardingLayout
      step="verification"
      title={t.onboarding.verification.title}
      subtitle={t.onboarding.verification.subtitle}
      onContinue={
        status === "approved"
          ? finish
          : status === "rejected" || status === "retry_required"
            ? () => void openCamera()
            : undefined
      }
      continueLabel={
        status === "approved"
          ? t.onboarding.verification.goDashboard
          : status === "rejected" || status === "retry_required"
            ? t.onboarding.verification.retry
            : undefined
      }
      showSkip={status === "pending" || status === "processing"}
      onSkip={finish}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <VerificationStatusBadge status={status} label={statusLabel} />
        </div>

        {cameraOpen ? (
          <Card className="space-y-3 overflow-hidden p-3">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="aspect-[3/4] w-full rounded-2xl bg-ink object-cover"
            />
            <Button
              variant="pink"
              size="md"
              className="w-full"
              onClick={() => void captureSelfie()}
            >
              <Camera className="size-4" aria-hidden />
              {t.onboarding.verification.upload}
            </Button>
            <Button variant="ghost" size="sm" className="w-full" onClick={stopCamera}>
              {t.onboarding.close}
            </Button>
          </Card>
        ) : null}

        {!cameraOpen && localPreview && status !== "pending" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={localPreview}
            alt=""
            className="mx-auto max-h-56 rounded-3xl border-2 border-border-soft object-cover"
          />
        ) : null}

        {status === "pending" && !cameraOpen ? (
          <Card className="space-y-3">
            <Button
              variant="pink"
              size="md"
              className="w-full"
              onClick={() => void openCamera()}
            >
              <Camera className="size-4" aria-hidden />
              {t.onboarding.verification.capture}
            </Button>
          </Card>
        ) : null}

        {status === "processing" ? (
          <LoadingState
            title={t.onboarding.verification.analyzingTitle}
            description={t.onboarding.verification.analyzingBody}
          />
        ) : null}

        {status === "approved" ? (
          <SuccessState
            title={t.onboarding.verification.approvedTitle}
            description={t.onboarding.verification.approvedBody}
            action={
              <Button variant="pink" size="sm" onClick={finish}>
                {t.onboarding.verification.goDashboard}
              </Button>
            }
          />
        ) : null}

        {(status === "rejected" || status === "retry_required") && !cameraOpen ? (
          <ErrorState
            title={
              status === "rejected"
                ? t.onboarding.verification.rejectedTitle
                : t.onboarding.verification.retryTitle
            }
            description={
              status === "rejected"
                ? t.onboarding.verification.rejectedBody
                : t.onboarding.verification.retryBody
            }
            action={
              <Button variant="pink" size="sm" onClick={() => void openCamera()}>
                {t.onboarding.verification.retry}
              </Button>
            }
          />
        ) : null}
      </div>
    </OnboardingLayout>
  );
}
