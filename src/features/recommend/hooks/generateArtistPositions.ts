interface ArtistInput {
  id: string;
  name: string;
  spotifyUrl: string;
  popularity: number;
  genres?: string[];
  imageUrl?: string;
}

interface ArtistWithPosition extends ArtistInput {
  x: number;
  y: number;
  width: number;
  height: number;
  youtubeSearchUrl: string;
}

interface CanvasConfig {
  width: number;
  height: number;
  padding: number;
  minDistance: number; // 최소 간격
}

/**
 * 텍스트 너비 근사 계산
 * 실제 렌더링 없이 글자 수 기반 추정
 */
function estimateTextWidth(text: string, fontSize: number = 12): number {
  // 평균 글자당 픽셀 (폰트마다 다름, 여기선 근사치)
  const avgCharWidth = fontSize * 0.6;
  return text.length * avgCharWidth;
}

/**
 * 충돌 검사 (AABB - Axis-Aligned Bounding Box)
 */
function isColliding(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
  minDistance: number
): boolean {
  const buffer = minDistance;

  return !(
    a.x + a.width / 2 + buffer < b.x - b.width / 2 ||
    a.x - a.width / 2 - buffer > b.x + b.width / 2 ||
    a.y + a.height / 2 + buffer < b.y - b.height / 2 ||
    a.y - a.height / 2 - buffer > b.y + b.height / 2
  );
}

/**
 * 불규칙 + 안 겹침 좌표 생성
 */
export function generateArtistPositions(
  artists: ArtistInput[],
  config: CanvasConfig = {
    width: 1200,
    height: 800,
    padding: 50,
    minDistance: 10,
  }
): ArtistWithPosition[] {
  const placed: ArtistWithPosition[] = [];
  const maxAttempts = 100; // 최대 시도 횟수

  // 인기순 정렬 (인기 아티스트가 먼저 배치되도록)
  const sorted = [...artists].sort((a, b) => b.popularity - a.popularity);

  for (const artist of sorted) {
    // 인기도에 따라 폰트 크기 조정 (10~20px)
    const fontSize = Math.max(10, Math.min(20, artist.popularity / 5));
    const width = estimateTextWidth(artist.name, fontSize);
    const height = fontSize + 4; // 약간의 여유

    let attempts = 0;
    let positioned = false;

    while (attempts < maxAttempts && !positioned) {
      // 랜덤 좌표 생성
      const x = config.padding + Math.random() * (config.width - config.padding * 2);
      const y = config.padding + Math.random() * (config.height - config.padding * 2);

      const candidate = {
        ...artist,
        x,
        y,
        width,
        height,
        youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
          artist.name + ' official'
        )}`,
      };

      // 기존 배치된 아티스트들과 충돌 검사
      const hasCollision = placed.some((p) => isColliding(p, candidate, config.minDistance));

      if (!hasCollision) {
        placed.push(candidate);
        positioned = true;
      }

      attempts++;
    }

    if (!positioned) {
      console.warn(`Failed to place artist: ${artist.name} (too crowded)`);
      placed.push({
        ...artist,
        x: config.padding + Math.random() * (config.width - config.padding * 2),
        y: config.padding + Math.random() * (config.height - config.padding * 2),
        width,
        height,
        youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
          artist.name + ' official'
        )}`,
      });
    }
  }

  return placed;
}
