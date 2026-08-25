import type { Dictionary } from "./types";

export const ja: Dictionary = {
  common: {
    backToHome: "← ホームへ",
    confirm: "確認",
    cancel: "キャンセル",
    save: "保存",
    delete: "削除",
    edit: "編集",
    submit: "送信",
    close: "閉じる",
    copy: "コピー",
    copied: "コピーしました",
    back: "戻る",
    loading: "読み込み中...",
    retry: "再試行",
    required: "必須",
    or: "または",
    groupIdLabel: "グループID",
    // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
    memberCountSuffix: "명 참여 중",
    demoModeNotice: "데모 화면이라 실제로 저장되지는 않아요.",
    viewAllLink: "전체 보기",
  },
  nav: {
    brandTagline: "私たちのサークル",
    groupsLabel: "マイグループ",
    notificationsLabel: "通知",
    profileLabel: "プロフィール",
    logoutLabel: "ログアウト",
    signInLabel: "ログイン",
    signUpLabel: "新規登録",
    groupTabs: {
      home: "ホーム",
      announcements: "お知らせ",
      dues: "会費",
      votes: "投票",
      settings: "設定",
    },
  },
  home: {
    hero: {
      kicker: "Woodong＝韓国語で「私たちのサークル」",
      title: "グループ運営を一か所で、Woodongと一緒に",
      subtitle:
        "会費、精算、投票、お知らせまで — 幹事は管理しやすく、メンバーは参加しやすいグループ運営サービスです。",
      cta: "無料で始める",
      ctaLoggedIn: "自分のグループを見る",
    },
    techStackPreview: {
      heading: "堅牢な技術スタックの上に",
      description: "最新のNext.jsとSupabaseを基盤に、速く安定して動作します。",
      items: ["Next.js 16", "Supabase", "Tailwind CSS", "shadcn/ui"],
      cta: "技術スタックをもっと見る",
    },
    features: {
      heading: "主な機能",
      description:
        "作成から会費、精算、投票、お知らせ、通知まで — グループ運営に必要な機能を一か所にまとめました。",
      items: [
        {
          title: "グループ管理",
          description:
            "グループを作成してメンバーを招待しましょう。幹事と一般メンバーの役割を分けて権限を管理できます。",
        },
        {
          title: "会費管理",
          description:
            "定期・臨時の会費を登録し、メンバーごとの納付状況を一目で確認できます。未納者には自動でリマインドが送信されます。",
        },
        {
          title: "精算レポート",
          description:
            "支出内訳を記録し、グループ全体に精算レポートを透明に共有しましょう。",
        },
        {
          title: "投票",
          description:
            "議題を投稿して締切まで投票を進めましょう。複数選択と匿名投票にも対応しています。",
        },
        {
          title: "お知らせ",
          description:
            "グループのお知らせを作成し、メンバー全員に通知しましょう。",
        },
        {
          title: "通知センター",
          description:
            "コメント・投票・会費リマインドなどすべての通知を一か所で確認し、チャンネルごとに設定できます。",
        },
      ],
    },
    footer: {
      techStack: "技術スタック",
      componentGallery: "コンポーネントギャラリー",
      iconGallery: "アイコンギャラリー",
      chartGallery: "チャートギャラリー",
      avatarGallery: "アバターギャラリー",
    },
  },
  about: {
    headerTitle: "next.jsスターターキット3の紹介",
    badge: "Starter Kit",
    heroTitle: "next.js starter-kit v3",
    heroDescription:
      "Next.js 16とSupabase Authによる認証まで整った状態から、すぐに開発を始められるスターターキットです。",
    features: [
      {
        title: "Next.js 16 App Router",
        description:
          'Cache Components("use cache")を有効化した最新のApp Routerアーキテクチャを標準搭載しています。',
      },
      {
        title: "Supabase Auth",
        description:
          "メール/パスワード認証とGoogle OAuthログインを、@supabase/ssrベースのCookieセッションでサポートします。",
      },
      {
        title: "Tailwind CSS v4 + shadcn/ui",
        description:
          "new-yorkスタイルのshadcn/uiコンポーネントとダークモード切り替えを標準提供します。",
      },
      {
        title: "開発ツールの自動化",
        description:
          "ESLint、Prettier、Husky、lint-staged、commitlintでコミット前チェックを自動化しました。",
      },
      {
        title: "レスポンシブUI",
        description:
          "モバイルからデスクトップまで、画面サイズに合わせて自然に適応するレスポンシブレイアウトを提供します。",
      },
      {
        title: "多言語対応",
        description:
          "韓国語・英語・日本語・中国語の4言語に対応し、ブラウザ/システムの言語設定に応じて既定言語が自動で選択されます。",
      },
      {
        title: "ダークモード切り替え",
        description:
          "ヘッダーのトグルボタンでライト・ダーク・システムテーマを即座に切り替えられます。",
      },
    ],
    galleriesHeading: "ギャラリー集",
    galleriesDescription:
      "UIを素早く組み立てられるよう、コンポーネント・アイコン・アバター・チャートをギャラリー形式でまとめました。",
    galleries: [
      {
        title: "shadcn/ui コンポーネントギャラリー",
        description:
          "Button、Form、DialogなどshadcnUI公式コンポーネントから、Tree Viewやデータテーブルなどの拡張コンポーネントまで一か所で確認できます。",
        cta: "コンポーネントギャラリーを見る",
      },
      {
        title: "アイコンギャラリー",
        description:
          "このプロジェクトに含まれるlucide-reactアイコン全体を検索し、ワンクリックでimport文をコピーできます。",
        cta: "アイコンギャラリーを見る",
      },
      {
        title: "アバターギャラリー",
        description:
          "サイズ、画像、イニシャル、ステータスバッジ、グループ表示まで、Avatarコンポーネントの多様な活用方法をまとめました。",
        cta: "アバターギャラリーを見る",
      },
      {
        title: "チャートギャラリー",
        description:
          "rechartsベースのshadcn/ui Chartコンポーネントで実装した棒・線・面・円・レーダーなど多様なチャートタイプを確認できます。",
        cta: "チャートギャラリーを見る",
      },
    ],
  },
  gallery: {
    headerTitle: "shadcn/ui コンポーネントギャラリー",
    heading: "コンポーネントギャラリー",
    description:
      "shadcn/ui公式レジストリの全コンポーネントと、実務でよく使われる拡張コンポーネントを一緒に確認できます。",
  },
  icons: {
    headerTitle: "lucide-react アイコンギャラリー",
    heading: "アイコンギャラリー",
    description:
      "このプロジェクトに含まれるlucide-reactの全アイコンを検索し、すぐにimport文をコピーできます。",
  },
  avatars: {
    headerTitle: "アバターギャラリー",
    heading: "アバターギャラリー",
    description:
      "サイズ、画像、イニシャル、ステータスバッジ、グループ表示まで、shadcn/ui Avatarコンポーネントの多様な活用方法を確認できます。",
  },
  charts: {
    headerTitle: "チャートギャラリー",
    heading: "チャートギャラリー",
    description:
      "rechartsベースのshadcn/ui Chartコンポーネントで実装した多様なチャートタイプをまとめました。",
  },
  techStack: {
    headerTitle: "技術スタック",
    heading: "技術スタック",
    description:
      "このスターターキットを構成するフレームワーク、ライブラリ、開発ツールを分野別に整理しました。",
  },
  groups: {
    pageTitle: "グループ一覧",
    createButton: "グループを作成",
    detailTitle: "グループ詳細",
    detailNotFound: "グループが見つからないか、アクセス権限がありません。",
    // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
    viewButton: "모임 보기",
    dashboard: {
      announcementsTitle: "최근 공지",
      duesTitle: "회비 납부 현황",
      votesTitle: "진행 중인 투표",
      noOpenVotes: "진행 중인 투표가 없어요.",
      unpaidCountLabel: "명 미납",
    },
    create: {
      title: "グループを作成",
      description:
        "グループ名だけ入力すればすぐに作成できます。その他の情報はいつでも編集できます。",
      nameLabel: "グループ名",
      namePlaceholder: "例: 週末登山グループ",
      descriptionLabel: "グループ紹介（任意）",
      descriptionPlaceholder: "グループを簡単に紹介してください",
      typeLabel: "グループの種類（任意）",
      typePlaceholder: "例: サークル",
      defaultDueAmountLabel: "基本会費（任意）",
      defaultDueAmountPlaceholder: "例: 30000",
      submitButton: "グループを作成",
      submittingLabel: "作成中...",
    },
    settings: {
      title: "グループ設定",
      infoSectionTitle: "グループ情報の編集",
      membersSectionTitle: "メンバー管理",
      inviteSectionTitle: "メンバー招待",
      dangerZoneTitle: "危険な操作",
      deleteButton: "グループを削除",
      deleteConfirmMessage:
        "グループを削除すると、会費・精算・投票のデータも一緒に削除されます。この操作は元に戻せません。",
      // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
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
      title: "メンバー招待",
      generateButton: "招待リンクを作成",
      reissueButton: "コードを再発行",
      copyLinkButton: "リンクをコピー",
      codeLabel: "招待コード",
      expiresAtLabel: "有効期限",
      // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
      maxUsesLabel: "최대 사용 횟수",
      usedCountLabel: "회 사용됨",
      emptyState: "발급된 초대 링크가 없어요.",
      activeLabel: "사용 가능",
      inactiveLabel: "만료/무효화됨",
      // TODO(i18n): Task 020の新規キーは韓国語の仮文言、翻訳が必要
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
      title: "メンバー一覧",
      roleAdmin: "幹事",
      roleMember: "メンバー",
      changeRoleButton: "役割を変更",
      removeButton: "退会させる",
      meLabel: "나",
      unnamedMemberLabel: "이름 미확인 멤버",
      namesComingSoonNotice:
        "멤버 이름·연락처 표시는 다음 업데이트에서 지원할 예정이에요.",
    },
    invitePage: {
      title: "グループに参加",
      codeLabel: "招待コード",
      joinButton: "参加する",
      alreadyMemberMessage:
        "すでに参加しているグループです。グループページへ移動します。",
      // TODO(i18n): Task 012/017の新規キーは韓国語の仮文言、翻訳が必要
      loginToJoinButton: "로그인하고 참여하기",
      previewNotice: "아래 모임의 초대를 받았어요. 참여하면 멤버로 등록돼요.",
      // TODO(i18n): Task 020の新規キーは韓国語の仮文言、翻訳が必要
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
      pageTitle: "お知らせ",
      createTitle: "お知らせを作成",
      titleLabel: "タイトル",
      contentLabel: "内容",
      submitButton: "送信する",
      // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
      writeButton: "공지 작성",
      submitSuccessToast:
        "공지를 발송했어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
  },
  dues: {
    pageTitle: "会費状況",
    summaryLabel: "今月の納付率",
    status: {
      paid: "納付済み",
      partial: "一部納付",
      unpaid: "未納",
    },
    // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
    type: {
      regular: "정기",
      extra: "번개/특별",
    },
    create: {
      title: "会費項目を作成",
      titleLabel: "項目名",
      amountLabel: "金額",
      periodLabel: "対象期間",
      reminderIntervalLabel: "リマインド周期（日）",
      submitButton: "会費項目を作成",
      // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
      dueDateLabel: "납부 기한",
      dueTypeLabel: "회비 유형",
      createTriggerButton: "새 회비 항목",
      successToast:
        "회비 항목을 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    markPaidButton: "納付済みにする",
    reminderToastMessage:
      "まだ会費が未納のようです。Woodongがそっとお知らせします！",
    // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
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
    pageTitle: "投票一覧",
    detailTitle: "投票詳細",
    voteIdLabel: "投票ID",
    // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
    type: {
      multipleChoice: "객관식",
      yesNo: "찬반",
    },
    create: {
      title: "投票を作成",
      titleLabel: "投票タイトル",
      optionsLabel: "選択肢",
      addOptionButton: "選択肢を追加",
      closesAtLabel: "締切日時",
      allowMultipleLabel: "複数選択を許可",
      anonymousLabel: "匿名投票",
      submitButton: "投票を作成",
      // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
      voteTypeLabel: "투표 형식",
      optionPlaceholder: "선택지를 입력해주세요",
      removeOptionButton: "삭제",
      successToast:
        "투표를 만들었어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    voteButton: "投票する",
    statusOpen: "進行中",
    statusClosed: "締切",
    closeNowButton: "今すぐ締め切る",
    closeNowConfirmMessage:
      "投票を今すぐ締め切りますか？この操作は元に戻せません。",
    resultsTitle: "投票結果",
    minOptionsError: "選択肢は2つ以上入力してください。",
    pastDeadlineError: "締切日時は現在より後に設定してください。",
    // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
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
    pageTitle: "通知センター",
    markAllReadButton: "すべて既読にする",
    // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
    unreadLabel: "안읽음",
    readLabel: "읽음",
    emptyState: "아직 알림이 없어요. 새 소식이 오면 바로 알려드릴게요!",
    channelSettings: {
      title: "通知チャンネル設定",
      inApp: "アプリ内通知",
      kakao: "カカオトーク",
      slack: "Slack",
      email: "メール",
      // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
      comingSoonNotice:
        "카카오톡·슬랙·이메일 발송은 다음 업데이트에서 지원할 예정이에요. 지금은 앱 내 알림만 실제로 전송돼요.",
      saveSuccessToast:
        "알림 설정을 저장했어요. (데모 화면이라 실제로 저장되지는 않아요)",
    },
    types: {
      announcement: "お知らせ",
      dueReminder: "会費納付リマインド",
      voteStart: "新しい投票が開始",
      voteClose: "投票締切結果",
      settlementReport: "精算レポート発行",
    },
  },
  me: {
    pageTitle: "マイページ",
    // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
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
    socialAccountLinkedToast: "既存のアカウントに連携されました。",
    kakaoNoEmailNotice:
      "カカオアカウントがメールアドレスを提供しないため、別アカウントとして登録されます。マイページでGoogleアカウントを連携すると、ログイン手段をもう一つ用意できます。",
    manualLinkCta: "アカウントを連携する",
    loginWithGoogle: "Googleで続ける",
    loginWithKakao: "カカオで続ける",
    socialConnecting: "接続中...",
    login: {
      title: "ログイン",
      description: "メールでログインしてグループを確認しましょう。",
      emailLabel: "メールアドレス",
      passwordLabel: "パスワード",
      submitButton: "ログイン",
      submittingButton: "ログイン中...",
      noAccountText: "アカウントをお持ちでないですか？",
      signUpLink: "会員登録",
    },
    signUp: {
      title: "会員登録",
      description: "新しいアカウントを作成しましょう。",
      emailLabel: "メールアドレス",
      passwordLabel: "パスワード",
      repeatPasswordLabel: "パスワード（確認）",
      submitButton: "会員登録",
      submittingButton: "アカウントを作成中...",
      haveAccountText: "すでにアカウントをお持ちですか？",
      loginLink: "ログイン",
      passwordMismatchError: "パスワードが一致しません。",
    },
    changePassword: {
      title: "パスワード変更",
      currentPasswordLabel: "現在のパスワード",
      newPasswordLabel: "新しいパスワード",
      confirmPasswordLabel: "新しいパスワード（確認）",
      submitButton: "パスワードを変更",
      submittingButton: "変更中...",
      successMessage: "パスワードを変更しました。",
      passwordMismatchError: "新しいパスワードが一致しません。",
      currentPasswordIncorrectError: "現在のパスワードが正しくありません。",
    },
    error: {
      title: "問題が発生しました。",
      codeErrorPrefix: "エラーコード: ",
      unspecifiedError: "不明なエラーが発生しました。",
    },
  },
  errors: {
    networkError: "ネットワーク接続をご確認ください。",
    notFound: "情報が見つかりませんでした。",
    invalidInviteCode: "無効な招待コードです。",
    genericError:
      "一時的なエラーが発生しました。しばらくしてから再試行してください。",
    lastAdminGuard:
      "最後の幹事は役割の変更やグループの退会ができません。先に他のメンバーを幹事に指定してください。",
    // TODO(i18n): Task 018-1の新規キーは韓国語の仮文言、翻訳が必要
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
    noGroups: "まだ参加しているグループがありません。Woodongにお任せください！",
    noDues: "登録された会費項目がありません。",
    noVotes: "進行中の投票がありません。",
    noAnnouncements: "まだお知らせがありません。",
    noNotifications:
      "まだ通知がありません。新しい情報が届いたらすぐにお知らせします！",
    noMembers: "まだメンバーがいません。",
  },
};
