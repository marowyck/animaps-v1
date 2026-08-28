/** Nested message tree for the public landing (and related chrome). */
export type Messages = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    benefits: string;
    howToStart: string;
    faq: string;
    createAccount: string;
    login: string;
    menu: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    languageAria: string;
  };
  hero: {
    titleLine1: string;
    titleHighlight: string;
    body: string;
    ctaAccount: string;
    ctaHow: string;
    imageAlt: string;
  };
  solution: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    bodyBefore: string;
    adopters: string;
    ngos: string;
    vets: string;
    agencies: string;
    conjunction: string;
    bodyAfter: string;
    cta: string;
    pillars: {
      match: { title: string; body: string };
      ngo: { title: string; body: string };
      marketplace: { title: string; body: string };
      geo: { title: string; body: string };
      indicators: { title: string; body: string };
    };
  };
  howItWorks: {
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    cta: string;
    steps: {
      account: { title: string; desc: string };
      profile: { title: string; desc: string };
      match: { title: string; desc: string };
      adopt: { title: string; desc: string };
    };
  };
  marquees: {
    green: string;
    pink: string;
  };
  audience: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    body: string;
    cta: string;
    cards: {
      guardians: { title: string; body: string };
      ngos: { title: string; body: string };
      clinics: { title: string; body: string };
      agencies: { title: string; body: string };
    };
  };
  differentials: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    body: string;
    cta: string;
    features: {
      match: { title: string; body: string };
      ngoRegister: { title: string; body: string };
      animalMgmt: { title: string; body: string };
      community: { title: string; body: string };
      vets: { title: string; body: string };
      biologists: { title: string; body: string };
      abuse: { title: string; body: string };
      wildlife: { title: string; body: string };
      map: { title: string; body: string };
      public: { title: string; body: string };
    };
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: {
      launch: { q: string; a: string };
      free: { q: string; a: string };
      match: { q: string; a: string };
      orgs: { q: string; a: string };
      urgent: { q: string; a: string };
      data: { q: string; a: string };
      brazil: { q: string; a: string };
      app: { q: string; a: string };
    };
  };
  waitlist: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    body: string;
    closing: string;
  };
  login: {
    title: string;
    body: string;
    ctaRegister: string;
    ctaHome: string;
  };
  form: {
    name: string;
    email: string;
    profileType: string;
    city: string;
    state: string;
    privacyBefore: string;
    privacyLink: string;
    privacyAfter: string;
    submit: string;
    submitting: string;
    success: string;
    unexpectedError: string;
    profiles: {
      guardian: string;
      ngo: string;
      clinic: string;
      other: string;
    };
    errors: {
      requiredFields: string;
      lgpdRequired: string;
    };
  };
  footer: {
    blurb: string;
    platform: string;
    account: string;
    legal: string;
    social: string;
    solution: string;
    howItWorks: string;
    whoFor: string;
    faq: string;
    createAccount: string;
    login: string;
    privacy: string;
    terms: string;
    languageAria: string;
  };
  cookies: {
    aria: string;
    body: string;
    learnMore: string;
    accept: string;
    reject: string;
  };
};
