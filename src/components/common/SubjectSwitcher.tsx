import React, { useEffect, useRef, useState } from 'react';
import { getSubjects } from '../../data/subjects';

export const SubjectSwitcher: React.FC<{ activeSlug?: string }> = ({ activeSlug }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const subjects = getSubjects();

    useEffect(() => {
        if (!open) return;
        const onDoc = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <div className="subject-switcher" ref={ref}>
            <button
                type="button"
                className="subject-switcher-btn"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Switch subject"
                onClick={() => setOpen((v) => !v)}
            >
                ☰
            </button>
            {open && (
                <ul className="subject-switcher-menu" role="menu">
                    {subjects.map((s) => (
                        <li key={s.id} role="none">
                            <a
                                role="menuitem"
                                href={`/${s.slug}`}
                                aria-current={s.slug === activeSlug || undefined}
                            >
                                {s.name}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
