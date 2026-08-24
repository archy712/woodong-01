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
  },
  nav: {
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
      title: "グループ運営を一か所で、Woodongと一緒に",
      subtitle:
        "会費、精算、投票、お知らせまで — 幹事は管理しやすく、メンバーは参加しやすいグループ運営サービスです。",
      cta: "無料で始める",
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
    },
    invite: {
      title: "メンバー招待",
      generateButton: "招待リンクを作成",
      reissueButton: "コードを再発行",
      copyLinkButton: "リンクをコピー",
      codeLabel: "招待コード",
      expiresAtLabel: "有効期限",
    },
    members: {
      title: "メンバー一覧",
      roleAdmin: "幹事",
      roleMember: "メンバー",
      changeRoleButton: "役割を変更",
      removeButton: "退会させる",
    },
    invitePage: {
      title: "グループに参加",
      codeLabel: "招待コード",
      joinButton: "参加する",
      alreadyMemberMessage:
        "すでに参加しているグループです。グループページへ移動します。",
    },
    announcements: {
      pageTitle: "お知らせ",
      createTitle: "お知らせを作成",
      titleLabel: "タイトル",
      contentLabel: "内容",
      submitButton: "送信する",
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
    create: {
      title: "会費項目を作成",
      titleLabel: "項目名",
      amountLabel: "金額",
      periodLabel: "対象期間",
      reminderIntervalLabel: "リマインド周期（日）",
      submitButton: "会費項目を作成",
    },
    markPaidButton: "納付済みにする",
    reminderToastMessage:
      "まだ会費が未納のようです。Woodongがそっとお知らせします！",
  },
  votes: {
    pageTitle: "投票一覧",
    detailTitle: "投票詳細",
    voteIdLabel: "投票ID",
    create: {
      title: "投票を作成",
      titleLabel: "投票タイトル",
      optionsLabel: "選択肢",
      addOptionButton: "選択肢を追加",
      closesAtLabel: "締切日時",
      allowMultipleLabel: "複数選択を許可",
      anonymousLabel: "匿名投票",
      submitButton: "投票を作成",
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
  },
  notifications: {
    pageTitle: "通知センター",
    markAllReadButton: "すべて既読にする",
    channelSettings: {
      title: "通知チャンネル設定",
      inApp: "アプリ内通知",
      kakao: "カカオトーク",
      slack: "Slack",
      email: "メール",
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
  },
  auth: {
    socialAccountLinkedToast: "既存のアカウントに連携されました。",
    kakaoNoEmailNotice:
      "カカオアカウントがメールアドレスを提供しないため、別アカウントとして登録されます。マイページからメールアカウントと連携できます。",
    manualLinkCta: "アカウントを連携する",
    loginWithGoogle: "Googleで続ける",
    loginWithKakao: "カカオで続ける",
    googleConnecting: "接続中...",
    login: {
      title: "ログイン",
      description: "メールでログインしてグループを確認しましょう。",
      emailLabel: "メールアドレス",
      passwordLabel: "パスワード",
      forgotPasswordLink: "パスワードをお忘れですか？",
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
    signUpSuccess: {
      title: "登録が完了しました！",
      description: "メールをご確認ください",
      message:
        "会員登録が完了しました。ログイン前にメールを確認してアカウントを認証してください。",
    },
    forgotPassword: {
      title: "パスワードの再設定",
      description:
        "メールアドレスを入力すると、パスワード再設定用のリンクをお送りします。",
      emailLabel: "メールアドレス",
      submitButton: "再設定メールを送信",
      submittingButton: "送信中...",
      haveAccountText: "すでにアカウントをお持ちですか？",
      loginLink: "ログイン",
      successTitle: "メールをご確認ください",
      successDescription: "パスワード再設定のご案内をお送りしました",
      successMessage:
        "メールとパスワードで登録された方には、パスワード再設定メールが届きます。",
    },
    updatePassword: {
      title: "パスワードの再設定",
      description: "新しいパスワードを入力してください。",
      passwordLabel: "新しいパスワード",
      passwordPlaceholder: "新しいパスワード",
      submitButton: "パスワードを保存",
      submittingButton: "保存中...",
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
