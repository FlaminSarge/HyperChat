/* eslint-disable no-use-before-define */
declare namespace Ytc {
  /*
   * Base JSON
   */
  /** Expected YTC JSON response */
  interface RawResponse {
    continuationContents?: {
      liveChatContinuation: BaseData;
    };
    /** Initial data only. */
    contents?: {
      liveChatRenderer: BaseData;
    };
  }

  interface BaseData {
    continuations: ContinuationData[];
    actions?: Action[];
    /** Only present on supposed YTC refresh, e.g. when toggling Top/Live Chat. */
    clientMessages?: unknown;
  }

  /** Expected YTC continuation data object */
  interface ContinuationData {
    timedContinuationData?: {
      timeoutMs: number;
    };
    invalidationContinuationData?: {
      timeoutMs: number;
    };
  }

  interface ReplayAction {
    addChatItemAction?: AddChatItemAction;
    addBannerToLiveChatCommand?: AddPinnedAction;
    removeBannerForLiveChatCommand?: {
      targetActionId: string;
    };
    addLiveChatTickerItemAction?: AddTickerAction;
    updateLiveChatPollAction?: UpdatePollAction;
  }

  /** Expected YTC action object */
  interface Action extends ReplayAction {
    replayChatItemAction?: ReplayChatItemAction;
    markChatItemsByAuthorAsDeletedAction?: AuthorBonkedAction;
    markChatItemAsDeletedAction?: MessageDeletedAction;
  }

  /*
   * Actions
   */
  /** YTC addChatItemAction object */
  interface AddChatItemAction {
    item: AddChatItem;
  }

  /** YTC replayChatItemAction object */
  interface ReplayChatItemAction {
    actions: ReplayAction[];
    videoOffsetTimeMsec: IntString;
  }

  /* YTC sentChatItemAction object */
  interface SentChatItemAction {
    actions: Action[];
  }

  /** YTC markChatItemsByAuthorAsDeletedAction object */
  interface AuthorBonkedAction extends IDeleted {
    /** ID of channel that was bonked */
    externalChannelId: string;
  }

  /** YTC markChatItemAsDeletedAction object. */
  interface MessageDeletedAction extends IDeleted {
    /** ID of message to be deleted */
    targetItemId: string;
  }

  /** YTC addBannerToLiveChatCommand object */
  interface AddPinnedAction {
    bannerRenderer: {
      liveChatBannerRenderer: {
        contents: AddChatItem;
        header: {
          liveChatBannerHeaderRenderer: {
            text: RunsObj;
          };
        };
        actionId: string;
        /** Gets used for pinned messages */
        bannerProperties?: BannerPropertiesObj;
      };
    };
    /** Gets used for chat summary/redirects */
    bannerProperties?: BannerPropertiesObj;
  }

  interface BannerPropertiesObj {
    isEphemeral?: boolean;
    bannerTimeoutMs?: number;
    autoCollapseDelay?: {
      seconds: number;
    }
  }

  interface AddTickerAction {
    item: {
      liveChatTickerSponsorItemRenderer?: TickerRenderer & {
        detailText: RunsObj | SimpleTextObj;
        detailTextColor: number;
        startBackgroundColor: number;
        endBackgroundColor: number;
        showItemEndpoint: {
          showLiveChatItemEndpoint: {
            renderer: {
              liveChatMembershipItemRenderer: MembershipRenderer;
            };
          };
        };
      };
      liveChatTickerPaidMessageItemRenderer?: TickerRenderer & {
        amount: SimpleTextObj;
        amountTextColor: number;
        durationSec: number;
        showItemEndpoint: {
          showLiveChatItemEndpoint: {
            renderer: {
              liveChatPaidMessageRenderer: PaidMessageRenderer;
            };
          };
        };
      };
    };
    durationSec: IntString;
  }

  /*
   * Misc
   */
  interface Thumbnails {
    thumbnails: Array<{
      url: string;
      width?: number;
      height?: number;
    }>;
  }

  interface ThumbnailsWithLabel extends Thumbnails {
    accessibility?: AccessibilityObj;
  }

  interface UpdatePollAction {
    pollToUpdate: {
      pollRenderer: PollRenderer;
    };
  }

  /** Message run object */
  interface MessageRun {
    text?: string;
    bold?: boolean;
    deemphasize?: boolean;
    navigationEndpoint?: {
      commandMetadata: {
        webCommandMetadata: {
          url: string;
        };
      };
    };
    emoji?: {
      emojiId?: string;
      image: ThumbnailsWithLabel;
    };
  }

  interface IRenderer {
    id: string;
    timestampUsec: IntString;
    authorExternalChannelId?: string;
  }

