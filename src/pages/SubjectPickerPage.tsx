import React from 'react';
import { getSubjects } from '../data/subjects';

const SubjectPickerPage: React.FC = () => {
    const subjects = getSubjects();
    return (
        <section className="subject-picker" aria-label="Choose a subject">
            <h1>Choose a subject</h1>
            <p className="subject-picker-intro">Pick what you want to study. Your progress is kept per subject.</p>
            <ul className="subject-picker-list">
                {subjects.map((s) => (
                    <li key={s.id}>
                        <a className="subject-picker-card" href={`/${s.slug}`}>
                            <span className="subject-picker-label">{s.shortLabel}</span>
                            <span className="subject-picker-name">{s.name}</span>
                            <span className="subject-picker-tagline">{s.tagline}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default SubjectPickerPage;
