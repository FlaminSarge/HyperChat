<script lang="ts">
  import Message from './Message.svelte';
  import MessageRun from './MessageRuns.svelte';
  import { showProfileIcons } from '../ts/storage';
  import { membershipBackground, milestoneChatBackground } from '../ts/chat-constants';

  export let message: Ytc.ParsedMessage;

  const classes = 'inline-flex flex-col rounded break-words overflow-hidden w-full text-white';

  $: membership = message.membership;
  $: membershipGift = message.membershipGiftPurchase;
  $: if (!(membership || membershipGift)) {
    console.error('Not a membership item', { message });
  }
  $: isMilestoneChat = message.message.length > 0;

  $: primaryText = (membership ?? membershipGift)?.headerPrimaryText;
</script>

{#if membership ?? membershipGift}
  <div class={classes} style="background-color: #{membershipBackground};">
    <div
      class="p-2"
      style="{isMilestoneChat ? `background-color: #${milestoneChatBackground};` : ''}"
    >
      {#if $showProfileIcons}
        <img
          class="h-5 w-5 inline align-middle rounded-full flex-none mr-1"
          src={message.author.profileIcon.src}
          alt={message.author.profileIcon.alt}
        />
      {/if}
      <span class="font-bold tracking-wide align-middle mr-3">
        {message.author.name}
      </span>
      {#if primaryText && primaryText.length > 0}
        <MessageRun
          class="font-medium mr-3"
          runs={primaryText}
        />
      {/if}
      {#if membership}
        <MessageRun runs={membership.headerSubtext} />
      {/if}
      {#if membershipGift}
        <img
          class="h-10 w-10 float-right"
          src={membershipGift.image.src}
          alt={membershipGift.image.alt}
          title={membershipGift.image.alt} />
      {/if}
    </div>
    {#if isMilestoneChat}
      <div class="p-2">
        <Message message={message} hideName />
      </div>
    {/if}
  </div>
{/if}
