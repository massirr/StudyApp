# Design Decisions

## Project Structure

```
study-app/
├── public/           # Static assets (favicons, images, etc.)
├── src/
│   ├── assets/        # Application assets (icons, fonts, etc.)
│   ├── components/    # Reusable React components
│   ├── context/       # React context providers for global state
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and shared logic
│   ├── pages/         # Page components for routing
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── docs/             # Project documentation
├── tests/            # Test files
└── vite.config.ts    # Vite configuration
```

## Directory Structure

- **public/**: Contains static assets that are served directly by the web server. These files are not processed by Vite.
- **src/assets/**: Application-specific assets like icons, fonts, and images that are imported in components.
- **src/components/**: Reusable React components that can be used across different pages.
- **src/context/**: React context providers for managing global application state.
- **src/hooks/**: Custom React hooks for encapsulating reusable logic.
- **src/lib/**: Utility functions, helpers, and shared business logic.
- **src/pages/**: Page-level components that represent different routes in the application.
- **src/types/**: TypeScript type definitions and interfaces used throughout the application.
- **tests/**: Test files for unit, integration, and end-to-end testing.

## Frontend

... (content from previous design spec) ...

## Data

... (content from previous design spec) ...