import { writeFileSync } from 'node:fs';
import { TOPICS } from '../src/data/topics.ts';
import { SOURCES } from '../src/data/sources.ts';
import { CONTENT_NOTES } from '../src/data/contentNotes.ts';
import { getQuestionsForTopic, getCodeSnippetQuestionsForTopic } from '../src/data/questions.ts';

// D8: bake enrichment. The exported helpers return enriched (padded, 4-option)
// questions and preserve the codeSnippet field. Union regular + code per topic.
const questions = TOPICS.flatMap((t) => [
  ...getQuestionsForTopic(t.id),
  ...getCodeSnippetQuestionsForTopic(t.id),
]);

const subject = {
  id: 'dp-750',
  slug: 'dp-750',
  name: 'DP-750: Azure Databricks Data Engineering',
  shortLabel: 'DP-750',
  tagline: 'Follow your topic path, resume where you left off, and keep progress in this browser.',
  sourcePolicy: 'microsoft-only',
  sources: SOURCES,
  topics: TOPICS,
  questions,
  notes: CONTENT_NOTES,
};

writeFileSync(
  new URL('../src/data/subjects/dp-750.json', import.meta.url),
  JSON.stringify(subject, null, 2) + '\n'
);
console.log(`Wrote dp-750.json: ${TOPICS.length} topics, ${questions.length} questions`);
