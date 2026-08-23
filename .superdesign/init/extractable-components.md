# Extractable components

No framework components can be extracted directly. The project is one dependency-free HTML/Canvas document.

## TitleScreen

- Source: `tactics.html`
- Category: layout
- Description: Full-frame title overlay with identity, premise, rules, and start action.
- Extractable props: none; content and styling are game-specific.
- Hardcoded: POOPULATION identity, TACTICS label, Japanese story copy, generated sprite cards, start button.

This target should stay inline; extracting it would add architecture without reuse.
