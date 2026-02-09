export const sanitizeHtml = (html: string): string => {
  const withoutScripts = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  const withoutEventHandlers = withoutScripts.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')

  return withoutEventHandlers
}
