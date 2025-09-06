export interface CustomSearchResult {
  id?: {
    videoId?: string;
  };
  kind?: string;
  title?: string;
  htmlTitle?: string;
  link: string;
  displayLink?: string;
  snippet?:
    | string
    | {
        videoId?: string;
        title?: string;
        description?: string;
        thumbnails?: {
          high?: {
            url: string;
          };
        };
        publishedAt?: string;
      };
  htmlSnippet?: string;
  cacheId?: string;
  formattedUrl?: string;
  htmlFormattedUrl?: string;
  pagemap?: {
    cse_image?: {
      src: string;
    };
    cse_thumbnail?: {
      src: string;
      width: string;
      height: string;
    }[];
    metatags?: {
      'article:published_time'?: string | Date;
      'og:image'?: string;
      'og:title'?: string;
      'og:description'?: string;
      'og:url'?: string;
    }[];
  };
  mime?: string;
  fileFormat?: string;
  image?: {
    contextLink: string;
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
  };
  labels?: Label[];
  createdAt?: string;
}

export interface CombinedInterviewsResult {
  results: CustomSearchResult[];
  totalCount: number;
}

export interface Label {
  name: string;
  displayName: string;
  label_with_op: string;
}

// export interface RSSInterviewResult {
//   title: string;
//   link: string;
//   source: string;
//   pubDate: string;
//   snippet: string;
// }
