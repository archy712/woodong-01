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
    demoModeNotice: "데모 화면이라 실제로 저장되지는 않아요.",
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
    },
  },
  about: {
    headerTitle: "About next.js starter-kit3",
    badge: "Starter Kit",
    heroTitle: "next.js starter-kit v3",
    heroDescription:
      "A starter kit that comes with Next.js 16 and Supabase Auth already wired up, so you can start building right away.",
    features: [
      {
        title: "Next.js 16 App Router",
        description:
          'A modern App Router architecture with Cache Components ("use cache") enabled by default.',
      },
      {
        title: "Supabase Auth",
        description:
          "Email/password sign-in and Google OAuth login, backed by @supabase/ssr cookie sessions.",
      },
      {
        title: "Tailwind CSS v4 + shadcn/ui",
        description:
          "shadcn/ui components in the new-york style, with dark mode switching built in.",
      },
      {
        title: "Automated Dev Tooling",
        description:
          "ESLint, Prettier, Husky, lint-staged, and commitlint automate checks before every commit.",
      },
      {
        title: "Responsive UI",
        description:
          "A responsive layout that adapts naturally to every screen size, from mobile to desktop.",
      },
      {
        title: "Multi-language Support",
        description:
          "Supports Korean, English, Japanese, and Chinese, with the default language chosen automatically from your browser/system settings.",
      },
      {
        title: "Dark Mode Toggle",
        description:
          "Switch instantly between light, dark, and system themes with the toggle in the header.",
      },
    ],
    galleriesHeading: "Gallery Collection",
    galleriesDescription:
      "Components, icons, avatars, and charts collected as galleries so you can assemble UI faster.",
    galleries: [
      {
        title: "shadcn/ui Component Gallery",
        description:
          "From official shadcn/ui components like Button, Form, and Dialog to extensions like Tree View and data tables, all in one place.",
        cta: "View Component Gallery",
      },
      {
        title: "Icon Gallery",
        description:
          "Search every lucide-react icon bundled with this project and copy its import statement with one click.",
        cta: "View Icon Gallery",
      },
      {
        title: "Avatar Gallery",
        description:
          "Sizes, images, initials, status badges, and grouping — explore every way to use the Avatar component.",
        cta: "View Avatar Gallery",
      },
      {
        title: "Chart Gallery",
        description:
          "Bar, line, area, pie, radar and more — chart types built with recharts-based shadcn/ui Chart components.",
        cta: "View Chart Gallery",
      },
    ],
  },
  gallery: {
    headerTitle: "shadcn/ui Component Gallery",
    heading: "Component Gallery",
    description:
      "Browse every component in the official shadcn/ui registry alongside extension components commonly used in real projects.",
  },
  icons: {
    headerTitle: "lucide-react Icon Gallery",
    heading: "Icon Gallery",
    description:
      "Search every lucide-react icon bundled with this project and copy its import statement instantly.",
  },
  avatars: {
    headerTitle: "Avatar Gallery",
    heading: "Avatar Gallery",
    description:
      "Sizes, images, initials, status badges, and grouping — explore every way to use the shadcn/ui Avatar component.",
  },
  charts: {
    headerTitle: "Chart Gallery",
    heading: "Chart Gallery",
    description:
      "A collection of chart types built with recharts-based shadcn/ui Chart components.",
  },
  techStack: {
    headerTitle: "Tech Stack",
    heading: "Tech Stack",
    description:
      "The frameworks, libraries, and dev tools that make up this starter kit, organized by category.",
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
    reminderToastMessage:
      "You haven't paid your dues yet — a friendly reminder from Woodong!",
    // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
    incomeOnlyNotice:
      "회비는 수입만 집계돼요. 지출·잔액 관리는 추후 업데이트에서 지원할 예정이에요.",
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
      successToast:
        "투표를 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
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
    submitVoteSuccessToast:
      "투표했어요! (데모 화면이라 실제로 저장되지는 않아요)",
    notFound: "투표를 찾을 수 없거나 접근 권한이 없어요.",
  },
  notifications: {
    pageTitle: "Notification Center",
    markAllReadButton: "Mark All as Read",
    // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
    unreadLabel: "안읽음",
    readLabel: "읽음",
    emptyState: "아직 알림이 없어요. 새 소식이 오면 바로 알려드릴게요!",
    channelSettings: {
      title: "Notification Channel Settings",
      inApp: "In-app",
      kakao: "KakaoTalk",
      slack: "Slack",
      email: "Email",
      // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
      comingSoonNotice:
        "카카오톡·슬랙·이메일 발송은 다음 업데이트에서 지원할 예정이에요. 지금은 앱 내 알림만 실제로 전송돼요.",
      saveSuccessToast:
        "알림 설정을 저장했어요. (데모 화면이라 실제로 저장되지는 않아요)",
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
      "비밀번호가 너무 짧거나 단순해요. 6자 이상으로 다시 설정해 주세요.",
    authSamePassword:
      "지금 쓰고 있는 비밀번호와 같아요. 다른 비밀번호를 입력해 주세요.",
    authRateLimit: "요청이 너무 잦아요. 잠시 후 다시 시도해 주세요.",
    authIdentityAlreadyLinked:
      "이미 다른 우동 계정에 연결된 소셜 계정이에요. 다른 계정으로 시도해 주세요.",
    authLastIdentityGuard:
      "마지막 로그인 수단은 해제할 수 없어요. 다른 계정을 먼저 연동해 주세요.",
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
