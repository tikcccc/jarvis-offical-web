"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/lib/i18n";
import { ROUTES } from "@/lib/constants";
import * as messages from "@/paraglide/messages";

const subscriptionSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

export function NewsletterForm() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
  });

  const onSubmit = async (data: SubscriptionFormValues) => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    try {
      router.push(
        `${ROUTES.CONTACT}?email=${encodeURIComponent(
          data.email
        )}#contact-form`
      );
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2.5 pt-0.5">
      <div className="flex space-x-2">
        <Input
          {...register("email")}
          placeholder={messages.footer_email_placeholder()}
          type="email"
          className="layout-footer-input flex-1 h-10 text-[15px] bg-transparent text-slate-900 dark:text-white caret-slate-900 dark:caret-white placeholder:text-slate-400 dark:placeholder:text-white/60 border border-slate-300 dark:border-white/35 hover:border-slate-400 dark:hover:border-white/55 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-slate-500 dark:focus-visible:border-white shadow-none transition-all duration-120"
        />
        <Button
          type="submit"
          disabled={isSubmitting || isRedirecting}
          className="px-4 h-10 shadow-sm transition-all duration-200 bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:shadow-md disabled:translate-y-0 disabled:shadow-sm layout-footer-newsletter-button cursor-pointer group"
        >
          {isSubmitting ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          ) : (
            <Send className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]" />
          )}
        </Button>
      </div>

      {errors.email && (
        <p className="text-xs text-red-500 pl-0.5">{errors.email.message}</p>
      )}
    </form>
  );
}
