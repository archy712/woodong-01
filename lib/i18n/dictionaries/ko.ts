import type { Dictionary } from "./types";

export const ko: Dictionary = {
  common: {
    backToHome: "← 홈으로",
    confirm: "확인",
    cancel: "취소",
    save: "저장",
    delete: "삭제",
    edit: "수정",
    submit: "제출",
    close: "닫기",
    copy: "복사",
    copied: "복사했어요",
    back: "뒤로",
    loading: "불러오는 중...",
    retry: "다시 시도",
    required: "필수",
    or: "또는",
    groupIdLabel: "모임 ID",
    memberCountSuffix: "명 참여 중",
    demoModeNotice: "데모 화면이라 실제로 저장되지는 않아요.",
    viewAllLink: "전체 보기",
  },
  nav: {
    brandTagline: "우리동호회",
    groupsLabel: "내 모임",
    notificationsLabel: "알림",
    profileLabel: "프로필",
    logoutLabel: "로그아웃",
    signInLabel: "로그인",
    signUpLabel: "회원가입",
    groupTabs: {
      home: "홈",
      announcements: "공지",
      dues: "회비",
      votes: "투표",
      settings: "설정",
    },
  },
  home: {
    hero: {
      kicker: "우리 동호회 운영 플랫폼",
      title: "모임 운영을 한 곳에서,\n우동과 함께 기록하고 관리하세요",
      subtitle:
        "회비, 정산, 투표, 공지까지\n총무는 관리하기 쉽고 멤버는 참여하기 편한 모임 운영 서비스입니다.",
      cta: "무료로 시작하기",
      ctaLoggedIn: "내 모임 보기",
    },
    techStackPreview: {
      heading: "탄탄한 기술 스택 위에서",
      description:
        "최신 Next.js와 Supabase를 기반으로 빠르고 안정적으로 동작합니다.",
      items: ["Next.js 16", "Supabase", "Tailwind CSS", "shadcn/ui"],
      cta: "기술 스택 더 보기",
    },
    features: {
      heading: "주요 기능",
      description:
        "생성부터 회비, 정산, 투표, 공지, 알림까지 — 모임 운영에 필요한 기능을 한 곳에 담았습니다.",
      items: [
        {
          title: "모임 관리",
          description:
            "모임을 만들고 멤버를 초대하세요. 총무와 일반회원 역할을 구분해 권한을 관리할 수 있습니다.",
        },
        {
          title: "회비 관리",
          description:
            "정기·추가 회비를 등록하고 멤버별 납부 현황을 한눈에 확인하세요. 미납자에게는 자동으로 리마인드가 발송됩니다.",
        },
        {
          title: "정산 리포트",
          description:
            "지출 내역을 기록하고 모임 전체에 정산 리포트를 투명하게 공유하세요.",
        },
        {
          title: "투표",
          description:
            "안건을 올리고 마감일까지 투표를 진행하세요. 복수 선택과 익명 투표도 지원합니다.",
        },
        {
          title: "공지사항",
          description: "모임 소식을 작성해 멤버 전원에게 알리세요.",
        },
        {
          title: "알림센터",
          description:
            "댓글·투표·회비 리마인드 등 모든 소식을 한 곳에서 확인하고 채널별로 알림을 설정하세요.",
        },
      ],
    },
    footer: {
      techStack: "기술 스택",
      componentGallery: "컴포넌트 갤러리",
      iconGallery: "아이콘 갤러리",
      chartGallery: "차트 갤러리",
      avatarGallery: "아바타 갤러리",
    },
  },
  about: {
    headerTitle: "next.js 스타터킷3 소개",
    badge: "Starter Kit",
    heroTitle: "next.js starter-kit v3",
    heroDescription:
      "Next.js 16과 Supabase Auth로 인증까지 준비된 상태에서 바로 개발을 시작할 수 있는 스타터킷입니다.",
    features: [
      {
        title: "Next.js 16 App Router",
        description:
          'Cache Components("use cache")를 활성화한 최신 App Router 아키텍처를 기본으로 제공합니다.',
      },
      {
        title: "Supabase Auth",
        description:
          "이메일/비밀번호 인증과 Google OAuth 로그인을 @supabase/ssr 기반 쿠키 세션으로 지원합니다.",
      },
      {
        title: "Tailwind CSS v4 + shadcn/ui",
        description:
          "new-york 스타일의 shadcn/ui 컴포넌트와 다크모드 전환을 기본 제공합니다.",
      },
      {
        title: "개발 도구 자동화",
        description:
          "ESLint, Prettier, Husky, lint-staged, commitlint로 커밋 전 검사를 자동화했습니다.",
      },
      {
        title: "반응형 UI",
        description:
          "모바일부터 데스크톱까지 화면 크기에 맞춰 자연스럽게 적응하는 반응형 레이아웃을 제공합니다.",
      },
      {
        title: "다국어 지원",
        description:
          "한국어, 영어, 일본어, 중국어 4개 언어를 지원하며, 브라우저·시스템 언어 설정에 따라 기본 언어가 자동으로 선택됩니다.",
      },
      {
        title: "다크모드 토글",
        description:
          "라이트・다크・시스템 테마를 헤더의 토글 버튼으로 즉시 전환할 수 있습니다.",
      },
    ],
    galleriesHeading: "갤러리 모음",
    galleriesDescription:
      "UI를 빠르게 조립할 수 있도록 컴포넌트·아이콘·아바타·차트를 갤러리 형태로 모아두었습니다.",
    galleries: [
      {
        title: "shadcn/ui 컴포넌트 갤러리",
        description:
          "Button, Form, Dialog 같은 shadcn/ui 공식 컴포넌트부터 Tree View·데이터 테이블 같은 확장 컴포넌트까지 한 곳에서 살펴볼 수 있습니다.",
        cta: "컴포넌트 갤러리 보기",
      },
      {
        title: "아이콘 갤러리",
        description:
          "이 프로젝트에 포함된 lucide-react 아이콘 전체를 검색하고 클릭 한 번으로 import 구문을 복사할 수 있습니다.",
        cta: "아이콘 갤러리 보기",
      },
      {
        title: "아바타 갤러리",
        description:
          "크기, 이미지, 이니셜, 상태 배지, 그룹 표시까지 Avatar 컴포넌트의 다양한 활용 방법을 모아볼 수 있습니다.",
        cta: "아바타 갤러리 보기",
      },
      {
        title: "차트 갤러리",
        description:
          "recharts 기반 shadcn/ui Chart 컴포넌트로 구현한 막대·선·영역·파이·레이더 등 다양한 차트 유형을 살펴볼 수 있습니다.",
        cta: "차트 갤러리 보기",
      },
    ],
  },
  gallery: {
    headerTitle: "shadcn/ui 컴포넌트 갤러리",
    heading: "컴포넌트 갤러리",
    description:
      "shadcn/ui 공식 레지스트리의 모든 컴포넌트와, 실무에서 자주 쓰이는 확장 컴포넌트를 함께 모아 살펴볼 수 있습니다.",
  },
  icons: {
    headerTitle: "lucide-react 아이콘 갤러리",
    heading: "아이콘 갤러리",
    description:
      "이 프로젝트에 포함된 lucide-react의 모든 아이콘을 검색하고 바로 import 구문을 복사할 수 있습니다.",
  },
  avatars: {
    headerTitle: "아바타 갤러리",
    heading: "아바타 갤러리",
    description:
      "크기, 이미지, 이니셜, 상태 배지, 그룹 표시까지 shadcn/ui Avatar 컴포넌트의 다양한 활용 방법을 모아 살펴볼 수 있습니다.",
  },
  charts: {
    headerTitle: "차트 갤러리",
    heading: "차트 갤러리",
    description:
      "recharts 기반 shadcn/ui Chart 컴포넌트로 구현한 다양한 차트 유형을 모아 살펴볼 수 있습니다.",
  },
  techStack: {
    headerTitle: "기술 스택",
    heading: "기술 스택",
    description:
      "이 스타터킷을 구성하는 프레임워크, 라이브러리, 개발 도구를 분야별로 정리했습니다.",
  },
  groups: {
    pageTitle: "모임 목록",
    createButton: "모임 만들기",
    detailTitle: "모임 상세",
    detailNotFound: "모임을 찾을 수 없거나 접근 권한이 없어요.",
    viewButton: "모임 보기",
    dashboard: {
      announcementsTitle: "최근 공지",
      duesTitle: "회비 납부 현황",
      votesTitle: "진행 중인 투표",
      noOpenVotes: "진행 중인 투표가 없어요.",
      unpaidCountLabel: "명 미납",
    },
    create: {
      title: "모임 만들기",
      description:
        "모임 이름만 입력하면 바로 만들 수 있어요. 나머지 정보는 언제든 수정할 수 있습니다.",
      nameLabel: "모임 이름",
      namePlaceholder: "예: 주말 등산 모임",
      descriptionLabel: "모임 소개 (선택)",
      descriptionPlaceholder: "모임을 간단히 소개해주세요",
      typeLabel: "모임 유형 (선택)",
      typePlaceholder: "예: 동호회",
      defaultDueAmountLabel: "기본 회비 금액 (선택, 원)",
      defaultDueAmountPlaceholder: "예: 30000",
      submitButton: "모임 만들기",
      submittingLabel: "만드는 중...",
    },
    settings: {
      title: "모임 설정",
      infoSectionTitle: "모임 정보 수정",
      membersSectionTitle: "멤버 관리",
      inviteSectionTitle: "멤버 초대",
      dangerZoneTitle: "위험 구역",
      deleteButton: "모임 삭제",
      deleteConfirmMessage:
        "모임을 삭제하면 회비, 정산, 투표 데이터가 함께 삭제돼요. 이 작업은 되돌릴 수 없어요.",
      deleteDialogTitle: "정말 이 모임을 삭제할까요?",
      saveSuccessToast:
        "모임 정보를 저장했어요. (데모 화면이라 실제로 저장되지는 않아요)",
      deleteSuccessToast:
        "모임을 삭제했어요. (데모 화면이라 실제로 삭제되지는 않아요)",
    },
    invite: {
      title: "멤버 초대",
      generateButton: "초대 링크 만들기",
      reissueButton: "코드 재발급",
      copyLinkButton: "링크 복사",
      codeLabel: "초대 코드",
      expiresAtLabel: "만료일",
      maxUsesLabel: "최대 사용 횟수",
      usedCountLabel: "회 사용됨",
      emptyState: "발급된 초대 링크가 없어요.",
      activeLabel: "사용 가능",
      inactiveLabel: "만료/무효화됨",
      issueSuccessToast:
        "초대 링크를 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    members: {
      title: "멤버 목록",
      roleAdmin: "총무",
      roleMember: "일반회원",
      changeRoleButton: "역할 변경",
      removeButton: "내보내기",
    },
    invitePage: {
      title: "초대 참여",
      codeLabel: "초대 코드",
      joinButton: "참여하기",
      alreadyMemberMessage:
        "이미 참여 중인 모임이에요. 모임 페이지로 이동할게요.",
      previewNotice: "아래 모임의 초대를 받았어요. 참여하면 멤버로 등록돼요.",
      expiredMessage: "이 초대 링크는 만료되었거나 더 이상 사용할 수 없어요.",
      joinSuccessToast:
        "참여했어요! (데모 화면이라 실제로 멤버로 등록되지는 않아요)",
    },
    announcements: {
      pageTitle: "공지사항",
      createTitle: "공지사항 작성",
      titleLabel: "제목",
      contentLabel: "내용",
      submitButton: "발송하기",
      writeButton: "공지 작성",
      submitSuccessToast:
        "공지를 발송했어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
  },
  dues: {
    pageTitle: "회비 현황",
    summaryLabel: "전체 납부율",
    status: {
      paid: "납부완료",
      partial: "부분납부",
      unpaid: "미납",
    },
    type: {
      regular: "정기",
      extra: "번개/특별",
    },
    create: {
      title: "회비 항목 만들기",
      titleLabel: "항목 이름",
      amountLabel: "금액",
      periodLabel: "대상 기간",
      dueDateLabel: "납부 기한",
      dueTypeLabel: "회비 유형",
      reminderIntervalLabel: "리마인드 주기 (일)",
      submitButton: "회비 항목 만들기",
      createTriggerButton: "새 회비 항목",
      successToast:
        "회비 항목을 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    markPaidButton: "납부완료로 변경",
    reminderToastMessage:
      "아직 회비 납부 전이시네요. 우동이 살짝 알려드릴게요!",
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
    pageTitle: "투표 목록",
    detailTitle: "투표 상세",
    voteIdLabel: "투표 ID",
    type: {
      multipleChoice: "객관식",
      yesNo: "찬반",
    },
    create: {
      title: "투표 만들기",
      titleLabel: "투표 제목",
      voteTypeLabel: "투표 형식",
      optionsLabel: "선택지",
      optionPlaceholder: "선택지를 입력해주세요",
      addOptionButton: "선택지 추가",
      removeOptionButton: "삭제",
      closesAtLabel: "마감 일시",
      allowMultipleLabel: "복수 선택 허용",
      anonymousLabel: "익명 투표",
      submitButton: "투표 만들기",
      successToast:
        "투표를 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    voteButton: "투표하기",
    statusOpen: "진행중",
    statusClosed: "마감",
    closeNowButton: "지금 마감",
    closeNowConfirmMessage:
      "투표를 지금 마감할까요? 이 작업은 되돌릴 수 없어요.",
    resultsTitle: "투표 결과",
    minOptionsError: "선택지는 2개 이상 입력해주세요.",
    pastDeadlineError: "마감일시는 지금 이후로 설정해주세요.",
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
    pageTitle: "알림센터",
    markAllReadButton: "모두 읽음으로 표시",
    unreadLabel: "안읽음",
    readLabel: "읽음",
    emptyState: "아직 알림이 없어요. 새 소식이 오면 바로 알려드릴게요!",
    channelSettings: {
      title: "알림 채널 설정",
      inApp: "앱 내 알림",
      kakao: "카카오톡",
      slack: "슬랙",
      email: "이메일",
      comingSoonNotice:
        "카카오톡·슬랙·이메일 발송은 다음 업데이트에서 지원할 예정이에요. 지금은 앱 내 알림만 실제로 전송돼요.",
      saveSuccessToast:
        "알림 설정을 저장했어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    types: {
      announcement: "공지",
      dueReminder: "회비 납부 리마인드",
      voteStart: "새 투표 시작",
      voteClose: "투표 마감 결과",
      settlementReport: "정산 리포트 발행",
    },
  },
  me: {
    pageTitle: "마이페이지",
    profileSectionTitle: "프로필",
    editProfileButton: "프로필 수정하기",
    linkedAccountsSectionTitle: "연동된 계정",
    linkedAccountsNotice:
      "Google·카카오 소셜 로그인 연동 관리는 다음 업데이트에서 지원할 예정이에요.",
    connectedLabel: "연동됨",
    notConnectedLabel: "연동 안 됨",
  },
  auth: {
    socialAccountLinkedToast: "기존 계정에 연결됐어요.",
    kakaoNoEmailNotice:
      "카카오 계정이 이메일을 제공하지 않아 별도 계정으로 가입돼요. 마이페이지에서 이메일 계정과 연동할 수 있어요.",
    manualLinkCta: "계정 연동하기",
    loginWithGoogle: "Google로 계속하기",
    loginWithKakao: "카카오로 계속하기",
    googleConnecting: "연결하는 중...",
    login: {
      title: "로그인",
      description: "이메일로 로그인해 모임을 확인하세요.",
      emailLabel: "이메일",
      passwordLabel: "비밀번호",
      forgotPasswordLink: "비밀번호를 잊으셨나요?",
      submitButton: "로그인",
      submittingButton: "로그인하는 중...",
      noAccountText: "계정이 없으신가요?",
      signUpLink: "회원가입",
    },
    signUp: {
      title: "회원가입",
      description: "새 계정을 만들어보세요.",
      emailLabel: "이메일",
      passwordLabel: "비밀번호",
      repeatPasswordLabel: "비밀번호 확인",
      submitButton: "회원가입",
      submittingButton: "계정을 만드는 중...",
      haveAccountText: "이미 계정이 있으신가요?",
      loginLink: "로그인",
      passwordMismatchError: "비밀번호가 일치하지 않아요.",
    },
    signUpSuccess: {
      title: "회원가입을 완료했어요!",
      description: "이메일을 확인해주세요",
      message:
        "회원가입이 완료되었어요. 로그인하기 전에 이메일을 확인해 계정을 인증해주세요.",
    },
    forgotPassword: {
      title: "비밀번호 재설정",
      description: "이메일을 입력하면 비밀번호 재설정 링크를 보내드려요.",
      emailLabel: "이메일",
      submitButton: "재설정 메일 보내기",
      submittingButton: "보내는 중...",
      haveAccountText: "이미 계정이 있으신가요?",
      loginLink: "로그인",
      successTitle: "이메일을 확인해주세요",
      successDescription: "비밀번호 재설정 안내를 보냈어요",
      successMessage:
        "이메일과 비밀번호로 가입하셨다면 비밀번호 재설정 메일을 받으실 수 있어요.",
    },
    updatePassword: {
      title: "비밀번호 재설정",
      description: "새 비밀번호를 입력해주세요.",
      passwordLabel: "새 비밀번호",
      passwordPlaceholder: "새 비밀번호",
      submitButton: "비밀번호 저장",
      submittingButton: "저장하는 중...",
    },
    error: {
      title: "문제가 발생했어요.",
      codeErrorPrefix: "오류 코드: ",
      unspecifiedError: "알 수 없는 오류가 발생했어요.",
    },
  },
  errors: {
    networkError: "네트워크 연결을 확인해주세요.",
    notFound: "요청하신 정보를 찾을 수 없어요.",
    invalidInviteCode: "유효하지 않은 초대 코드예요.",
    genericError: "일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
    lastAdminGuard:
      "마지막 총무는 역할을 변경하거나 모임을 나갈 수 없어요. 먼저 다른 멤버를 총무로 지정해주세요.",
  },
  emptyStates: {
    noGroups: "아직 속한 모임이 없어요. 우동, 모임을 부탁해!",
    noDues: "등록된 회비 항목이 없어요.",
    noVotes: "진행 중인 투표가 없어요.",
    noAnnouncements: "아직 등록된 공지가 없어요.",
    noNotifications: "아직 알림이 없어요. 새 소식이 오면 바로 알려드릴게요!",
    noMembers: "아직 멤버가 없어요.",
  },
};
