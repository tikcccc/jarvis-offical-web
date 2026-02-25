"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronDown,
  MapPin,
  Timer,
  Users,
} from "lucide-react";
import type { Career } from "@/sanity/lib/types";
import { Link } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  formatDate,
  formatEmploymentType,
  formatExperience,
  formatWorkModel,
} from "./careers-formatters";
import styles from "./careers-list.module.css";
import {
  isAvailableLanguageTag,
  sourceLanguageTag,
  type AvailableLanguageTag,
} from "@/paraglide/runtime";
import * as m from "@/paraglide/messages";

type FilterOption = {
  value: string;
  label: string;
  order: number;
};

type Job = {
  id: string;
  slug: string;
  title: string;
  teamKey: string;
  teamTitle: string;
  teamOrder: number;
  categoryTitle: string;
  categoryOrder: number;
  location: string;
  employmentTypeLabel?: string | null;
  workModelLabel?: string | null;
  experienceLabel?: string | null;
  postedAt?: string | null;
  expiresAt?: string | null;
};

type Labels = {
  role: string;
  location: string;
  workMode: string;
  apply: string;
  seniority: string;
  posted: string;
  deadline: string;
  positionsFound: string;
  allTeams: string;
  clearFilter: string;
  roleFallback: string;
  flexible: string;
  teamEmpty: string;
  categoryEmpty: string;
  listEmpty: string;
};

const FILTER_ALL = "all";

type MessageFn = (params?: Record<string, never>, options?: { languageTag?: AvailableLanguageTag }) => string;

const translate = (fn: MessageFn, languageTag: AvailableLanguageTag) =>
  fn({}, { languageTag });