  interface AuthorBadge {
    liveChatAuthorBadgeRenderer: {
      /** Changes based on YT language */
      tooltip: string;
      /** Used to check if author is member ignoring YT language */
      customThumbnail?: Thumbnails;
      /** Only available for verified, mods and owner */
      icon?: {
        /** Unlocalized string */
        iconType: string;
      };
      accessibility?: AccessibilityObj;
    };
  }

  interface TextMessageRenderer extends IRenderer {
    message?: RunsObj;
    authorName?: SimpleTextObj;
    authorPhoto?: Thumbnails;
    authorBadges?: AuthorBadge[];
    /** Only available on replays */
    timestampText?: SimpleTextObj;
    contextMenuEndpoint?: {
      liveChatItemContextMenuEndpoint: {
        params: string;
      };
    };
  }

  interface IPaidRenderer extends TextMessageRenderer {
    purchaseAmountText: SimpleTextObj;
    authorNameTextColor: number;
  }

  interface PaidMessageRenderer extends IPaidRenderer {
    headerBackgroundColor: number;
    headerTextColor: number;
    bodyBackgroundColor: number;
    bodyTextColor: number;
  }

  interface PaidStickerRenderer extends IPaidRenderer {
    sticker: ThumbnailsWithLabel;
    moneyChipBackgroundColor: number;
    moneyChipTextColor: number;
  }

  interface MembershipRenderer extends TextMessageRenderer {
    headerPrimaryText?: RunsObj;
    headerSubtext: SimpleTextObj | RunsObj;
  }

  interface MembershipGiftPurchaseRenderer extends IRenderer {
    header: {
      liveChatSponsorshipsHeaderRenderer: TextMessageRenderer & {
        primaryText: RunsObj;
        image: Thumbnails;
      };
    };
  }

  interface EngagementMessageRenderer {
    message: RunsObj[];
    id: string;
    timestampUsec?: IntString;
    icon?: {
      /** Unlocalized string */
      iconType: string;
    };
    actionButton?: {
      buttonRenderer: ButtonRenderer;
    }
  }

  interface ChatSummaryRenderer {
    liveChatSummaryId: string;
    chatSummary: RunsObj;
    icon?: {
      /** Unlocalized string */
      iconType: string;
    };
  }

  interface RedirectRenderer {
    bannerMessage: RunsObj;
    authorPhoto?: Thumbnails;
    inlineActionButton?: {
      buttonRenderer: ButtonRenderer;
    }
    contextMenuButton?: {
      buttonRenderer: ButtonRenderer;
    }
  }

  interface ButtonRenderer {
    style?: string;
    size?: string;
    icon?: string;
    accessibility?: AccessibilityObj;
    isDisabled?: boolean;
    text?: RunsObj; // | SimpleTextObj;
    command: {
      commandMetadata?: {
        webCommandMetadata?: {
          apiUrl?: string;
          sendPost?: boolean;
        }
      }
      liveChatActionEndpoint?: {
        params: string;
      }
      urlEndpoint?: {
        url: string;
        target: string;
      }
      watchEndpoint?: {
        videoId: string;
      }
    }
  }

  interface PollRenderer {
    choices: PollChoice[];
    liveChatPollId: string;
    header: {
      pollHeaderRenderer: {
        pollQuestion: RunsObj;
        thumbnail: Thumbnails;
        metadataText: RunsObj;
        liveChatPollType: string;
      }
    }
    displayVoteResults?: boolean;
    button?: ButtonRenderer;
  }

  interface PollChoice {
    text: RunsObj;
    selected: boolean;
    voteRatio?: number;
    votePercentage?: SimpleTextObj;
  }

  interface PlaceholderRenderer { // No idea what the purpose of this is
    id: string;
    timestampUsec: IntString;
  }

  type Renderers = TextMessageRenderer | PaidMessageRenderer |
  PaidStickerRenderer | MembershipRenderer | MembershipGiftPurchaseRenderer;

  interface AddChatItem {
    /** Normal message */
    liveChatTextMessageRenderer?: TextMessageRenderer;
    /** Super Chat */
    liveChatPaidMessageRenderer?: PaidMessageRenderer;
    /** Super Sticker */
    liveChatPaidStickerRenderer?: PaidStickerRenderer;
    /** Membership & Member Milestone Chat */
    liveChatMembershipItemRenderer?: MembershipRenderer;
    /** Membership gift purchase */
    liveChatSponsorshipsGiftPurchaseAnnouncementRenderer?: MembershipGiftPurchaseRenderer;
    /** Membership gift redemption */
    liveChatSponsorshipsGiftRedemptionAnnouncementRenderer?: TextMessageRenderer;
    /** AI Chat Summary */
    liveChatBannerChatSummaryRenderer?: ChatSummaryRenderer;
    /** Redirects */
    liveChatBannerRedirectRenderer?: RedirectRenderer;
    /** Poll start */
    pollRenderer?: PollRenderer;
    /** Poll end + other in-chat announcements TODO */
    liveChatViewerEngagementMessageRenderer?: EngagementMessageRenderer;
    /** ??? */
    liveChatPlaceholderItemRenderer?: PlaceholderRenderer;
  }

