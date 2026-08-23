export interface Dictionary {
  common: {
    backToHome: string;
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    submit: string;
    close: string;
    copy: string;
    copied: string;
    back: string;
    loading: string;
    retry: string;
    required: string;
  };
  nav: {
    groupsLabel: string;
    notificationsLabel: string;
    devDocsLabel: string;
    groupTabs: {
      home: string;
      announcements: string;
      dues: string;
      votes: string;
      settings: string;
    };
  };
  home: {
    heading: string;
    footer: {
      about: string;
      techStack: string;
      componentGallery: string;
      iconGallery: string;
      chartGallery: string;
      avatarGallery: string;
    };
  };
  about: {
    headerTitle: string;
    badge: string;
    heroTitle: string;
    heroDescription: string;
    features: { title: string; description: string }[];
    galleriesHeading: string;
    galleriesDescription: string;
    galleries: { title: string; description: string; cta: string }[];
  };
  gallery: {
    headerTitle: string;
    heading: string;
    description: string;
  };
  icons: {
    headerTitle: string;
    heading: string;
    description: string;
  };
  avatars: {
    headerTitle: string;
    heading: string;
    description: string;
  };
  charts: {
    headerTitle: string;
    heading: string;
    description: string;
  };
  techStack: {
    headerTitle: string;
    heading: string;
    description: string;
  };
  groups: {
    pageTitle: string;
    createButton: string;
    detailNotFound: string;
    create: {
      title: string;
      description: string;
      nameLabel: string;
      namePlaceholder: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      typeLabel: string;
      typePlaceholder: string;
      defaultDueAmountLabel: string;
      defaultDueAmountPlaceholder: string;
      submitButton: string;
      submittingLabel: string;
    };
    settings: {
      title: string;
      infoSectionTitle: string;
      membersSectionTitle: string;
      inviteSectionTitle: string;
      dangerZoneTitle: string;
      deleteButton: string;
      deleteConfirmMessage: string;
    };
    invite: {
      title: string;
      generateButton: string;
      reissueButton: string;
      copyLinkButton: string;
      codeLabel: string;
      expiresAtLabel: string;
    };
    members: {
      title: string;
      roleAdmin: string;
      roleMember: string;
      changeRoleButton: string;
      removeButton: string;
    };
    invitePage: {
      title: string;
      codeLabel: string;
      joinButton: string;
      alreadyMemberMessage: string;
    };
    announcements: {
      pageTitle: string;
      createTitle: string;
      titleLabel: string;
      contentLabel: string;
      submitButton: string;
    };
  };
  dues: {
    pageTitle: string;
    summaryLabel: string;
    status: {
      paid: string;
      partial: string;
      unpaid: string;
    };
    create: {
      title: string;
      titleLabel: string;
      amountLabel: string;
      periodLabel: string;
      reminderIntervalLabel: string;
      submitButton: string;
    };
    markPaidButton: string;
    reminderToastMessage: string;
  };
  votes: {
    pageTitle: string;
    create: {
      title: string;
      titleLabel: string;
      optionsLabel: string;
      addOptionButton: string;
      closesAtLabel: string;
      allowMultipleLabel: string;
      anonymousLabel: string;
      submitButton: string;
    };
    voteButton: string;
    statusOpen: string;
    statusClosed: string;
    closeNowButton: string;
    closeNowConfirmMessage: string;
    resultsTitle: string;
    minOptionsError: string;
    pastDeadlineError: string;
  };
  notifications: {
    pageTitle: string;
    markAllReadButton: string;
    channelSettings: {
      title: string;
      inApp: string;
      kakao: string;
      slack: string;
      email: string;
    };
    types: {
      announcement: string;
      dueReminder: string;
      voteStart: string;
      voteClose: string;
      settlementReport: string;
    };
  };
  auth: {
    socialAccountLinkedToast: string;
    kakaoNoEmailNotice: string;
    manualLinkCta: string;
    loginWithGoogle: string;
    loginWithKakao: string;
  };
  errors: {
    networkError: string;
    notFound: string;
    invalidInviteCode: string;
    genericError: string;
    lastAdminGuard: string;
  };
  emptyStates: {
    noGroups: string;
    noDues: string;
    noVotes: string;
    noAnnouncements: string;
    noNotifications: string;
    noMembers: string;
  };
}
