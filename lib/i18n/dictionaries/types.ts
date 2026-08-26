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
    /** 테마 전환 드롭다운(Task 031 — 아이콘만 있는 트리거의 접근 가능한 이름). */
    theme: {
      label: string;
      light: string;
      dark: string;
      system: string;
    };
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
      ctaLoggedIn: string;
    };
    features: {
      heading: string;
      description: string;
      items: { title: string; description: string }[];
    };
    techStackPreview: {
      heading: string;
      description: string;
      items: string[];
      cta: string;
    };
    footer: {
      techStack: string;
      componentGallery: string;
      iconGallery: string;
      chartGallery: string;
      avatarGallery: string;
      /** 법적 고지 링크(Task 034). 개발자 문서 링크와 다른 줄에 놓인다. */
      privacyPolicy: string;
      termsOfService: string;
    };
  };
  gallery: {
    heading: string;
    description: string;
  };
  icons: {
    heading: string;
    description: string;
  };
  avatars: {
    heading: string;
    description: string;
  };
  charts: {
    heading: string;
    description: string;
  };
  techStack: {
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
      adminOnlyNotice: string;
      coverImageLabel: string;
      coverImageHint: string;
      coverImageRemoveButton: string;
      coverUploadError: string;
    };
    invite: {
      title: string;
      generateButton: string;
      reissueButton: string;
      reissueNotice: string;
      copyLinkButton: string;
      codeLabel: string;
      createdAtLabel: string;
      expiresAtLabel: string;
      maxUsesLabel: string;
      usedCountLabel: string;
      emptyState: string;
      activeLabel: string;
      inactiveLabel: string;
      issueSuccessToast: string;
      revokeButton: string;
      revokeDialogTitle: string;
      revokeConfirmMessage: string;
      revokeSuccessToast: string;
      adminOnlyNotice: string;
    };
    members: {
      title: string;
      roleAdmin: string;
      roleMember: string;
      promoteButton: string;
      demoteButton: string;
      removeButton: string;
      leaveButton: string;
      promoteDialogTitle: string;
      promoteConfirmMessage: string;
      demoteDialogTitle: string;
      demoteConfirmMessage: string;
      removeDialogTitle: string;
      removeConfirmMessage: string;
      leaveDialogTitle: string;
      leaveConfirmMessage: string;
      roleChangeSuccessToast: string;
      removeSuccessToast: string;
      leaveSuccessToast: string;
      lastAdminNotice: string;
      memberViewNotice: string;
      phoneLabel: string;
      meLabel: string;
      unnamedMemberLabel: string;
    };
    invitePage: {
      title: string;
      codeLabel: string;
      joinButton: string;
      loginToJoinButton: string;
      alreadyMemberMessage: string;
      alreadyMemberNotice: string;
      goToGroupButton: string;
      previewNotice: string;
      expiredMessage: string;
      revokedMessage: string;
      exhaustedMessage: string;
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
      notifiedCountSuffix: string;
      notifiedNoneNotice: string;
      editButton: string;
      editTitle: string;
      editSubmitButton: string;
      editSuccessToast: string;
      editedBadge: string;
      adminOnlyNotice: string;
      notifyNotice: string;
      editNotifyNotice: string;
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
    /** 회비 리마인드 알림 제목에서 회비 항목 이름 뒤에 붙는 문구(Task 028). */
    reminderNotificationTitleSuffix: string;
    /** 회비 리마인드 알림 본문(Task 028). */
    reminderNotificationBody: string;
    memberProgressTitle: string;
    unpaidHighlightTitle: string;
    emptyState: string;
    headcountRateLabel: string;
    amountRateLabel: string;
    paidCountSuffix: string;
    chargedCountSuffix: string;
    collectedAmountLabel: string;
    chargedAmountLabel: string;
    statusFilterLabel: string;
    filterAllLabel: string;
    filterEmptyState: string;
    showUnpaidOnlyButton: string;
    recordPayment: {
      title: string;
      statusLabel: string;
      amountLabel: string;
      paidAtLabel: string;
      memoLabel: string;
      submitButton: string;
      successToast: string;
      historyTitle: string;
      historyEmpty: string;
      addTitle: string;
      totalPaidLabel: string;
      remainingLabel: string;
      updateSuccessToast: string;
      deleteDialogTitle: string;
      deleteConfirmMessage: string;
      deleteSuccessToast: string;
    };
  };
  /** 지출 내역·잔액 (PRD 3.4-b, Task 035). */
  expenses: {
    sectionTitle: string;
    addButton: string;
    emptyState: string;
    adminOnlyNotice: string;
    /** `woodong_expenses.category` CHECK 제약과 1:1로 대응한다. 값을 늘리면 여기도 함께 늘린다. */
    category: {
      meal: string;
      event: string;
      supplies: string;
      venue: string;
      transport: string;
      other: string;
    };
    balance: {
      title: string;
      incomeLabel: string;
      expenseLabel: string;
      balanceLabel: string;
      /** 수입이 "청구액"이 아니라 "실제 수납액"임을 알리는 각주. */
      note: string;
    };
    form: {
      createTitle: string;
      editTitle: string;
      categoryLabel: string;
      categoryPlaceholder: string;
      amountLabel: string;
      spentAtLabel: string;
      paidByLabel: string;
      paidByNone: string;
      memoLabel: string;
      receiptLabel: string;
      receiptHint: string;
      receiptRemoveButton: string;
      receiptUploadError: string;
      submitButton: string;
      submittingLabel: string;
      createSuccessToast: string;
      updateSuccessToast: string;
    };
    receiptViewLabel: string;
    receiptNoneLabel: string;
    editButton: string;
    deleteButton: string;
    deleteDialogTitle: string;
    deleteConfirmMessage: string;
    deleteSuccessToast: string;
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
      /** 생성 알림 팬아웃 건수 뒤에 붙는 문구(Task 029). */
      notifiedCountSuffix: string;
      /** 알림 대상이 0명일 때의 안내(Task 029). */
      notifiedNoneNotice: string;
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
    /** "새 투표 시작" 알림 제목(Task 029). 뒤에 투표 제목이 붙는다. */
    notificationTitle: string;
    /** "새 투표 시작" 알림 본문(Task 029). */
    notificationBody: string;
    /** 총무가 아닌 사용자가 투표 생성 화면에 들어왔을 때의 안내(Task 029). */
    adminOnlyNotice: string;
    /** 마감 시각이 지난 투표에서 참여 위젯 대신 보여주는 안내(Task 029). */
    closedNotice: string;
    /** 수동 조기마감 확인 다이얼로그 제목(Task 030). */
    closeNowDialogTitle: string;
    /** 수동 조기마감 성공 토스트(Task 030). */
    closeNowSuccessToast: string;
    /** 이미 마감돼 있어서 아무것도 하지 않았을 때의 안내(Task 030). */
    closeNowAlreadyClosedToast: string;
    /** 마감 결과 알림 팬아웃 건수 뒤에 붙는 문구(Task 030). */
    closeNotifiedCountSuffix: string;
    /** "투표 마감" 결과 알림 제목(Task 030). 뒤에 투표 제목이 붙는다. */
    closeNotificationTitle: string;
    /** "투표 마감" 결과 알림 본문(Task 030). */
    closeNotificationBody: string;
  };
  notifications: {
    pageTitle: string;
    markAllReadButton: string;
    unreadLabel: string;
    readLabel: string;
    emptyState: string;
    /** 미읽음 건수 뒤에 붙는 문구(`3` + 이 문구). */
    unreadCountSuffix: string;
    /** 미읽음이 0건일 때 목록 상단에 대신 보여주는 문구. */
    allReadMessage: string;
    /** "모두 읽음" 성공 토스트에서 처리 건수 뒤에 붙는 문구. */
    markAllReadSuccessSuffix: string;
    /** 읽음/클릭 처리 실패 토스트. */
    markReadErrorToast: string;
    /** 헤더 종 아이콘의 미읽음 뱃지 스크린리더 라벨. */
    unreadBadgeLabel: string;
    channelSettings: {
      title: string;
      inApp: string;
      /** 웹 푸시 채널 이름(v1.6에서 카카오톡/슬랙/이메일을 대체). */
      webPush: string;
      /** `in_app` 채널의 보조 설명. */
      inAppDescription: string;
      /** `web_push` 채널의 보조 설명 — 1차에서는 설정만 저장된다는 안내. */
      webPushDescription: string;
      comingSoonNotice: string;
      saveSuccessToast: string;
      /** 저장 실패 토스트. */
      saveErrorToast: string;
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
    linkedAccountsLoadError: string;
    connectedLabel: string;
    notConnectedLabel: string;
    emailProviderLabel: string;
    linkAccountButton: string;
    unlinkAccountButton: string;
    lastIdentityNotice: string;
    unlinkConfirmTitle: string;
    unlinkConfirmDescription: string;
    unlinkConfirmCancel: string;
    unlinkConfirmAction: string;
    unlinkSuccessToast: string;
  };
  auth: {
    socialAccountLinkedToast: string;
    kakaoNoEmailNotice: string;
    manualLinkCta: string;
    loginWithGoogle: string;
    loginWithKakao: string;
    socialConnecting: string;
    login: {
      title: string;
      description: string;
      emailLabel: string;
      passwordLabel: string;
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
    changePassword: {
      title: string;
      currentPasswordLabel: string;
      newPasswordLabel: string;
      confirmPasswordLabel: string;
      submitButton: string;
      submittingButton: string;
      successMessage: string;
      passwordMismatchError: string;
      currentPasswordIncorrectError: string;
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
    authInvalidCredentials: string;
    authEmailTaken: string;
    authWeakPassword: string;
    authSamePassword: string;
    authRateLimit: string;
    authIdentityAlreadyLinked: string;
    authLastIdentityGuard: string;
    authCurrentPasswordInvalid: string;
  };
  /**
   * 법적 고지 페이지(Task 034). **본문은 여기 없다** — 처리방침·약관 전문은
   * `lib/legal/`의 한국어 정본 하나만 두고, 이 사전에는 페이지 제목·요약·
   * "정본은 한국어" 안내 같은 UI 문구만 4개 언어로 유지한다(결정 D-3).
   */
  legal: {
    effectiveDateLabel: string;
    /** ko를 제외한 로케일에서 본문 위에 노출하는 정본 언어 안내. */
    canonicalNotice: string;
    privacy: {
      heading: string;
      description: string;
    };
    terms: {
      heading: string;
      description: string;
    };
    /** 회원가입 필수 동의 문구. `{terms}`/`{privacy}`가 링크로 치환된다. */
    consent: {
      label: string;
      termsLinkText: string;
      privacyLinkText: string;
      requiredError: string;
    };
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
