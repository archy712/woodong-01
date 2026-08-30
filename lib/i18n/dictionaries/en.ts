import type { Dictionary } from "./types";

export const en: Dictionary = {
  common: {
    backToHome: "← Home",
    confirm: "Confirm",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    submit: "Submit",
    close: "Close",
    copy: "Copy",
    copied: "Copied",
    back: "Back",
    loading: "Loading...",
    retry: "Retry",
    required: "Required",
    or: "or",
    groupIdLabel: "Group ID",
    // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
    memberCountSuffix: "명 참여 중",
    viewAllLink: "전체 보기",
  },
  nav: {
    brandTagline: "Our Club",
    groupsLabel: "My Groups",
    notificationsLabel: "Notifications",
    profileLabel: "Profile",
    logoutLabel: "Log out",
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    theme: {
      label: "Change theme",
      light: "Light",
      dark: "Dark",
      system: "System",
    },
    groupTabs: {
      home: "Home",
      announcements: "Announcements",
      dues: "Dues",
      votes: "Votes",
      settings: "Settings",
    },
  },
  home: {
    hero: {
      kicker: 'Woodong — Korean for "our club"',
      title: "Run your group in one place, with Woodong",
      subtitle:
        "From dues to settlements, votes, and announcements — an easy-to-manage service for organizers, and an easy-to-join experience for members.",
      cta: "Get started for free",
      ctaLoggedIn: "View my groups",
    },
    techStackPreview: {
      heading: "Built on a solid stack",
      description:
        "Powered by the latest Next.js and Supabase for a fast, reliable experience.",
      items: ["Next.js 16", "Supabase", "Tailwind CSS", "shadcn/ui"],
      cta: "See the full tech stack",
    },
    features: {
      heading: "Key Features",
      description:
        "From creating a group to dues, settlements, votes, announcements, and notifications — everything you need to run a group, in one place.",
      items: [
        {
          title: "Group Management",
          description:
            "Create a group and invite members. Assign organizer and member roles to manage permissions.",
        },
        {
          title: "Dues Management",
          description:
            "Set up regular or one-off dues and see who has paid at a glance. Unpaid members are reminded automatically.",
        },
        {
          title: "Settlement Reports",
          description:
            "Log expenses and share transparent settlement reports with the whole group.",
        },
        {
          title: "Votes",
          description:
            "Raise an agenda item and run a vote until the deadline. Multiple-choice and anonymous voting are supported.",
        },
        {
          title: "Announcements",
          description: "Write up group news and notify every member.",
        },
        {
          title: "Notification Center",
          description:
            "See comments, votes, and dues reminders in one place, and configure notifications by channel.",
        },
      ],
    },
    footer: {
      techStack: "Tech Stack",
      componentGallery: "Component Gallery",
      iconGallery: "Icon Gallery",
      chartGallery: "Chart Gallery",
      avatarGallery: "Avatar Gallery",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
  },
  gallery: {
    heading: "Component Gallery",
    description:
      "Browse every component in the official shadcn/ui registry alongside extension components commonly used in real projects.",
  },
  icons: {
    heading: "Icon Gallery",
    description:
      "Search every lucide-react icon bundled with this project and copy its import statement instantly.",
  },
  avatars: {
    heading: "Avatar Gallery",
    description:
      "Sizes, images, initials, status badges, and grouping — explore every way to use the shadcn/ui Avatar component.",
  },
  charts: {
    heading: "Chart Gallery",
    description:
      "A collection of chart types built with recharts-based shadcn/ui Chart components.",
  },
  techStack: {
    heading: "Tech Stack",
    description:
      "The frameworks, libraries, and dev tools that Woodong is built on, organized by category.",
  },
  groups: {
    pageTitle: "My Groups",
    createButton: "Create Group",
    detailTitle: "Group Details",
    detailNotFound: "Group not found, or you don't have access to it.",
    // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
    viewButton: "모임 보기",
    dashboard: {
      announcementsTitle: "최근 공지",
      duesTitle: "회비 납부 현황",
      votesTitle: "진행 중인 투표",
      noOpenVotes: "진행 중인 투표가 없어요.",
      unpaidCountLabel: "명 미납",
    },
    create: {
      title: "Create a Group",
      description:
        "Just enter a group name to create it right away. You can always edit the rest later.",
      nameLabel: "Group Name",
      namePlaceholder: "e.g. Weekend Hiking Club",
      descriptionLabel: "Group Description (optional)",
      descriptionPlaceholder: "Give a short introduction to your group",
      typeLabel: "Group Type (optional)",
      typePlaceholder: "e.g. Club",
      defaultDueAmountLabel: "Default Dues Amount (optional)",
      defaultDueAmountPlaceholder: "e.g. 30000",
      submitButton: "Create Group",
      submittingLabel: "Creating...",
    },
    settings: {
      title: "Group Settings",
      infoSectionTitle: "Edit Group Info",
      membersSectionTitle: "Manage Members",
      inviteSectionTitle: "Invite Members",
      dangerZoneTitle: "Danger Zone",
      deleteButton: "Delete Group",
      deleteConfirmMessage:
        "Deleting this group will also delete its dues, settlement, and vote data. This action cannot be undone.",
      // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
      deleteDialogTitle: "정말 이 모임을 삭제할까요?",
      saveSuccessToast:
        "모임 정보를 저장했어요. (데모 화면이라 실제로 저장되지는 않아요)",
      deleteSuccessToast:
        "모임을 삭제했어요. (데모 화면이라 실제로 삭제되지는 않아요)",
      adminOnlyNotice: "모임 정보 수정은 총무만 할 수 있어요.",
      coverImageLabel: "대표 이미지",
      coverImageHint:
        "JPEG·PNG·WebP, 5MB 이하. 업로드할 때 자동으로 크기를 줄여 저장해요.",
      coverImageRemoveButton: "이미지 제거",
      coverUploadError: "이미지를 올리지 못했어요. 잠시 후 다시 시도해주세요.",
    },
    invite: {
      title: "Invite Members",
      generateButton: "Create Invite Link",
      reissueButton: "Reissue Code",
      copyLinkButton: "Copy Link",
      codeLabel: "Invite Code",
      expiresAtLabel: "Expires At",
      // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
      maxUsesLabel: "최대 사용 횟수",
      usedCountLabel: "회 사용됨",
      emptyState: "발급된 초대 링크가 없어요.",
      activeLabel: "사용 가능",
      inactiveLabel: "만료/무효화됨",
      // TODO(i18n): Task 020 new keys below are Korean placeholders, need translation.
      reissueNotice:
        "새 링크를 만들면 기존 링크는 자동으로 무효화돼요. 이미 참여한 멤버는 그대로 남아요.",
      createdAtLabel: "발급일",
      issueSuccessToast:
        "초대 링크를 만들었어요. 이전 링크는 더 이상 사용할 수 없어요.",
      revokeButton: "무효화",
      revokeDialogTitle: "이 초대 링크를 무효화할까요?",
      revokeConfirmMessage:
        "무효화하면 이 링크로는 더 이상 모임에 참여할 수 없어요. 이미 참여한 멤버는 그대로 남아요.",
      revokeSuccessToast: "초대 링크를 무효화했어요.",
      adminOnlyNotice: "초대 링크 발급은 총무만 할 수 있어요.",
    },
    members: {
      title: "Members",
      roleAdmin: "Organizer",
      roleMember: "Member",
      promoteButton: "Make Organizer",
      demoteButton: "Make Member",
      removeButton: "Remove",
      leaveButton: "Leave Group",
      // TODO(i18n): Task 021 new keys below are Korean placeholders, need translation.
      promoteDialogTitle: "총무로 지정할까요?",
      promoteConfirmMessage:
        "모임 정보 수정, 회비 관리, 멤버 관리까지 할 수 있게 돼요.",
      demoteDialogTitle: "일반회원으로 변경할까요?",
      demoteConfirmMessage:
        "총무 권한이 사라져 모임 설정과 회비를 관리할 수 없게 돼요.",
      removeDialogTitle: "이 멤버를 내보낼까요?",
      removeConfirmMessage:
        "다시 참여하려면 새 초대 링크가 필요해요. 지난 회비·투표 기록은 그대로 남아요.",
      leaveDialogTitle: "모임에서 나갈까요?",
      leaveConfirmMessage:
        "나가면 이 모임의 공지·회비·투표를 볼 수 없어요. 다시 들어오려면 초대 링크가 필요해요.",
      roleChangeSuccessToast: "역할을 변경했어요.",
      removeSuccessToast: "멤버를 내보냈어요.",
      leaveSuccessToast: "모임에서 나왔어요.",
      lastAdminNotice:
        "마지막 총무예요. 다른 멤버를 총무로 지정하면 역할을 바꾸거나 모임을 나갈 수 있어요.",
      memberViewNotice: "멤버 역할 변경과 내보내기는 총무만 할 수 있어요.",
      phoneLabel: "연락처",
      meLabel: "나",
      unnamedMemberLabel: "이름 미확인 멤버",
    },
    invitePage: {
      title: "Join Group",
      codeLabel: "Invite Code",
      joinButton: "Join",
      alreadyMemberMessage:
        "You're already a member of this group. Taking you to the group page.",
      // TODO(i18n): Task 012/017 new keys below are Korean placeholders, need translation.
      loginToJoinButton: "로그인하고 참여하기",
      previewNotice: "아래 모임의 초대를 받았어요. 참여하면 멤버로 등록돼요.",
      // TODO(i18n): Task 020 new keys below are Korean placeholders, need translation.
      alreadyMemberNotice: "이미 이 모임의 멤버예요.",
      goToGroupButton: "모임으로 이동",
      expiredMessage:
        "이 초대 링크는 만료됐어요. 총무에게 새 링크를 요청해주세요.",
      revokedMessage:
        "이 초대 링크는 무효화됐어요. 총무에게 새 링크를 요청해주세요.",
      exhaustedMessage:
        "이 초대 링크는 사용 가능 횟수를 모두 채웠어요. 총무에게 새 링크를 요청해주세요.",
      joinSuccessToast: "참여했어요! 이제 이 모임의 멤버예요.",
    },
    announcements: {
      pageTitle: "Announcements",
      createTitle: "Write an Announcement",
      titleLabel: "Title",
      contentLabel: "Content",
      submitButton: "Send",
      // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
      writeButton: "공지 작성",
      submitSuccessToast:
        "공지를 발송했어요. (데모 화면이라 실제로 저장되지는 않아요)",
      // TODO(i18n): Task 025 신규 키 — 2차 확장에서 번역
      notifiedCountSuffix: "명에게 알림을 보냈어요.",
      notifiedNoneNotice: "알림을 받을 다른 멤버가 아직 없어요.",
      editButton: "수정",
      editTitle: "공지 수정",
      editSubmitButton: "수정 저장",
      editSuccessToast: "공지를 수정했어요.",
      editedBadge: "수정됨",
      adminOnlyNotice: "공지 작성과 수정은 총무만 할 수 있어요.",
      notifyNotice: "발송하면 모임 멤버 전원에게 앱 내 알림이 전달돼요.",
      editNotifyNotice: "수정해도 알림은 다시 가지 않아요.",
    },
  },
  dues: {
    pageTitle: "Dues",
    summaryLabel: "This Month's Payment Rate",
    status: {
      paid: "Paid",
      partial: "Partially Paid",
      unpaid: "Unpaid",
    },
    // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
    type: {
      regular: "정기",
      extra: "번개/특별",
    },
    create: {
      title: "Create a Dues Item",
      titleLabel: "Item Name",
      amountLabel: "Amount",
      periodLabel: "Period",
      reminderIntervalLabel: "Reminder Interval (optional, days)",
      submitButton: "Create Dues Item",
      // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
      dueDateLabel: "납부 기한",
      dueTypeLabel: "회비 유형",
      createTriggerButton: "새 회비 항목",
      successToast:
        "회비 항목을 만들었어요. 활성 멤버 전원에게 청구가 생성됐어요.",
    },
    markPaidButton: "Mark as Paid",
    // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
    memberProgressTitle: "멤버별 납부 현황",
    unpaidHighlightTitle: "아직 납부하지 않은 멤버",
    emptyState: "등록된 회비 항목이 없어요.",
    // TODO(i18n): Task 024 신규 키 — 2차 확장에서 번역
    headcountRateLabel: "인원 기준",
    amountRateLabel: "금액 기준 수납률",
    paidCountSuffix: "명 납부완료",
    chargedCountSuffix: "명 청구",
    collectedAmountLabel: "수납",
    chargedAmountLabel: "청구",
    statusFilterLabel: "납부 상태로 거르기",
    filterAllLabel: "전체",
    filterEmptyState: "이 상태인 멤버가 없어요.",
    showUnpaidOnlyButton: "미납만 보기",
    recordPayment: {
      title: "납부 관리",
      statusLabel: "납부 상태",
      amountLabel: "납부 금액",
      paidAtLabel: "납부 확인일",
      memoLabel: "비고 (선택)",
      submitButton: "납부 기록하기",
      successToast: "납부 이력을 기록했어요.",
      historyTitle: "납부 이력",
      historyEmpty: "아직 기록된 납부 이력이 없어요.",
      addTitle: "납부 기록 추가",
      totalPaidLabel: "납부 누계",
      remainingLabel: "남은 금액",
      updateSuccessToast: "납부 이력을 수정했어요.",
      deleteDialogTitle: "이 납부 이력을 삭제할까요?",
      deleteConfirmMessage:
        "삭제하면 납부 상태가 남은 이력 기준으로 다시 계산돼요.",
      deleteSuccessToast: "납부 이력을 삭제했어요.",
    },
  },
  // TODO(i18n): Task 035 new keys below are Korean placeholders, need translation (Task 040).
  expenses: {
    sectionTitle: "지출 내역",
    addButton: "지출 등록",
    emptyState: "아직 등록된 지출이 없어요.",
    adminOnlyNotice: "지출 등록·수정은 총무만 할 수 있어요.",
    category: {
      meal: "회식비",
      event: "행사비",
      supplies: "비품비",
      venue: "대관료",
      transport: "교통비",
      other: "기타",
    },
    balance: {
      title: "모임 잔액",
      incomeLabel: "총 수입",
      expenseLabel: "총 지출",
      balanceLabel: "잔액",
      note: "총 수입은 실제로 납부 확인된 금액만 더한 값이에요(청구액이 아닙니다).",
    },
    form: {
      createTitle: "지출 등록",
      editTitle: "지출 수정",
      categoryLabel: "카테고리",
      categoryPlaceholder: "카테고리를 선택해주세요",
      amountLabel: "금액",
      spentAtLabel: "지출 일자",
      paidByLabel: "담당자",
      paidByNone: "선택 안 함",
      memoLabel: "비고",
      receiptLabel: "영수증",
      receiptHint: "JPEG·PNG·WebP, 최대 5MB. 같은 모임 멤버만 볼 수 있어요.",
      receiptRemoveButton: "영수증 제거",
      receiptUploadError:
        "영수증 업로드에 실패했어요. 잠시 후 다시 시도해주세요.",
      submitButton: "저장",
      submittingLabel: "저장하는 중...",
      createSuccessToast: "지출을 등록했어요.",
      updateSuccessToast: "지출을 수정했어요.",
    },
    receiptViewLabel: "영수증 보기",
    receiptNoneLabel: "영수증 없음",
    editButton: "수정",
    deleteButton: "삭제",
    deleteDialogTitle: "지출을 삭제할까요?",
    deleteConfirmMessage:
      "삭제하면 되돌릴 수 없고, 첨부한 영수증도 함께 지워져요.",
    deleteSuccessToast: "지출을 삭제했어요.",
  },
  settlements: {
    // TODO(i18n): Task 036 keys below are Korean placeholders, need translation.
    pageTitle: "정산 리포트",
    entryLinkLabel: "정산 리포트",
    backToDuesLabel: "회비 현황으로",
    emptyState: "아직 만든 정산 리포트가 없어요.",
    adminOnlyNotice: "정산 리포트 생성·발행은 총무만 할 수 있어요.",
    statusDraft: "초안",
    statusPublished: "발행됨",
    draftVisibilityNotice:
      "초안은 총무에게만 보여요. 금액을 확인한 뒤 발행하면 멤버 전원에게 알림이 갑니다.",
    create: {
      triggerButton: "새 정산 리포트",
      title: "정산 리포트 만들기",
      description:
        "기간을 정하면 그 기간의 회비 수납액과 지출을 모아 초안을 만들어요.",
      periodStartLabel: "정산 시작일",
      periodEndLabel: "정산 종료일",
      submitButton: "초안 만들기",
      submittingLabel: "계산하는 중...",
      successToast: "정산 초안을 만들었어요.",
    },
    recalculate: {
      triggerButton: "기간 수정·재계산",
      title: "기간 수정하고 다시 계산하기",
      description:
        "기간을 바꾸거나, 회비·지출을 고친 뒤 최신 금액으로 다시 계산할 때 사용해요.",
      submitButton: "다시 계산",
      submittingLabel: "계산하는 중...",
      successToast: "정산 초안을 다시 계산했어요.",
    },
    publish: {
      triggerButton: "발행",
      dialogTitle: "정산 리포트를 발행할까요?",
      confirmMessage:
        "발행하면 모임 멤버 전원에게 알림이 가고, 이후에는 금액을 수정할 수 없어요.",
      confirmButton: "발행",
      successToast: "정산 리포트를 발행했어요.",
      notifiedToastSuffix: "명에게 알렸어요.",
      notificationTitle: "정산 리포트가 발행되었어요",
      notificationBody: "모임의 수입·지출 정산 결과를 확인해보세요.",
    },
    delete: {
      triggerButton: "삭제",
      dialogTitle: "정산 리포트를 삭제할까요?",
      confirmMessage:
        "삭제하면 되돌릴 수 없어요. 다시 만들어 발행하면 멤버가 알림을 한 번 더 받아요.",
      successToast: "정산 리포트를 삭제했어요.",
    },
    detail: {
      notFound: "정산 리포트를 찾을 수 없어요.",
      incomeSectionTitle: "수입",
      expenseSectionTitle: "지출",
      totalIncomeLabel: "총 수입",
      totalExpenseLabel: "총 지출",
      balanceLabel: "잔액",
      entryCountSuffix: "건",
      noItems: "이 기간에 집계된 수입·지출이 없어요.",
      publishedAtLabel: "발행 일시",
      publishedByLabel: "발행자",
      createdByLabel: "작성자",
      snapshotNotice:
        "발행 시점의 수입·지출을 그대로 저장한 스냅샷이에요. 이후 회비·지출이 바뀌어도 이 리포트의 숫자는 변하지 않아요.",
      incomeNote:
        "수입은 실제로 납부 확인된 금액만 더한 값이에요(청구액이 아닙니다).",
      printButton: "PDF로 저장",
      printHint: '인쇄 창에서 대상을 "PDF로 저장"으로 선택하세요.',
    },
  },
  exports: {
    menuLabel: "Export data",
    menuDescription:
      "Download dues, expenses, and settlement records as CSV. Use it to hand over the books when the treasurer changes.",
    datasetLabel: {
      dues: "Dues charges",
      payments: "Payment history",
      expenses: "Expenses",
      settlements: "Settlement reports",
    },
    filename: {
      dues: "dues-charges",
      payments: "payment-history",
      expenses: "expenses",
      settlements: "settlement-reports",
    },
    settlementCsvButton: "Download CSV",
    itemTypeIncome: "Income",
    itemTypeExpense: "Expense",
    formerMemberLabel: "Former member",
    columns: {
      dues: {
        cycleTitle: "Dues item",
        period: "Period",
        dueType: "Type",
        dueDate: "Due date",
        memberName: "Member",
        chargedAmount: "Charged",
        paidAmount: "Paid",
        remainingAmount: "Outstanding",
        status: "Status",
        userId: "User ID",
        dueId: "Charge ID",
      },
      payments: {
        paidAt: "Paid on",
        cycleTitle: "Dues item",
        memberName: "Payer",
        amount: "Amount",
        memo: "Memo",
        recordedBy: "Recorded by",
        dueId: "Charge ID",
        paymentId: "Payment ID",
      },
      expenses: {
        spentAt: "Spent on",
        category: "Category",
        amount: "Amount",
        paidBy: "Paid by",
        memo: "Note",
        receiptPath: "Receipt path",
        createdAt: "Created on",
        expenseId: "Expense ID",
      },
      settlements: {
        periodStart: "Period start",
        periodEnd: "Period end",
        status: "Status",
        publishedAt: "Published on",
        totalIncome: "Total income",
        totalExpense: "Total expense",
        balance: "Balance",
        itemType: "Kind",
        category: "Category",
        description: "Description",
        amount: "Amount",
        entryCount: "Entries",
        settlementId: "Settlement ID",
      },
    },
  },
  votes: {
    pageTitle: "Votes",
    detailTitle: "Vote Details",
    voteIdLabel: "Vote ID",
    // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
    type: {
      multipleChoice: "객관식",
      yesNo: "찬반",
    },
    create: {
      title: "Create a Vote",
      titleLabel: "Vote Title",
      optionsLabel: "Options",
      addOptionButton: "Add Option",
      closesAtLabel: "Closing Date/Time",
      allowMultipleLabel: "Allow Multiple Choices",
      anonymousLabel: "Anonymous Vote",
      submitButton: "Create Vote",
      // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
      voteTypeLabel: "투표 형식",
      optionPlaceholder: "선택지를 입력해주세요",
      removeOptionButton: "삭제",
      successToast: "투표를 만들었어요.",
      notifiedCountSuffix: "명에게 알림을 보냈어요.",
      notifiedNoneNotice: "알림을 받을 다른 멤버가 아직 없어요.",
    },
    voteButton: "Vote",
    statusOpen: "Open",
    statusClosed: "Closed",
    closeNowButton: "Close Now",
    closeNowConfirmMessage:
      "Close this vote now? This action cannot be undone.",
    resultsTitle: "Vote Results",
    minOptionsError: "Please enter at least 2 options.",
    pastDeadlineError: "Please set a closing time in the future.",
    // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
    emptyState: "진행 중인 투표가 없어요.",
    alreadyVotedNotice: "이미 참여한 투표예요.",
    notVotedYetNotice: "아직 참여하지 않았어요. 지금 투표해보세요!",
    anonymousResultsNotice: "익명 투표라 참여자 수만 표시돼요.",
    realNameResultsNotice: "참여자 이름이 함께 표시돼요.",
    voterNamesLabel: "참여자",
    responseCountSuffix: "표",
    submitVoteSuccessToast: "투표했어요!",
    notFound: "투표를 찾을 수 없거나 접근 권한이 없어요.",
    notificationTitle: "새 투표가 시작됐어요",
    notificationBody: "마감 전에 투표에 참여해주세요.",
    adminOnlyNotice: "투표는 총무만 만들 수 있어요.",
    closedNotice: "마감된 투표라 더 이상 참여할 수 없어요.",
    closeNowDialogTitle: "투표를 마감할까요?",
    closeNowSuccessToast: "투표를 마감했어요.",
    closeNowAlreadyClosedToast: "이미 마감된 투표예요.",
    closeNotifiedCountSuffix: "명에게 결과 알림을 보냈어요.",
    closeNotificationTitle: "투표가 마감됐어요",
    closeNotificationBody: "투표 결과를 확인해보세요.",
  },
  notifications: {
    pageTitle: "Notification Center",
    markAllReadButton: "Mark All as Read",
    // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
    unreadLabel: "안읽음",
    readLabel: "읽음",
    emptyState: "아직 알림이 없어요. 새 소식이 오면 바로 알려드릴게요!",
    // TODO(i18n): Task 026 new keys below are Korean placeholders, need translation.
    unreadCountSuffix: "건의 새 알림이 있어요",
    allReadMessage: "새 알림을 모두 확인했어요.",
    markAllReadSuccessSuffix: "건을 읽음으로 표시했어요.",
    markReadErrorToast: "읽음 처리에 실패했어요. 잠시 후 다시 시도해주세요.",
    unreadBadgeLabel: "안 읽은 알림",
    channelSettings: {
      title: "Notification Channel Settings",
      inApp: "In-app",
      webPush: "Web Push",
      // TODO(i18n): Task 012/027 new keys below are Korean placeholders, need translation.
      inAppDescription: "알림센터와 종 아이콘으로 받아요.",
      webPushDescription:
        "브라우저 알림으로 받아요. 켜면 이 브라우저의 알림 권한을 요청해요.",
      comingSoonNotice:
        "앱 내 알림을 끄면 새 공지가 와도 알림센터에 쌓이지 않아요. 웹 푸시 발송이 끝내 실패하면 앱 내 알림으로 대신 남겨 드려요.",
      saveSuccessToast: "알림 설정을 저장했어요.",
      saveErrorToast:
        "알림 설정을 저장하지 못했어요. 잠시 후 다시 시도해주세요.",
      // TODO(i18n): Task 038 웹 푸시 문구, 한국어 임시
      webPushUnsupported: "이 브라우저는 웹 푸시를 지원하지 않아요.",
      webPushPermissionDenied:
        "브라우저에서 알림이 차단돼 있어요. 주소창 옆 사이트 설정에서 알림을 허용한 뒤 다시 켜주세요.",
      webPushSubscribeErrorToast:
        "브라우저 알림을 켜지 못했어요. 잠시 후 다시 시도해주세요.",
      webPushActiveNotice:
        "지금 이 브라우저로 알림을 받고 있어요. 다른 기기에서 켜면 이 기기의 구독은 해제돼요.",
      webPushMissingKeyNotice:
        "이 환경에는 웹 푸시 키가 설정되지 않아 켤 수 없어요.",
      webPushIosInstallTitle: "iPhone·iPad는 홈 화면에 추가해야 받을 수 있어요",
      webPushIosInstallBody:
        "Safari 아래쪽 공유 버튼 → '홈 화면에 추가'로 우동을 설치한 뒤, 설치된 우동에서 이 스위치를 켜주세요.",
    },
    types: {
      announcement: "Announcement",
      dueReminder: "Dues Reminder",
      voteStart: "New Vote Started",
      voteClose: "Vote Results",
      settlementReport: "Settlement Report Published",
    },
  },
  me: {
    pageTitle: "My Page",
    // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
    profileSectionTitle: "프로필",
    editProfileButton: "프로필 수정하기",
    linkedAccountsSectionTitle: "연동된 계정",
    linkedAccountsNotice:
      "연동한 계정 중 아무거나로 로그인하면 같은 모임 정보를 볼 수 있어요.",
    linkedAccountsLoadError:
      "연동 정보를 불러오지 못했어요. 잠시 후 새로고침해 주세요.",
    connectedLabel: "연동됨",
    notConnectedLabel: "연동 안 됨",
    emailProviderLabel: "이메일",
    linkAccountButton: "연동하기",
    unlinkAccountButton: "연동 해제",
    lastIdentityNotice:
      "마지막 로그인 수단은 해제할 수 없어요. 다른 계정을 먼저 연동해 주세요.",
    unlinkConfirmTitle: "연동을 해제할까요?",
    unlinkConfirmDescription:
      "이 계정으로는 더 이상 로그인할 수 없어요. 모임 정보는 그대로 남아 있고, 언제든 다시 연동할 수 있어요.",
    unlinkConfirmCancel: "취소",
    unlinkConfirmAction: "해제하기",
    unlinkSuccessToast: "연동을 해제했어요.",
  },
  auth: {
    socialAccountLinkedToast: "Linked to your existing account.",
    kakaoNoEmailNotice:
      "Your Kakao account didn't provide an email, so a separate account was created. Link a Google account from My Page to add a second way to sign in.",
    manualLinkCta: "Link Account",
    loginWithGoogle: "Continue with Google",
    loginWithKakao: "Continue with Kakao",
    socialConnecting: "Connecting...",
    login: {
      title: "Login",
      description: "Sign in with your email to see your groups.",
      emailLabel: "Email",
      passwordLabel: "Password",
      submitButton: "Login",
      submittingButton: "Logging in...",
      noAccountText: "Don't have an account?",
      signUpLink: "Sign up",
    },
    signUp: {
      title: "Sign up",
      description: "Create a new account.",
      emailLabel: "Email",
      passwordLabel: "Password",
      repeatPasswordLabel: "Confirm Password",
      submitButton: "Sign up",
      submittingButton: "Creating account...",
      haveAccountText: "Already have an account?",
      loginLink: "Login",
      passwordMismatchError: "Passwords do not match.",
    },
    changePassword: {
      title: "Change Password",
      currentPasswordLabel: "Current Password",
      newPasswordLabel: "New Password",
      confirmPasswordLabel: "Confirm New Password",
      submitButton: "Change Password",
      submittingButton: "Changing...",
      successMessage: "Your password has been changed.",
      passwordMismatchError: "New passwords do not match.",
      currentPasswordIncorrectError: "Current password is incorrect.",
    },
    error: {
      title: "Sorry, something went wrong.",
      codeErrorPrefix: "Error code: ",
      unspecifiedError: "An unspecified error occurred.",
    },
  },
  errors: {
    networkError: "Please check your network connection.",
    notFound: "We couldn't find what you're looking for.",
    invalidInviteCode: "This invite code is invalid.",
    genericError: "A temporary error occurred. Please try again shortly.",
    lastAdminGuard:
      "The last organizer can't change roles or leave the group. Please assign another member as organizer first.",
    // TODO(i18n): Task 018-1 new keys below are Korean placeholders, need translation.
    authInvalidCredentials: "이메일 또는 비밀번호가 올바르지 않아요.",
    authEmailTaken: "이미 가입된 이메일이에요. 로그인해 주세요.",
    authWeakPassword:
      "That password is too short or too simple. Please use at least 8 characters.",
    authSamePassword:
      "지금 쓰고 있는 비밀번호와 같아요. 다른 비밀번호를 입력해 주세요.",
    authRateLimit: "요청이 너무 잦아요. 잠시 후 다시 시도해 주세요.",
    authIdentityAlreadyLinked:
      "이미 다른 우동 계정에 연결된 소셜 계정이에요. 다른 계정으로 시도해 주세요.",
    authLastIdentityGuard:
      "마지막 로그인 수단은 해제할 수 없어요. 다른 계정을 먼저 연동해 주세요.",
    authCurrentPasswordInvalid: "That current password isn't correct.",
  },
  legal: {
    effectiveDateLabel: "Effective date",
    canonicalNotice:
      "The Korean text below is the legally binding version. This translation of the page heading is provided for convenience only.",
    privacy: {
      heading: "Privacy Policy",
      description:
        "What personal data Woodong collects, why it is used, and who inside a group can see it.",
    },
    terms: {
      heading: "Terms of Service",
      description:
        "The rights and obligations that apply to you and to the operator when you use Woodong.",
    },
    consent: {
      label: "I agree to the {terms} and the {privacy}.",
      termsLinkText: "Terms of Service",
      privacyLinkText: "Privacy Policy",
      requiredError:
        "You must agree to the Terms of Service and the Privacy Policy to sign up.",
    },
  },
  emptyStates: {
    noGroups: "You're not part of any group yet. Let Woodong help!",
    noDues: "No dues items yet.",
    noVotes: "No votes are open right now.",
    noAnnouncements: "No announcements yet.",
    noNotifications: "No notifications yet. We'll let you know right away!",
    noMembers: "No members yet.",
  },
};
