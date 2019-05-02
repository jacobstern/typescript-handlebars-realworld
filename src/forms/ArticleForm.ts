import { IsNotEmpty, NotContains } from 'class-validator';
import { PlainObject } from './plain-object';
import { validateHelper } from './validate-helper';

export class ArticleForm {
  private __nominal: void;

  @IsNotEmpty()
  public readonly title: string;

  @IsNotEmpty()
  public readonly description: string;

  @IsNotEmpty()
  public readonly body: string;

  @NotContains(',', { each: true })
  @IsNotEmpty({ each: true })
  public readonly tags: string[];

  private constructor() {}

  public static validate(form: PlainObject<ArticleForm>): Promise<ArticleForm> {
    return validateHelper(new ArticleForm(), form);
  }
}
