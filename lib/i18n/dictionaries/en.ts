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
      issueSuccessToast:
        "초대 링크를 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    members: {
      title: "Members",
      roleAdmin: "Organizer",
      roleMember: "Member",
      changeRoleButton: "Change Role",
      removeButton: "Remove",
    },
    invitePage: {
      title: "Join Group",
      codeLabel: "Invite Code",
      joinButton: "Join",
      alreadyMemberMessage:
        "You're already a member of this group. Taking you to the group page.",
      // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
      previewNotice: "아래 모임의 초대를 받았어요. 참여하면 멤버로 등록돼요.",
      expiredMessage: "이 초대 링크는 만료되었거나 더 이상 사용할 수 없어요.",
      joinSuccessToast:
        "참여했어요! (데모 화면이라 실제로 멤버로 등록되지는 않아요)",
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
      reminderIntervalLabel: "Reminder Interval (days)",
      submitButton: "Create Dues Item",
      // TODO(i18n): Task 012 new keys below are Korean placeholders, need translation.
      dueDateLabel: "납부 기한",
      dueTypeLabel: "회비 유형",
      createTriggerButton: "새 회비 항목",
      successToast:
        "회비 항목을 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
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
    recordPayment: {
      title: "납부 상태 변경",
      statusLabel: "납부 상태",
      amountLabel: "납부 금액",
      paidAtLabel: "납부 확인일",
      memoLabel: "비고 (선택)",
      submitButton: "저장",
      successToast:
        "납부 상태를 변경했어요. (데모 화면이라 실제로 저장되지는 않아요)",
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
      "Google·카카오 소셜 로그인 연동 관리는 다음 업데이트에서 지원할 예정이에요.",
    connectedLabel: "연동됨",
    notConnectedLabel: "연동 안 됨",
  },
  auth: {
    socialAccountLinkedToast: "Linked to your existing account.",
    kakaoNoEmailNotice:
      "Your Kakao account didn't provide an email, so a separate account was created. You can link it to your email account from My Page.",
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
