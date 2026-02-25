"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ArrowRight,
  Check,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";
import * as messages from "@/paraglide/messages";
import { submitContactForm } from "@/app/actions/contact-form.action";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/schemas/contact-form.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";

// Map coordinates for 430 Nathan Road, Yau Ma Tei
const lat = 22.30973871039109;
const lon = 114.17166002409992;
const displayLat = lat.toFixed(2);
const displayLon = lon.toFixed(2);
// Expand the bounding box so the embed shows a broader, almost continental view around Hong Kong
const mapViewDelta = 50;
const bbox = `${Math.max(-180, lon - mapViewDelta)}%2C${Math.max(-85, lat - mapViewDelta)}%2C${Math.min(180, lon + mapViewDelta)}%2C${Math.min(85, lat + mapViewDelta)}`;
const googleMapsQuery = encodeURIComponent(
  "Hong Kong, 19/F, Nathan Commercial Building, 430 Nathan Road, Yau Ma Tei, Kowloon"
);
const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;

export default function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const searchParams = useSearchParams();
  const serviceOptions = [
    {
      value: "BIM Consultancy",
      label: messages.contact_service_option_bim_consultancy(),
    },
    {
      value: "AI Solutions",
      label: messages.contact_service_option_ai_solutions(),
    },
    {
      value: "Software Training",
      label: messages.contact_service_option_training(),
    },
    {
      value: "3D Modeling",
      label: messages.contact_service_option_modeling(),
    },
    {
      value: "jarvis-desktop",
      label: messages.contact_service_option_jarvis_desktop(),
    },
    {
      value: "jarvis-cloud",
      label: messages.contact_service_option_jarvis_cloud(),
    },
    {
      value: "support",
      label: messages.contact_service_option_support(),
    },
    {
      value: "other",
      label: messages.contact_service_option_other(),
    },
  ];
  const companyTypeOptions = [
    {
      value: "Architectural",
      label: messages.contact_company_type_architectural(),
    },
    {
      value: "Engineering",
      label: messages.contact_company_type_engineering(),
    },
    {
      value: "Contractor",
      label: messages.contact_company_type_contractor(),
    },
    {
      value: "Developer",
      label: messages.contact_company_type_developer(),
    },
    {
      value: "Government",
      label: messages.contact_company_type_government(),
    },
    {
      value: "IT",
      label: messages.contact_company_type_it(),
    },
    {
      value: "Other",
      label: messages.contact_company_type_other(),
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      service: "",
      marketingConsent: false,
    },
  });

  const selectedService = watch("service");
  const selectedCompanyType = watch("companyType");
  const marketingConsent = watch("marketingConsent");
  const prefillEmail =
    searchParams.get("email") ?? searchParams.get("prefillEmail");

  useEffect(() => {
    if (prefillEmail) {
      setValue("email", prefillEmail);
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [prefillEmail, setValue]);

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitContactForm(data, locale);
      if (result.success) {
        setIsSuccess(true);
        reset();
      } else {
        toast.error(messages.contact_error_title(), {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(messages.contact_error_title(), {
        description: messages.contact_error_generic(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`contact-page surface-noise-overlay transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
    >
      {/* Global noise texture overlay */}
      <div className="noise-grain" />

      {/* Main Content */}
        <main className="pb-20 md:pb-22 lg:pb-24 relative z-10">
          {/* Page Header - Swiss Style */}
          <PageHeader
            title={messages.contact_page_title()}
            subtitle={messages.contact_page_subtitle()}
            className="mb-8 md:mb-10 lg:mb-12"
          />

        {/* Main Grid */}
        <div className="container-content">
          <div className="grid lg:grid-cols-12 gap-x-16 gap-y-16">
            {/* Left Column: Contact Info */}
            <div
              className={`lg:col-span-4 flex flex-col gap-12 lg:pt-16 transform transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              {/* Info List */}
              <div className="space-y-10">
                {/* Address */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="contact-info-icon">
                      <MapPin size={20} strokeWidth={2} />
                    </div>
                    <h3 className="contact-info-heading">
                      {messages.contact_info_address()}
                    </h3>
                  </div>
                  <address className="pl-[52px] not-italic contact-info-body leading-relaxed">
                    {messages.contact_address_line1()}
                    <br />
                    {messages.contact_address_line2()}
                    <br />
                    {messages.contact_address_line3()}
                    <br />
                    {messages.contact_address_city()}
                  </address>
                </div>

                {/* Phone */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="contact-info-icon">
                      <Phone size={20} strokeWidth={2} />
                    </div>
                    <h3 className="contact-info-heading">
                      {messages.contact_info_phone()}
                    </h3>
                  </div>
                  <div className="pl-[52px]">
                    <a
                      href="tel:+85223828380"
                      className="contact-info-body transition-colors"
                    >
                      +852 2382 8380
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="contact-info-icon">
                      <Mail size={20} strokeWidth={2} />
                    </div>
                    <h3 className="contact-info-heading">
                      {messages.contact_info_email()}
                    </h3>
                  </div>
                  <div className="pl-[52px]">
                    <a
                      href="mailto:solution@isbim.com.hk"
                      className="contact-info-body transition-colors break-all"
                    >
                      solution@isbim.com.hk
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="pt-4 relative">
                {/* Map corner brackets - top-left and bottom-right */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l border-t contact-corner-bracket" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r border-b contact-corner-bracket" />

                <div className="contact-map-container group">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`}
                    className="opacity-90 hover:opacity-100 transition-all duration-700"
                    title={messages.contact_map_title()}
                  />

                  {/* Overlay Button */}
                  <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-map-btn translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20"
                  >
                    <ExternalLink size={12} />
                    {messages.contact_map_cta()}
                  </a>
                </div>

                <div className="flex justify-between items-center mt-3 px-1">
                  <p className="contact-coord contact-coord--wide uppercase">
                    LAT: {displayLat} | LON: {displayLon}
                  </p>
                  <p className="contact-coord contact-coord--wide uppercase">
                    STRATEGIC LOCATION
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Form Section */}
            <div
              className={`lg:col-span-8 transform transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div
                id="contact-form"
                ref={formRef}
                className="contact-panel rounded-sm p-8 md:p-12 lg:p-16 relative overflow-hidden"
              >
                {isSuccess ? (
                  <SuccessState onReset={() => setIsSuccess(false)} />
                ) : (
                  <form
                     onSubmit={handleSubmit(onSubmit)}
                     className="space-y-12"
                   >
                    {/* Row 1: Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <FormInput
                        label={messages.contact_label_first_name()}
                        required
                        error={errors.firstName?.message}
                        {...register("firstName")}
                        placeholder={messages.contact_placeholder_first_name()}
                      />
                      <FormInput
                        label={messages.contact_label_last_name()}
                        required
                        error={errors.lastName?.message}
                        {...register("lastName")}
                        placeholder={messages.contact_placeholder_last_name()}
                      />
                    </div>

                    {/* Row 2: Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <FormInput
                        label={messages.contact_label_company_name()}
                        required
                        error={errors.companyName?.message}
                        {...register("companyName")}
                        placeholder={messages.contact_placeholder_company_name()}
                      />
                      <FormSelect
                        label={messages.contact_label_company_type()}
                        value={selectedCompanyType || ""}
                        onChange={(value) =>
                          setValue(
                            "companyType",
                            value as ContactFormInput["companyType"],
                            { shouldValidate: true, shouldDirty: true }
                          )
                        }
                        options={companyTypeOptions}
                        placeholder={messages.contact_placeholder_company_type()}
                      />
                    </div>

                    {/* Row 3: Job & Service */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <FormInput
                        label={messages.contact_label_job_title()}
                        error={errors.jobTitle?.message}
                        {...register("jobTitle")}
                        placeholder={messages.contact_placeholder_job_title()}
                      />
                      <FormSelect
                        label={messages.contact_label_service()}
                        value={selectedService || ""}
                        onChange={(value) =>
                          setValue("service", value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        options={serviceOptions}
                        placeholder={messages.contact_placeholder_service()}
                        required
                        error={errors.service?.message}
                      />
                    </div>

                    {/* Row 4: Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <FormInput
                        label={messages.contact_label_email()}
                        type="email"
                        required
                        error={errors.email?.message}
                        {...register("email")}
                        placeholder="email@example.com"
                      />
                      <FormInput
                        label={messages.contact_label_phone()}
                        type="tel"
                        error={errors.phoneNumber?.message}
                        {...register("phoneNumber")}
                        placeholder={messages.contact_placeholder_phone()}
                      />
                    </div>

                    {/* Consent */}
                    <div className="pt-4 flex items-start gap-4 group cursor-pointer">
                      <div className="relative flex items-center mt-0.5">
                        <input
                          type="checkbox"
                          id="consent"
                          checked={marketingConsent}
                          onChange={() =>
                            setValue("marketingConsent", !marketingConsent, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          className="peer appearance-none w-4 h-4 border contact-checkbox cursor-pointer"
                        />
                        <svg
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <label
                        htmlFor="consent"
                        className="text-base contact-consent-label leading-relaxed cursor-pointer select-none transition-colors"
                      >
                        {messages.contact_marketing_consent()}{" "}
                        {messages.contact_marketing_privacy()}
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-8 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="contact-btn-primary flex items-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <span>
                          {isSubmitting ? (
                            <span className="animate-pulse">
                              {messages.contact_submit_loading()}
                            </span>
                          ) : (
                            <span className="flex items-center gap-4">
                              {messages.contact_submit_label()}
                              <ArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform"
                              />
                            </span>
                          )}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Success State Component
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-[--contact-accent] blur-xl opacity-30 animate-pulse" />
        <div className="relative w-24 h-24 contact-gradient-bg rounded-full flex items-center justify-center mb-8 shadow-lg">
          <Check className="w-10 h-10 text-white" />
        </div>
      </div>
      <h3 className="text-4xl font-light contact-form-heading mb-4">
        {messages.contact_success_title()}
      </h3>
      <p className="text-lg contact-form-subheading max-w-md font-light leading-relaxed">
        {messages.contact_success_message()}
      </p>
      <button
        onClick={onReset}
        className="mt-12 contact-reset-btn"
      >
        {messages.contact_reset_button()}
      </button>
    </div>
  );
}

// Form Input Component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput = ({
  label,
  error,
  required,
  ...props
}: FormInputProps) => {
  return (
    <div className="group relative">
      <label className="contact-label group-focus-within:text-[--contact-accent]">
        {label}
        {required && " *"}
      </label>
      <input
        className={cn(
          "contact-input focus:border-[--contact-accent]",
          error && "border-red-400"
        )}
        {...props}
      />
      {error && (
        <p className="text-base text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
};

// Form Select Component
interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
  error?: string;
}

const FormSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: FormSelectProps) => {
  return (
    <div className="group relative">
      <label className="contact-label group-focus-within:text-[--contact-accent]">
        {label}
        {required && " *"}
      </label>
      <Select value={value || ""} onValueChange={(val) => onChange(val)}>
          <SelectTrigger
            className={cn(
              "contact-select w-full justify-between items-center px-0 py-3 rounded-none border-0 border-b bg-transparent h-auto shadow-none data-[size=default]:!h-auto data-[size=sm]:!h-auto",
              "transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus:border-[--contact-accent]",
              "group-hover:text-[--contact-accent]",
              "[&_svg]:transition-transform [&_[data-slot=select-icon]]:transition-transform data-[state=open]:[&_svg]:-rotate-180",
              "data-[state=open]:border-b data-[state=open]:border-[--contact-accent]",
            error && "border-red-400"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          side="bottom"
          align="start"
          position="popper"
          sideOffset={6}
          avoidCollisions={false}
          className="contact-select-content"
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="contact-select-item"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-base text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
};