const normalizeCareers = (
  careers: Career[],
  locale: AvailableLanguageTag
): Job[] =>
  careers.map((career) => {
    const locations = (career.locations || [])
      .map((loc) => loc?.title)
      .filter(Boolean) as string[];

    const teamTitle =
      career.team?.title || translate(m.careers_team_default, locale);
    const teamKey = career.team?.slug?.current || career.team?._id || teamTitle;
    const pillarTitle =
      career.team?.pillar?.title || translate(m.careers_pillar_default, locale);

    return {
      id: career._id,
      slug: career.slug?.current || career._id,
      title: career.title,
      teamKey,
      teamTitle,
      teamOrder: career.team?.sortOrder ?? 999,
      categoryTitle: pillarTitle,
      categoryOrder: career.team?.pillar?.sortOrder ?? 999,
      location: locations[0] || translate(m.careers_location_default, locale),
      employmentTypeLabel:
        formatEmploymentType(career.employmentType, locale) ||
        translate(m.careers_role_fallback, locale),
      workModelLabel:
        formatWorkModel(career.workModel, locale) ||
        translate(m.careers_flexible, locale),
      experienceLabel: formatExperience(career.experienceLevel, locale),
      postedAt: career.postedAt || null,
      expiresAt: career.expiresAt || null,
    };
  });

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  icon?: React.ElementType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return;
      if (!ref.current) return;
      const target = event.target as Node | null;
      if (target && !ref.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedLabel =
    value === FILTER_ALL
      ? label
      : options.find((opt) => opt.value === value)?.label || label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          styles.filterButton,
          "font-body-base",
          value !== FILTER_ALL ? styles.filterButtonActive : styles.filterButtonInactive
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {Icon && <Icon size={14} />}
        {selectedLabel}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={cn(styles.dropdownMenu, styles.fadeInUp)}
        >
          <button
            type="button"
            role="option"
            aria-selected={value === FILTER_ALL}
            onClick={() => {
              onChange(FILTER_ALL);
              setIsOpen(false);
            }}
            className={cn(
              styles.dropdownOption,
              "font-body-base",
              value === FILTER_ALL && styles.dropdownOptionSelected
            )}
          >
            {label}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={value === opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                styles.dropdownOption,
                "font-body-base",
                value === opt.value && styles.dropdownOptionSelected
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const HoverCard = ({
  job,
  labels,
  locale,
}: {
  job: Job;
  labels: Labels;
  locale: AvailableLanguageTag;
}) => (
  <div className={cn(styles.hoverCard, styles.fadeInUp, "font-legal")}>
    <div className={styles.hoverCardHeader}>
      <div className={cn(styles.hoverCardTeam, "font-body-base font-semibold max-w-[70%] truncate")}>
        {job.teamTitle}
      </div>
      <span className={cn(styles.hoverCardBadge, "font-legal")}>
        {job.employmentTypeLabel || labels.roleFallback}
      </span>
    </div>

    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className={cn(styles.hoverCardMetaKey, "font-legal")}>
          <Briefcase size={12} />
          <span>{labels.seniority}</span>
        </div>
        <div className={cn(styles.hoverCardMetaValue, "font-legal")}>
          {job.experienceLabel || "—"}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className={cn(styles.hoverCardMetaKey, "font-legal")}>
          <MapPin size={12} />
          <span>{labels.location}</span>
        </div>
        <div className={cn(styles.hoverCardMetaValue, "font-legal")}>
          {job.location}
        </div>
      </div>

      {job.postedAt && (
        <div className="flex justify-between items-center">
          <div className={cn(styles.hoverCardMetaKey, "font-legal")}>
            <Calendar size={12} />
            <span>{labels.posted}</span>
          </div>
          <div className={cn(styles.hoverCardMetaValue, "font-legal")}>
            {formatDate(job.postedAt, locale)}
          </div>
        </div>
      )}

      {job.expiresAt && (
        <div className={cn(styles.hoverCardDeadlineRow, "flex justify-between items-center")}>
          <div className={cn(styles.hoverCardMetaKey, "font-legal")}>
            <Timer size={12} />
            <span>{labels.deadline}</span>
          </div>
          <div className={cn(styles.hoverCardDeadlineValue, "font-legal")}>
            {formatDate(job.expiresAt, locale)}
          </div>
        </div>
      )}
    </div>
  </div>
);

const SingleTeamListView = ({
  jobs,
  labels,
  locale,
}: {
  jobs: Job[];
  labels: Labels;
  locale: AvailableLanguageTag;
}) => {
  return (
    <div className={cn(styles.fadeIn, "container-content flex flex-col gap-0")}>
      <div
        className={cn(
          styles.listHeaderRow,
          "hidden md:grid grid-cols-12 gap-4 pb-4 mb-2 px-2 font-legal uppercase tracking-[0.24em] font-semibold"
        )}
      >
        <div className="col-span-5">{labels.role}</div>
        <div className="col-span-2">{labels.seniority}</div>
        <div className="col-span-2">{labels.location}</div>
        <div className="col-span-2">{labels.workMode}</div>
        <div className="col-span-1 text-right">{labels.apply}</div>
      </div>

      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Link
            key={job.id}
            href={`/careers/${job.slug}`}
            className={cn(
              styles.listRow,
              "group relative grid grid-cols-1 md:grid-cols-12 gap-4 py-5 items-center px-2"
            )}
          >
            <div className="col-span-5 relative">
              <span className={cn(styles.listRowTitle, "font-body-base")}>
                {job.title}
              </span>

              <div className={cn(styles.listRowMobileMeta, "md:hidden flex gap-2 mt-1 font-legal")}>
                <span>{job.location}</span> •{" "}
                <span>{job.employmentTypeLabel || labels.roleFallback}</span>
              </div>

              <div
                className={cn(
                  styles.hoverPopover,
                  "absolute left-10 bottom-full mb-2 hidden group-hover:block pointer-events-none transform -translate-x-0"
                )}
              >
                <HoverCard job={job} labels={labels} locale={locale} />
                <div className={styles.popoverArrow} />
              </div>
            </div>

            <div className={cn(styles.listRowMeta, "hidden md:block col-span-2 font-body-base")}>
              {job.experienceLabel || "—"}
            </div>
            <div className={cn(styles.listRowMeta, "hidden md:block col-span-2 font-body-base")}>
              {job.location}
            </div>
            <div className={cn(styles.listRowMeta, "hidden md:block col-span-2 font-body-base")}>
              <span className={styles.workModelBadge}>
                {job.workModelLabel || "—"}
              </span>
            </div>
            <div className="hidden md:flex col-span-1 text-right justify-end">
              <span className={styles.applyIcon}>
                <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))
      ) : (
        <div className={cn(styles.emptyState, "font-body-base italic")}>
          {labels.teamEmpty}
        </div>
      )}
    </div>
  );
};

