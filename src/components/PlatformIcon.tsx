import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Film,
  Image as ImageIcon,
  Layers,
  PlaySquare,
  Send,
  Share2,
  Video,
} from 'lucide-react';
import { ContentFormat, SocialPlatform, WorkflowStatus } from '../types/content';

export function PlatformGlyph({
  platform,
  className = 'w-4 h-4',
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  switch (platform) {
    case 'Instagram':
      return <Camera className={`${className} text-[#B55478]`} />;
    case 'TikTok':
      return <Film className={`${className} text-[#39313A]`} />;
    case 'Facebook':
      return <Share2 className={`${className} text-[#C57292]`} />;
    case 'YouTube':
      return <PlaySquare className={`${className} text-[#963E60]`} />;
  }
}

export function FormatGlyph({
  format,
  className = 'w-4 h-4',
}: {
  format: ContentFormat;
  className?: string;
}) {
  switch (format) {
    case 'Foto':
      return <ImageIcon className={`${className} text-[#B55478]`} />;
    case 'Video':
      return <Video className={`${className} text-[#B55478]`} />;
    case 'Reels':
      return <Film className={`${className} text-[#B55478]`} />;
    case 'Carousel':
      return <Layers className={`${className} text-[#B55478]`} />;
    case 'Story':
      return <Clock className={`${className} text-[#B55478]`} />;
  }
}

export function StatusLabel({ status }: { status: WorkflowStatus }) {
  switch (status) {
    case 'Dalam Proses':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A6B7B] whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 shrink-0 text-[#D98EAA]" />
          Dalam Proses
        </span>
      );
    case 'Terjadwal':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B55478] whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          Terjadwal
        </span>
      );
    case 'Perlu Perbaikan':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          Perlu Perbaikan
        </span>
      );
    case 'Siap Publikasi':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          Optimal · Siap Publikasi
        </span>
      );
    case 'Dipublikasikan':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#39313A] whitespace-nowrap">
          <Send className="w-3.5 h-3.5 shrink-0 text-[#B55478]" />
          Dipublikasikan
        </span>
      );
  }
}
