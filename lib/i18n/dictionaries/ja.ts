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
    memberCountSuffix: "人参加中",
    viewAllLink: "すべて見る",
  },
  nav: {
    brandTagline: "私たちのサークル",
    groupsLabel: "マイグループ",
    notificationsLabel: "通知",
    profileLabel: "プロフィール",
    logoutLabel: "ログアウト",
    signInLabel: "ログイン",
    signUpLabel: "新規登録",
    theme: {
      label: "テーマ変更",
      light: "ライト",
      dark: "ダーク",
      system: "システム",
    },
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
      privacyPolicy: "プライバシーポリシー",
      termsOfService: "利用規約",
    },
  },
  gallery: {
    heading: "コンポーネントギャラリー",
    description:
      "shadcn/ui公式レジストリの全コンポーネントと、実務でよく使われる拡張コンポーネントを一緒に確認できます。",
  },
  icons: {
    heading: "アイコンギャラリー",
    description:
      "このプロジェクトに含まれるlucide-reactの全アイコンを検索し、すぐにimport文をコピーできます。",
  },
  avatars: {
    heading: "アバターギャラリー",
    description:
      "サイズ、画像、イニシャル、ステータスバッジ、グループ表示まで、shadcn/ui Avatarコンポーネントの多様な活用方法を確認できます。",
  },
  charts: {
    heading: "チャートギャラリー",
    description:
      "rechartsベースのshadcn/ui Chartコンポーネントで実装した多様なチャートタイプをまとめました。",
  },
  techStack: {
    heading: "技術スタック",
    description:
      "ウドンを構成するフレームワーク、ライブラリ、開発ツールを分野別に整理しました。",
  },
  groups: {
    pageTitle: "グループ一覧",
    createButton: "グループを作成",
    detailTitle: "グループ詳細",
    detailNotFound: "グループが見つからないか、アクセス権限がありません。",
    viewButton: "グループを見る",
    dashboard: {
      announcementsTitle: "最近のお知らせ",
      duesTitle: "会費の納付状況",
      votesTitle: "進行中の投票",
      noOpenVotes: "進行中の投票はありません。",
      unpaidCountLabel: "人未納",
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
      deleteDialogTitle: "このグループを削除しますか？",
      saveSuccessToast:
        "グループ情報を保存しました。（デモ画面のため実際には保存されません）",
      deleteSuccessToast:
        "グループを削除しました。（デモ画面のため実際には削除されません）",
      adminOnlyNotice: "グループ情報の編集は会計担当のみ可能です。",
      coverImageLabel: "カバー画像",
      coverImageHint:
        "JPEG・PNG・WebP、5MB以下。アップロード時に自動でサイズを縮小して保存します。",
      coverImageRemoveButton: "画像を削除",
      coverUploadError:
        "画像をアップロードできませんでした。しばらくしてからもう一度お試しください。",
    },
    invite: {
      title: "メンバー招待",
      generateButton: "招待リンクを作成",
      reissueButton: "コードを再発行",
      copyLinkButton: "リンクをコピー",
      codeLabel: "招待コード",
      expiresAtLabel: "有効期限",
      maxUsesLabel: "最大利用回数",
      usedCountLabel: "回使用済み",
      emptyState: "発行された招待リンクはありません。",
      activeLabel: "利用可能",
      inactiveLabel: "期限切れ・無効化済み",
      reissueNotice:
        "新しいリンクを作ると既存のリンクは自動的に無効になります。すでに参加したメンバーはそのまま残ります。",
      createdAtLabel: "発行日",
      issueSuccessToast:
        "招待リンクを作成しました。以前のリンクはもう使えません。",
      revokeButton: "無効化",
      revokeDialogTitle: "この招待リンクを無効にしますか？",
      revokeConfirmMessage:
        "無効にすると、このリンクからはグループに参加できなくなります。すでに参加したメンバーはそのまま残ります。",
      revokeSuccessToast: "招待リンクを無効にしました。",
      adminOnlyNotice: "招待リンクの発行は会計担当のみ可能です。",
    },
    members: {
      title: "メンバー一覧",
      roleAdmin: "幹事",
      roleMember: "メンバー",
      promoteButton: "幹事に指定",
      demoteButton: "メンバーに変更",
      removeButton: "退会させる",
      leaveButton: "グループを抜ける",
      promoteDialogTitle: "会計担当に指定しますか？",
      promoteConfirmMessage:
        "グループ情報の編集、会費管理、メンバー管理ができるようになります。",
      demoteDialogTitle: "一般メンバーに変更しますか？",
      demoteConfirmMessage:
        "会計担当の権限がなくなり、グループ設定や会費を管理できなくなります。",
      removeDialogTitle: "このメンバーを退出させますか？",
      removeConfirmMessage:
        "再参加には新しい招待リンクが必要です。過去の会費・投票の記録はそのまま残ります。",
      leaveDialogTitle: "グループから退会しますか？",
      leaveConfirmMessage:
        "退会すると、このグループのお知らせ・会費・投票を見られなくなります。再参加には招待リンクが必要です。",
      roleChangeSuccessToast: "役割を変更しました。",
      removeSuccessToast: "メンバーを退出させました。",
      leaveSuccessToast: "グループから退会しました。",
      lastAdminNotice:
        "最後の会計担当です。他のメンバーを会計担当に指定すると、役割の変更や退会ができます。",
      memberViewNotice: "メンバーの役割変更と退出は会計担当のみ可能です。",
      phoneLabel: "連絡先",
      meLabel: "自分",
      unnamedMemberLabel: "名前未設定のメンバー",
    },
    invitePage: {
      title: "グループに参加",
      codeLabel: "招待コード",
      joinButton: "参加する",
      alreadyMemberMessage:
        "すでに参加しているグループです。グループページへ移動します。",
      loginToJoinButton: "ログインして参加",
      previewNotice:
        "以下のグループに招待されています。参加するとメンバーとして登録されます。",
      alreadyMemberNotice: "すでにこのグループのメンバーです。",
      goToGroupButton: "グループへ移動",
      expiredMessage:
        "この招待リンクは期限切れです。会計担当に新しいリンクをリクエストしてください。",
      revokedMessage:
        "この招待リンクは無効化されています。会計担当に新しいリンクをリクエストしてください。",
      exhaustedMessage:
        "この招待リンクは利用可能回数に達しました。会計担当に新しいリンクをリクエストしてください。",
      joinSuccessToast: "参加しました！これでこのグループのメンバーです。",
    },
    announcements: {
      pageTitle: "お知らせ",
      createTitle: "お知らせを作成",
      titleLabel: "タイトル",
      contentLabel: "内容",
      submitButton: "送信する",
      writeButton: "お知らせを書く",
      submitSuccessToast:
        "お知らせを送信しました。（デモ画面のため実際には保存されません）",
      notifiedCountSuffix: "人に通知を送りました。",
      notifiedNoneNotice: "通知を受け取る他のメンバーはまだいません。",
      editButton: "編集",
      editTitle: "お知らせを編集",
      editSubmitButton: "変更を保存",
      editSuccessToast: "お知らせを修正しました。",
      editedBadge: "編集済み",
      adminOnlyNotice: "お知らせの作成と編集は会計担当のみ可能です。",
      notifyNotice: "送信するとグループメンバー全員にアプリ内通知が届きます。",
      editNotifyNotice: "編集しても通知は再送されません。",
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
    type: {
      regular: "定期",
      extra: "臨時・特別",
    },
    create: {
      title: "会費項目を作成",
      titleLabel: "項目名",
      amountLabel: "金額",
      periodLabel: "対象期間",
      reminderIntervalLabel: "リマインド周期（任意・日）",
      submitButton: "会費項目を作成",
      dueDateLabel: "納付期限",
      dueTypeLabel: "会費の種別",
      createTriggerButton: "新しい会費項目",
      successToast:
        "会費項目を作成しました。アクティブなメンバー全員に請求が作成されました。",
    },
    markPaidButton: "納付済みにする",
    memberProgressTitle: "メンバー別の納付状況",
    unpaidHighlightTitle: "まだ納付していないメンバー",
    emptyState: "登録された会費項目はありません。",
    headcountRateLabel: "人数ベース",
    amountRateLabel: "金額ベースの収納率",
    paidCountSuffix: "人納付済み",
    chargedCountSuffix: "人請求",
    collectedAmountLabel: "収納",
    chargedAmountLabel: "請求",
    statusFilterLabel: "納付状況で絞り込む",
    filterAllLabel: "すべて",
    filterEmptyState: "この状態のメンバーはいません。",
    showUnpaidOnlyButton: "未納のみ表示",
    recordPayment: {
      title: "納付管理",
      statusLabel: "納付状況",
      amountLabel: "納付金額",
      paidAtLabel: "納付確認日",
      memoLabel: "備考（任意）",
      submitButton: "納付を記録",
      successToast: "納付履歴を記録しました。",
      historyTitle: "納付履歴",
      historyEmpty: "まだ記録された納付履歴はありません。",
      addTitle: "納付記録を追加",
      totalPaidLabel: "納付累計",
      remainingLabel: "残額",
      updateSuccessToast: "納付履歴を修正しました。",
      deleteDialogTitle: "この納付履歴を削除しますか？",
      deleteConfirmMessage:
        "削除すると、残りの履歴を基準に納付状況が再計算されます。",
      deleteSuccessToast: "納付履歴を削除しました。",
    },
  },
  expenses: {
    sectionTitle: "支出明細",
    addButton: "支出を登録",
    emptyState: "まだ登録された支出はありません。",
    adminOnlyNotice: "支出の登録・編集は会計担当のみ可能です。",
    category: {
      meal: "会食費",
      event: "イベント費",
      supplies: "備品費",
      venue: "会場費",
      transport: "交通費",
      other: "その他",
    },
    balance: {
      title: "グループの残高",
      incomeLabel: "収入合計",
      expenseLabel: "支出合計",
      balanceLabel: "残高",
      note: "収入合計は実際に納付が確認された金額のみの合計です（請求額ではありません）。",
    },
    form: {
      createTitle: "支出を登録",
      editTitle: "支出を編集",
      categoryLabel: "カテゴリ",
      categoryPlaceholder: "カテゴリを選択してください",
      amountLabel: "金額",
      spentAtLabel: "支出日",
      paidByLabel: "担当者",
      paidByNone: "選択しない",
      memoLabel: "備考",
      receiptLabel: "領収書",
      receiptHint:
        "JPEG・PNG・WebP、最大5MB。同じグループのメンバーのみ閲覧できます。",
      receiptRemoveButton: "領収書を削除",
      receiptUploadError:
        "領収書のアップロードに失敗しました。しばらくしてからもう一度お試しください。",
      submitButton: "保存",
      submittingLabel: "保存中...",
      createSuccessToast: "支出を登録しました。",
      updateSuccessToast: "支出を修正しました。",
    },
    receiptViewLabel: "領収書を見る",
    receiptNoneLabel: "領収書なし",
    editButton: "編集",
    deleteButton: "削除",
    deleteDialogTitle: "支出を削除しますか？",
    deleteConfirmMessage:
      "削除すると元に戻せません。添付した領収書も一緒に削除されます。",
    deleteSuccessToast: "支出を削除しました。",
  },
  settlements: {
    pageTitle: "精算レポート",
    entryLinkLabel: "精算レポート",
    backToDuesLabel: "会費の状況へ",
    emptyState: "まだ作成した精算レポートはありません。",
    adminOnlyNotice: "精算レポートの作成・発行は会計担当のみ可能です。",
    statusDraft: "下書き",
    statusPublished: "発行済み",
    draftVisibilityNotice:
      "下書きは会計担当にのみ表示されます。金額を確認してから発行すると、メンバー全員に通知が届きます。",
    create: {
      triggerButton: "新しい精算レポート",
      title: "精算レポートを作成",
      description:
        "期間を決めると、その期間の会費収納額と支出をまとめて下書きを作ります。",
      periodStartLabel: "精算開始日",
      periodEndLabel: "精算終了日",
      submitButton: "下書きを作成",
      submittingLabel: "計算中...",
      successToast: "精算の下書きを作成しました。",
    },
    recalculate: {
      triggerButton: "期間の修正・再計算",
      title: "期間を変更して再計算する",
      description:
        "期間を変更したり、会費・支出を修正したあとに最新の金額で再計算するときに使います。",
      submitButton: "再計算",
      submittingLabel: "計算中...",
      successToast: "精算の下書きを再計算しました。",
    },
    publish: {
      triggerButton: "発行",
      dialogTitle: "精算レポートを発行しますか？",
      confirmMessage:
        "発行するとグループメンバー全員に通知が届き、以降は金額を修正できません。",
      confirmButton: "発行",
      successToast: "精算レポートを発行しました。",
      notifiedToastSuffix: "人に知らせました。",
      notificationTitle: "精算レポートが発行されました",
      notificationBody: "グループの収支の精算結果を確認してみましょう。",
    },
    delete: {
      triggerButton: "削除",
      dialogTitle: "精算レポートを削除しますか？",
      confirmMessage:
        "削除すると元に戻せません。作り直して発行すると、メンバーはもう一度通知を受け取ります。",
      successToast: "精算レポートを削除しました。",
    },
    detail: {
      notFound: "精算レポートが見つかりません。",
      incomeSectionTitle: "収入",
      expenseSectionTitle: "支出",
      totalIncomeLabel: "収入合計",
      totalExpenseLabel: "支出合計",
      balanceLabel: "残高",
      entryCountSuffix: "件",
      noItems: "この期間に集計された収支はありません。",
      publishedAtLabel: "発行日時",
      publishedByLabel: "発行者",
      createdByLabel: "作成者",
      snapshotNotice:
        "発行時点の収支をそのまま保存したスナップショットです。以降に会費・支出が変わっても、このレポートの数字は変わりません。",
      incomeNote:
        "収入は実際に納付が確認された金額のみの合計です（請求額ではありません）。",
      printButton: "PDFで保存",
      printHint: "印刷ダイアログで送信先を「PDFで保存」に選んでください。",
    },
  },
  exports: {
    menuLabel: "データを書き出す",
    menuDescription:
      "会費・支出・精算の記録を CSV で受け取れます。会計担当が変わるときの引き継ぎに使ってください。",
    datasetLabel: {
      dues: "会費の請求状況",
      payments: "入金履歴",
      expenses: "支出明細",
      settlements: "精算レポート",
    },
    filename: {
      dues: "会費請求状況",
      payments: "入金履歴",
      expenses: "支出明細",
      settlements: "精算レポート",
    },
    settlementCsvButton: "CSVで受け取る",
    itemTypeIncome: "収入",
    itemTypeExpense: "支出",
    formerMemberLabel: "退会したメンバー",
    columns: {
      dues: {
        cycleTitle: "会費項目",
        period: "期間",
        dueType: "種別",
        dueDate: "納付期限",
        memberName: "メンバー",
        chargedAmount: "請求額",
        paidAmount: "入金額",
        remainingAmount: "未納額",
        status: "ステータス",
        userId: "ユーザーID",
        dueId: "請求ID",
      },
      payments: {
        paidAt: "入金日",
        cycleTitle: "会費項目",
        memberName: "入金者",
        amount: "入金額",
        memo: "メモ",
        recordedBy: "記録者",
        dueId: "請求ID",
        paymentId: "入金ID",
      },
      expenses: {
        spentAt: "支出日",
        category: "カテゴリ",
        amount: "金額",
        paidBy: "担当者",
        memo: "備考",
        receiptPath: "領収書パス",
        createdAt: "登録日",
        expenseId: "支出ID",
      },
      settlements: {
        periodStart: "精算開始日",
        periodEnd: "精算終了日",
        status: "ステータス",
        publishedAt: "発行日",
        totalIncome: "収入合計",
        totalExpense: "支出合計",
        balance: "残高",
        itemType: "区分",
        category: "カテゴリ",
        description: "説明",
        amount: "金額",
        entryCount: "件数",
        settlementId: "精算ID",
      },
    },
  },
  votes: {
    pageTitle: "投票一覧",
    detailTitle: "投票詳細",
    voteIdLabel: "投票ID",
    type: {
      multipleChoice: "選択式",
      yesNo: "賛否",
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
      voteTypeLabel: "投票形式",
      optionPlaceholder: "選択肢を入力してください",
      removeOptionButton: "削除",
      successToast: "投票を作成しました。",
      notifiedCountSuffix: "人に通知を送りました。",
      notifiedNoneNotice: "通知を受け取る他のメンバーはまだいません。",
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
    emptyState: "進行中の投票はありません。",
    alreadyVotedNotice: "すでに参加した投票です。",
    notVotedYetNotice: "まだ参加していません。今すぐ投票してみましょう！",
    anonymousResultsNotice: "匿名投票のため参加者数のみ表示されます。",
    realNameResultsNotice: "参加者の名前も一緒に表示されます。",
    voterNamesLabel: "参加者",
    responseCountSuffix: "票",
    submitVoteSuccessToast: "投票しました！",
    notFound: "投票が見つからないか、アクセス権限がありません。",
    notificationTitle: "新しい投票が始まりました",
    notificationBody: "締め切り前に投票してください。",
    adminOnlyNotice: "投票は会計担当のみ作成できます。",
    closedNotice: "締め切られた投票のため、これ以上参加できません。",
    closeNowDialogTitle: "投票を締め切りますか？",
    closeNowSuccessToast: "投票を締め切りました。",
    closeNowAlreadyClosedToast: "すでに締め切られた投票です。",
    closeNotifiedCountSuffix: "人に結果の通知を送りました。",
    closeNotificationTitle: "投票が締め切られました",
    closeNotificationBody: "投票結果を確認してみましょう。",
  },
  notifications: {
    pageTitle: "通知センター",
    markAllReadButton: "すべて既読にする",
    unreadLabel: "未読",
    readLabel: "既読",
    emptyState:
      "まだお知らせはありません。新しい知らせが届いたらすぐにお伝えします！",
    unreadCountSuffix: "件の新しいお知らせがあります",
    allReadMessage: "新しいお知らせをすべて確認しました。",
    markAllReadSuccessSuffix: "件を既読にしました。",
    markReadErrorToast:
      "既読処理に失敗しました。しばらくしてからもう一度お試しください。",
    unreadBadgeLabel: "未読のお知らせ",
    channelSettings: {
      title: "通知チャンネル設定",
      inApp: "アプリ内通知",
      webPush: "ウェブプッシュ",
      inAppDescription: "お知らせセンターとベルのアイコンで受け取ります。",
      webPushDescription:
        "ブラウザ通知で受け取ります。オンにすると、このブラウザの通知許可をリクエストします。",
      comingSoonNotice:
        "アプリ内通知をオフにすると、新しいお知らせがお知らせセンターに残りません。ウェブプッシュの送信が最終的に失敗した場合は、代わりにアプリ内通知として残します。",
      saveSuccessToast: "通知設定を保存しました。",
      saveErrorToast:
        "通知設定を保存できませんでした。しばらくしてからもう一度お試しください。",
      webPushUnsupported: "このブラウザはウェブプッシュに対応していません。",
      webPushPermissionDenied:
        "ブラウザで通知がブロックされています。アドレスバー横のサイト設定で通知を許可してから、もう一度オンにしてください。",
      webPushSubscribeErrorToast:
        "ブラウザ通知をオンにできませんでした。しばらくしてからもう一度お試しください。",
      webPushActiveNotice:
        "現在このブラウザで通知を受け取っています。他の端末でオンにすると、この端末の購読は解除されます。",
      webPushMissingKeyNotice:
        "この環境にはウェブプッシュのキーが設定されていないため、オンにできません。",
      webPushIosInstallTitle:
        "iPhone・iPadはホーム画面に追加すると受け取れます",
      webPushIosInstallBody:
        "Safari下部の共有ボタン →「ホーム画面に追加」でWoodongをインストールし、インストールしたWoodongからこのスイッチをオンにしてください。",
    },
    types: {
      announcement: "お知らせ",
      dueReminder: "会費納付リマインド",
      voteStart: "新しい投票が開始",
      voteClose: "投票締切結果",
      settlementReport: "精算レポート発行",
    },
    templates: {
      dueReminder: {
        title: "{cycle_title} の納付リマインド",
        body: "まだ会費が未納です。Woodongからそっとお知らせします！",
      },
      voteStart: {
        title: "新しい投票が始まりました: {vote_title}",
        body: "締め切り前に投票してください。",
      },
      voteClose: {
        title: "投票が締め切られました: {vote_title}",
        body: "投票結果を確認してみましょう。",
      },
      settlementPublished: {
        title: "精算レポートが発行されました",
        body: "{period_start} ~ {period_end} の収支の精算結果を確認してください。",
      },
    },
    filters: {
      typeGroupLabel: "お知らせの種類で絞り込む",
      allTypes: "すべて",
      unreadOnly: "未読のみ",
      emptyFiltered: "条件に合うお知らせはありません。",
      resetButton: "絞り込みを解除",
    },
  },
  me: {
    pageTitle: "マイページ",
    profileSectionTitle: "プロフィール",
    editProfileButton: "プロフィールを編集",
    linkedAccountsSectionTitle: "連携済みアカウント",
    linkedAccountsNotice:
      "連携したアカウントのいずれかでログインすれば、同じグループ情報を見られます。",
    linkedAccountsLoadError:
      "連携情報を読み込めませんでした。しばらくしてから再読み込みしてください。",
    connectedLabel: "連携済み",
    notConnectedLabel: "未連携",
    emailProviderLabel: "メール",
    linkAccountButton: "連携する",
    unlinkAccountButton: "連携を解除",
    lastIdentityNotice:
      "最後のログイン手段は解除できません。先に他のアカウントを連携してください。",
    unlinkConfirmTitle: "連携を解除しますか？",
    unlinkConfirmDescription:
      "このアカウントではログインできなくなります。グループ情報はそのまま残り、いつでも再連携できます。",
    unlinkConfirmCancel: "キャンセル",
    unlinkConfirmAction: "解除する",
    unlinkSuccessToast: "連携を解除しました。",
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
    authInvalidCredentials:
      "メールアドレスまたはパスワードが正しくありません。",
    authEmailTaken:
      "すでに登録済みのメールアドレスです。ログインしてください。",
    authWeakPassword:
      "パスワードが短すぎるか単純すぎます。8文字以上で設定し直してください。",
    authSamePassword:
      "現在使用中のパスワードと同じです。別のパスワードを入力してください。",
    authRateLimit:
      "リクエストが多すぎます。しばらくしてからもう一度お試しください。",
    authIdentityAlreadyLinked:
      "すでに他のWoodongアカウントに連携されているソーシャルアカウントです。別のアカウントでお試しください。",
    authLastIdentityGuard:
      "最後のログイン手段は解除できません。先に他のアカウントを連携してください。",
    authCurrentPasswordInvalid: "現在のパスワードが正しくありません。",
  },
  legal: {
    effectiveDateLabel: "施行日",
    canonicalNotice:
      "以下の韓国語の本文が法的効力を持つ正本です。この翻訳は参考のために提供されます。",
    privacy: {
      heading: "プライバシーポリシー",
      description:
        "ウドンがどのような個人情報を収集し、何の目的で利用し、グループ内で誰まで見えるのかをまとめました。",
    },
    terms: {
      heading: "利用規約",
      description:
        "ウドンをご利用いただく際に適用される、利用者と運営者の権利・義務をまとめました。",
    },
    consent: {
      label: "{terms}および{privacy}に同意します。",
      termsLinkText: "利用規約",
      privacyLinkText: "プライバシーポリシー",
      requiredError:
        "利用規約とプライバシーポリシーに同意しないと登録できません。",
    },
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
