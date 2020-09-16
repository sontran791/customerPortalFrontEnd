export interface Gif {
  gifId?: number;
  importDatetime: string;
  trendingDatetime: string;
  title: string;
  fixedHeight: Image;
  fixedHeightSmallStill: Image;
  fixedWidth: Image;
  fixedWidthSmallStill: Image;
  original: Image;
  tags: Tag[];
}

export interface Image {
  width: number;
  height: number;
  url: string;
}

export interface Tag {
  tagId?: number;
  name: string;
}

export interface GifSearchResponse {
  gifs: Gif[];
  totalCount: number;
  count: number;
  offset: number;
}
