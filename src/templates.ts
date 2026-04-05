export interface NoteTemplate {
  name: string;
  icon: string;
  content: string;
}

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    name: "Meeting Notes",
    icon: "📝",
    content: `# Meeting Notes - [Date]

## Attendees
- 

## Agenda
1. 

## Discussion

## Action Items
- [ ] 
- [ ] 

## Next Steps
`,
  },
  {
    name: "Project Plan",
    icon: "📋",
    content: `# Project: [Name]

## Overview
Brief description of the project.

## Goals
1. 
2. 

## Timeline
| Phase | Start | End | Status |
|-------|-------|-----|--------|
| Planning | | | |
| Development | | | |
| Testing | | | |
| Launch | | | |

## Tech Stack
- 

## Resources
- 
`,
  },
  {
    name: "Bug Report",
    icon: "🐛",
    content: `# Bug: [Title]

## Description

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior

## Actual Behavior

## Environment
- OS: 
- Browser: 
- Version: 

## Screenshots
`,
  },
  {
    name: "Daily Journal",
    icon: "📖",
    content: `# [Date]

## Today I Will
- [ ] 
- [ ] 
- [ ] 

## Notes

## Grateful For
1. 
2. 
3. 

## Tomorrow
- 
`,
  },
  {
    name: "Code Snippet",
    icon: "💻",
    content: `# [Title]

## Description

## Code

${"`"}${"`"}${"`"}typescript

${"`"}${"`"}${"`"}

## Usage

## Notes
`,
  },
  {
    name: "Reading Notes",
    icon: "📚",
    content: `# Book: [Title]
**Author:** 
**Rating:** /5

## Summary

## Key Takeaways
1. 
2. 
3. 

## Favorite Quotes
> 

## Thoughts
`,
  },
];
