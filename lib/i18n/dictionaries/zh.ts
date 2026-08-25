import type { Dictionary } from "./types";

export const zh: Dictionary = {
  common: {
    backToHome: "← 返回首页",
    confirm: "确认",
    cancel: "取消",
    save: "保存",
    delete: "删除",
    edit: "编辑",
    submit: "提交",
    close: "关闭",
    copy: "复制",
    copied: "已复制",
    back: "返回",
    loading: "加载中...",
    retry: "重试",
    required: "必填",
    or: "或",
    groupIdLabel: "小组 ID",
    // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
    memberCountSuffix: "명 참여 중",
    demoModeNotice: "데모 화면이라 실제로 저장되지는 않아요.",
    viewAllLink: "전체 보기",
  },
  nav: {
    brandTagline: "我们的同好会",
    groupsLabel: "我的小组",
    notificationsLabel: "通知",
    profileLabel: "个人资料",
    logoutLabel: "退出登录",
    signInLabel: "登录",
    signUpLabel: "注册",
    groupTabs: {
      home: "首页",
      announcements: "公告",
      dues: "会费",
      votes: "投票",
      settings: "设置",
    },
  },
  home: {
    hero: {
      kicker: "Woodong＝韩语里的“我们的同好会”",
      title: "在一个地方运营你的小组，与 Woodong 一起",
      subtitle:
        "从会费到结算、投票、公告——组长易于管理，成员也能轻松参与的小组运营服务。",
      cta: "免费开始使用",
      ctaLoggedIn: "查看我的小组",
    },
    techStackPreview: {
      heading: "构建在稳固的技术栈之上",
      description: "基于最新的 Next.js 和 Supabase，快速而稳定地运行。",
      items: ["Next.js 16", "Supabase", "Tailwind CSS", "shadcn/ui"],
      cta: "查看完整技术栈",
    },
    features: {
      heading: "主要功能",
      description:
        "从创建小组到会费、结算、投票、公告、通知——运营小组所需的一切功能都在这里。",
      items: [
        {
          title: "小组管理",
          description: "创建小组并邀请成员。区分组长和普通成员角色，管理权限。",
        },
        {
          title: "会费管理",
          description:
            "登记定期或临时会费，一目了然地查看每位成员的缴费情况。未缴费成员将自动收到提醒。",
        },
        {
          title: "结算报告",
          description: "记录支出明细，向全体成员透明地分享结算报告。",
        },
        {
          title: "投票",
          description: "发起议题并在截止日期前进行投票。支持多选和匿名投票。",
        },
        {
          title: "公告",
          description: "撰写小组动态，通知全体成员。",
        },
        {
          title: "通知中心",
          description:
            "在一个地方查看评论、投票、会费提醒等所有消息，并按渠道设置通知。",
        },
      ],
    },
    footer: {
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
  groups: {
    pageTitle: "小组列表",
    createButton: "创建小组",
    detailTitle: "小组详情",
    detailNotFound: "找不到该小组，或你没有访问权限。",
    // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
    viewButton: "모임 보기",
    dashboard: {
      announcementsTitle: "최근 공지",
      duesTitle: "회비 납부 현황",
      votesTitle: "진행 중인 투표",
      noOpenVotes: "진행 중인 투표가 없어요.",
      unpaidCountLabel: "명 미납",
    },
    create: {
      title: "创建小组",
      description: "只需输入小组名称即可立即创建，其余信息可随时修改。",
      nameLabel: "小组名称",
      namePlaceholder: "例：周末登山小组",
      descriptionLabel: "小组介绍（可选）",
      descriptionPlaceholder: "简单介绍一下你的小组吧",
      typeLabel: "小组类型（可选）",
      typePlaceholder: "例：兴趣社团",
      defaultDueAmountLabel: "默认会费金额（可选）",
      defaultDueAmountPlaceholder: "例：30000",
      submitButton: "创建小组",
      submittingLabel: "创建中...",
    },
    settings: {
      title: "小组设置",
      infoSectionTitle: "编辑小组信息",
      membersSectionTitle: "成员管理",
      inviteSectionTitle: "邀请成员",
      dangerZoneTitle: "危险操作区",
      deleteButton: "删除小组",
      deleteConfirmMessage:
        "删除小组将同时删除会费、结算、投票数据。此操作无法撤销。",
      // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
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
      title: "邀请成员",
      generateButton: "生成邀请链接",
      reissueButton: "重新生成邀请码",
      copyLinkButton: "复制链接",
      codeLabel: "邀请码",
      expiresAtLabel: "过期时间",
      // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
      maxUsesLabel: "최대 사용 횟수",
      usedCountLabel: "회 사용됨",
      emptyState: "발급된 초대 링크가 없어요.",
      activeLabel: "사용 가능",
      inactiveLabel: "만료/무효화됨",
      // TODO(i18n): Task 020 新增键为韩语占位文案，待翻译
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
      title: "成员列表",
      roleAdmin: "组长",
      roleMember: "普通成员",
      promoteButton: "设为组长",
      demoteButton: "改为普通成员",
      removeButton: "移除",
      leaveButton: "退出小组",
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
      title: "加入小组",
      codeLabel: "邀请码",
      joinButton: "加入",
      alreadyMemberMessage: "你已经是该小组的成员了，即将跳转到小组页面。",
      // TODO(i18n): Task 012/017 新增键为韩语占位文案，待翻译
      loginToJoinButton: "로그인하고 참여하기",
      previewNotice: "아래 모임의 초대를 받았어요. 참여하면 멤버로 등록돼요.",
      // TODO(i18n): Task 020 新增键为韩语占位文案，待翻译
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
      pageTitle: "公告",
      createTitle: "撰写公告",
      titleLabel: "标题",
      contentLabel: "内容",
      submitButton: "发送",
      // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
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
    pageTitle: "会费情况",
    summaryLabel: "本月缴费率",
    status: {
      paid: "已缴费",
      partial: "部分缴费",
      unpaid: "未缴费",
    },
    // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
    type: {
      regular: "정기",
      extra: "번개/특별",
    },
    create: {
      title: "创建会费项目",
      titleLabel: "项目名称",
      amountLabel: "金额",
      periodLabel: "适用期间",
      reminderIntervalLabel: "提醒周期（选填，天）",
      submitButton: "创建会费项目",
      // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
      dueDateLabel: "납부 기한",
      dueTypeLabel: "회비 유형",
      createTriggerButton: "새 회비 항목",
      successToast:
        "회비 항목을 만들었어요. 활성 멤버 전원에게 청구가 생성됐어요.",
    },
    markPaidButton: "标记为已缴费",
    reminderToastMessage: "你还没有缴纳会费哦，Woodong 悄悄提醒你一下！",
    // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
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
    pageTitle: "投票列表",
    detailTitle: "投票详情",
    voteIdLabel: "投票 ID",
    // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
    type: {
      multipleChoice: "객관식",
      yesNo: "찬반",
    },
    create: {
      title: "创建投票",
      titleLabel: "投票标题",
      optionsLabel: "选项",
      addOptionButton: "添加选项",
      closesAtLabel: "截止时间",
      allowMultipleLabel: "允许多选",
      anonymousLabel: "匿名投票",
      submitButton: "创建投票",
      // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
      voteTypeLabel: "투표 형식",
      optionPlaceholder: "선택지를 입력해주세요",
      removeOptionButton: "삭제",
      successToast:
        "투표를 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    voteButton: "投票",
    statusOpen: "进行中",
    statusClosed: "已截止",
    closeNowButton: "立即截止",
    closeNowConfirmMessage: "确定要立即截止投票吗？此操作无法撤销。",
    resultsTitle: "投票结果",
    minOptionsError: "请至少输入 2 个选项。",
    pastDeadlineError: "请将截止时间设置为当前时间之后。",
    // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
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
    pageTitle: "通知中心",
    markAllReadButton: "全部标记为已读",
    // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
    unreadLabel: "안읽음",
    readLabel: "읽음",
    emptyState: "아직 알림이 없어요. 새 소식이 오면 바로 알려드릴게요!",
    // TODO(i18n): Task 026 新增键为韩语占位文案，待翻译
    unreadCountSuffix: "건의 새 알림이 있어요",
    allReadMessage: "새 알림을 모두 확인했어요.",
    markAllReadSuccessSuffix: "건을 읽음으로 표시했어요.",
    markReadErrorToast: "읽음 처리에 실패했어요. 잠시 후 다시 시도해주세요.",
    unreadBadgeLabel: "안 읽은 알림",
    channelSettings: {
      title: "通知渠道设置",
      inApp: "应用内通知",
      kakao: "KakaoTalk",
      slack: "Slack",
      email: "邮箱",
      // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
      comingSoonNotice:
        "카카오톡·슬랙·이메일 발송은 다음 업데이트에서 지원할 예정이에요. 지금은 앱 내 알림만 실제로 전송돼요.",
      saveSuccessToast:
        "알림 설정을 저장했어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    types: {
      announcement: "公告",
      dueReminder: "会费缴纳提醒",
      voteStart: "新投票开始",
      voteClose: "投票截止结果",
      settlementReport: "结算报告发布",
    },
  },
  me: {
    pageTitle: "我的页面",
    // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
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
    socialAccountLinkedToast: "已关联到现有账户。",
    kakaoNoEmailNotice:
      "由于 Kakao 账户未提供邮箱，将作为独立账户注册。你可以在个人页面关联 Google 账户，多一种登录方式。",
    manualLinkCta: "关联账户",
    loginWithGoogle: "使用 Google 继续",
    loginWithKakao: "使用 Kakao 继续",
    socialConnecting: "连接中...",
    login: {
      title: "登录",
      description: "使用邮箱登录以查看你的小组。",
      emailLabel: "邮箱",
      passwordLabel: "密码",
      submitButton: "登录",
      submittingButton: "登录中...",
      noAccountText: "还没有账户？",
      signUpLink: "注册",
    },
    signUp: {
      title: "注册",
      description: "创建一个新账户。",
      emailLabel: "邮箱",
      passwordLabel: "密码",
      repeatPasswordLabel: "确认密码",
      submitButton: "注册",
      submittingButton: "正在创建账户...",
      haveAccountText: "已经有账户了吗？",
      loginLink: "登录",
      passwordMismatchError: "两次输入的密码不一致。",
    },
    changePassword: {
      title: "修改密码",
      currentPasswordLabel: "当前密码",
      newPasswordLabel: "新密码",
      confirmPasswordLabel: "确认新密码",
      submitButton: "修改密码",
      submittingButton: "修改中...",
      successMessage: "密码已修改。",
      passwordMismatchError: "两次输入的新密码不一致。",
      currentPasswordIncorrectError: "当前密码不正确。",
    },
    error: {
      title: "出错了。",
      codeErrorPrefix: "错误代码：",
      unspecifiedError: "发生了未知错误。",
    },
  },
  errors: {
    networkError: "请检查你的网络连接。",
    notFound: "未找到相关信息。",
    invalidInviteCode: "邀请码无效。",
    genericError: "发生临时错误，请稍后重试。",
    lastAdminGuard:
      "最后一位组长无法更改角色或退出小组，请先指定其他成员为组长。",
    // TODO(i18n): Task 018-1 新增键为韩语占位文案，待翻译
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
    noGroups: "你还没有加入任何小组，交给 Woodong 吧！",
    noDues: "暂无会费项目。",
    noVotes: "暂无进行中的投票。",
    noAnnouncements: "暂无公告。",
    noNotifications: "暂无通知，有新消息会第一时间通知你！",
    noMembers: "暂无成员。",
  },
};
