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
      issueSuccessToast:
        "초대 링크를 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    members: {
      title: "成员列表",
      roleAdmin: "组长",
      roleMember: "普通成员",
      changeRoleButton: "更改角色",
      removeButton: "移除",
    },
    invitePage: {
      title: "加入小组",
      codeLabel: "邀请码",
      joinButton: "加入",
      alreadyMemberMessage: "你已经是该小组的成员了，即将跳转到小组页面。",
      // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
      previewNotice: "아래 모임의 초대를 받았어요. 참여하면 멤버로 등록돼요.",
      expiredMessage: "이 초대 링크는 만료되었거나 더 이상 사용할 수 없어요.",
      joinSuccessToast:
        "참여했어요! (데모 화면이라 실제로 멤버로 등록되지는 않아요)",
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
      reminderIntervalLabel: "提醒周期（天）",
      submitButton: "创建会费项目",
      // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
      dueDateLabel: "납부 기한",
      dueTypeLabel: "회비 유형",
      createTriggerButton: "새 회비 항목",
      successToast:
        "회비 항목을 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    markPaidButton: "标记为已缴费",
    reminderToastMessage: "你还没有缴纳会费哦，Woodong 悄悄提醒你一下！",
    // TODO(i18n): Task 012 新增键为韩语占位文案，待翻译
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
      "Google·카카오 소셜 로그인 연동 관리는 다음 업데이트에서 지원할 예정이에요.",
    connectedLabel: "연동됨",
    notConnectedLabel: "연동 안 됨",
  },
  auth: {
    socialAccountLinkedToast: "已关联到现有账户。",
    kakaoNoEmailNotice:
      "由于 Kakao 账户未提供邮箱，将作为独立账户注册。你可以在个人页面中将其与邮箱账户关联。",
    manualLinkCta: "关联账户",
    loginWithGoogle: "使用 Google 继续",
    loginWithKakao: "使用 Kakao 继续",
    googleConnecting: "连接中...",
    login: {
      title: "登录",
      description: "使用邮箱登录以查看你的小组。",
      emailLabel: "邮箱",
      passwordLabel: "密码",
      forgotPasswordLink: "忘记密码了吗？",
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
    signUpSuccess: {
      title: "注册成功！",
      description: "请查收邮箱",
      message: "注册已完成。登录前请查收邮箱以验证账户。",
    },
    forgotPassword: {
      title: "重置密码",
      description: "输入邮箱地址，我们会向你发送重置密码的链接。",
      emailLabel: "邮箱",
      submitButton: "发送重置邮件",
      submittingButton: "发送中...",
      haveAccountText: "已经有账户了吗？",
      loginLink: "登录",
      successTitle: "请查收邮箱",
      successDescription: "已发送密码重置说明",
      successMessage: "如果你使用邮箱和密码注册，将会收到密码重置邮件。",
    },
    updatePassword: {
      title: "重置密码",
      description: "请输入新密码。",
      passwordLabel: "新密码",
      passwordPlaceholder: "新密码",
      submitButton: "保存新密码",
      submittingButton: "保存中...",
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
