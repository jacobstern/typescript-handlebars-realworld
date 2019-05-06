import uniqid from 'uniqid';
import slug from 'slug';

export function generateSlug(title: string): string {
  return slug(title) + '-' + uniqid();
}
