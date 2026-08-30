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
      promoteButton: "幹事に指定",
      demoteButton: "メンバーに変更",
      removeButton: "退会させる",
      leaveButton: "グループを抜ける",
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
      reminderIntervalLabel: "リマインド周期（任意・日）",
      submitButton: "会費項目を作成",
      // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
      dueDateLabel: "납부 기한",
      dueTypeLabel: "회비 유형",
      createTriggerButton: "새 회비 항목",
      successToast:
        "회비 항목을 만들었어요. 활성 멤버 전원에게 청구가 생성됐어요.",
    },
    markPaidButton: "納付済みにする",
    // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
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
  // TODO(i18n): Task 035の新規キーは韓国語の仮文言、翻訳が必要（Task 040）
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
      successToast: "투표를 만들었어요.",
      notifiedCountSuffix: "명에게 알림을 보냈어요.",
      notifiedNoneNotice: "알림을 받을 다른 멤버가 아직 없어요.",
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
    pageTitle: "通知センター",
    markAllReadButton: "すべて既読にする",
    // TODO(i18n): Task 012の新規キーは韓国語の仮文言、翻訳が必要
    unreadLabel: "안읽음",
    readLabel: "읽음",
    emptyState: "아직 알림이 없어요. 새 소식이 오면 바로 알려드릴게요!",
    // TODO(i18n): Task 026の新規キーは韓国語の仮文言、翻訳が必要
    unreadCountSuffix: "건의 새 알림이 있어요",
    allReadMessage: "새 알림을 모두 확인했어요.",
    markAllReadSuccessSuffix: "건을 읽음으로 표시했어요.",
    markReadErrorToast: "읽음 처리에 실패했어요. 잠시 후 다시 시도해주세요.",
    unreadBadgeLabel: "안 읽은 알림",
    channelSettings: {
      title: "通知チャンネル設定",
      inApp: "アプリ内通知",
      webPush: "ウェブプッシュ",
      // TODO(i18n): Task 012/027の新規キーは韓国語の仮文言、翻訳が必要
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
      announcement: "お知らせ",
      dueReminder: "会費納付リマインド",
      voteStart: "新しい投票が開始",
      voteClose: "投票締切結果",
      settlementReport: "精算レポート発行",
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
      "パスワードが短すぎるか単純すぎます。8文字以上で設定し直してください。",
    authSamePassword:
      "지금 쓰고 있는 비밀번호와 같아요. 다른 비밀번호를 입력해 주세요.",
    authRateLimit: "요청이 너무 잦아요. 잠시 후 다시 시도해 주세요.",
    authIdentityAlreadyLinked:
      "이미 다른 우동 계정에 연결된 소셜 계정이에요. 다른 계정으로 시도해 주세요.",
    authLastIdentityGuard:
      "마지막 로그인 수단은 해제할 수 없어요. 다른 계정을 먼저 연동해 주세요.",
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