const NewspaperItem = ({
  job,
  labels,
  locale,
}: {
  job: Job;
  labels: Labels;
  locale: AvailableLanguageTag;
}) => (
  <div className="relative group">
    <Link
      href={`/careers/${job.slug}`}
      className={cn(styles.newspaperItemRow, "flex justify-between items-start py-3")}
    >
      <div className="flex flex-col gap-1 pr-4">
        <h4 className={cn(styles.newspaperItemTitle, "font-body-base leading-snug")}>
          {job.title}
        </h4>
        <div className={cn(styles.newspaperMeta, "flex items-center gap-3 font-legal uppercase tracking-[0.2em]")}>
          <span>{job.location}</span>
          <span className={cn(styles.newspaperDot, "w-1 h-1 rounded-full")} />
          <span>{job.workModelLabel || labels.flexible}</span>
        </div>
      </div>
      <ArrowRight
        size={14}
        className={cn(styles.newspaperArrow, "flex-shrink-0 mt-1")}
      />
    </Link>

    <div
      className={cn(
        styles.hoverPopover,
        "absolute left-0 bottom-full mb-2 hidden group-hover:block pointer-events-none transform -translate-x-2"
      )}
    >
      <HoverCard job={job} labels={labels} locale={locale} />
      <div className={styles.popoverArrow} />
    </div>
  </div>
);

type CategoryGroup = {
  key: string;
  title: string;
  order: number;
  teams: Array<{
    key: string;
    title: string;
    order: number;
    jobs: Job[];
  }>;
};

const groupForNewspaperLayout = (data: Job[]): CategoryGroup[] => {
  const categories = new Map<
    string,
    {
      key: string;
      title: string;
      order: number;
      teams: Map<
        string,
        { key: string; title: string; order: number; jobs: Job[] }
      >;
    }
  >();

  data.forEach((job) => {
    const categoryKey = job.categoryTitle;
    const category =
      categories.get(categoryKey) ||
      (() => {
        const next = {
          key: categoryKey,
          title: job.categoryTitle,
          order: job.categoryOrder,
          teams: new Map<
            string,
            { key: string; title: string; order: number; jobs: Job[] }
          >(),
        };
        categories.set(categoryKey, next);
        return next;
      })();

    category.order = Math.min(category.order, job.categoryOrder);

    const team =
      category.teams.get(job.teamKey) ||
      (() => {
        const next = {
          key: job.teamKey,
          title: job.teamTitle,
          order: job.teamOrder,
          jobs: [] as Job[],
        };
        category.teams.set(job.teamKey, next);
        return next;
      })();

    team.order = Math.min(team.order, job.teamOrder);
    team.jobs.push(job);
  });

  return Array.from(categories.values())
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map((category) => ({
      key: category.key,
      title: category.title,
      order: category.order,
      teams: Array.from(category.teams.values()).sort(
        (a, b) => a.order - b.order || a.title.localeCompare(b.title)
      ),
    }));
};

