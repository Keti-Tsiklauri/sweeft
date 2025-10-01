export interface Photo {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
  likes: number;
  stats?: {
    views: {
      total: number;
    };
    downloads: {
      total: number;
    };
  };
}
