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
  auth: {
    google: string;
    googleSoon: string;
    or: string;
    brandHomeAria: string;
    showPassword: string;
    hidePassword: string;
    slides: {
      rescue: { title: string; body: string; imageAlt: string };
      adoption: { title: string; body: string; imageAlt: string };
      wildlife: { title: string; body: string; imageAlt: string };
    };
    register: {
      title: string;
      subtitle: string;
      step2Title: string;
      step2Subtitle: string;
      stepOf: string;
      continue: string;
      back: string;
      password: string;
      confirmPassword: string;
      passwordHint: string;
      passwordRules: {
        minLength: string;
        uppercase: string;
        special: string;
      };
      errors: {
        passwordRequired: string;
        passwordWeak: string;
        passwordMismatch: string;
      };
      hasAccount: string;
      loginLink: string;
    };
    login: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      submit: string;
      noAccount: string;
      registerLink: string;
      soon: string;
    };
    verifyEmail: {
      title: string;
      subtitle: string;
      expires: string;
      continue: string;
      resend: string;
      resendIn: string;
      resending: string;
      back: string;
      close: string;
      incomplete: string;
      invalid: string;
      expired: string;
      success: string;
      resent: string;
      codeLabel: string;
    };
  };
  onboarding: {
    back: string;
    close: string;
    continue: string;
    skip: string;
    loading: string;
    stepOf: string;
    select: string;
    guidelines: {
      title: string;
      intro: string;
      accept: string;
      rules: {
        truthful: string;
        respectPeople: string;
        respectAnimals: string;
        noFalseInfo: string;
        noIllegal: string;
        reportBad: string;
        responsibleAdoption: string;
      };
      terms: string;
      privacy: string;
      community: string;
      legalBefore: string;
      legalAnd: string;
    };
    intention: {
      title: string;
      subtitle: string;
      needOne: string;
      items: Record<
        | "adopt"
        | "pet_owner"
        | "help_animals"
        | "report"
        | "lost_animal"
        | "found_animal"
        | "community"
        | "explore",
        { title: string; description: string }
      >;
    };
    otherRoles: {
      title: string;
      subtitle: string;
      needOne: string;
      items: Record<
        | "independent_protector"
        | "foster_home"
        | "volunteer"
        | "animal_professional"
        | "animal_business"
        | "community_member"
        | "other",
        { title: string; description: string }
      >;
    };
    organization: {
      tradeName: string;
      description: string;
      email: string;
      phone: string;
      website: string;
      instagram: string;
      facebook: string;
      socialOther: string;
      city: string;
      state: string;
      areaOfOperation: string;
      animalTypes: string;
      hasShelter: string;
      doesAdoptions: string;
      doesRescues: string;
      acceptsVolunteers: string;
      acceptsDonations: string;
      titles: {
        infoTitle: string;
        infoSubtitle: string;
        locationTitle: string;
        locationSubtitle: string;
        animalTypesTitle: string;
        animalTypesSubtitle: string;
        servicesTitle: string;
        servicesSubtitle: string;
      };
    };
    clinic: {
      tradeName: string;
      description: string;
      phone: string;
      email: string;
      website: string;
      address: string;
      businessHours: string;
      is24h: string;
      emergencyCare: string;
      homeService: string;
      animalsServed: string;
      servicesOffered: string;
      titles: {
        infoTitle: string;
        infoSubtitle: string;
        locationTitle: string;
        locationSubtitle: string;
        servicesTitle: string;
        servicesSubtitle: string;
        animalsTitle: string;
        animalsSubtitle: string;
      };
      services: Record<
        | "vaccination"
        | "neutering"
        | "emergency_care"
        | "grooming"
        | "consultation"
        | "surgery"
        | "imaging"
        | "hospitalization",
        string
      >;
    };
    animalType: {
      title: string;
      subtitle: string;
      items: Record<
        | "dog"
        | "cat"
        | "rabbit"
        | "bird"
        | "small_pets"
        | "reptiles"
        | "horses"
        | "other"
        | "any",
        string
      >;
    };
    animalSize: {
      title: string;
      subtitle: string;
      items: Record<"small" | "medium" | "large" | "giant" | "any", string>;
    };
    preferences: {
      title: string;
      subtitle: string;
      groups: {
        ages: string;
        sex: string;
        vaccination: string;
        neutered: string;
        specialNeeds: string;
        compatibility: string;
        energyLevel: string;
        environment: string;
      };
      options: Record<string, string>;
    };
    interests: {
      title: string;
      subtitle: string;
      search: string;
      searchLabel: string;
      save: string;
      maxReached: string;
      items: Record<string, string>;
    };
    profile: {
      title: string;
      subtitle: string;
      sections: Record<string, string>;
      privacy: {
        group: string;
        public: string;
        matches: string;
        private: string;
      };
      stubSaved: string;
      stubOptions: Record<string, string[]>;
    };
    verification: {
      title: string;
      subtitle: string;
      start: string;
      capture: string;
      upload: string;
      cameraDenied: string;
      analyzingTitle: string;
      analyzingBody: string;
      approvedTitle: string;
      approvedBody: string;
      rejectedTitle: string;
      rejectedBody: string;
      retryTitle: string;
      retryBody: string;
      retry: string;
      goDashboard: string;
      status: Record<
        "pending" | "processing" | "approved" | "rejected" | "retry_required",
        string
      >;
      institutional: {
        title: string;
        subtitle: string;
        pendingBody: string;
        submitLabel: string;
        goDashboard: string;
      };
    };
    location: {
      title: string;
      body: string;
      allow: string;
      later: string;
    };
  };
  dashboard: {
    welcome: string;
    nav: {
      home?: string;
      discover: string;
      animals: string;
      matches: string;
      messages: string;
      reports: string;
      favorites: string;
      profile: string;
      settings: string;
      dashboard?: string;
      adoptionRequests?: string;
      volunteers?: string;
      donations?: string;
      organization?: string;
      services?: string;
      location?: string;
      reviews?: string;
    };
    summary: {
      nearby: string;
      matches: string;
      favorites: string;
      messages: string;
      region: string;
      requests?: string;
      volunteers?: string;
      donations?: string;
      reviews?: string;
    };
    comingSoon: string;
    openMenu: string;
    exit: string;
  };
  discover: {
    title: string;
    subtitle: string;
    empty: string;
    actions: {
      like: string;
      favorite: string;
      skip: string;
      view: string;
      report: string;
      share: string;
    };
    liked: string;
    favorited: string;
    skipped: string;
    reported: string;
    shared: string;
    kinds: {
      animal: string;
      person: string;
      organization: string;
      protector: string;
    };
  };
  common: {
    loading: string;
    error: string;
    success: string;
    empty: string;
    retry: string;
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
      person: string;
      ong: string;
      veterinary_clinic: string;
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
