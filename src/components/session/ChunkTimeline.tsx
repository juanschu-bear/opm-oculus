import type { OPMChunkResult } from "@/types/opm";

interface ChunkTimelineProps {
  chunks: OPMChunkResult[];
}

export default function ChunkTimeline({ chunks }: ChunkTimelineProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-wider text-white/50">Chunk timeline</div>
      <div className="mt-3 space-y-2">
        {chunks.map((chunk) => (
          <div key={chunk.chunk_index} className="text-xs text-white/70">
            Chunk {chunk.chunk_index}: {chunk.chunk_range[0]}s - {chunk.chunk_range[1]}s ({chunk.findings.length} findings)
          </div>
        ))}
      </div>
    </div>
  );
}
