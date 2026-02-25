import { LegalPageData } from "@/components/legal/legal-page-template";
import { Link } from "@/lib/i18n";
import * as m from "@/paraglide/messages";

export function getTermsOfServiceData(_locale: "en" | "zh"): LegalPageData {
  void _locale;
  return {
    pageTitle: m.terms_title(),
    lastUpdated: m.terms_last_updated(),
    intro: m.terms_intro(),
    sections: [
      {
        title: m.terms_q1_title(),
        content: (
          <>
            <p>{m.terms_q1_p1()}</p>
            <p>{m.terms_q1_p2()}</p>
          </>
        ),
      },
      {
        title: m.terms_q2_title(),
        content: (
          <>
            <h3 className="font-semibold text-base mb-3 mt-4">
              {m.terms_q2_subheading_access()}
            </h3>
            <p>{m.terms_q2_access_desc()}</p>

            <h3 className="font-semibold text-base mb-3 mt-6">
              {m.terms_q2_subheading_security()}
            </h3>
            <p>{m.terms_q2_security_desc()}</p>
          </>
        ),
      },
      {
        title: m.terms_q3_title(),
        content: (
          <>
            <h3 className="font-semibold text-base mb-3 mt-4">
              {m.terms_q3_subheading_compliance()}
            </h3>
            <p>{m.terms_q3_compliance_desc()}</p>

            <h3 className="font-semibold text-base mb-3 mt-6">
              {m.terms_q3_subheading_usage()}
            </h3>
            <ul className="cookies-list">
              <li>{m.terms_q3_usage_item1()}</li>
              <li>{m.terms_q3_usage_item2()}</li>
              <li>{m.terms_q3_usage_item3()}</li>
              <li>{m.terms_q3_usage_item4()}</li>
            </ul>

            <h3 className="font-semibold text-base mb-3 mt-6">
              {m.terms_q3_subheading_account()}
            </h3>
            <p>{m.terms_q3_account_desc()}</p>
          </>
        ),
      },
      {
        title: m.terms_q4_title(),
        content: (
          <>
            <h3 className="font-semibold text-base mb-3 mt-4">
              {m.terms_q4_subheading_rights()}
            </h3>
            <p>{m.terms_q4_rights_desc()}</p>

            <h3 className="font-semibold text-base mb-3 mt-6">
              {m.terms_q4_subheading_customer_data()}
            </h3>
            <p>{m.terms_q4_customer_data_desc()}</p>

            <h3 className="font-semibold text-base mb-3 mt-6">
              {m.terms_q4_subheading_feedback()}
            </h3>
            <p>{m.terms_q4_feedback_desc()}</p>
          </>
        ),
      },
      {
        title: m.terms_q5_title(),
        content: (
          <>
            <h3 className="font-semibold text-base mb-3 mt-4">
              {m.terms_q5_subheading_verification()}
            </h3>
            <p>{m.terms_q5_verification_desc()}</p>

            <h3 className="font-semibold text-base mb-3 mt-6">
              {m.terms_q5_subheading_judgment()}
            </h3>
            <p>{m.terms_q5_judgment_desc()}</p>
          </>
        ),
      },
      {
        title: m.terms_q6_title(),
        content: (
          <p>
            {m.terms_q6_desc()}{" "}
            <Link href="/privacy" className="cookies-email-link">
              {m.privacy_title()}
            </Link>
            .
          </p>
        ),
      },
      {
        title: m.terms_q7_title(),
        content: (
          <>
            <h3 className="font-semibold text-base mb-3 mt-4">
              {m.terms_q7_subheading_disclaimer()}
            </h3>
            <p>{m.terms_q7_disclaimer_p1()}</p>
            <p>{m.terms_q7_disclaimer_p2()}</p>
          </>
        ),
      },
      {
        title: m.terms_q8_title(),
        content: (
          <>
            <p>{m.terms_q8_p1()}</p>
            <h3 className="font-semibold text-base mb-3 mt-6">
              {m.terms_q8_subheading_customer()}
            </h3>
            <p>{m.terms_q8_customer_desc()}</p>
          </>
        ),
      },
      {
        title: m.terms_q9_title(),
        content: <p>{m.terms_q9_desc()}</p>,
      },
      {
        title: m.terms_q10_title(),
        content: (
          <ul className="cookies-list">
            <li>{m.terms_q10_item_customer()}</li>
            <li>{m.terms_q10_item_customer_data()}</li>
            <li>{m.terms_q10_item_properties()}</li>
            <li>{m.terms_q10_item_services()}</li>
          </ul>
        ),
      },
    ],
  };
}
