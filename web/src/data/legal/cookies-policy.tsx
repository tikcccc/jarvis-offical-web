import { LegalPageData } from "@/components/legal/legal-page-template";
import { Link } from "@/lib/i18n";
import * as m from "@/paraglide/messages";

export function getCookiesPolicyData(locale: "en" | "zh"): LegalPageData {
  void locale;
  return {
    pageTitle: m.cookies_title(),
    lastUpdated: m.cookies_last_updated(),
    intro: m.cookies_intro(),
    sections: [
      {
        title: m.cookies_q1_title(),
        content: (
          <div className="accordion-text">
            <p>{m.cookies_q1_p1()}</p>
            <p>
              <strong>{m.cookies_q1_p2_session()}</strong>
              {m.cookies_q1_p2_desc1()}
              <br />
              <strong>{m.cookies_q1_p2_persistent()}</strong>
              {m.cookies_q1_p2_desc2()}
            </p>
          </div>
        ),
      },
      {
        title: m.cookies_q2_title(),
        content: (
          <div className="accordion-text">
            <p>{m.cookies_q2_p1()}</p>
            <div>
              <p className="cookies-callout-title font-body-base">
                {m.cookies_q2_p2_title()}
              </p>
              <p>{m.cookies_q2_p2_desc()}</p>
            </div>
            <p className="cookies-note font-caption">{m.cookies_q2_note()}</p>
          </div>
        ),
      },
      {
        title: m.cookies_q3_title(),
        content: (
          <div className="accordion-text">
            <p>{m.cookies_q3_intro()}</p>
            <ul className="cookies-list">
              <li>
                <strong>{m.cookies_q3_browser_title()}</strong>
                {m.cookies_q3_browser_desc()}
              </li>
              <li>
                <strong>{m.cookies_q3_cache_title()}</strong>
                {m.cookies_q3_cache_desc()}
              </li>
            </ul>
            <p className="cookies-note font-caption">{m.cookies_q3_note()}</p>
          </div>
        ),
      },
      {
        title: m.cookies_q4_title(),
        content: (
          <div className="accordion-text">
            <p>{m.cookies_q4_desc()}</p>
          </div>
        ),
      },
      {
        title: m.cookies_q5_title(),
        content: (
          <div className="accordion-text">
            <p>
              {m.cookies_q5_desc()}
              <Link
                href="mailto:solution@isbim.com.hk"
                className="cookies-email-link"
              >
                {m.cookies_contact_email()}
              </Link>
              .
            </p>
          </div>
        ),
      },
    ],
  };
}
