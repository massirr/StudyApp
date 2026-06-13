import React from 'react';

const NotFoundPage: React.FC = () => {
    return (
        <section className="not-found-page">
            <h1>Page Not Found</h1>
            <p>The page you requested does not exist in this study app.</p>
            <a className="primary-button" href="/">
                Back to Dashboard
            </a>
        </section>
    );
};

export default NotFoundPage;
