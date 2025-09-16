"use client"

import { useState } from "react"
import { IconCopy, IconExternalLink } from "@tabler/icons-react"

interface Citation {
  title: string;
  authors?: string[];
  venue?: string;
  year?: number;
  doi?: string;
  url?: string;
}

interface CitationListProps {
  items: Citation[];
}

export default function CitationList({ items }: CitationListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!items?.length) return null;

  const formatAPA = (citation: Citation): string => {
    const authors = citation.authors?.join(", ") || "Unknown";
    const year = citation.year ? ` (${citation.year})` : "";
    const venue = citation.venue ? ` ${citation.venue}` : "";
    const doi = citation.doi ? ` https://doi.org/${citation.doi}` : "";
    
    return `${authors}${year}. ${citation.title}${venue}.${doi}`;
  };

  const formatBibTeX = (citation: Citation, index: number): string => {
    const key = `ref${index + 1}`;
    const authors = citation.authors?.join(" and ") || "Unknown";
    const year = citation.year || "n.d.";
    const venue = citation.venue || "Unknown venue";
    
    return `@article{${key},
  title={${citation.title}},
  author={${authors}},
  journal={${venue}},
  year={${year}},
  doi={${citation.doi || ""}},
  url={${citation.url || ""}}
}`;
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Sources & Citations</h3>
      <div className="space-y-3">
        {items.map((citation, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="space-y-2">
              <div className="font-medium text-white">{citation.title}</div>
              <div className="text-sm text-gray-300">
                {citation.authors?.join(", ")}
                {citation.venue && ` — ${citation.venue}`}
                {citation.year && ` (${citation.year})`}
              </div>
              <div className="flex items-center space-x-4 text-sm">
                {citation.doi && (
                  <a 
                    href={`https://doi.org/${citation.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <IconExternalLink className="w-3 h-3" />
                    <span>DOI</span>
                  </a>
                )}
                {citation.url && (
                  <a 
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <IconExternalLink className="w-3 h-3" />
                    <span>Link</span>
                  </a>
                )}
                <button
                  onClick={() => copyToClipboard(formatAPA(citation), index * 2)}
                  className="text-green-400 hover:text-green-300 flex items-center space-x-1"
                >
                  <IconCopy className="w-3 h-3" />
                  <span>{copiedIndex === index * 2 ? "Copied!" : "APA"}</span>
                </button>
                <button
                  onClick={() => copyToClipboard(formatBibTeX(citation, index), index * 2 + 1)}
                  className="text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                >
                  <IconCopy className="w-3 h-3" />
                  <span>{copiedIndex === index * 2 + 1 ? "Copied!" : "BibTeX"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
