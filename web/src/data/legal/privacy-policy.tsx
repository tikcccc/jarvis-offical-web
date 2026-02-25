import { Link } from "@/lib/i18n";
import type { LegalPageData } from "@/components/legal/legal-page-template";
import * as m from "@/paraglide/messages";

export function getPrivacyPolicyData(_locale: "en" | "zh"): LegalPageData {
  void _locale;
  return {
    pageTitle: m.privacy_title(),
    lastUpdated: m.privacy_last_updated(),
    intro: m.privacy_intro(),
    sections: [
      {
        title: m.privacy_q1_title(),
        content: (
          <>
            <h3 className="font-semibold text-base mb-3 mt-4">
              {m.privacy_q1_subheading_applicability()}
            </h3>
            <p>{m.privacy_q1_applicability_desc()}</p>
            <ul className="cookies-list">
              <li>{m.privacy_q1_app_item1()}</li>
              <li>{m.privacy_q1_app_item2()}</li>
              <li>{m.privacy_q1_app_item3()}</li>
              <li>{m.privacy_q1_app_item4()}</li>
            </ul>

            <h3 className="font-semibold text-base mb-3 mt-6">
              {m.privacy_q1_subheading_roles()}
            </h3>
            <p>{m.privacy_q1_roles_desc()}</p>
          </>
        ),
      },
      {
        title: m.privacy_q2_title(),
        content: (
          <>
            <p>{m.privacy_q2_intro()}</p>
            <ul className="cookies-list mt-4">
              <li>
                <strong>{m.privacy_q2_item1_label()}</strong>{" "}
                {m.privacy_q2_item1_desc()}
              </li>
              <li>
                <strong>{m.privacy_q2_item2_label()}</strong>{" "}
                {m.privacy_q2_item2_desc()}
              </li>
              <li>
                <strong>{m.privacy_q2_item3_label()}</strong>{" "}
                {m.privacy_q2_item3_desc()}
              </li>
              <li>
                <strong>{m.privacy_q2_item4_label()}</strong>{" "}
                {m.privacy_q2_item4_desc()}
              </li>
            </ul>
          </>
        ),
      },
      {
        title: m.privacy_q3_title(),
        content: (
          <>
            <p className="font-medium mb-3">{m.privacy_q3_notice_title()}</p>
            <p>{m.privacy_q3_intro()}</p>

            <ul className="cookies-list mt-4">
              <li>
                <strong>{m.privacy_q3_item1_label()}</strong>{" "}
                {m.privacy_q3_item1_desc()}
              </li>
              <li>
                <strong>{m.privacy_q3_item2_label()}</strong>{" "}
                {m.privacy_q3_item2_desc()}
              </li>
              <li>
                <strong>{m.privacy_q3_item3_label()}</strong>{" "}
                {m.privacy_q3_item3_desc()}
              </li>
              <li>
                <strong>{m.privacy_q3_item4_label()}</strong>{" "}
                {m.privacy_q3_item4_desc()}
              </li>
            </ul>
          </>
        ),
      },
      {
        title: m.privacy_q4_title(),
        content: (
          <>
            <p>{m.privacy_q4_intro()}</p>
            <ul className="cookies-list mt-4">
              <li>
                <strong>{m.privacy_q4_item1_label()}</strong>{" "}
                {m.privacy_q4_item1_desc()}
              </li>
              <li>
                <strong>{m.privacy_q4_item2_label()}</strong>{" "}
                {m.privacy_q4_item2_desc()}
              </li>
              <li>
                <strong>{m.privacy_q4_item3_label()}</strong>{" "}
                {m.privacy_q4_item3_desc()}
              </li>
              <li>
                <strong>{m.privacy_q4_item4_label()}</strong>{" "}
                {m.privacy_q4_item4_desc()}
              </li>
              <li>
                <strong>{m.privacy_q4_item5_label()}</strong>{" "}
                {m.privacy_q4_item5_desc()}
              </li>
            </ul>
          </>
        ),
      },
      {
        title: m.privacy_q5_title(),
        content: (
          <>
            <p>{m.privacy_q5_p1()}</p>
            <p className="mt-4">
              <strong>{m.privacy_q5_p2_label()}</strong>{" "}
              {m.privacy_q5_p2_desc()}
            </p>
          </>
        ),
      },
      {
        title: m.privacy_q6_title(),
        content: (
          <>
            <p>{m.privacy_q6_intro()}</p>
            <ul className="cookies-list mt-4">
              <li>
                <strong>{m.privacy_q6_item1_label()}</strong>{" "}
                {m.privacy_q6_item1_desc()}
              </li>
              <li>
                <strong>{m.privacy_q6_item2_label()}</strong>{" "}
                {m.privacy_q6_item2_desc()}
              </li>
              <li>
                <strong>{m.privacy_q6_item3_label()}</strong>{" "}
                {m.privacy_q6_item3_desc()}
              </li>
              <li>
                <strong>{m.privacy_q6_item4_label()}</strong>{" "}
                {m.privacy_q6_item4_desc()}
              </li>
            </ul>
          </>
        ),
      },
      {
        title: m.privacy_q7_title(),
        content: (
          <>
            <p>{m.privacy_q7_intro()}</p>
            <ul className="cookies-list mt-4">
              <li>
                <strong>{m.privacy_q7_item1_label()}</strong>{" "}
                {m.privacy_q7_item1_desc()}
              </li>
              <li>
                <strong>{m.privacy_q7_item2_label()}</strong>{" "}
                {m.privacy_q7_item2_desc()}
              </li>
              <li>
                <strong>{m.privacy_q7_item3_label()}</strong>{" "}
                {m.privacy_q7_item3_desc()}
              </li>
            </ul>
          </>
        ),
      },
      {
        title: m.privacy_q8_title(),
        content: (
          <>
            <p>{m.privacy_q8_intro()}</p>
            <ul className="cookies-list mt-4">
              <li>
                <strong>{m.privacy_q8_item1_label()}</strong>{" "}
                {m.privacy_q8_item1_desc()}
              </li>
              <li>
                <strong>{m.privacy_q8_item2_label()}</strong>{" "}
                {m.privacy_q8_item2_desc()}
              </li>
            </ul>
          </>
        ),
      },
      {
        title: m.privacy_q9_title(),
        content: (
          <>
            <p>{m.privacy_q9_p1()}</p>
            <p className="mt-4">
              <strong>{m.privacy_q9_p2_label()}</strong>{" "}
              {m.privacy_q9_p2_desc()}
            </p>
          </>
        ),
      },
      {
        title: m.privacy_q10_title(),
        content: (
          <p>
            {m.privacy_q10_desc_prefix()}
            <Link href="/cookies" className="cookies-email-link">
              {m.privacy_q10_link_label()}
            </Link>
            {m.privacy_q10_desc_suffix()}
          </p>
        ),
      },
      {
        title: m.privacy_q11_title(),
        content: (
          <>
            <p className="mb-4">{m.privacy_q11_children()}</p>
            <p>
              <strong>{m.privacy_q11_contact_label()}</strong>{" "}
              {m.privacy_q11_contact_desc()}
              <Link href="mailto:solution@isbim.com.hk" className="cookies-email-link">
                {m.privacy_contact_email()}
              </Link>
            </p>
          </>
        ),
      },
    ],
  };
}
