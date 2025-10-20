# Product Requirements Document: Customizable Bookmark Display Options

## 1. Introduction
This document outlines the requirements for implementing customizable display options for Hoarder's Pipette bookmarks within search engine results.

## 2. Goals
*   Enhance user experience by allowing personalization of bookmark display.
*   Provide flexibility in how bookmark information is presented.
*   Increase user engagement with the Hoarder's Pipette extension.

## 3. User Stories
*   As a user, I want to choose between a compact and a detailed view for my bookmarks so that I can control the visual clutter on the search results page.
*   As a user, I want to select which information (e.g., tags, description snippets, date saved) is visible for each bookmark so that I only see what's most relevant to me.
*   As a user, I want to apply custom styling (e.g., color-coding) to my bookmarks based on their list so that I can quickly identify specific types of bookmarks.

## 4. Functional Requirements
*   **FR1: Display Layout Selection:** The extension shall provide an option in the settings page to select between "Compact" and "Detailed" display layouts for bookmarks.
    *   Compact: Shows only title and URL.
    *   Detailed: Shows title, URL, description snippet, and tags.
*   **FR2: Information Visibility Toggle:** The extension shall allow users to toggle the visibility of specific bookmark attributes (e.g., tags, description snippets, date saved) within the selected layout.
*   **FR3: Custom Styling based on Metadata:** The extension shall provide options to apply a color badge to bookmarks based on their associated lists.
*   **FR4: Persistence of Preferences:** User display preferences shall be saved and loaded across browser sessions.
*   **FR5: Real-time Preview (Optional but desirable):** The settings page should ideally offer a real-time preview of how changes to display options will affect the bookmarks.

## 5. Non-Functional Requirements
*   **NFR1: Performance:** Customization options should not negatively impact the performance of search result page loading or extension responsiveness.
*   **NFR2: Usability:** The customization interface in the options page should be intuitive and easy to use.
*   **NFR3: Cross-Browser Compatibility:** Display options should function consistently across supported browsers (Chrome, Firefox).
*   **NFR4: Accessibility:** Customization options should adhere to accessibility best practices.

## 6. Scope
*   **In Scope:**
    *   Implementation of display layout selection (Compact/Detailed).
    *   Toggling visibility of tags, description snippets, and date saved.
    *   Color badge based on tags or folders.
    *   Saving and loading user preferences.
*   **Out of Scope (for this iteration):**
    *   Advanced CSS customization (e.g., custom fonts, complex animations).
    *   Drag-and-drop reordering of displayed elements.
    *   Integration with external styling themes.

## 7. Assumptions
*   The Hoarder app API provides necessary metadata (tags, description, date saved) for bookmarks.
*   The existing oRPC communication pattern can be extended to handle preference updates.
*   The current UI framework (React) is suitable for implementing the customization interface.

## 8. Open Questions
*   What specific color palette or styling options should be provided for list-based customization?
*   How will the "date saved" be formatted and displayed?
*   What is the maximum length for description snippets?

## 9. Future Considerations
*   More advanced styling options (e.g., custom CSS input).
