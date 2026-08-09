import type { MDXComponents } from "mdx/types";

// Global MDX element mapping: module screens speak the design system's
// type scale without repeating classes in every file.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="text-h1" {...props} />,
    h2: (props) => <h2 className="text-h2" {...props} />,
    p: (props) => <p className="max-w-prose" {...props} />,
    ul: (props) => (
      <ul className="list-disc pl-5 flex flex-col gap-1 max-w-prose" {...props} />
    ),
    ol: (props) => (
      <ol className="list-decimal pl-5 flex flex-col gap-1 max-w-prose" {...props} />
    ),
    strong: (props) => <strong className="font-medium text-text" {...props} />,
    code: (props) => (
      <code
        className="font-mono text-[15px] bg-sub px-1.5 py-0.5 rounded-[6px]"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="border-l-2 border-l-[var(--accent)] pl-4 text-muted"
        {...props}
      />
    ),
    ...components,
  };
}
