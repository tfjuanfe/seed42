// Static, styled Python snippet — a peek under the hood, not an editor.
// Minimal tokenizer: comments, strings, keywords. No highlighting lib.

const KEYWORDS =
  /\b(def|return|if|else|elif|for|in|import|from|as|not|and|or|while|print|True|False|None)\b/g;

function renderLine(line: string, i: number) {
  const commentIdx = line.indexOf("#");
  const code = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const comment = commentIdx >= 0 ? line.slice(commentIdx) : "";

  // Order matters: strings first, then keywords on the remainder.
  const parts: React.ReactNode[] = [];
  let rest = code;
  let key = 0;
  const stringRe = /("[^"]*"|'[^']*')/;
  while (rest.length > 0) {
    const m = rest.match(stringRe);
    if (!m || m.index === undefined) {
      parts.push(renderKeywords(rest, `k${i}-${key++}`));
      break;
    }
    if (m.index > 0) {
      parts.push(renderKeywords(rest.slice(0, m.index), `k${i}-${key++}`));
    }
    parts.push(
      <span key={`s${i}-${key++}`} className="text-success">
        {m[0]}
      </span>,
    );
    rest = rest.slice(m.index + m[0].length);
  }

  return (
    <div key={i} className="whitespace-pre">
      {parts}
      {comment && <span className="text-muted italic">{comment}</span>}
    </div>
  );
}

function renderKeywords(text: string, key: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(KEYWORDS)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    // accent-hover flips: light violet on dark, deep violet on light
    out.push(
      <span key={`${key}-${k++}`} className="text-accent-hover">
        {m[0]}
      </span>,
    );
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <span key={key}>{out}</span>;
}

interface Props {
  title: string;
  code: string;
}

export function CodePeek({ title, code }: Props) {
  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border overflow-hidden">
      <p className="eyebrow px-4 pt-3 pb-2 border-b border-hairline">
        {title}
      </p>
      <div className="p-4 overflow-x-auto font-mono text-[13.5px] leading-relaxed">
        {code
          .trim()
          .split("\n")
          .map((l, i) => renderLine(l, i))}
      </div>
    </div>
  );
}