  interface TickerRenderer { // Doesn't have a timestamp but ID is always a paid message id
    id: string;
    startBackgroundColor: number;
    endBackgroundColor: number;
    durationSec: number;
    fullDurationSec: number;
  }

  interface IDeleted {
    /** Message to replace deleted messages. */
    deletedStateMessage: RunsObj;
  }

  /** Integer formatted as string for whatever reason */
  type IntString = string;

  interface SimpleTextObj {
    simpleText: string;
  }

  interface RunsObj {
    runs: MessageRun[];
  }

  interface AccessibilityObj {
    accessibilityData: {
      label: string;
    }
  }

  /*
   * Parsed objects
   */
  interface ParsedImage {
    src: string;
    alt: string;
  }

  interface ParsedTextRun {
    type: 'text';
    text: string;
    styles?: string[];
  }

  interface ParsedLinkRun {
    type: 'link';
    text: string;
    url: string;
  }

  interface ParsedEmojiRun extends ParsedImage {
    type: 'emoji';
    standardEmoji?: boolean;
  }

  type ParsedRun = ParsedTextRun | ParsedLinkRun | ParsedEmojiRun;

  interface PaidDetails {
    amount: string;
    bodyBackgroundColor: string;
    bodyTextColor: string;
    nameColor: string;
  }

  interface ParsedSuperChat extends PaidDetails {
    headerBackgroundColor: string;
    headerTextColor: string;
  }

  interface ParsedSuperSticker extends PaidDetails, ParsedImage { }

  interface ParsedMembership {
    headerPrimaryText: ParsedRun[];
    headerSubtext: ParsedRun[];
  }

  interface ParsedMembershipGiftPurchase {
    headerPrimaryText: ParsedRun[];
    image: ParsedImage;
  }

  interface ParsedMessage {
    author: {
      name: string;
      id: string;
      types: string[];
      profileIcon: ParsedImage;
      customBadge?: ParsedImage;
      url?: string;
    };
    message: ParsedRun[];
    timestamp: string;
    showtime: number;
    messageId: string;
    superChat?: ParsedSuperChat;
    superSticker?: ParsedSuperSticker;
    membership?: ParsedMembership;
    params?: string;
    membershipGiftPurchase?: ParsedMembershipGiftPurchase;
    membershipGiftRedeem?: boolean;
  }

  interface ParsedBonk {
    replacedMessage: ParsedRun[];
    authorId: string;
  }

  interface ParsedDeleted {
    replacedMessage: ParsedRun[];
    messageId: string;
  }

  interface ParsedPinned {
    type: 'pin';
    actionId: string;
    item: {
      header: ParsedRun[];
      contents: ParsedMessage;
    };
    showtime: number;
  }

  interface ParsedSummary {
    type: 'summary';
    actionId: string;
    item: {
      header: ParsedRun[];
      subheader: ParsedRun[];
      message: ParsedRun[];
    };
    showtime: number;
    timestamp?: string;
  }

  interface ParsedRedirect {
    type: 'redirect';
    actionId: string;
    item: {
      message: ParsedRun[];
      profileIcon: ParsedImage;
      action: {
        url: string;
        text: ParsedRun[];
      }
    };
    showtime: number;
    timestamp?: string;
  }

  interface ParsedPoll {
    type: 'poll';
    actionId: string;
    item: {
      header: ParsedRun[];
      profileIcon: ParsedImage;
      question: ParsedRun[];
      choices: Array<{
        text: ParsedRun[];
        selected: boolean;
        ratio?: number;
        percentage?: string;
      }>;
    }
    // TODO add 'action' for ending poll button
  }

  interface ParsedRemoveBanner {
    type: 'unpin';
    targetActionId: string;
  }

  interface ParsedTicker extends ParsedMessage {
    type: 'ticker';
    tickerDuration: number;
    detailText?: string;
  }

  type ParsedMisc = ParsedPinned | ParsedSummary | ParsedRedirect | ParsedPoll | ParsedRemoveBanner;

  type ParsedTimedItem = ParsedMessage | ParsedTicker;

  type ParsedAction = ParsedTimedItem | ParsedBonk | ParsedDeleted | ParsedMisc;

  interface ParsedChunk {
    messages: ParsedMessage[];
    bonks: ParsedBonk[];
    deletions: ParsedDeleted[];
    miscActions: ParsedMisc[];
    isReplay: boolean;
    refresh: boolean;
  }
}
