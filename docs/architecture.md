# Architecture Overview

## Frontend

- React, TypeScript, Vite
- LocalStorage for persistence
- No backend or authentication for v1

## Data Flow Diagram

```
┌───────────────────────┐       ┌───────────────────────┐
│                       │       │                       │
│      User Interface   │──────▶│    React Components   │
│                       │       │                       │
└───────────────────────┘       └───────────┬───────────┘
                                                │
                                                ▼
┌───────────────────────┐       ┌───────────────────────┐
│                       │       │                       │
│   React Context API   │◀──────│   Utility Functions   │
│                       │       │                       │
└───────────┬───────────┘       └───────────┬───────────┘
             │                                   │
             ▼                                   ▼
┌───────────────────────┐       ┌───────────────────────┐
│                       │       │                       │
│   LocalStorage        │◀──────│   Data Persistence    │
│                       │       │                       │
└───────────────────────┘       └───────────────────────┘
```

## Data Flow

1. **User Interaction**: User interacts with React components in the UI.
2. **Component Action**: Components call utility functions to update data.
3. **Data Persistence**: Utility functions update LocalStorage with the new data.
4. **Context Update**: Utility functions update React Context to reflect the changes.
5. **State Propagation**: Components read state from React Context, triggering re-renders with updated data.

- User interactions update LocalStorage via utility functions.
- Components read state from LocalStorage or React Context.