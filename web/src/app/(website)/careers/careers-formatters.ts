import type { CmsCareer as Career } from "@/strapi/lib";
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

const workModelMessages: Record<NonNullable<Career["workModel"]>, MessageFn> = {
  onsite: m.careers_work_model_onsite,
  hybrid: m.careers_work_model_hybrid,
  remote: m.careers_work_model_remote,
  "现场办公": m.careers_work_model_onsite,
  "混合办公": m.careers_work_model_hybrid,
  "远程办公": m.careers_work_model_remote,
};

const employmentTypeMessages: Record<
  NonNullable<Career["employmentType"]>,
  MessageFn
> = {
  "full-time": m.careers_employment_full_time,
  "part-time": m.careers_employment_part_time,
  contract: m.careers_employment_contract,
  internship: m.careers_employment_internship,
  temporary: m.careers_employment_temporary,
  "全职": m.careers_employment_full_time,
  "兼职": m.careers_employment_part_time,
  "合同制": m.careers_employment_contract,
  "实习": m.careers_employment_internship,
  "临时": m.careers_employment_temporary,
};

const experienceMessages: Record<
  NonNullable<Career["experienceLevel"]>,
  MessageFn
> = {
  intern: m.careers_experience_intern,
  junior: m.careers_experience_junior,
  mid: m.careers_experience_mid,
  senior: m.careers_experience_senior,
  lead: m.careers_experience_lead,
  director: m.careers_experience_director,
  "实习生": m.careers_experience_intern,
  "初级": m.careers_experience_junior,
  "中级": m.careers_experience_mid,
  "高级": m.careers_experience_senior,
  "主管": m.careers_experience_lead,
  "总监": m.careers_experience_director,
};

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
  const message = value ? workModelMessages[value] : undefined;
  return message ? translate(message, lang) : null;
};

export const formatEmploymentType = (value?: Career["employmentType"], locale?: AvailableLanguageTag) => {
  const lang = resolveLanguage(locale ?? getLanguageTag());
  const message = value ? employmentTypeMessages[value] : undefined;
  return message ? translate(message, lang) : null;
};

export const formatExperience = (value?: Career["experienceLevel"], locale?: AvailableLanguageTag) => {
  const lang = resolveLanguage(locale ?? getLanguageTag());
  const message = value ? experienceMessages[value] : undefined;
  return message ? translate(message, lang) : null;
};
