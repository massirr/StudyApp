# Architecture Overview

## Frontend

- React, TypeScript, Vite
- LocalStorage for persistence
- No backend or authentication for v1

## Data Flow

- User interactions update LocalStorage via utility functions.
- Components read state from LocalStorage or React Context.