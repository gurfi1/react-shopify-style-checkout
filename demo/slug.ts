/** "Heading, Text, Link" becomes "heading-text-link", for anchors and routes. */
export const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
