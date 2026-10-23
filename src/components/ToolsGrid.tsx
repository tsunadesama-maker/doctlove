import React, { useState } from 'react';
import {
  Search,
  Languages,
  CopyPlus,
  Scissors,
  Trash2,
  RotateCw,
  Minimize2,
  ImageDown,
  ScanText,
  FileText,
  Image,
  Table,
  Presentation,
  FileCode,
  FileUp,
  FileImage,
  FileSpreadsheet,
  SlidersHorizontal,
  Edit3,
  PenTool,
  Stamp,
  Crop,
  Images,
  Music,
  Sparkles,
  BookOpen,
  ImagePlus,
  Video,
  Layers,
} from 'lucide-react';
import { TOOLS, CATEGORIES, ToolDefinition } from '../data/tools';
import { useI18n } from '../context/I18nContext';

interface ToolsGridProps {
  onSelectTool: (toolId: string) => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({ onSelectTool }) => {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'Languages': return <Languages className={className} />;
      case 'CopyPlus': return <CopyPlus className={className} />;
      case 'Scissors': return <Scissors className={className} />;
      case 'Trash2': return <Trash2 className={className} />;
      case 'RotateCw': return <RotateCw className={className} />;
      case 'Minimize2': return <Minimize2 className={className} />;
      case 'ImageDown': return <ImageDown className={className} />;
      case 'ScanText': return <ScanText className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'Image': return <Image className={className} />;
      case 'Table': return <Table className={className} />;
      case 'Presentation': return <Presentation className={className} />;
      case 'FileCode': return <FileCode className={className} />;
      case 'FileUp': return <FileUp className={className} />;
      case 'FileImage': return <FileImage className={className} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className={className} />;
      case 'SlidersHorizontal': return <SlidersHorizontal className={className} />;
      case 'Edit3': return <Edit3 className={className} />;
      case 'PenTool': return <PenTool className={className} />;
      case 'Stamp': return <Stamp className={className} />;
      case 'Crop': return <Crop className={className} />;
      case 'Images': return <Images className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'ImagePlus': return <ImagePlus className={className} />;
      case 'Video': return <Video className={className} />;
      case 'Layers': return <Layers className={className} />;
      default: return <FileText className={className} />;
    }
  };

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      
      {/* Barre de recherche et Catégories de filtrage */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Catégories de filtres */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs font-semibold">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Barre de recherche rapide */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un outil (ex: Fusionner, Word, Signer, Traduire...)"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs transition-colors"
          />
        </div>

      </div>

      {/* Grille de cartes d'outils (Style iLovePDF authentique) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-600/60 rounded-2xl p-5.5 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                {/* Icône avec couleur dédiée */}
                <div className={`w-12 h-12 rounded-xl ${tool.bgColor} dark:bg-slate-800/80 ${tool.color} flex items-center justify-center border ${tool.borderColor} dark:border-slate-700/60 transition-transform group-hover:scale-110 shadow-2xs`}>
                  {renderIcon(tool.iconName, 'w-6 h-6')}
                </div>
                {tool.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-red-50 dark:group-hover:bg-red-950/40 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Titre & Description */}
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {tool.shortDesc}
                </p>
              </div>
            </div>

            {/* Pied de carte : catégorie sobre */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <span className="font-medium text-slate-500 dark:text-slate-400">{tool.categoryLabel}</span>
              <span className="text-red-600 dark:text-red-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Utiliser →
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Aucun outil trouvé pour "{searchQuery}".</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
            className="mt-3 text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
          >
            Réinitialiser la recherche
          </button>
        </div>
      )}

    </section>
  );
};
