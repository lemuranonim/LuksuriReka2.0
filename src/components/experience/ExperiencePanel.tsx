import { text, type Locale } from "@/lib/site-content";
import type { ExperienceStage } from "@/lib/experience";
import ExperiencePoster from "./ExperiencePoster";
import { ExperienceReplay } from "./ExperienceRoot";

export default function ExperiencePanel({ kind, locale }: { kind: ExperienceStage; locale: Locale }) {
  const description = {
    identity: text(locale, "Simbol Luksuri Reka dalam komposisi bidang dan cahaya.", "The Luksuri Reka symbol in a composition of planes and light."),
    solutions: text(locale, "Tiga bidang saling terhubung, mewakili website, aplikasi operasional, dan integrasi.", "Three connected planes representing websites, operations applications, and integration."),
    work: text(locale, "Bidang yang memperlihatkan skema hubungan antarbagian dalam alur kerja.", "A display showing how parts connect in a workflow diagram."),
  };
  return <figure className={`lr-experience-panel lr-experience-${kind}`}>
    <div className="lr-experience-frame" data-lr-stage={kind} role="img" aria-label={description[kind]}>
      <ExperiencePoster kind={kind} />
      <div className="lr-experience-coordinates" aria-hidden="true"><span>LR / {kind === "identity" ? "01" : kind === "solutions" ? "03" : "04"}</span><span>{kind === "identity" ? "IDEA → FORM" : kind === "solutions" ? "FORM → SYSTEM" : "SYSTEM → WORK"}</span></div>
    </div>
    <figcaption><span>{kind === "identity" ? text(locale, "Dari bentuk, menuju fungsi.", "From form, to function.") : kind === "solutions" ? text(locale, "Satu kebutuhan bisa menghubungkan beberapa kemampuan.", "One need can bring several capabilities together.") : text(locale, "SKEMA ALUR · Dari konteks pengguna menuju bagian yang saling terhubung.", "WORKFLOW DIAGRAM · From user context to connected parts.")}</span><ExperienceReplay locale={locale} stage={kind} /></figcaption>
  </figure>;
}
