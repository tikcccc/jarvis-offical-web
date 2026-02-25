export type ServiceTab = "JPM" | "BIM" | "VENTURES" | "FINANCE";

export type ServiceSeoKey = "jpm" | "bim" | "venture" | "finance";

export interface ServiceContent {
  hero: {
    title: string;
    subTitle: string;
    desc: string;
    tag: string;
    img: string;
  };
  narrative: {
    label: string;
    lead: string;
    sub: string;
    p1: string;
    p2: string;
  };
  engine: { id: string; title: string; desc: string }[];
  stats: {
    label: string;
    main: { val: string; label: string };
    grid: { val: string; label: string }[];
  };
  gallery: {
    title: string;
    meta: string;
    items: { id: string; loc: string; title: string; desc: string; metric: string; img: string; href?: string }[];
  };
}

export const SERVICE_CONTENT: Record<ServiceTab, ServiceContent> = {
  JPM: {
    hero: {
      title: "JPM",
      subTitle: "Project Management",
      desc: "Building the backbone of emerging economies.",
      tag: "Hong Kong Precision – China Scale",
      img: "/images/services/jpm/hero.png",
    },
    narrative: {
      label: "The Methodology",
      lead: "Traditional models fail.",
      sub: "We orchestrate differently.",
      p1: "Emerging economies demand infrastructure that is bankable, efficient, and defect-free. JPM fuses Hong Kong's rigorous professional services with China's unmatched manufacturing scale.",
      p2: "This isn't just construction; it's a strategic bridge to the Belt & Road initiative, powered by real-time digital twins and an ecosystem of 8,000+ vetted suppliers.",
    },
    engine: [
      { id: "01", title: "HK Professional Services", desc: "Bilingual PM teams translating global standards into China-executable specs. Dual compliance expertise." },
      { id: "02", title: "AI Intelligence", desc: "Real-time digital twin predicting risks 30 days ahead at 89% accuracy. 3-minute executive dashboards." },
      { id: "03", title: "8,000+ Suppliers", desc: "Vetted MiC supply chain with 4-step matching: technical, experience, financial, and cultural fit." },
      { id: "04", title: "Global Delivery", desc: "End-to-end management. 35-45% less waste and 25-35% lower emissions." },
    ],
    stats: {
      label: "Performance Delta",
      main: { val: "20-30%", label: "PROJECT COST SAVINGS" },
      grid: [
        { val: "-45%", label: "Delivery Time" },
        { val: "5%", label: "Defect Rate (vs 18%)" },
        { val: "19%", label: "Overruns (vs 68%)" },
        { val: "24m", label: "Cash Cycle (vs 36m)" },
      ],
    },
    gallery: {
      title: "Africa 2025",
      meta: "HKD 13,000,000,000+ Signed",
      items: [
        { id: "01", loc: "CAMEROON", title: "National Engineering Initiative", desc: "28,000-unit City of Great Achievement + South Province Government HQ. Presidential approval secured.", metric: "HKD 760M", img: "/images/view2.png" },
        { id: "02", loc: "NIGERIA", title: "Abuja Smart City", desc: "143-hectare luxury complex. MoU with Ministry of Housing. Speaker + 13 Governors engaged.", metric: "HKD 500M", img: "/images/view3.png" },
      ],
    },
  },
  BIM: {
    hero: {
      title: "BIM",
      subTitle: "Consultancy",
      desc: "Mandated digital transformation.",
      tag: "Model › Coordinate › Comply",
      img: "/images/view2.png",
    },
    narrative: {
      label: "The Mandate",
      lead: "Drawings are dead.",
      sub: "Compliance is mandatory.",
      p1: "Hong Kong's BIM journey started in 2017. Today, TC(W) No. 1/2025 makes BIM models contractually binding. isBIM has been there every step — delivering certified, compliant BIM for 2,600+ projects.",
      p2: "A single 3D digital twin replaces hundreds of conflicting 2D drawings. Everyone — architect, engineer, contractor — works on the same live model. No more arguments.",
    },
    engine: [
      { id: "01", title: "Full BIM Modelling", desc: "LOD 300-500, Revit/IFC standards, and clash-free coordination for zero ambiguity." },
      { id: "02", title: "On-site Secondment", desc: "CIC/BSI-certified BIM Managers & Coordinators deployed directly to your project team." },
      { id: "03", title: "End-to-End Consultancy", desc: "From BEP creation and CDCP setup to rigorous ISO 19650 compliance audits." },
      { id: "04", title: "Tendering Support", desc: "BIM-embedded BOQs, 5D cost models, and full ContractBIM compliance support." },
    ],
    stats: {
      label: "Impact Analysis",
      main: { val: "75%", label: "REWORK REDUCTION" },
      grid: [
        { val: "100%", label: "Mandate Ready" },
        { val: "72%", label: "Budget Accuracy" },
        { val: "-45%", label: "Timeline (4D Scheduling)" },
        { val: "2,600+", label: "Proven Projects" },
      ],
    },
    gallery: {
      title: "Proven Assets",
      meta: "1.2 Billion Sq.Ft Delivered",
      items: [
        { id: "01", loc: "HONG KONG", title: "M+ Museum", desc: "Delivering complex geometry coordination and asset management standards for a world-class cultural landmark.", metric: "ISO 19650", img: "/images/view3.png" },
        { id: "02", loc: "INFRASTRUCTURE", title: "HKIA Expansion", desc: "Full lifecycle BIM implementation from investigation to 4D construction simulation for aviation hubs.", metric: "CIC GOLD", img: "/images/view4.png" },
      ],
    },
  },
  VENTURES: {
    hero: {
      title: "VENTURES",
      subTitle: "Construction Tech",
      desc: "Globalising construction tech.",
      tag: "Physics + Intelligence",
      img: "/images/venture hero.jpg",
    },
    narrative: {
      label: "The Playbook",
      lead: "VCs lack distribution.",
      sub: "We are the pipeline.",
      p1: "We partner with the sharpest construction-AI founders and give them what most VCs can't: instant commercial traction. We turn prototypes into revenue in months, not years.",
      p2: "Our conviction is simple: the winners will be those who fuse deep domain physics with frontier intelligence. We back them before anyone else sees it.",
    },
    engine: [
      { id: "01", title: "Battle-Tested Distribution", desc: "20 years of domain expertise. We turn prototypes into revenue in months, not years." },
      { id: "02", title: "Conviction-Led Investment", desc: "First institutional capital for vertical AI, robotics, and digital twins." },
      { id: "03", title: "In-Kind Incubation", desc: "Accelerating product-market fit inside our own global pipeline of 2,600+ projects." },
      { id: "04", title: "Global Scale", desc: "Fastest route to AI-ready data centers in SE Asia and housing in Africa." },
    ],
    stats: {
      label: "Ecosystem Scale",
      main: { val: "2,600+", label: "LIVE PROJECTS ACCESS" },
      grid: [
        { val: "1.2B", label: "Sq.Ft Built Assets" },
        { val: "8,000+", label: "Supplier Network" },
        { val: "20 Yrs", label: "Domain Expertise" },
        { val: "Global", label: "Asia • Africa • Middle East" },
      ],
    },
    gallery: {
      title: "The Portfolio",
      meta: "Re-engineering Construction",
      items: [
        { id: "01", loc: "VERTICAL AI", title: "Autonomous Agents", desc: "Backing teams that automate complex construction workflows through generative design and scheduling.", metric: "SEED TO SERIES A", img: "/images/services/jpm/hero.png" },
        { id: "02", loc: "HARDWARE", title: "Modular Robotics", desc: "Industrializing on-site assembly with precision robotics and computer vision systems.", metric: "GLOBAL PILOTS", img: "/images/view2.png" },
        { id: "03", loc: "SMART CITIES", title: "Urban Operating Systems", desc: "Deploying city-scale digital twins and IoT networks to manage energy grid and traffic flows in emerging megacities.", metric: "SERIES B", img: "/images/view4.png" },
      ],
    },
  },
  FINANCE: {
    hero: {
      title: "FINANCE",
      subTitle: "Infrastructure Capital",
      desc: "Infrastructure Finance.",
      tag: "Live JARVIS data + global capital = financial close",
      img: "/images/view4.png",
    },
    narrative: {
      label: "The Gap",
      lead: "Risk is opaque.",
      sub: "Data makes it visible.",
      p1: "Most global investors shy away from emerging economies due to non-commercial risk and lack of verifiable data. Billions in viable projects stay stranded.",
      p2: "We sit at the centre of a network of PE funds and multilateral banks. Because every project runs on JARVIS, we deliver the live transparency lenders demand.",
    },
    engine: [
      { id: "01", title: "Global Capital Network", desc: "Access to leading PE funds, DFIs, export-credit agencies , and sovereign investors." },
      { id: "02", title: "Live Digital Twins", desc: "Real-time monitoring of every cost and schedule parameter." },
      { id: "03", title: "In-Kind Investment", desc: "We fund bankable feasibility studies and financial modelling to de-risk projects early." },
      { id: "04", title: "30-Day Forecasting", desc: "Audited cost curves and risk prediction giving lenders certainty." },
    ],
    stats: {
      label: "Risk Mitigation",
      main: { val: "T+1", label: "REAL-TIME REPORTING" },
      grid: [
        { val: "30 Days", label: "Risk Forecast Horizon" },
        { val: "0", label: "Blind Spots" },
        { val: "100%", label: "Bankable Studies" },
        { val: "AAA", label: "Standard Compliance" },
      ],
    },
    gallery: {
      title: "Asset Classes",
      meta: "Making Infrastructure Bankable",
      items: [
        { id: "01", loc: "GREEN ENERGY", title: "Renewable Power", desc: "Structuring finance for solar and wind power projects in emerging markets.", metric: "ESG COMPLIANT", img: "/images/view2.png" },
        { id: "02", loc: "DIGITAL INFRA", title: "Data Centres", desc: "Providing cost certainty and opaque cost trajectory solutions for emerging markets.", metric: "AUDITED COST CURVES", img: "/images/view3.png" },
      ],
    },
  },
};

export const SERVICE_META: Record<
  ServiceTab,
  { seoKey: ServiceSeoKey; title: string; description: string }
> = {
  JPM: {
    seoKey: "jpm",
    title: "JPM Project Management",
    description: "Bankable project delivery that fuses Hong Kong rigor with China scale for Belt & Road infrastructure.",
  },
  BIM: {
    seoKey: "bim",
    title: "BIM Consultancy",
    description: "Certified BIM delivery for 2,600+ projects with ISO 19650 compliance and mandate-ready workflows.",
  },
  VENTURES: {
    seoKey: "venture",
    title: "Venture Investments",
    description: "Conviction-led construction tech investments with instant distribution and live JARVIS data advantages.",
  },
  FINANCE: {
    seoKey: "finance",
    title: "Project Finance",
    description: "Infrastructure finance with live digital twin transparency, de-risking capital for emerging markets.",
  },
};
