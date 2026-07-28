import { Subject } from '../../types/study';
import { validateSubject } from './schema';

// Every *.json in this folder is a subject — adding a file (e.g. via the MCP
// create_subject tool) registers it. validateSubject throws at module load on bad data.
const modules = import.meta.glob('./*.json', { eager: true }) as Record<string, { default: unknown }>;
const SUBJECTS: Subject[] = Object.keys(modules)
  .sort()
  .map((path) => validateSubject(modules[path].default));

export function getSubjects(): Subject[] {
  return SUBJECTS;
}

export function getSubjectBySlug(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

export const getTopicBySlug = (subject: Subject, slug: string) =>
  subject.topics.find((t) => t.slug === slug);

// Preserve the code-snippet tier split (D8): regular vs code questions.
export const getQuestionsForTopic = (subject: Subject, topicId: string) =>
  subject.questions.filter((q) => q.topicId === topicId && !q.codeSnippet);

export const getCodeSnippetQuestionsForTopic = (subject: Subject, topicId: string) =>
  subject.questions.filter((q) => q.topicId === topicId && !!q.codeSnippet);

export const getQuestionCountForTopic = (subject: Subject, topicId: string) =>
  getQuestionsForTopic(subject, topicId).length;

export const getAllQuestions = (subject: Subject) =>
  subject.questions.filter((q) => !q.codeSnippet);

export const getContentNotesForTopic = (subject: Subject, topicId: string) =>
  subject.notes.filter((n) => n.topicId === topicId);

export const getSourceByUrl = (subject: Subject, url: string) =>
  subject.sources.find((s) => s.url === url);
