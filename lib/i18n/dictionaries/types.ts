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
    or: string;
    groupIdLabel: string;
    memberCountSuffix: string;
    demoModeNotice: string;
    viewAllLink: string;
  };
  nav: {
    brandTagline: string;
    groupsLabel: string;
    notificationsLabel: string;
    profileLabel: string;
    logoutLabel: string;
    signInLabel: string;
    signUpLabel: string;
    groupTabs: {
      home: string;
      announcements: string;
      dues: string;
      votes: string;
      settings: string;
    };
  };
  home: {
    hero: {
      kicker: string;
      title: string;
      subtitle: string;
      cta: string;
    };
    features: {
      heading: string;
      description: string;
      items: { title: string; description: string }[];
    };
    footer: {
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
    detailTitle: string;
    detailNotFound: string;
    viewButton: string;
    dashboard: {
      announcementsTitle: string;
      duesTitle: string;
      votesTitle: string;
      noOpenVotes: string;
      unpaidCountLabel: string;
    };
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
      deleteDialogTitle: string;
      saveSuccessToast: string;
      deleteSuccessToast: string;
    };
    invite: {
      title: string;
      generateButton: string;
      reissueButton: string;
      copyLinkButton: string;
      codeLabel: string;
      expiresAtLabel: string;
      maxUsesLabel: string;
      usedCountLabel: string;
      emptyState: string;
      activeLabel: string;
      inactiveLabel: string;
      issueSuccessToast: string;
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
      previewNotice: string;
      expiredMessage: string;
      joinSuccessToast: string;
    };
    announcements: {
      pageTitle: string;
      createTitle: string;
      titleLabel: string;
      contentLabel: string;
      submitButton: string;
      writeButton: string;
      submitSuccessToast: string;
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
    type: {
      regular: string;
      extra: string;
    };
    create: {
      title: string;
      titleLabel: string;
      amountLabel: string;
      periodLabel: string;
      dueDateLabel: string;
      dueTypeLabel: string;
      reminderIntervalLabel: string;
      submitButton: string;
      createTriggerButton: string;
      successToast: string;
    };
    markPaidButton: string;
    reminderToastMessage: string;
    incomeOnlyNotice: string;
    memberProgressTitle: string;
    unpaidHighlightTitle: string;
    emptyState: string;
    recordPayment: {
      title: string;
      statusLabel: string;
      amountLabel: string;
      paidAtLabel: string;
      memoLabel: string;
      submitButton: string;
      successToast: string;
    };
  };
  votes: {
    pageTitle: string;
    detailTitle: string;
    voteIdLabel: string;
    type: {
      multipleChoice: string;
      yesNo: string;
    };
    create: {
      title: string;
      titleLabel: string;
      voteTypeLabel: string;
      optionsLabel: string;
      optionPlaceholder: string;
      addOptionButton: string;
      removeOptionButton: string;
      closesAtLabel: string;
      allowMultipleLabel: string;
      anonymousLabel: string;
      submitButton: string;
      successToast: string;
    };
    voteButton: string;
    statusOpen: string;
    statusClosed: string;
    closeNowButton: string;
    closeNowConfirmMessage: string;
    resultsTitle: string;
    minOptionsError: string;
    pastDeadlineError: string;
    emptyState: string;
    alreadyVotedNotice: string;
    notVotedYetNotice: string;
    anonymousResultsNotice: string;
    realNameResultsNotice: string;
    voterNamesLabel: string;
    responseCountSuffix: string;
    submitVoteSuccessToast: string;
    notFound: string;
  };
  notifications: {
    pageTitle: string;
    markAllReadButton: string;
    unreadLabel: string;
    readLabel: string;
    emptyState: string;
    channelSettings: {
      title: string;
      inApp: string;
      kakao: string;
      slack: string;
      email: string;
      comingSoonNotice: string;
      saveSuccessToast: string;
    };
    types: {
      announcement: string;
      dueReminder: string;
      voteStart: string;
      voteClose: string;
      settlementReport: string;
    };
  };
  me: {
    pageTitle: string;
    profileSectionTitle: string;
    editProfileButton: string;
    linkedAccountsSectionTitle: string;
    linkedAccountsNotice: string;
    connectedLabel: string;
    notConnectedLabel: string;
  };
  auth: {
    socialAccountLinkedToast: string;
    kakaoNoEmailNotice: string;
    manualLinkCta: string;
    loginWithGoogle: string;
    loginWithKakao: string;
    googleConnecting: string;
    login: {
      title: string;
      description: string;
      emailLabel: string;
      passwordLabel: string;
      forgotPasswordLink: string;
      submitButton: string;
      submittingButton: string;
      noAccountText: string;
      signUpLink: string;
    };
    signUp: {
      title: string;
      description: string;
      emailLabel: string;
      passwordLabel: string;
      repeatPasswordLabel: string;
      submitButton: string;
      submittingButton: string;
      haveAccountText: string;
      loginLink: string;
      passwordMismatchError: string;
    };
    signUpSuccess: {
      title: string;
      description: string;
      message: string;
    };
    forgotPassword: {
      title: string;
      description: string;
      emailLabel: string;
      submitButton: string;
      submittingButton: string;
      haveAccountText: string;
      loginLink: string;
      successTitle: string;
      successDescription: string;
      successMessage: string;
    };
    updatePassword: {
      title: string;
      description: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      submitButton: string;
      submittingButton: string;
    };
    error: {
      title: string;
      codeErrorPrefix: string;
      unspecifiedError: string;
    };
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
