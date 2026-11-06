# Design spec: Card and tags

Source: Figma file `U8KBSY261ZqVIyPUw58jpE`, frame "In Progress" (node `2:527`), read once via `get_design_context`.
Do not call Figma again unless asked. Use this file as the source.

## Colors

| Value                 | Hex                       | Figma style           | Where used                                                                        |
|-----------------------|---------------------------|-----------------------|-----------------------------------------------------------------------------------|
| Card background       | `#FFFFFF`                 | -                     | Card/Normal fill                                                                  |
| Card border           | `#666666`                 | Support/Dark Grey     | Card/Normal 1px border                                                            |
| Text primary          | `#221C1D`                 | Primary/Black         | Card title; text on Medium and Low priority tags                                  |
| Text secondary        | `#666666`                 | Support/Dark Grey     | Date text (not in app); used for card description in the app (no design for it)   |
| Priority High bg      | `#DE1D3E`                 | Primary/Crimson Red   | Priority/High tag                                                                 |
| Priority Medium bg    | `#F0CA81`                 | -                     | Priority/Medium tag                                                               |
| Priority Low bg       | `#B8EBB0`                 | -                     | Priority/Low tag                                                                  |
| Priority High text    | `#FFFFFF`                 | -                     | Text on High tag                                                                  |
| Tag "Web" bg          | `#4F1DDE`                 | -                     | Tag/Web                                                                           |
| Tag "Mobile" bg       | `#DE1D6E`                 | -                     | Tag/Mobile                                                                        |
| Tag text              | `rgba(255,255,255,0.9)` | -                     | Text on Web and Mobile tags                                                       |

Not in the design: a "Critical" priority (the app has one).

## Typography

Font family: Poppins. Line height is `normal` everywhere.

| Element           | Size | Weight       |
|---                |---   |---           |
| Card title        | 12px | Medium (500) |
| Priority tag text | 10px | Regular (400) |
| Category tag text | 10px | Regular (400) |
| Date (not in app) | 11px | Regular (400) |

## Spacing and sizes

- Card: padding 8px, vertical gap between children 8px, column flex, width hugs content (title is 250px wide).
- Priority tag: padding 4px vertical, 8px horizontal.
- Category tag: padding 4px all sides.
- Gap between tags: 8px.
- Avatar (not in app): 32x32px, gap 8px.

## Border radius

- Card: 4px
- Category tag: 4px
- Priority tag: 20px (pill)

## Border

- Card: 1px solid `#666666`.

## Shadows

None in the design.

## Hover / focus states

None in the design.

## Card layout order (top to bottom)

1. Priority tag
2. Title
3. Category tags
4. Date (not in app)
5. Avatars (not in app)

## Elements the app does not have

- Avatars (32x32 user images)
- Date ("Mar 3, 2020")
- Separate placement of the priority tag above the title (the app renders priority and category tags in one list after the title)

## Out of scope (other components)

- Column ("In Progress"): background `#F9F9F9`, border `#E5E5E5`, padding 16px, gap 16px, radius 4px; title 16px Poppins Medium, black.
