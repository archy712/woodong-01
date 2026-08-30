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
    memberCountSuffix: " member(s)",
    viewAllLink: "View all",
  },
  nav: {
    brandTagline: "Our Club",
    groupsLabel: "My Groups",
    notificationsLabel: "Notifications",
    profileLabel: "Profile",
    logoutLabel: "Log out",
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    theme: {
      label: "Change theme",
      light: "Light",
      dark: "Dark",
      system: "System",
    },
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
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
  },
  gallery: {
    heading: "Component Gallery",
    description:
      "Browse every component in the official shadcn/ui registry alongside extension components commonly used in real projects.",
  },
  icons: {
    heading: "Icon Gallery",
    description:
      "Search every lucide-react icon bundled with this project and copy its import statement instantly.",
  },
  avatars: {
    heading: "Avatar Gallery",
    description:
      "Sizes, images, initials, status badges, and grouping — explore every way to use the shadcn/ui Avatar component.",
  },
  charts: {
    heading: "Chart Gallery",
    description:
      "A collection of chart types built with recharts-based shadcn/ui Chart components.",
  },
  techStack: {
    heading: "Tech Stack",
    description:
      "The frameworks, libraries, and dev tools that Woodong is built on, organized by category.",
  },
  groups: {
    pageTitle: "My Groups",
    createButton: "Create Group",
    detailTitle: "Group Details",
    detailNotFound: "Group not found, or you don't have access to it.",
    viewButton: "Open group",
    dashboard: {
      announcementsTitle: "Latest notice",
      duesTitle: "Dues status",
      votesTitle: "Open votes",
      noOpenVotes: "No votes are open right now.",
      unpaidCountLabel: " unpaid",
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
      deleteDialogTitle: "Delete this group?",
      saveSuccessToast:
        "Group info saved. (Demo screen - nothing is actually saved)",
      deleteSuccessToast:
        "Group deleted. (Demo screen - nothing is actually deleted)",
      adminOnlyNotice: "Only the treasurer can edit group info.",
      coverImageLabel: "Cover image",
      coverImageHint:
        "JPEG/PNG/WebP, up to 5MB. Images are resized automatically on upload.",
      coverImageRemoveButton: "Remove image",
      coverUploadError:
        "Could not upload the image. Please try again in a moment.",
    },
    invite: {
      title: "Invite Members",
      generateButton: "Create Invite Link",
      reissueButton: "Reissue Code",
      copyLinkButton: "Copy Link",
      codeLabel: "Invite Code",
      expiresAtLabel: "Expires At",
      maxUsesLabel: "Max uses",
      usedCountLabel: " used",
      emptyState: "No invite links have been issued.",
      activeLabel: "Available",
      inactiveLabel: "Expired / revoked",
      reissueNotice:
        "Creating a new link automatically revokes the old one. Members who already joined stay in the group.",
      createdAtLabel: "Issued on",
      issueSuccessToast:
        "Invite link created. The previous link can no longer be used.",
      revokeButton: "Revoke",
      revokeDialogTitle: "Revoke this invite link?",
      revokeConfirmMessage:
        "Once revoked, nobody can join through this link. Members who already joined stay in the group.",
      revokeSuccessToast: "Invite link revoked.",
      adminOnlyNotice: "Only the treasurer can issue invite links.",
    },
    members: {
      title: "Members",
      roleAdmin: "Organizer",
      roleMember: "Member",
      promoteButton: "Make Organizer",
      demoteButton: "Make Member",
      removeButton: "Remove",
      leaveButton: "Leave Group",
      promoteDialogTitle: "Make this member a treasurer?",
      promoteConfirmMessage:
        "They will be able to edit group info and manage dues and members.",
      demoteDialogTitle: "Change to regular member?",
      demoteConfirmMessage:
        "They will lose treasurer rights and can no longer manage group settings or dues.",
      removeDialogTitle: "Remove this member?",
      removeConfirmMessage:
        "They will need a new invite link to rejoin. Past dues and vote records remain.",
      leaveDialogTitle: "Leave this group?",
      leaveConfirmMessage:
        "After leaving you cannot see this group's notices, dues, or votes. You will need an invite link to rejoin.",
      roleChangeSuccessToast: "Role updated.",
      removeSuccessToast: "Member removed.",
      leaveSuccessToast: "You left the group.",
      lastAdminNotice:
        "You are the last treasurer. Assign another member as treasurer to change your role or leave.",
      memberViewNotice:
        "Only the treasurer can change roles or remove members.",
      phoneLabel: "Contact",
      meLabel: "You",
      unnamedMemberLabel: "Member without a name",
    },
    invitePage: {
      title: "Join Group",
      codeLabel: "Invite Code",
      joinButton: "Join",
      alreadyMemberMessage:
        "You're already a member of this group. Taking you to the group page.",
      loginToJoinButton: "Sign in and join",
      previewNotice:
        "You have been invited to the group below. Joining registers you as a member.",
      alreadyMemberNotice: "You are already a member of this group.",
      goToGroupButton: "Go to group",
      expiredMessage:
        "This invite link has expired. Please ask the treasurer for a new one.",
      revokedMessage:
        "This invite link has been revoked. Please ask the treasurer for a new one.",
      exhaustedMessage:
        "This invite link has reached its usage limit. Please ask the treasurer for a new one.",
      joinSuccessToast: "You're in! You are now a member of this group.",
    },
    announcements: {
      pageTitle: "Announcements",
      createTitle: "Write an Announcement",
      titleLabel: "Title",
      contentLabel: "Content",
      submitButton: "Send",
      writeButton: "Write a notice",
      submitSuccessToast:
        "Notice sent. (Demo screen - nothing is actually saved)",
      notifiedCountSuffix: " member(s) notified.",
      notifiedNoneNotice: "There are no other members to notify yet.",
      editButton: "Edit",
      editTitle: "Edit notice",
      editSubmitButton: "Save changes",
      editSuccessToast: "Notice updated.",
      editedBadge: "Edited",
      adminOnlyNotice: "Only the treasurer can write or edit notices.",
      notifyNotice:
        "Sending delivers an in-app notification to every group member.",
      editNotifyNotice: "Editing does not send the notification again.",
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
    type: {
      regular: "Regular",
      extra: "One-off / special",
    },
    create: {
      title: "Create a Dues Item",
      titleLabel: "Item Name",
      amountLabel: "Amount",
      periodLabel: "Period",
      reminderIntervalLabel: "Reminder Interval (optional, days)",
      submitButton: "Create Dues Item",
      dueDateLabel: "Due date",
      dueTypeLabel: "Dues type",
      createTriggerButton: "New dues item",
      successToast:
        "Dues item created. Charges were issued to every active member.",
    },
    markPaidButton: "Mark as Paid",
    memberProgressTitle: "Payment status by member",
    unpaidHighlightTitle: "Members who have not paid",
    emptyState: "No dues items have been created.",
    headcountRateLabel: "By member count",
    amountRateLabel: "Collection rate by amount",
    paidCountSuffix: " paid",
    chargedCountSuffix: " charged",
    collectedAmountLabel: "Collected",
    chargedAmountLabel: "Charged",
    statusFilterLabel: "Filter by payment status",
    filterAllLabel: "All",
    filterEmptyState: "No members have this status.",
    showUnpaidOnlyButton: "Show unpaid only",
    recordPayment: {
      title: "Manage payments",
      statusLabel: "Payment status",
      amountLabel: "Amount paid",
      paidAtLabel: "Payment date",
      memoLabel: "Note (optional)",
      submitButton: "Record payment",
      successToast: "Payment recorded.",
      historyTitle: "Payment history",
      historyEmpty: "No payments have been recorded yet.",
      addTitle: "Add payment",
      totalPaidLabel: "Total paid",
      remainingLabel: "Remaining",
      updateSuccessToast: "Payment updated.",
      deleteDialogTitle: "Delete this payment record?",
      deleteConfirmMessage:
        "Deleting recalculates the payment status from the remaining records.",
      deleteSuccessToast: "Payment deleted.",
    },
  },
  expenses: {
    sectionTitle: "Expenses",
    addButton: "Add expense",
    emptyState: "No expenses have been recorded yet.",
    adminOnlyNotice: "Only the treasurer can add or edit expenses.",
    category: {
      meal: "Meals",
      event: "Events",
      supplies: "Supplies",
      venue: "Venue",
      transport: "Transport",
      other: "Other",
    },
    balance: {
      title: "Group balance",
      incomeLabel: "Total income",
      expenseLabel: "Total expense",
      balanceLabel: "Balance",
      note: "Total income counts only payments that were confirmed (not the amount charged).",
    },
    form: {
      createTitle: "Add expense",
      editTitle: "Edit expense",
      categoryLabel: "Category",
      categoryPlaceholder: "Select a category",
      amountLabel: "Amount",
      spentAtLabel: "Spent on",
      paidByLabel: "Paid by",
      paidByNone: "Not selected",
      memoLabel: "Note",
      receiptLabel: "Receipt",
      receiptHint:
        "JPEG/PNG/WebP, up to 5MB. Only members of this group can see it.",
      receiptRemoveButton: "Remove receipt",
      receiptUploadError:
        "Could not upload the receipt. Please try again in a moment.",
      submitButton: "Save",
      submittingLabel: "Saving...",
      createSuccessToast: "Expense added.",
      updateSuccessToast: "Expense updated.",
    },
    receiptViewLabel: "View receipt",
    receiptNoneLabel: "No receipt",
    editButton: "Edit",
    deleteButton: "Delete",
    deleteDialogTitle: "Delete this expense?",
    deleteConfirmMessage:
      "This cannot be undone, and the attached receipt is deleted as well.",
    deleteSuccessToast: "Expense deleted.",
  },
  settlements: {
    pageTitle: "Settlement report",
    entryLinkLabel: "Settlement report",
    backToDuesLabel: "Back to dues",
    emptyState: "No settlement reports have been created yet.",
    adminOnlyNotice:
      "Only the treasurer can create or publish settlement reports.",
    statusDraft: "Draft",
    statusPublished: "Published",
    draftVisibilityNotice:
      "Drafts are visible to the treasurer only. Publish once the amounts look right, and every member gets a notification.",
    create: {
      triggerButton: "New settlement report",
      title: "Create a settlement report",
      description:
        "Pick a period and we gather the dues collected and expenses from it into a draft.",
      periodStartLabel: "Period start",
      periodEndLabel: "Period end",
      submitButton: "Create draft",
      submittingLabel: "Calculating...",
      successToast: "Settlement draft created.",
    },
    recalculate: {
      triggerButton: "Edit period & recalculate",
      title: "Change the period and recalculate",
      description:
        "Use this to change the period, or to recalculate with the latest amounts after editing dues or expenses.",
      submitButton: "Recalculate",
      submittingLabel: "Calculating...",
      successToast: "Settlement draft recalculated.",
    },
    publish: {
      triggerButton: "Publish",
      dialogTitle: "Publish this settlement report?",
      confirmMessage:
        "Publishing notifies every group member, and the amounts can no longer be edited.",
      confirmButton: "Publish",
      successToast: "Settlement report published.",
      notifiedToastSuffix: " member(s) notified.",
      notificationTitle: "A settlement report was published",
      notificationBody: "Check the group's income and expense settlement.",
    },
    delete: {
      triggerButton: "Delete",
      dialogTitle: "Delete this settlement report?",
      confirmMessage:
        "This cannot be undone. If you create and publish it again, members get another notification.",
      successToast: "Settlement report deleted.",
    },
    detail: {
      notFound: "Settlement report not found.",
      incomeSectionTitle: "Income",
      expenseSectionTitle: "Expense",
      totalIncomeLabel: "Total income",
      totalExpenseLabel: "Total expense",
      balanceLabel: "Balance",
      entryCountSuffix: " record(s)",
      noItems: "No income or expenses were recorded in this period.",
      publishedAtLabel: "Published at",
      publishedByLabel: "Published by",
      createdByLabel: "Created by",
      snapshotNotice:
        "This is a snapshot of income and expenses at the time of publishing. The numbers stay the same even if dues or expenses change later.",
      incomeNote:
        "Income counts only payments that were confirmed (not the amount charged).",
      printButton: "Save as PDF",
      printHint:
        'In the print dialog, choose "Save as PDF" as the destination.',
    },
  },
  exports: {
    menuLabel: "Export data",
    menuDescription:
      "Download dues, expenses, and settlement records as CSV. Use it to hand over the books when the treasurer changes.",
    datasetLabel: {
      dues: "Dues charges",
      payments: "Payment history",
      expenses: "Expenses",
      settlements: "Settlement reports",
    },
    filename: {
      dues: "dues-charges",
      payments: "payment-history",
      expenses: "expenses",
      settlements: "settlement-reports",
    },
    settlementCsvButton: "Download CSV",
    itemTypeIncome: "Income",
    itemTypeExpense: "Expense",
    formerMemberLabel: "Former member",
    columns: {
      dues: {
        cycleTitle: "Dues item",
        period: "Period",
        dueType: "Type",
        dueDate: "Due date",
        memberName: "Member",
        chargedAmount: "Charged",
        paidAmount: "Paid",
        remainingAmount: "Outstanding",
        status: "Status",
        userId: "User ID",
        dueId: "Charge ID",
      },
      payments: {
        paidAt: "Paid on",
        cycleTitle: "Dues item",
        memberName: "Payer",
        amount: "Amount",
        memo: "Memo",
        recordedBy: "Recorded by",
        dueId: "Charge ID",
        paymentId: "Payment ID",
      },
      expenses: {
        spentAt: "Spent on",
        category: "Category",
        amount: "Amount",
        paidBy: "Paid by",
        memo: "Note",
        receiptPath: "Receipt path",
        createdAt: "Created on",
        expenseId: "Expense ID",
      },
      settlements: {
        periodStart: "Period start",
        periodEnd: "Period end",
        status: "Status",
        publishedAt: "Published on",
        totalIncome: "Total income",
        totalExpense: "Total expense",
        balance: "Balance",
        itemType: "Kind",
        category: "Category",
        description: "Description",
        amount: "Amount",
        entryCount: "Entries",
        settlementId: "Settlement ID",
      },
    },
  },
  votes: {
    pageTitle: "Votes",
    detailTitle: "Vote Details",
    voteIdLabel: "Vote ID",
    type: {
      multipleChoice: "Multiple choice",
      yesNo: "Yes / No",
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
      voteTypeLabel: "Vote format",
      optionPlaceholder: "Enter the options",
      removeOptionButton: "Delete",
      successToast: "Vote created.",
      notifiedCountSuffix: " member(s) notified.",
      notifiedNoneNotice: "There are no other members to notify yet.",
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
    emptyState: "No votes are open right now.",
    alreadyVotedNotice: "You have already voted.",
    notVotedYetNotice: "You haven't voted yet. Cast your vote now!",
    anonymousResultsNotice:
      "This is an anonymous vote, so only the number of participants is shown.",
    realNameResultsNotice: "Participant names are shown alongside the results.",
    voterNamesLabel: "Participants",
    responseCountSuffix: " vote(s)",
    submitVoteSuccessToast: "Vote cast!",
    notFound: "The vote does not exist or you do not have access.",
    notificationTitle: "A new vote has started",
    notificationBody: "Cast your vote before it closes.",
    adminOnlyNotice: "Only the treasurer can create votes.",
    closedNotice: "This vote is closed, so you can no longer take part.",
    closeNowDialogTitle: "Close this vote now?",
    closeNowSuccessToast: "Vote closed.",
    closeNowAlreadyClosedToast: "This vote is already closed.",
    closeNotifiedCountSuffix: " member(s) notified of the results.",
    closeNotificationTitle: "Voting has closed",
    closeNotificationBody: "Check the results.",
  },
  notifications: {
    pageTitle: "Notification Center",
    markAllReadButton: "Mark All as Read",
    unreadLabel: "Unread",
    readLabel: "Read",
    emptyState:
      "No notifications yet. We'll let you know as soon as something happens!",
    unreadCountSuffix: " unread",
    allReadMessage: "You're all caught up.",
    markAllReadSuccessSuffix: " marked as read.",
    markReadErrorToast:
      "Could not mark it as read. Please try again in a moment.",
    unreadBadgeLabel: "Unread notifications",
    channelSettings: {
      title: "Notification Channel Settings",
      inApp: "In-app",
      webPush: "Web Push",
      inAppDescription:
        "Delivered in the notification center and the bell icon.",
      webPushDescription:
        "Delivered as browser notifications. Turning this on asks for this browser's notification permission.",
      comingSoonNotice:
        "If you turn in-app notifications off, new notices no longer pile up in the notification center. If a web push finally fails, we leave it as an in-app notification instead.",
      saveSuccessToast: "Notification settings saved.",
      saveErrorToast:
        "Could not save the notification settings. Please try again in a moment.",
      webPushUnsupported: "This browser does not support web push.",
      webPushPermissionDenied:
        "Notifications are blocked in your browser. Allow notifications in the site settings next to the address bar, then turn this on again.",
      webPushSubscribeErrorToast:
        "Could not turn on browser notifications. Please try again in a moment.",
      webPushActiveNotice:
        "You are receiving notifications in this browser. Turning it on from another device unsubscribes this one.",
      webPushMissingKeyNotice:
        "This environment has no web push key configured, so it cannot be turned on.",
      webPushIosInstallTitle:
        "On iPhone and iPad, add it to the Home Screen first",
      webPushIosInstallBody:
        "Install Woodong with the share button at the bottom of Safari -> 'Add to Home Screen', then turn this switch on from the installed app.",
    },
    types: {
      announcement: "Announcement",
      dueReminder: "Dues Reminder",
      voteStart: "New Vote Started",
      voteClose: "Vote Results",
      settlementReport: "Settlement Report Published",
    },
    templates: {
      dueReminder: {
        title: "Reminder: {cycle_title}",
        body: "Your dues are still unpaid. Here is a friendly nudge!",
      },
      voteStart: {
        title: "A new vote has started: {vote_title}",
        body: "Cast your vote before it closes.",
      },
      voteClose: {
        title: "Voting has closed: {vote_title}",
        body: "Check the results.",
      },
      settlementPublished: {
        title: "A settlement report was published",
        body: "See the income and expense summary for {period_start} - {period_end}.",
      },
    },
    filters: {
      typeGroupLabel: "Filter by notification type",
      allTypes: "All",
      unreadOnly: "Unread only",
      emptyFiltered: "No notifications match this filter.",
      resetButton: "Clear filter",
    },
  },
  me: {
    pageTitle: "My Page",
    profileSectionTitle: "Profile",
    editProfileButton: "Edit profile",
    linkedAccountsSectionTitle: "Linked accounts",
    linkedAccountsNotice:
      "Sign in with any linked account to see the same group data.",
    linkedAccountsLoadError:
      "Could not load the linked accounts. Please refresh in a moment.",
    connectedLabel: "Linked",
    notConnectedLabel: "Not linked",
    emailProviderLabel: "Email",
    linkAccountButton: "Link",
    unlinkAccountButton: "Unlink",
    lastIdentityNotice:
      "You cannot unlink your last sign-in method. Link another account first.",
    unlinkConfirmTitle: "Unlink this account?",
    unlinkConfirmDescription:
      "You can no longer sign in with this account. Your group data stays as it is, and you can link it again anytime.",
    unlinkConfirmCancel: "Cancel",
    unlinkConfirmAction: "Unlink",
    unlinkSuccessToast: "Account unlinked.",
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
    authInvalidCredentials: "The email or password is incorrect.",
    authEmailTaken: "This email is already registered. Please sign in.",
    authWeakPassword:
      "That password is too short or too simple. Please use at least 8 characters.",
    authSamePassword:
      "That is the same as your current password. Please enter a different one.",
    authRateLimit: "Too many requests. Please try again in a moment.",
    authIdentityAlreadyLinked:
      "This social account is already linked to another Woodong account. Please try a different one.",
    authLastIdentityGuard:
      "You cannot unlink your last sign-in method. Link another account first.",
    authCurrentPasswordInvalid: "That current password isn't correct.",
  },
  legal: {
    effectiveDateLabel: "Effective date",
    canonicalNotice:
      "The Korean text below is the legally binding version. This translation of the page heading is provided for convenience only.",
    privacy: {
      heading: "Privacy Policy",
      description:
        "What personal data Woodong collects, why it is used, and who inside a group can see it.",
    },
    terms: {
      heading: "Terms of Service",
      description:
        "The rights and obligations that apply to you and to the operator when you use Woodong.",
    },
    consent: {
      label: "I agree to the {terms} and the {privacy}.",
      termsLinkText: "Terms of Service",
      privacyLinkText: "Privacy Policy",
      requiredError:
        "You must agree to the Terms of Service and the Privacy Policy to sign up.",
    },
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
