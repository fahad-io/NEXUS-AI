# Marketplace QA Coverage Map

## Route And Entry Points
- Primary route: `/marketplace`
- Entry links:
  - Navbar `Marketplace`
  - Landing page `Browse all`
  - Landing page lab cards and budget cards

## Marketplace Page UI Map
- Header container
  - Page title: `Model Marketplace`
  - Search input: `Search models...`
  - Type chips:
    - `All`
    - `Language`
    - `Vision`
    - `Code`
    - `Image Gen`
    - `Audio`
    - `Open Source`
  - Lab chips:
    - `All Labs`
    - Dynamic unique labs from model data
- Left sidebar filters
  - `Provider` checkbox group
  - `Pricing` checkbox group
  - `Min Rating` pill buttons
  - `License` checkbox group
  - `Quick Guides` static links:
    - `Getting Started`
    - `API Reference`
    - `Pricing Guide`
    - `Model Comparison`
- Results area
  - Loading/count label:
    - `Loading models...`
    - `{n} models found`
  - Responsive model card grid
  - Empty state:
    - `No models match your filters.`
    - `Clear all filters` action

## Model Card UI Map
- Icon tile
- Model name
- Optional badge:
  - `hot`
  - `new`
  - `open`
  - `beta`
- Organization name
- Description
- Up to four tags
- Star rating widget
- Price label
- `Use in Chat Hub` button
- Hover state:
  - lift animation
  - stronger shadow
  - CTA visual change

## Model Detail Dialog UI Map
- Open trigger: model card CTA
- Close methods:
  - close button
  - backdrop click
  - `Escape`
- Tabs:
  - `Overview`
  - `How to Use`
  - `Pricing`
  - `Prompt Guide`
  - `Agent Creation`
  - `Reviews`
- Overview tab
  - Description box
  - Input/Output box
  - Use Cases chips
  - Example Prompt -> Output section
- How to Use tab
  - Six instructional steps
  - Embedded code block
- Pricing tab
  - Three pricing cards
  - Free tier info banner
- Prompt Guide tab
  - Four prompt principle blocks
  - `Copy` action per block
- Agent Creation tab
  - Six setup steps
  - `Open Agent Builder` button
  - `Ask the Hub` button
- Reviews tab
  - Summary rating
  - Distribution bars
  - Review entries

## Real Code Behaviors Affecting QA
- Models are loaded through `useModels()`.
- If the API succeeds, marketplace uses backend model data.
- If the API fails, marketplace falls back to cached models or `FALLBACK_MODELS`.
- There is a loading label but no skeleton loader.
- There is no pagination or infinite scroll.
- There is no dedicated marketplace detail route; details open in a modal dialog.
- There is no cart or add/remove purchase flow in the current marketplace implementation.
- There is no dedicated React error boundary specifically wrapping marketplace code.
