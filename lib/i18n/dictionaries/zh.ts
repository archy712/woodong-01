import type { Dictionary } from "./types";

export const zh: Dictionary = {
  common: {
    backToHome: "← 返回首页",
    // TODO(i18n): 2차 확장에서 번역 예정 — 현재는 ko.ts 문구를 스텁으로 복사
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
  },
  // TODO(i18n): 2차 확장에서 번역 예정 — 현재는 ko.ts 문구를 스텁으로 복사
  nav: {
    groupsLabel: "내 모임",
    notificationsLabel: "알림",
    devDocsLabel: "개발자 문서",
    groupTabs: {
      home: "홈",
      announcements: "공지",
      dues: "회비",
      votes: "투표",
      settings: "설정",
    },
  },
  home: {
    heading: "Next.js 入门套件 3",
    footer: {
      about: "next.js 入门套件3简介",
      techStack: "技术栈",
      componentGallery: "组件展示馆",
      iconGallery: "图标展示馆",
      chartGallery: "图表展示馆",
      avatarGallery: "头像展示馆",
    },
  },
  about: {
    headerTitle: "next.js 入门套件3简介",
    badge: "Starter Kit",
    heroTitle: "next.js starter-kit v3",
    heroDescription:
      "这是一个已经配置好 Next.js 16 和 Supabase Auth 认证的入门套件，让你可以立即开始开发。",
    features: [
      {
        title: "Next.js 16 App Router",
        description:
          '默认启用 Cache Components("use cache") 的最新 App Router 架构。',
      },
      {
        title: "Supabase Auth",
        description:
          "基于 @supabase/ssr 的 Cookie 会话，支持邮箱/密码认证和 Google OAuth 登录。",
      },
      {
        title: "Tailwind CSS v4 + shadcn/ui",
        description: "new-york 风格的 shadcn/ui 组件，默认支持深色模式切换。",
      },
      {
        title: "开发工具自动化",
        description:
          "通过 ESLint、Prettier、Husky、lint-staged、commitlint 自动化提交前检查。",
      },
      {
        title: "响应式 UI",
        description: "从移动端到桌面端，布局都能根据屏幕尺寸自然适配。",
      },
      {
        title: "多语言支持",
        description:
          "支持韩语、英语、日语、中文四种语言，默认语言会根据浏览器/系统语言设置自动选择。",
      },
      {
        title: "深色模式切换",
        description:
          "通过页头的切换按钮，可即时在浅色、深色、跟随系统主题间切换。",
      },
    ],
    galleriesHeading: "展示馆合集",
    galleriesDescription:
      "将组件、图标、头像、图表整理成展示馆形式，帮助你更快搭建界面。",
    galleries: [
      {
        title: "shadcn/ui 组件展示馆",
        description:
          "从 Button、Form、Dialog 等 shadcn/ui 官方组件，到 Tree View、数据表格等扩展组件，一站式浏览。",
        cta: "查看组件展示馆",
      },
      {
        title: "图标展示馆",
        description:
          "搜索本项目内置的全部 lucide-react 图标，一键复制 import 语句。",
        cta: "查看图标展示馆",
      },
      {
        title: "头像展示馆",
        description:
          "尺寸、图片、首字母、状态徽标、分组显示——探索 Avatar 组件的多种用法。",
        cta: "查看头像展示馆",
      },
      {
        title: "图表展示馆",
        description:
          "基于 recharts 的 shadcn/ui Chart 组件实现的柱状图、折线图、面积图、饼图、雷达图等多种图表类型。",
        cta: "查看图表展示馆",
      },
    ],
  },
  gallery: {
    headerTitle: "shadcn/ui 组件展示馆",
    heading: "组件展示馆",
    description:
      "浏览 shadcn/ui 官方注册表中的全部组件，以及实际项目中常用的扩展组件。",
  },
  icons: {
    headerTitle: "lucide-react 图标展示馆",
    heading: "图标展示馆",
    description:
      "搜索本项目内置的全部 lucide-react 图标，立即复制 import 语句。",
  },
  avatars: {
    headerTitle: "头像展示馆",
    heading: "头像展示馆",
    description:
      "尺寸、图片、首字母、状态徽标、分组显示——探索 shadcn/ui Avatar 组件的多种用法。",
  },
  charts: {
    headerTitle: "图表展示馆",
    heading: "图表展示馆",
    description:
      "基于 recharts 的 shadcn/ui Chart 组件实现的多种图表类型合集。",
  },
  techStack: {
    headerTitle: "技术栈",
    heading: "技术栈",
    description: "按类别整理的构成本入门套件的框架、库和开发工具。",
  },
  // TODO(i18n): 아래 우동 도메인 네임스페이스는 2차 확장에서 번역 예정 — 현재는 ko.ts 문구를 스텁으로 복사
  groups: {
    pageTitle: "모임 목록",
    createButton: "모임 만들기",
    detailNotFound: "모임을 찾을 수 없거나 접근 권한이 없어요.",
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
    },
    invite: {
      title: "멤버 초대",
      generateButton: "초대 링크 만들기",
      reissueButton: "코드 재발급",
      copyLinkButton: "링크 복사",
      codeLabel: "초대 코드",
      expiresAtLabel: "만료일",
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
    },
    announcements: {
      pageTitle: "공지사항",
      createTitle: "공지사항 작성",
      titleLabel: "제목",
      contentLabel: "내용",
      submitButton: "발송하기",
    },
  },
  dues: {
    pageTitle: "회비 현황",
    summaryLabel: "이번 달 납부율",
    status: {
      paid: "납부완료",
      partial: "부분납부",
      unpaid: "미납",
    },
    create: {
      title: "회비 항목 만들기",
      titleLabel: "항목 이름",
      amountLabel: "금액",
      periodLabel: "대상 기간",
      reminderIntervalLabel: "리마인드 주기 (일)",
      submitButton: "회비 항목 만들기",
    },
    markPaidButton: "납부완료로 변경",
    reminderToastMessage:
      "아직 회비 납부 전이시네요. 우동이 살짝 알려드릴게요!",
  },
  votes: {
    pageTitle: "투표 목록",
    create: {
      title: "투표 만들기",
      titleLabel: "투표 제목",
      optionsLabel: "선택지",
      addOptionButton: "선택지 추가",
      closesAtLabel: "마감 일시",
      allowMultipleLabel: "복수 선택 허용",
      anonymousLabel: "익명 투표",
      submitButton: "투표 만들기",
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
  },
  notifications: {
    pageTitle: "알림센터",
    markAllReadButton: "모두 읽음으로 표시",
    channelSettings: {
      title: "알림 채널 설정",
      inApp: "앱 내 알림",
      kakao: "카카오톡",
      slack: "슬랙",
      email: "이메일",
    },
    types: {
      announcement: "공지",
      dueReminder: "회비 납부 리마인드",
      voteStart: "새 투표 시작",
      voteClose: "투표 마감 결과",
      settlementReport: "정산 리포트 발행",
    },
  },
  auth: {
    socialAccountLinkedToast: "기존 계정에 연결됐어요.",
    kakaoNoEmailNotice:
      "카카오 계정이 이메일을 제공하지 않아 별도 계정으로 가입돼요. 마이페이지에서 이메일 계정과 연동할 수 있어요.",
    manualLinkCta: "계정 연동하기",
    loginWithGoogle: "Google로 계속하기",
    loginWithKakao: "카카오로 계속하기",
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
