const ALLOWED_HOSTS = new Set(['learn.microsoft.com', 'microsoft.com', 'www.microsoft.com']);

const isAllowedHost = (host: string): boolean => {
    if (ALLOWED_HOSTS.has(host)) {
        return true;
    }

    return host.endsWith('.microsoft.com');
};

export const isOfficialMicrosoftUrl = (value: string): boolean => {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && isAllowedHost(url.hostname);
    } catch {
        return false;
    }
};

export const assertOfficialMicrosoftUrls = (
    urls: string[],
    contextLabel: string
): void => {
    const invalid = urls.filter((url) => !isOfficialMicrosoftUrl(url));
    if (invalid.length > 0) {
        throw new Error(
            `${contextLabel} contains unsupported source URLs: ${invalid.join(', ')}`
        );
    }
};
