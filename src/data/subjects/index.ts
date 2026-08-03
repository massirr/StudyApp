import { Subject } from '../../types/study';
import { validateSubject } from './schema';
import dp750 from './dp-750.json';
import dutch from './dutch.json';

// Register each subject JSON here. validateSubject throws at module load on bad data.
const RAW: unknown[] = [dp750, dutch];
const SUBJECTS: Subject[] = RAW.map(validateSubject);

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
