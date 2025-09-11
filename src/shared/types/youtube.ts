// 기본 썸네일 타입
export interface YouTubeThumbnails {
  default: { url: string; width: number; height: number };
  medium: { url: string; width: number; height: number };
  high: { url: string; width: number; height: number };
}

// YouTube 비디오 아이템 (검색 결과용)
export interface YouTubeSearchItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeThumbnails;
    channelTitle: string;
  };
}

// YouTube 비디오 상세 정보 (videos API용)
export interface YouTubeVideoItem {
  kind: string;
  etag: string;
  id: string;
  snippet?: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeThumbnails;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
  };
  status: {
    uploadStatus: string;
    privacyStatus: string;
    license: string;
    embeddable: boolean;
    publicStatsViewable: boolean;
    madeForKids: boolean;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
}

// YouTube 검색 응답
export interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeSearchItem[];
}

// YouTube 비디오 상세 응답
export interface YouTubeVideoResponse {
  kind: string;
  etag: string;
  items: YouTubeVideoItem[];
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// YouTube 채널 정보
export interface YouTubeChannel {
  handle?: string;
  kind: string;
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string;
    thumbnails: YouTubeThumbnails;
    country?: string;
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
  brandingSettings?: {
    channel: {
      title: string;
      description: string;
      keywords?: string;
      country?: string;
    };
    image: {
      bannerExternalUrl: string;
    };
  };
}

// 채널 응답
export interface YouTubeChannelResponse {
  kind: string;
  etag: string;
  items: YouTubeChannel[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// 통합 YouTube 아이템 (검색과 비디오 정보를 모두 처리)
export interface YouTubeItem {
  id: {
    videoId: string;
  };
  snippet: {
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeThumbnails;
    publishedAt: string;
    channelTitle: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  videoId?: string;
  channelHandle?: string;
  channelTitle?: string;
  channelThumbnail?: string;
  publishedAt?: string;
}
