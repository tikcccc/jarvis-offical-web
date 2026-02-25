import type { Career } from "@/sanity/lib/types";
import * as m from "@/paraglide/messages";
import {
  isAvailableLanguageTag,
  languageTag as getLanguageTag,
  sourceLanguageTag,
  type AvailableLanguageTag,
} from "@/paraglide/runtime";

const resolveLanguage = (tag?: string): AvailableLanguageTag =>
  isAvailableLanguageTag(tag) ? tag : sourceLanguageTag;

const toIntlLocale = (lang: AvailableLanguageTag) =>
  lang === "zh" ? "zh-HK" : "en-US";

type MessageFn = (params?: Record<string, never>, options?: { languageTag?: AvailableLanguageTag }) => string;

const translate = (fn: MessageFn, lang: AvailableLanguageTag) =>
  fn({}, { languageTag: lang });

export const formatDate = (value?: string | null, locale?: AvailableLanguageTag) => {
  if (!value) return null;
  const lang = resolveLanguage(locale ?? getLanguageTag());
  try {
    return new Intl.DateTimeFormat(toIntlLocale(lang), {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
};

export const formatWorkModel = (value?: Career["workModel"], locale?: AvailableLanguageTag) => {
  const lang = resolveLanguage(locale ?? getLanguageTag());
  switch (value) {
    case "onsite":
      return translate(m.careers_work_model_onsite, lang);
    case "hybrid":
      return translate(m.careers_work_model_hybrid, lang);
    case "remote":
      return translate(m.careers_work_model_remote, lang);
    default:
      return null;
  }
};

export const formatEmploymentType = (value?: Career["employmentType"], locale?: AvailableLanguageTag) => {
  const lang = resolveLanguage(locale ?? getLanguageTag());
  switch (value) {
    case "full-time":
      return translate(m.careers_employment_full_time, lang);
    case "part-time":
      return translate(m.careers_employment_part_time, lang);
    case "contract":
      return translate(m.careers_employment_contract, lang);
    case "internship":
      return translate(m.careers_employment_internship, lang);
    case "temporary":
      return translate(m.careers_employment_temporary, lang);
    default:
      return null;
  }
};

export const formatExperience = (value?: Career["experienceLevel"], locale?: AvailableLanguageTag) => {
  const lang = resolveLanguage(locale ?? getLanguageTag());
  switch (value) {
    case "intern":
      return translate(m.careers_experience_intern, lang);
    case "junior":
      return translate(m.careers_experience_junior, lang);
    case "mid":
      return translate(m.careers_experience_mid, lang);
    case "senior":
      return translate(m.careers_experience_senior, lang);
    case "lead":
      return translate(m.careers_experience_lead, lang);
    case "director":
      return translate(m.careers_experience_director, lang);
    default:
      return null;
  }
};
