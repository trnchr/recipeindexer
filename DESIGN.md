---
name: Recipe Indexer
description: A calm, private recipe portal under a green awning.
colors:
  ticket-green: "#14A24E"
  deep-herb: "#00672C"
  coral-pink: "#FF6476"
  amber-ink: "#A46522"
  ticket-cream: "#FFFFE6"
  sage-muted: "#4A6B55"
  mint-wash: "#E3F2D9"
  pink-wash: "#FFE6E4"
  herb-rule: "#BFDDB4"
typography:
  display:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "clamp(3rem, 9vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  display-page:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.1
  lede:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2.4vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.35
  title-section:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
  nav:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
  body:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  sm: "6px"
  md: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  section: "clamp(48px, 7vw, 88px)"
  gutter: "clamp(16px, 4vw, 40px)"
  container: "1120px"
  header: "64px"
components:
  site-header:
    backgroundColor: "{colors.ticket-green}"
    textColor: "{colors.ticket-cream}"
    height: "{spacing.header}"
  nav-link:
    textColor: "{colors.ticket-cream}"
    typography: "{typography.nav}"
  button-signin:
    backgroundColor: "{colors.ticket-cream}"
    textColor: "{colors.deep-herb}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-signin-hover:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.deep-herb}"
  button-google:
    backgroundColor: "{colors.ticket-green}"
    textColor: "{colors.ticket-cream}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "6px 28px 6px 6px"
    height: "52px"
  button-google-hover:
    backgroundColor: "{colors.deep-herb}"
    textColor: "{colors.ticket-cream}"
  button-primary:
    backgroundColor: "{colors.ticket-green}"
    textColor: "{colors.ticket-cream}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.deep-herb}"
    textColor: "{colors.ticket-cream}"
  button-secondary:
    backgroundColor: "{colors.ticket-cream}"
    textColor: "{colors.deep-herb}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.deep-herb}"
  panel:
    backgroundColor: "{colors.ticket-cream}"
    textColor: "{colors.deep-herb}"
    rounded: "{rounded.md}"
    padding: "clamp(20px, 3vw, 32px)"
  account-panel:
    backgroundColor: "{colors.ticket-cream}"
    textColor: "{colors.deep-herb}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
    width: "18rem"
  chip-ingredient:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.deep-herb}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
    height: "32px"
  search-sample:
    backgroundColor: "{colors.ticket-cream}"
    textColor: "{colors.deep-herb}"
    rounded: "{rounded.sm}"
    padding: "7px 10px"
  label-section:
    textColor: "{colors.amber-ink}"
    typography: "{typography.label}"
  menu-row:
    textColor: "{colors.ticket-green}"
    typography: "{typography.title}"
    padding: "16px 0"
  toc:
    textColor: "{colors.deep-herb}"
    typography: "{typography.meta}"
    width: "220px"
  avatar:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.deep-herb}"
    rounded: "{rounded.sm}"
    size: "40px"
---

# Design System: Recipe Indexer

## Overview

**Creative North Star: "The Green Awning"**

The site is a calm little shop with a green awning. A green bar runs across the top of every page, edge to edge, and its bottom edge has a small rounded zigzag, like the scalloped trim of a shop awning (or the torn edge of a receipt, where the idea started). Under the awning, the whole page is cream and uses the full width of the screen. Content sits in roomy, softly rounded panels with thin green borders, the way a wiki or database portal lays out its entries. Nothing is squeezed into a narrow card.

The feeling is "organized and unhurried". There is plenty of space between parts of the page (the gaps grow on bigger screens), so a visitor never feels crowded. The personality still comes from the original food-menu references: one heavy, rounded type family, a chunky green wordmark, small coral section labels in capitals, and dotted leader lines from a dish to its time. The structure comes from working tools: a top bar with navigation, panels side by side on wide screens, and an "On this page" list beside long text. The narrow receipt card on a green background was tried and rejected by the owner as cramped; the zigzag survives only as the awning trim. The dark navy-and-gold wiki theme was rejected earlier; only its layout ideas carry over.

The site is completely still. Nothing slides or fades in; only hover colors change.

