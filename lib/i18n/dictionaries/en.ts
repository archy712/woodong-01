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
  },
  nav: {
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
      title: "Run your group in one place, with Woodong",
      subtitle:
        "From dues to settlements, votes, and announcements — an easy-to-manage service for organizers, and an easy-to-join experience for members.",
      cta: "Get started for free",
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
    },
    invite: {
      title: "Invite Members",
      generateButton: "Create Invite Link",
      reissueButton: "Reissue Code",
      copyLinkButton: "Copy Link",
      codeLabel: "Invite Code",
      expiresAtLabel: "Expires At",
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
    },
    announcements: {
      pageTitle: "Announcements",
      createTitle: "Write an Announcement",
      titleLabel: "Title",
      contentLabel: "Content",
      submitButton: "Send",
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
    create: {
      title: "Create a Dues Item",
      titleLabel: "Item Name",
      amountLabel: "Amount",
      periodLabel: "Period",
      reminderIntervalLabel: "Reminder Interval (days)",
      submitButton: "Create Dues Item",
    },
    markPaidButton: "Mark as Paid",
    reminderToastMessage:
      "You haven't paid your dues yet — a friendly reminder from Woodong!",
  },
  votes: {
    pageTitle: "Votes",
    detailTitle: "Vote Details",
    voteIdLabel: "Vote ID",
    create: {
      title: "Create a Vote",
      titleLabel: "Vote Title",
      optionsLabel: "Options",
      addOptionButton: "Add Option",
      closesAtLabel: "Closing Date/Time",
      allowMultipleLabel: "Allow Multiple Choices",
      anonymousLabel: "Anonymous Vote",
      submitButton: "Create Vote",
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
  },
  notifications: {
    pageTitle: "Notification Center",
    markAllReadButton: "Mark All as Read",
    channelSettings: {
      title: "Notification Channel Settings",
      inApp: "In-app",
      kakao: "KakaoTalk",
      slack: "Slack",
      email: "Email",
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
  },
  auth: {
    socialAccountLinkedToast: "Linked to your existing account.",
    kakaoNoEmailNotice:
      "Your Kakao account didn't provide an email, so a separate account was created. You can link it to your email account from My Page.",
    manualLinkCta: "Link Account",
    loginWithGoogle: "Continue with Google",
    loginWithKakao: "Continue with Kakao",
    googleConnecting: "Connecting...",
    login: {
      title: "Login",
      description: "Sign in with your email to see your groups.",
      emailLabel: "Email",
      passwordLabel: "Password",
      forgotPasswordLink: "Forgot your password?",
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
    signUpSuccess: {
      title: "You're signed up!",
      description: "Check your email",
      message:
        "Sign-up is complete. Please check your email to confirm your account before logging in.",
    },
    forgotPassword: {
      title: "Reset Password",
      description:
        "Enter your email and we'll send you a link to reset your password.",
      emailLabel: "Email",
      submitButton: "Send Reset Email",
      submittingButton: "Sending...",
      haveAccountText: "Already have an account?",
      loginLink: "Login",
      successTitle: "Check Your Email",
      successDescription: "Password reset instructions sent",
      successMessage:
        "If you signed up with an email and password, you'll receive a password reset email.",
    },
    updatePassword: {
      title: "Reset Password",
      description: "Please enter your new password.",
      passwordLabel: "New Password",
      passwordPlaceholder: "New password",
      submitButton: "Save New Password",
      submittingButton: "Saving...",
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
