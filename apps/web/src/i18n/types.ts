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
        | "volunteer"
        | "foster_home"
        | "independent_protector"
        | "animal_professional"
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
    organizationType: {
      title: string;
      subtitle: string;
      needOne: string;
      items: Record<
        | "NGO"
        | "ANIMAL_SHELTER"
        | "VETERINARY_CLINIC"
        | "VETERINARY_HOSPITAL"
        | "ANIMAL_BUSINESS"
        | "ANIMAL_SERVICE"
        | "PRIVATE_INSTITUTION"
        | "OTHER",
        { title: string; description: string }
      >;
    };
    institutionType: {
      title: string;
      subtitle: string;
      needOne: string;
      items: Record<
        | "city_hall"
        | "municipal_department"
        | "animal_welfare_department"
        | "environmental_department"
        | "health_department"
        | "zoonoses_center"
        | "environmental_agency"
        | "public_inspection"
        | "public_partner"
        | "other",
        { title: string; description: string }
      >;
    };
    institution: {
      infoTitle: string;
      infoSubtitle: string;
      sectionIdentity: string;
      sectionContact: string;
      sectionOps: string;
      officialName: string;
      publicName: string;
      description: string;
      email: string;
      emailDomain: string;
      phone: string;
      website: string;
      responsibleDepartment: string;
      dataResponsibleArea: string;
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
      cases?: string;
      map?: string;
      analytics?: string;
      team?: string;
      institution?: string;
      routing?: string;
      integrations?: string;
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
      newCases?: string;
      inReview?: string;
      priority?: string;
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
    mocks: Record<
      "a1" | "p1" | "o1" | "pr1" | "a2",
      { subtitle: string; tags: string[] }
    >;
  };
  cases: {
    types: Record<
      | "animal_abuse"
      | "animal_neglect"
      | "animal_abandonment"
      | "animal_at_risk"
      | "injured_animal"
      | "road_accident"
      | "lost_animal"
      | "found_animal"
      | "stray_animal"
      | "hoarding"
      | "illegal_activity"
      | "environmental_risk"
      | "public_request"
      | "other",
      { title: string; description: string }
    >;
    citizenStatus: Record<
      | "registered_on_platform"
      | "awaiting_routing"
      | "routed"
      | "received"
      | "under_analysis"
      | "in_progress"
      | "resolved",
      string
    >;
    internalStatus: Record<
      | "new"
      | "triage"
      | "under_review"
      | "assigned"
      | "in_progress"
      | "waiting_information"
      | "resolved"
      | "closed"
      | "cancelled"
      | "duplicate"
      | "invalid",
      string
    >;
    priority: Record<"low" | "medium" | "high" | "critical", string>;
    precision: Record<
      "exact" | "approximate" | "city" | "region" | "hidden",
      string
    >;
    roles: Record<
      | "reporter"
      | "assignee"
      | "observer"
      | "routed_institution"
      | "origin_organization"
      | "responder",
      string
    >;
    create: {
      title: string;
      subtitle: string;
      honesty: string;
      typeLabel: string;
      titleLabel: string;
      descriptionLabel: string;
      city: string;
      state: string;
      neighborhood: string;
      attachment: string;
      anonymous: string;
      submit: string;
      cancel: string;
      success: string;
    };
    list: {
      citizenTitle: string;
      citizenSubtitle: string;
      institutionTitle: string;
      institutionSubtitle: string;
      emptyTitle: string;
      emptyCitizen: string;
      emptyInstitution: string;
      createCta: string;
    };
    detail: {
      back: string;
      citizenStatus: string;
      internalStatus: string;
      priority: string;
      noLocation: string;
      honesty: string;
      attachments: string;
      publicUpdates: string;
      timeline: string;
      participants: string;
      internalNotes: string;
      noUpdates: string;
      addComment: string;
      postComment: string;
      addInternal: string;
      postInternal: string;
      postPublic: string;
      publicFormHint: string;
      commentAdded: string;
      institutionAuthor: string;
    };
    attachmentKinds: Record<"photo" | "video" | "document", string>;
    events: {
      registered: string;
      evaluatingMatch: string;
      claimed: string;
      markedReview: string;
      assignmentCleared: string;
      assigned: string;
      assignedMember: string;
      assignedTeam: string;
      assignedNone: string;
      routed: string;
      matchVia: string;
      ambiguousMatch: string;
      noMatch: string;
    };
    systemComments: {
      registered: string;
      routed: string;
    };
    claim: {
      title: string;
      subtitle: string;
      token: string;
      email: string;
      submit: string;
      link: string;
      notFound: string;
      success: string;
      tokenIssued: string;
      saveToken: string;
      dismissToken: string;
    };
    institution: {
      softGate: string;
      markReview: string;
      markedReview: string;
    };
    assignment: {
      title: string;
      hint: string;
      unassigned: string;
      member: string;
      team: string;
      none: string;
      assign: string;
      clear: string;
      assigned: string;
      cleared: string;
      needTarget: string;
      softGate: string;
      noPermission: string;
    };
    routing: {
      title: string;
      hint: string;
      empty: string;
      preview: string;
      previewMatch: string;
      previewAmbiguous: string;
      previewNone: string;
      runMatcher: string;
      matched: string;
      noMatch: string;
      softGate: string;
      noPermission: string;
      from: string;
      none: string;
      forwardTitle: string;
      forwardTo: string;
      forwardReason: string;
      forwardNote: string;
      forwardSubmit: string;
      forwarded: string;
      reasons: Record<
        | "initial"
        | "no_competence"
        | "out_of_region"
        | "out_of_type"
        | "partnership"
        | "specialization"
        | "other",
        string
      >;
    };
    errors: {
      required: string;
      forbidden: string;
      notFound: string;
    };
  };
  institution: {
    softGate: {
      title: string;
      body: string;
      banner: string;
      ctaProfile: string;
      ctaSettings: string;
    };
    overview: {
      title: string;
      subtitle: string;
      pendingTitle: string;
      pendingSubtitle: string;
      verification: string;
      unnamed: string;
      totalLabel: string;
      openInbox: string;
      modulesTitle: string;
      moduleMap: string;
      moduleAnalytics: string;
      moduleTeam: string;
      moduleInstitution: string;
      moduleRouting: string;
      moduleIntegrations: string;
      honesty: string;
      metrics: {
        new: string;
        inReview: string;
        inProgress: string;
        priority: string;
        closed: string;
      };
    };
    profile: {
      title: string;
      subtitle: string;
      settingsTitle: string;
      settingsSubtitle: string;
      typeLabel: string;
      typeUnknown: string;
      sectionIdentity: string;
      sectionContact: string;
      sectionOps: string;
      sectionJurisdiction: string;
      jurisdictionHint: string;
      officialName: string;
      publicName: string;
      description: string;
      email: string;
      emailDomain: string;
      phone: string;
      website: string;
      responsibleDepartment: string;
      dataResponsibleArea: string;
      city: string;
      state: string;
      save: string;
      saved: string;
      policyTitle: string;
      policyBody: string;
    };
    map: {
      title: string;
      subtitle: string;
      canvasHint: string;
      privacy: string;
      aggregatesTitle: string;
      unknownCity: string;
      emptyTitle: string;
      emptyBody: string;
      heatmapTitle: string;
      legendLow: string;
      legendHigh: string;
      caseCount: string;
      openAnalytics: string;
    };
    analytics: {
      title: string;
      subtitle: string;
      comingTitle: string;
      comingBody: string;
      periodLabel: string;
      periods: Record<"7d" | "30d" | "90d" | "all", string>;
      privacyNote: string;
      created: string;
      closed: string;
      avgResolution: string;
      byType: string;
      byPriority: string;
      byStatus: string;
      byCitizen: string;
      byCity: string;
      timeline: string;
      empty: string;
      exportCsv: string;
      exportDone: string;
      openMap: string;
    };
    team: {
      title: string;
      subtitle: string;
      individualOnly: string;
      you: string;
      adminRole: string;
      emptyTitle: string;
      emptyBody: string;
      readOnlyHint: string;
      noPermission: string;
      departmentsTitle: string;
      teamsTitle: string;
      membersTitle: string;
      deptName: string;
      addDept: string;
      noDepts: string;
      deptAdded: string;
      deptRemoved: string;
      teamName: string;
      teamDept: string;
      addTeam: string;
      noTeams: string;
      teamAdded: string;
      teamRemoved: string;
      noDeptLink: string;
      none: string;
      remove: string;
      inviteEmail: string;
      inviteName: string;
      inviteRole: string;
      inviteDept: string;
      inviteTeam: string;
      sendInvite: string;
      inviteSent: string;
      inviteDuplicate: string;
      inviteInvalid: string;
      noMembers: string;
      activate: string;
      suspend: string;
      removeMember: string;
      memberActivated: string;
      memberSuspended: string;
      memberRemoved: string;
      roleUpdated: string;
      roles: Record<
        | "INSTITUTION_ADMIN"
        | "INSTITUTION_MANAGER"
        | "ANALYST"
        | "OPERATOR"
        | "INSPECTOR"
        | "MODERATOR"
        | "READ_ONLY",
        string
      >;
      statuses: Record<"invited" | "active" | "suspended" | "left", string>;
    };
    inbox: {
      search: string;
      searchPlaceholder: string;
      priority: string;
      status: string;
      all: string;
      readOnlyHint: string;
    };
    routing: {
      title: string;
      subtitle: string;
      openConfig: string;
      readOnlyHint: string;
      awaitingLabel: string;
      routedLabel: string;
      queueTitle: string;
      queueEmpty: string;
      runForCase: string;
      jurisdictionsTitle: string;
      jurisdictionsHint: string;
      jurType: string;
      jurValue: string;
      addJur: string;
      noJurs: string;
      jurAdded: string;
      jurRemoved: string;
      remove: string;
      jurTypes: Record<
        "national" | "state" | "municipal" | "regional" | "local",
        string
      >;
      capabilitiesTitle: string;
      capabilitiesHint: string;
      policyTitle: string;
      anonymousReports: string;
      policyHint: string;
      policySaved: string;
    };
    integrations: {
      title: string;
      subtitle: string;
      honesty: string;
      readOnlyHint: string;
      connectionsTitle: string;
      connectionsHint: string;
      connName: string;
      connKind: string;
      endpointUrl: string;
      notes: string;
      noSecrets: string;
      addConnection: string;
      noConnections: string;
      connectionAdded: string;
      connectionRemoved: string;
      remove: string;
      runSync: string;
      syncOk: string;
      syncFail: string;
      syncMissingEndpoint: string;
      enable: string;
      disable: string;
      reenabled: string;
      disabled: string;
      logsTitle: string;
      logsHint: string;
      noLogs: string;
      exportTitle: string;
      exportHint: string;
      exportPeriod: string;
      exportPurpose: string;
      exportCsv: string;
      exportDone: string;
      exportLocked: string;
      noExports: string;
      defaultPurpose: string;
      rows: string;
      providersNote: string;
      kinds: Record<"api" | "webhook" | "import" | "export" | "partner", string>;
      providers: Record<
        | "generic_rest"
        | "generic_webhook"
        | "generic_csv_import"
        | "generic_csv_export"
        | "generic_partner_feed",
        string
      >;
      statuses: Record<
        | "pending"
        | "syncing"
        | "success"
        | "failed"
        | "retrying"
        | "disabled",
        string
      >;
      directions: Record<"inbound" | "outbound", string>;
    };
    settings: {
      genericTitle: string;
      genericBody: string;
    };
    errors: {
      institutionOnly: string;
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
    accountType: string;
    accountTypes: Record<
      "PERSON" | "ORGANIZATION" | "INSTITUTION" | "OTHER",
      string
    >;
    accountTypeHints: Record<
      "PERSON" | "ORGANIZATION" | "INSTITUTION" | "OTHER",
      string
    >;
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
      institution: string;
    };
    errors: {
      requiredFields: string;
      lgpdRequired: string;
      organizationTypeRequired: string;
      institutionTypeRequired: string;
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
