import { getMediaUrl } from "@/lib/media";

type RichTextContent = {
  root?: {
    children?: LexicalNode[];
  };
};

type LexicalNode = {
  type?: string;
  tag?: string;
  listType?: string;
  text?: string;
  format?: number;
  value?: Parameters<typeof getMediaUrl>[0] & {
    alt?: string;
  };
  fields?: {
    alt?: string;
    caption?: string;
  };
  children?: LexicalNode[];
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getNodeText(node: LexicalNode): string {
  return node.text ? escapeHtml(node.text) : "";
}

function serializeLexical(block: LexicalNode): string {
  if (!block) return "";

  // Upload node
  if (block.type === "upload" && block.value) {
    const url = getMediaUrl(block.value);
    const alt = escapeHtml(block.value?.alt || block.fields?.alt || "");
    const caption = escapeHtml(block.fields?.caption || "");

    if (caption) {
      return `
        <figure class="my-8">
          <img src="${url}" alt="${alt}" class="w-full rounded-2xl shadow-lg" loading="lazy" decoding="async" />
          <figcaption class="text-center text-sm text-gray-500 mt-3">${caption}</figcaption>
        </figure>
      `;
    }

    return `
      <div class="my-8">
        <img src="${url}" alt="${alt}" class="w-full rounded-2xl shadow-lg" loading="lazy" decoding="async" />
      </div>
    `;
  }

  // Paragraph
  if (block.type === "paragraph") {
    const parts =
      block.children
        ?.map((c) => {
          let text = getNodeText(c);
          const format = c.format || 0;

          if (format & 1) text = `<strong>${text}</strong>`;
          if (format & 2) text = `<em>${text}</em>`;
          if (format & 8) text = `<u>${text}</u>`;
          if (format & 16) text = `<s>${text}</s>`;

          return text;
        })
        .join("") || "";

    if (!parts || block.children?.length === 0) return "<br />";
    return `<p class="mb-5 text-gray-700 leading-[1.9] text-justify">${parts}</p>`;
  }

  // Heading — h1 removed to avoid duplicate h1 on pages with PageHero
  if (block.type === "heading") {
    const text = block.children?.map((c) => getNodeText(c)).join("") || "";
    const tag = block.tag === "h1" ? "h2" : block.tag || "h2";

    const classes: Record<string, string> = {
      h2: "text-2xl font-extrabold text-[#0a1628] mb-4 mt-8 pb-2 border-b-2 border-[#c49a2c]/20",
      h3: "text-xl font-bold text-[#0a1628] mb-3 mt-6",
      h4: "text-lg font-bold text-[#0a1628] mb-2 mt-4",
      h5: "text-base font-bold text-[#0a1628] mb-2 mt-4",
      h6: "text-sm font-bold text-[#0a1628] mb-2 mt-4",
    };

    return `<${tag} class="${classes[tag] || ""}">${text}</${tag}>`;
  }

  // List
  if (block.type === "list") {
    const tag = block.listType === "number" ? "ol" : "ul";
    const items =
      block.children
        ?.map((item) => {
          const text = item.children?.map((c) => getNodeText(c)).join("") || "";
          return `<li class="mb-2 text-gray-700 leading-relaxed">${text}</li>`;
        })
        .join("") || "";

    const listClass =
      block.listType === "number"
        ? "list-decimal list-inside mb-6 space-y-1 pr-4 marker:text-[#c49a2c]"
        : "list-disc list-inside mb-6 space-y-1 pr-4 marker:text-[#c49a2c]";

    return `<${tag} class="${listClass}">${items}</${tag}>`;
  }

  // Quote
  if (block.type === "quote") {
    const text =
      block.children
        ?.map((c) => c.children?.map((cc) => getNodeText(cc)).join(""))
        .join(" ") || "";

    return `<blockquote class="border-r-4 border-[#c49a2c] bg-amber-50/50 p-5 rounded-l-xl mb-6 text-gray-600 italic leading-relaxed"><p>${text}</p></blockquote>`;
  }

  // Horizontal rule
  if (block.type === "horizontalrule") {
    return `<hr class="my-10 border-gray-200" aria-hidden="true" />`;
  }

  // Code block
  if (block.type === "code") {
    const code =
      block.children
        ?.map((c) => c.children?.map((cc) => getNodeText(cc)).join("\n"))
        .join("\n") || "";

    return `<pre class="bg-gray-900 text-gray-100 p-5 rounded-xl mb-6 overflow-x-auto text-sm leading-relaxed" tabindex="0"><code>${code}</code></pre>`;
  }

  return "";
}

function renderLexicalHTML(content: RichTextContent): string {
  if (!content?.root?.children) return "";
  return content.root.children.map((block) => serializeLexical(block)).join("\n");
}

interface RichTextRendererProps {
  content?: RichTextContent | null;
  className?: string;
}

export default function RichTextRenderer({
  content,
  className = "",
}: RichTextRendererProps) {
  if (!content) return null;

  const html = renderLexicalHTML(content);

  if (!html) {
    return (
      <div className="text-center py-12 bg-gray-100 rounded-2xl">
        <p className="text-gray-500">محتوایی برای نمایش وجود ندارد.</p>
      </div>
    );
  }

  return (
    <div
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}