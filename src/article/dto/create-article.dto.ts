export class CreateArticleDto {
  slug: string;

  title: string;

  description: string;

  body: string;

  tagList: string[];

  favoritesCount: number;
}
