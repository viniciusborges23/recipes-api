export default function sanitize(title: string) {
  return title.trim().replace(/\n|\r|\t/g, '');
}
