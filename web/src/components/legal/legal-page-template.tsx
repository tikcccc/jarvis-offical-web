"use client";

import { useState, useRef, useEffect } from "react";

export interface LegalSection {
  title: string;
  content: React.ReactNode;
}

export interface LegalPageData {
  pageTitle: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

interface AccordionItemProps {
  index: number;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ title, children, isOpen, onToggle }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        const scrollHeight = contentRef.current.scrollHeight;
        contentRef.current.style.maxHeight = `${scrollHeight}px`;
      } else {
        contentRef.current.style.maxHeight = "0px";
      }
    }
  }, [isOpen]);

  return (
    <div className="accordion-item">
      <button
        className={`accordion-button font-body-xxlg ${isOpen ? "active" : ""}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className="icon-plus" aria-hidden="true">
          +
        </span>
      </button>
      <div
        ref={contentRef}
        className={`accordion-content ${isOpen ? "open" : ""}`}
      >
        <div className="accordion-text font-body-base">{children}</div>
      </div>
    </div>
  );
}

interface LegalPageTemplateProps {
  data: LegalPageData;
}

export function LegalPageTemplate({ data }: LegalPageTemplateProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="container-content legal-page">
        {/* Hero Section */}
        <div className="legal-hero">
          <h1 className="font-legal-header-title legal-title">{data.pageTitle}</h1>
          <div className="legal-meta font-caption">{data.lastUpdated}</div>
          <div className="legal-intro font-body-base">{data.intro}</div>
        </div>

        {/* Accordion Section */}
        <div className="legal-accordion">
          {data.sections.map((section, index) => (
            <AccordionItem
              key={index}
              index={index}
              title={section.title}
              isOpen={openIndex === index}
              onToggle={() => toggleAccordion(index)}
            >
              {section.content}
            </AccordionItem>
          ))}
        </div>
      </div>
    </main>
  );
}
