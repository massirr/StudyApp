import { QuizQuestion, QuizOption } from '../../src/types/quiz';
import { Topic, Subtopic, SourceReference, ContentNote, SourcePolicy } from '../../src/types/study';

export interface NewSubject {
  id: string; slug: string; name: string; shortLabel: string;
  tagline: string; sourcePolicy?: SourcePolicy;
}
export type SubjectPatch = Partial<Omit<NewSubject, 'id' | 'slug'>>;

export type NewTopic = Omit<Topic, 'id'>;
export type TopicPatch = Partial<Omit<Topic, 'id'>>;

export type NewQuestion = Omit<QuizQuestion, 'id'>;
export type QuestionPatch = Partial<Omit<QuizQuestion, 'id' | 'topicId'>>;

export type NewSource = Omit<SourceReference, 'id'>;
export type SourcePatch = Partial<Omit<SourceReference, 'id'>>;

export type NewNote = Omit<ContentNote, 'id'>;
export type NotePatch = Partial<Omit<ContentNote, 'id' | 'topicId'>>;

export type { QuizOption, Subtopic };
