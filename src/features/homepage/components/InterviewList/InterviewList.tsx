import Link from 'next/link';

import { formatDate } from '@/lib/utils/date';
import { googleSearch } from '@/lib/google/googleSearch';
import { InterviewListProps } from './types';

export default async function InterviewList({ artistName, className = '', slice = 5 }: InterviewListProps) {
  const LATEST_INTERVIEWS_QUERY = `${artistName} artist interview site:rollingstone.com OR site:billboard.com OR site:pitchfork.com OR site:complex.com`;

  const interviews = await googleSearch(LATEST_INTERVIEWS_QUERY);

  const sortedInterviews = interviews
    .filter((interview) => typeof interview.pagemap?.metatags?.[0]?.['article:published_time'] === 'string')
    .sort((a, b) => {
      const dateA = new Date(a.pagemap?.metatags?.[0]?.['article:published_time'] ?? '').getTime();
      const dateB = new Date(b.pagemap?.metatags?.[0]?.['article:published_time'] ?? '').getTime();
      return dateB - dateA;
    });

  if (!artistName) {
    return null;
  }

  return (
    <div className={`pt-3 px-3  border-3 border-black ${className}`}>
      <h1 className="lg:text-4xl text-3xl font-extrabold mb-3 text-black text-center">Latest Interviews</h1>
      <ul>
        {sortedInterviews.slice(0, slice).map((interview) => (
          <li key={interview.link} className="lg:p-4 p-2 border-t border-black truncate">
            <Link
              href={interview.link}
              target="_blank"
              rel="noopener noreferrer"
              className="lg:text-xl text-lg text-black hover:text-indigo-800 w-full hover:underline  truncate"
            >
              {interview.pagemap?.metatags?.[0]?.['og:title'] || interview.title}
            </Link>

            {typeof interview.pagemap?.metatags?.[0]?.['article:published_time'] === 'string' &&
              interview.pagemap.metatags[0]['article:published_time'].trim() && (
                <p className="lg:text-md md:text-sm text-md  text-gray-600 mt-1">
                  {formatDate(interview.pagemap.metatags[0]['article:published_time'])}
                </p>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
}
