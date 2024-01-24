export interface PostDto {
    postId: number;
    postTitle: string;
    postContent: string;
    createdAt: string;
    modifiedAt: string;
    postAuthor: string;
    postImageUrl: string;
    postLike: number;
    postUnlike: number;
    report: number;
    userId: number;
  }
