"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/Button";
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
import { mockVerifySelfie } from "@/features/verification/mockVerifySelfie";
import { useT } from "@/i18n";
import { OnboardingLayout } from "../OnboardingLayout";
import { useOnboarding } from "../OnboardingProvider";
import { useOnboardingNavigation } from "../useOnboardingNavigation";

export function SelfieVerification() {
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
          <div className="space-y-3 rounded-[1.75rem] bg-surface-accent p-3">
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
          </div>
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
          <Button
            variant="pink"
            size="md"
            className="w-full"
            onClick={() => void openCamera()}
          >
            <Camera className="size-4" aria-hidden />
            {t.onboarding.verification.capture}
          </Button>
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