**Key Characteristics:**
- A sticky, full-width Ticket Green top bar with a small rounded zigzag along its bottom edge, on every page
- A cream page below that uses the screen's width, up to 1120px of content with flexible side margins
- Roomy bordered panels (1.5px Herb Rule, 12px corners) holding each part of a page, side by side on wide screens
- Three inks only: green, coral pink, cream (plus their darker text-safe versions and light tints)
- One rounded, heavy type family (Rubik, saved in the project) doing everything
- Flat and still: no shadows, no gradients, no entrance animations

## Colors

A three-ink print palette: leaf green, coral pink and cream. All colors live as CSS variables in `src/index.css`; change one there and it changes everywhere. (The names come from the earlier "ticket" design and were kept so nothing had to be renamed.)

### Primary
- **Ticket Green** (#14A24E): the top bar, the home page heading, page headings, panel headings ("Start your own library"), section headings in long text, recipe names in rows, the Google and "Go to your recipes" buttons, the border of the example search box and of secondary buttons. Also the phone browser's toolbar color and the favicon's tile. On cream it reaches 3.3:1, enough only for large or bold text (about 19px bold or 24px regular and up). Lightened from the original #009640 at the owner's request; don't go lighter.
- **Deep Herb** (#00672C): the text-safe green, 6.9:1 on cream. The default text color on the page: body text, links, chips, quiet list items, times on rows, the Sign in pill's text, secondary button text. Also the hover and busy fill of the green buttons.

### Secondary
- **Toasted Amber** (#A46522): a warm toasted amber, the site’s accent, 4.6:1 on cream. Chosen by the owner to replace the original coral red, which felt too strong (owner picked #A96824; this is a hair darker so small text stays readable). Uppercase section labels and counts ("EXAMPLE SEARCH", "ON THIS PAGE", "0 RECIPES"), the "SOON" tag, the current page's footer link, list bullets in long text, error messages and the border of notice boxes, the keyboard focus ring on the page, the text cursor, and the highlight behind selected text.
- **Coral Pink** (#FF6476): reserved, not used on any screen yet. For decoration and big display moments only (28px and up, illustration fills). Only 2.8:1 on cream, so never for small text or behind text.

### Neutral
- **Ticket Cream** (#FFFFE6): the page background, panel fill, the text on the green bar and on green buttons, the Sign in pill, the disc behind the Google "G", and the keyboard focus ring inside the green bar.
- **Sage Muted** (#4A6B55): secondary text, 5.9:1 on cream. The ingredient line under a recipe name, "Last updated" dates, the footer fine print, the signed-in email, the sample note, a busy secondary button's text.
- **Mint Wash** (#E3F2D9): the soft green tint. Ingredient chips, highlighted ingredients in text, the "in testing" status box, the avatar's fallback square, the hover fill of cream pills, inline `code`, and the scrollbar thumb.
- **Herb Rule** (#BFDDB4): lines only. Panel borders (1.5px), the footer's top line (1.5px), the line under each list row (1px), dotted leaders (2px dotted), and link underlines. Never the only border on a button or input.
- **Pink Wash** (#FFE6E4): reserved, not used yet. Large decorative areas only. Never behind Toasted Amber text smaller than 19px bold.

### Named Rules
**The Three Inks Rule.** Every screen uses green, coral and cream, nothing else. No gray, no pure white, no black, no blue links. If a new color seems needed, use a tint of one of the three. The one exception is Google's own four-color "G" on the sign-in button, which Google requires unchanged; it sits on a cream disc.

**The Bright-for-Big Rule.** Ticket Green and Coral Pink are for large type and fills. Anything under about 19px bold uses Deep Herb or Toasted Amber.

**The Awning Text Rule.** Cream text on Ticket Green is only readable when it's big and bold, so every word printed directly on the green bar or a green button is at least 19px (1.1875rem) and bold. Anything smaller goes on a cream pill or chip (the Sign in button, an error under it).

**The Themed Browser Rule.** The browser's own bits match too: selected text is Toasted Amber with cream letters, the typing cursor is Toasted Amber, the scrollbar is a Mint Wash thumb on a Deep Herb track, and the phone toolbar is Ticket Green.

## Typography

**Display Font:** Rubik (with system-ui, sans-serif)
**Body Font:** Rubik (same family)

Rubik is saved in the project (`public/fonts`, two variable files covering weights 400 to 800, Latin and extended Latin), not loaded from Google, and the main file is preloaded so the wordmark doesn't flash in a fallback font.

**Character:** Rubik's softly rounded corners feel friendly and food-poster-like at heavy weights and stay plain and readable at body sizes. Even inline `code` uses Rubik (500 weight on a Mint Wash patch) rather than a typewriter font.

### Hierarchy
- **Display** (800, clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem), 1.0, slightly tight, about 18 characters wide): the home page's main heading, which is the tagline ("All your recipes, searchable by ingredient."), left-aligned, Ticket Green. The brand name is not repeated in page bodies; it lives in the top bar.
- **Display, page size** (800, clamp(2.25rem, 6vw, 3.5rem), 0.98, balanced line breaks): the main heading of every other page ("Privacy policy", "Sam's recipes", "Page not found"). Ticket Green.
- **Headline** (800, 1.75rem, 1.1): a heading inside a panel ("Start your own library"). Ticket Green.
- **Lede, large** (400, clamp(1.125rem, 1rem + 0.6vw, 1.375rem), 1.45, about 44 characters wide): the supporting sentence under the home heading. Deep Herb.
- **Section heading** (700, 1.375rem, 1.2): headings inside long text pages, with 40px of space above. Ticket Green.
- **Title** (700, 1.25rem, 1.2): recipe names in rows (Ticket Green) and green button labels (cream).
- **Brand** (800, clamp(1.5rem, 1.1rem + 1.2vw, 2rem), never wraps): "Recipe Indexer" in the green bar, cream.
- **Nav** (700, 1.1875rem): links in the green bar ("My recipes"), cream. The smallest size allowed on green.
- **Body** (400, 1.0625rem, 1.5): reading text and short intros, at most 60 to 68 characters wide. Deep Herb. Big enough to read at arm's length on a phone at the stove.
- **Meta** (400, 0.9375rem, 1.5): the line under a recipe name, dates, fine print, the email, "On this page" links, footer links (at 500). Sage Muted for secondary info, Deep Herb for links. At 500 weight it is also the chip and time size.
- **Label** (700, 0.875rem, 0.06em tracking, UPPERCASE): section labels at the top of panels ("EXAMPLE SEARCH", "COMING UP", "ON THIS PAGE"), counts ("2 RECIPES HAVE BOTH", "0 RECIPES") and the "SOON" tag. Toasted Amber. Always the heading of the thing below it, never a small line stacked above a bigger heading.

### Named Rules
**The Menu Line Rule.** In lists, a recipe reads like a menu item: name first in Title weight, a dotted leader, the time on the right, the ingredient detail on its own line below in Meta. Never the other way round.

**The One Shout Rule.** Only one Display-size element per page: the tagline heading on the home page, the page heading everywhere else. The brand in the top bar is not a Display element.

## Layout

- **The frame:** green top bar, cream page, footer. The page is at least as tall as the screen, so the footer always sits at the bottom even on short pages.
- **Width:** content is at most 1120px wide, centered. The side margins (the "gutter") grow with the screen, from 16px on small phones to 40px on large screens. The top bar's contents line up with the page content below it.
- **Space between sections:** big parts of a page are separated by a gap that grows with the screen, from 48px on phones to 88px on large screens (`--section-gap`). The page starts three-quarters of that gap below the top bar and ends a full gap above the footer.
- **Side by side on wide screens:** on the home page, "How it works" then the example search are full-width panels stacked 40px apart; from 900px the search results sit in two columns and the three steps of "How it works" sit side by side. On the library page, from 900px the main panel takes 3 parts and "Coming up" 2 parts.
- **Call-to-action band:** a full-width panel with text on the left and the button on the right from 760px; stacked below that.
- **Text pages (How it works, Privacy, Terms):** from 900px, a 220px "On this page" column on the left that stays in view while you scroll, and the text on the right (at most 68 characters wide), with a 40 to 88px gap between them. Below 900px the "On this page" list sits in its own bordered box above the text. Jumping to a section leaves room for the sticky bar.
- **Rhythm:** a 4px base with steps of 4, 8, 16, 24, 40 and 64px. In practice: 4px between a recipe name and its detail line, 8px between chips, 16px above and below each list row, 24px under a panel's section label, 40px between columns and before text-page headings. The 64px step is defined but not used.
- **Mobile-first:** designed at 375px wide first and checked down to 320px. Tap targets at least 44px tall. No hover-only actions. Below 600px the "How it works" link leaves the top bar (it stays in the footer and on the home page).

## Elevation & Depth

Flat. No drop shadows, inner shadows, blur, gradients or paper textures anywhere. Depth comes from color and lines only: the green bar against the cream page, and thin Herb Rule borders around panels. The top bar stays stuck to the top of the screen while the page scrolls under it, with nothing but its zigzag edge separating them. State changes use color fills (Mint Wash on cream pills, Deep Herb on green buttons), never lift. The only physical touch is the Google button pressing 1px down while held.

### Motion
None on arrival. Hover color changes take 150ms with a quick-start, soft-landing curve (`cubic-bezier(0.16, 1, 0.3, 1)`). That's all.

### Named Rules
**The Flat Print Rule.** If it couldn't be printed with flat inks on cream paper, it doesn't belong. (The zigzag is made with a CSS mask, a cutting tool: nobody sees a gradient or an image.)

**The Still Page Rule.** Pages don't animate in. Only hover and press feedback moves, and only for 150ms.

## Shapes

- **The awning trim:** the only zigzag on the site. A strip of teeth along the bottom of the green bar, each tooth 16px wide and 8px tall, with softly rounded points and dips (never sharp). The teeth stretch slightly so the bar holds only whole teeth. It's drawn with a CSS mask and a tiny inline SVG tooth. Nothing else gets a zigzag.
- **Panels:** softly rounded (12px), 1.5px Herb Rule border, cream fill.
- **Buttons:** fully rounded pills (999px).
- **Small things:** chips, the example search box, avatars, the account menu, notice and status boxes are gently rounded (6px). Tiny inline patches (highlighted ingredients, `code`) use 3 to 4px.
- **The Google disc:** a 40px circle, the only circle, because it holds Google's round mark.
- **Borders:** 1.5px solid Ticket Green on interactive or input-like things (secondary buttons, the search box, the account menu); 1.5px Herb Rule on panels and the footer; 1px Herb Rule under list rows; 2px dotted Herb Rule for leaders.
- **Favicon (brand mark):** still a tiny receipt from the first design: a cream receipt with softly rounded zigzag teeth top and bottom, a Toasted Amber label bar and two Deep Herb text lines, on a Ticket Green tile with 7px corners. It's the site's mark, not a layout rule.

## Components

### Site Header (signature component)
- **Character:** the green awning over every page. Sticky at the top from 600px wide; on phones it scrolls away with the page so it doesn't take up the small screen.
- **Layout:** from 600px, one row at least 72px tall, lined up with the page content. Left: the brand ("Recipe Indexer", 800, cream, clamp(1.5rem, 1.1rem + 1.2vw, 2rem), never wraps; 1.3125rem below 360px). Right: when signed in, the "My recipes" link (Nav type, cream; underlined 2px when hovered or on that page). "How it works" is not in the bar; it lives in the footer and on the home page. Then the account area. Below 600px, when signed in, the bar has two rows: brand and account on top, "My recipes" underneath. "Recipe Indexer" appears only here; page bodies never repeat it.
- **Trim:** the rounded zigzag along the bottom (see Shapes).
- **Focus:** inside the bar the keyboard focus ring is cream instead of Toasted Amber, so it shows on green.
- **Signed out:** the Sign in pill (below). If Google can't be reached, the error appears under it on a small cream chip with a Toasted Amber border, so it stays readable over the green.
- **Checking:** an empty 44px slot, so nothing jumps when sign-in finishes loading.
- **Signed in:** "My recipes" is a link in the bar (not in the menu). The avatar is a button (2px padding, a transparent 2px border that turns cream on hover and while open) that opens the account menu: a flat panel below it, right-aligned, cream fill, 1.5px Ticket Green border, 6px corners, 16px padding, up to 18rem wide, no shadow. It holds account things only: a "SIGNED IN AS" label, the name (700) and email (Meta, Sage Muted), and a Sign out secondary button. Account settings and preferences go here when they exist. It closes on outside click, Escape, or moving to another page.

### Buttons
- **Sign in (top bar):** a 44px-tall cream pill with Deep Herb text (1rem, 700), 20px side padding, no border. Hover fills Mint Wash. While opening Google it reads "Opening Google…".
- **Google sign-in (main button):** a 52px-tall Ticket Green pill up to 22rem wide, cream label in Title type that never wraps. On its left, a 40px cream disc holding Google's four-color "G" (20px). Hover and the "Opening Google…" busy state darken to Deep Herb; pressing nudges it 1px down. At 380px wide and below, the label drops to 1.1875rem (19px bold, the smallest readable size for cream on green) and the spacing tightens. Below 340px the label switches to Google's shorter official wording, "Sign in with Google". Never shrink the label below 19px to make it fit. In the call-to-action band on wide screens it shrinks to fit its label.
- **Primary link button ("Go to your recipes"):** the same green pill without the disc: 52px tall, 28px side padding, cream Title-type label, Deep Herb on hover.
- **Secondary (Sign out):** a 44px-tall cream pill with a 1.5px Ticket Green border and Deep Herb text at 1rem, 500 weight. Hover fills Mint Wash. While busy the text turns Sage Muted.
- **Focus (everything):** a 2px Toasted Amber outline 3px outside the element, only for keyboard focus (cream inside the green bar).

### Panels
- **Character:** the portal's entry boxes. Each part of a page lives in one.
- **Style:** cream fill, 1.5px Herb Rule border, 12px corners, no shadow. Padding grows with the screen from 20px to 32px.
- **Inside:** a Toasted Amber section label at the top with 24px under it, then the content. A list that starts right under the label has no extra space above its first row.

### Page Heading
- The page's Display-size title, then optional lines 16px below it (a "Last updated" date in Meta / Sage Muted, or a Toasted Amber count like "0 RECIPES"). One section gap below.

### Ingredient Chips
- Mint Wash fill, Deep Herb text at 1rem, 500 weight, 6px corners, 36px tall, 12px side padding. Today they appear only in the example search, so they have no remove (×) button yet.

### Example Search Box
- On the home page the example search is a full-width panel. The box is at least 60px tall with a 1.5px Ticket Green border and 6px corners around a wrapping row of chips, followed by a Sage Muted "Add an ingredient…" hint. It's a picture of the search, not a working input, so it has no focus or typing state. 40px below it, a Toasted Amber count ("6 RECIPES HAVE BOTH"), then the result rows, in two columns from 900px wide. The sample uses chicken + miso recipes and is labeled as sample.

### List Row
- **Structure:** name on the left, a 2px dotted Herb Rule leader stretching across, and the time (Deep Herb, 500, even-width digits) or a Toasted Amber "SOON" tag on the right. When a long name wraps, the leader and time line up with its last line. An optional detail line sits 4px below in Meta / Sage Muted, with matched ingredients on a Mint Wash patch.
- **Name styles:** recipe names in Title, Ticket Green. A quieter version (1.0625rem, 500, Deep Herb) lists steps and planned features, with or without a leader.
- **Separation:** no box around each row. A 1px Herb Rule line under every row except the last, 16px of space above and below.

### On This Page List (text pages)
- A Toasted Amber "ON THIS PAGE" label, then links in Meta size (Deep Herb, no underline until hovered, 6px padding above and below each). Sticky in a 220px left column from 900px; a bordered box with 12px corners above the text on smaller screens.

### Long Text
- Section headings in Section-heading type (Ticket Green) with 40px above; Body-size paragraphs and lists at most 68 characters wide; Toasted Amber bullets.
- **Status note:** a Mint Wash box (12px 16px padding, 6px corners) for honest "in testing" notes.

### Avatar
- A 40px square photo with 6px corners. With no photo (or if it fails to load), a Mint Wash square with the first letter of the name in bold.

### Links
- Deep Herb text with a 1.5px Herb Rule underline, 3px below the text. On hover the text and underline turn Toasted Amber. (Links in the green bar follow the bar's own rules.)

### Site Footer
- A 1.5px Herb Rule line across the full width, then, lined up with the page content: links ("How it works", "Privacy", "Terms", Meta size, 500, 10px padding above and below for tapping) on the left, the current page's link in Toasted Amber; the fine print (Meta, Sage Muted) on the right. They wrap onto separate lines on phones.

### Messages
- **Notice:** a box at the top of the page content for page-wide problems (sign-in failed, setup missing): 1.5px Toasted Amber border, 6px corners, 12px 16px padding, Meta-size Deep Herb text, 40px below.
- **Error:** Meta size at 500 weight in Toasted Amber, announced to screen readers, right under the action that failed.

### Planned, not built yet
These come from the earlier seed and the owner's references and are not in the code; treat them as direction only: category pills (cream pills, Toasted Amber fill when selected), a real ingredient search field with removable chips, source badges after a recipe name ("IMPORTED", "TYPED IN" in Toasted Amber), 56px square recipe thumbnails with 6px corners, a Mint Wash hover on clickable rows, and a pager. Document them properly once they exist.

## Do's and Don'ts

### Do:
- **Do** put every page under the sticky full-width Ticket Green bar with its small rounded zigzag trim, on a cream page that uses the screen's width (content up to 1120px).
- **Do** keep every word on green at least 19px and bold; put smaller text on a cream pill or chip.
- **Do** group each part of a page in a panel: cream, 1.5px Herb Rule border, 12px corners, no shadow.
- **Do** leave generous space between sections (`--section-gap`, 48 to 88px); the owner asked for more breathing room, not less.
- **Do** put panels side by side from 900px wide and stack them on phones.
- **Do** use Rubik for everything: 800 for the brand and headings, 700 for recipe names, labels and green-bar text, 500 for chips and small buttons, 400 for reading text.
- **Do** use Toasted Amber uppercase labels (700, 0.06em tracking) as the headings of panels, lists and counts.
- **Do** use Deep Herb (#00672C) or Toasted Amber (#A46522) for any text on cream smaller than about 19px bold.
- **Do** keep rows menu-like: name first, dotted leader, time on the right, light detail below, thin dividers.
- **Do** design for a 375px-wide phone first, check down to 320px, and keep tap targets at least 44px tall.

### Don't:
- **Don't** bring back the narrow fixed-width receipt card on a green background, or zigzag edges on panels. The zigzag lives only on the bottom of the green bar (and in the favicon).
- **Don't** add page entrance animations, fades or slide-ins.
- **Don't** use the dark navy-and-gold look, serif small caps or diamond avatar frames from the wiki screenshot. Take only its layout.
- **Don't** add a fourth color, or gray, pure white (#FFFFFF) or black. Tint the three inks instead. Google's "G" is the only exception.
- **Don't** use Coral Pink (#FF6476) or Ticket Green (#14A24E) for small text or behind small text.
- **Don't** use drop shadows, visible gradients, glassy blur or paper-grain textures, on panels, menus or anything else.
- **Don't** wrap each recipe row in its own bordered card. Panels hold lists; rows inside are separated by thin lines.
- **Don't** put more than one Display-size element on a page.
- **Don't** put a small coral label above a big heading as decoration; a label is the heading of what's under it.
- **Don't** design a public, shared or "featured" view of anyone's recipes. Imported recipes are never public; every recipe screen is private to its owner.
- **Don't** copy the "dìdi" or "clicli" names, logos, flower marks or the Lucky Bellies mascot. They belong to real businesses. Draw our own marks if we add any.
- **Don't** use emoji as icons. Use simple line icons in Deep Herb, 1.5px stroke, if icons are needed.
