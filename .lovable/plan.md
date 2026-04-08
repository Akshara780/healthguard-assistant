

## Plan: Remove "Share chat via WhatsApp" from Chat page

**What changes**: Remove the WhatsApp share button that appears below chat messages in `src/pages/Chat.tsx`.

**Technical details**:
- In `src/pages/Chat.tsx`, delete the block (around lines 155-163) that renders `<WhatsAppShareButton>` after messages
- Remove the unused `WhatsAppShareButton` import

This is a small, single-file change.

