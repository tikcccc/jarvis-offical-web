import type { LegalPageData } from "@/components/legal/legal-page-template";
import { Link } from "@/lib/i18n";
import * as m from "@/paraglide/messages";

export function getPrivacyCookiePolicyData(_locale: "en" | "zh"): LegalPageData {
  void _locale;

  return {
    pageTitle: m.privacy_cookie_title(),
    lastUpdated: m.privacy_cookie_last_updated(),
    intro: m.privacy_cookie_intro(),
    sections: [
      {
        title: m.privacy_cookie_terms_title(),
        content: <p>{m.privacy_cookie_terms_desc()}</p>,
      },
      {
        title: m.privacy_cookie_disclaimer_title(),
        content: (
          <>
            <p>{m.privacy_cookie_disclaimer_p1()}</p>
            <p className="mb-4" aria-hidden="true">&nbsp;</p>
            <p>{m.privacy_cookie_disclaimer_p2()}</p>
            <p>
              {m.privacy_cookie_disclaimer_p3_prefix()}
              <a href="tel:+85223828380" className="cookies-email-link">
                {m.privacy_cookie_disclaimer_phone()}
              </a>
              {m.privacy_cookie_disclaimer_p3_suffix()}
            </p>
          </>
        ),
      },
      {
        title: m.privacy_cookie_liability_title(),
        content: <p>{m.privacy_cookie_liability_desc()}</p>,
      },
      {
        title: m.privacy_cookie_ownership_title(),
        content: (
          <>
            <p className="mb-4">{m.privacy_cookie_ownership_p1()}</p>
            <p className="mb-4" aria-hidden="true">&nbsp;</p>
            <p>{m.privacy_cookie_ownership_p2()}</p>
          </>
        ),
      },
      {
        title: m.privacy_cookie_governing_law_title(),
        content: <p>{m.privacy_cookie_governing_law_desc()}</p>,
      },
      {
        title: m.privacy_cookie_queries_title(),
        content: (
          <p>
            {m.privacy_cookie_queries_desc_prefix()}
            <Link href="mailto:solution@isbim.com.hk" className="cookies-email-link">
              {m.cookies_contact_email()}
            </Link>
            {m.privacy_cookie_queries_desc_suffix()}
          </p>
        ),
      },
    ],
  };
}