const NewspaperLayout = ({
  data,
  labels,
  locale,
}: {
  data: Job[];
  labels: Labels;
  locale: AvailableLanguageTag;
}) => {
  const groupedData = useMemo(() => groupForNewspaperLayout(data), [data]);

  return (
    <div className={cn(styles.fadeIn, "grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20")}>
      {groupedData.map((category) => (
        <div key={category.key} className="flex flex-col gap-10">
          <h2 className={cn(styles.newspaperCategoryTitle, "font-container-subtitle tracking-tight mb-2")}>
            {category.title}
          </h2>

          {category.teams.length > 0 ? (
            category.teams.map((team) => (
              <div key={team.key} className="mb-4">
                <h3 className={cn(styles.newspaperTeamTitle, "font-label-sm mb-4 flex items-center gap-2")}>
                  {team.title}
                </h3>
                <div className="flex flex-col gap-1">
                  {team.jobs.map((job) => (
                    <NewspaperItem key={job.id} job={job} labels={labels} locale={locale} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className={cn(styles.emptyState, "font-body-base italic mt-2")}>
              {labels.categoryEmpty}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function CareersListClient({ careers }: { careers: Career[] }) {
  const currentLocale = useLocale();
  const locale = (isAvailableLanguageTag(currentLocale) ? currentLocale : sourceLanguageTag) as AvailableLanguageTag;
  const t = (fn: MessageFn) => fn({}, { languageTag: locale });
  const labels: Labels = {
    role: t(m.careers_role_label),
    location: t(m.careers_location_label),
    workMode: t(m.careers_work_mode_label),
    apply: t(m.careers_apply_label),
    seniority: t(m.careers_seniority_label),
    posted: t(m.careers_posted_label),
    deadline: t(m.careers_deadline_label),
    positionsFound: t(m.careers_positions_found),
    allTeams: t(m.careers_filter_all_teams),
    clearFilter: t(m.careers_filter_clear),
    roleFallback: t(m.careers_role_fallback),
    flexible: t(m.careers_flexible),
    teamEmpty: t(m.careers_team_empty),
    categoryEmpty: t(m.careers_category_empty),
    listEmpty: t(m.careers_empty_list),
  };

  const jobs = useMemo(() => normalizeCareers(careers, locale), [careers, locale]);
  const [filterTeam, setFilterTeam] = useState(FILTER_ALL);

  const teamOptions = useMemo(() => {
    const map = new Map<string, FilterOption>();
    jobs.forEach((job) => {
      if (!map.has(job.teamKey)) {
        map.set(job.teamKey, {
          value: job.teamKey,
          label: job.teamTitle,
          order: job.teamOrder,
        });
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => a.order - b.order || a.label.localeCompare(b.label)
    );
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (filterTeam === FILTER_ALL) return jobs;
    return jobs.filter((job) => job.teamKey === filterTeam);
  }, [jobs, filterTeam]);

  if (!jobs.length) {
    return (
      <section className="container-content section-padding pb-24">
        <div className={cn(styles.emptyCard, "p-8 text-center")}>
          <p className={cn(styles.emptyCardText, "font-body-lg")}>
            {labels.listEmpty}
          </p>
        </div>
      </section>
    );
  }

  const showNewspaperLayout = filterTeam === FILTER_ALL;

  return (
    <section className="container-content section-padding pb-24">
      <div className={styles.fadeIn}>
        <div className={styles.controlsBar}>
          <div className="flex items-center gap-4">
            {filterTeam !== FILTER_ALL && (
              <button
                type="button"
                onClick={() => setFilterTeam(FILTER_ALL)}
                className={styles.clearFilterButton}
                title={labels.clearFilter}
              >
                <ArrowLeft size={14} />
              </button>
            )}

            <div className="flex flex-wrap gap-6 w-full md:w-auto">
              <FilterDropdown
                label={labels.allTeams}
                value={filterTeam}
                options={teamOptions}
                onChange={setFilterTeam}
                icon={Users}
              />
            </div>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <span className={cn(styles.resultCount, "font-legal uppercase tracking-[0.24em] font-semibold")}>
              {filteredJobs.length} {labels.positionsFound}
            </span>
          </div>
        </div>

        <div className="min-h-[500px]">
          {showNewspaperLayout ? (
            <NewspaperLayout data={filteredJobs} labels={labels} locale={locale} />
          ) : (
            <SingleTeamListView jobs={filteredJobs} labels={labels} locale={locale} />
          )}
        </div>
      </div>
    </section>
  );
}
