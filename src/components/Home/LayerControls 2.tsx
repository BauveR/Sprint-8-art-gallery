import { useState, useEffect } from 'react';

export interface LayerConfig {
  layer1: LayerSettings;
  layer2: LayerSettings;
  layer3: LayerSettings;
  layer4: LayerSettings;
}

export interface LayerSettings {
  size: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  position?: {
    mobile: Position;
    tablet: Position;
    desktop: Position;
  };
  centered?: boolean;
}

export interface Position {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

interface LayerControlsProps {
  initialConfig: LayerConfig;
  onConfigChange: (config: LayerConfig) => void;
}

export default function LayerControls({ initialConfig, onConfigChange }: LayerControlsProps) {
  const [config, setConfig] = useState<LayerConfig>(initialConfig);
  const [selectedLayer, setSelectedLayer] = useState<'layer1' | 'layer2' | 'layer3' | 'layer4'>('layer1');
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onConfigChange(config);
  }, [config, onConfigChange]);

  const updateSize = (layer: string, breakpoint: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [layer]: {
        ...prev[layer as keyof LayerConfig],
        size: {
          ...prev[layer as keyof LayerConfig].size,
          [breakpoint]: `${value}%`
        }
      }
    }));
  };

  const updatePosition = (layer: string, breakpoint: string, property: string, value: string) => {
    setConfig(prev => {
      const currentLayer = prev[layer as keyof LayerConfig];
      if (!currentLayer.position) return prev;

      const currentPosition = currentLayer.position[breakpoint as keyof typeof currentLayer.position];

      return {
        ...prev,
        [layer]: {
          ...currentLayer,
          position: {
            ...currentLayer.position,
            [breakpoint]: {
              ...currentPosition,
              [property]: `${value}%`
            }
          }
        }
      };
    });
  };

  const copyConfig = () => {
    const configString = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(configString);
    alert('Configuración copiada al portapapeles!');
  };

  const currentLayer = config[selectedLayer];
  const currentSize = parseInt(currentLayer.size[selectedBreakpoint]);
  const currentPosition = currentLayer.position?.[selectedBreakpoint];

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg font-semibold mb-2"
      >
        {isOpen ? '✕ Cerrar' : '🎨 Controles de Capas'}
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-2xl w-96 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4 text-purple-400">🎨 Control de Capas</h3>

          {/* Layer Selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Capa:</label>
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value as any)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              <option value="layer1">📱 Capa 1 - Fondo (svgs-20.png)</option>
              <option value="layer2">📱 Capa 2 - Segunda (page-16.svg)</option>
              <option value="layer3">📱 Capa 3 - Tercera (svgs-21.png)</option>
              <option value="layer4">📱 Capa 4 - Frente (svgs-15.svg)</option>
            </select>
          </div>

          {/* Breakpoint Selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Dispositivo:</label>
            <div className="flex gap-2">
              {(['mobile', 'tablet', 'desktop'] as const).map((bp) => (
                <button
                  key={bp}
                  onClick={() => setSelectedBreakpoint(bp)}
                  className={`flex-1 px-3 py-2 rounded ${
                    selectedBreakpoint === bp
                      ? 'bg-purple-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {bp === 'mobile' ? '📱' : bp === 'tablet' ? '📱' : '🖥️'} {bp}
                </button>
              ))}
            </div>
          </div>

          {/* Size Control */}
          <div className="mb-4 p-4 bg-gray-800 rounded">
            <label className="block text-sm font-semibold mb-2">
              Tamaño: {currentSize}%
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={currentSize}
              onChange={(e) => updateSize(selectedLayer, selectedBreakpoint, e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span>
              <span>200%</span>
            </div>
          </div>

          {/* Position Controls */}
          {currentPosition && (
            <div className="space-y-3 mb-4 p-4 bg-gray-800 rounded">
              <h4 className="text-sm font-semibold mb-2">Posición:</h4>

              {/* Top */}
              {currentPosition.top !== undefined && (
                <div>
                  <label className="block text-xs mb-1">
                    Top: {parseInt(currentPosition.top)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parseInt(currentPosition.top)}
                    onChange={(e) => updatePosition(selectedLayer, selectedBreakpoint, 'top', e.target.value)}
                    className="w-full"
                  />
                </div>
              )}

              {/* Bottom */}
              {currentPosition.bottom !== undefined && (
                <div>
                  <label className="block text-xs mb-1">
                    Bottom: {parseInt(currentPosition.bottom)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parseInt(currentPosition.bottom)}
                    onChange={(e) => updatePosition(selectedLayer, selectedBreakpoint, 'bottom', e.target.value)}
                    className="w-full"
                  />
                </div>
              )}

              {/* Left */}
              {currentPosition.left !== undefined && (
                <div>
                  <label className="block text-xs mb-1">
                    Left: {parseInt(currentPosition.left)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parseInt(currentPosition.left)}
                    onChange={(e) => updatePosition(selectedLayer, selectedBreakpoint, 'left', e.target.value)}
                    className="w-full"
                  />
                </div>
              )}

              {/* Right */}
              {currentPosition.right !== undefined && (
                <div>
                  <label className="block text-xs mb-1">
                    Right: {parseInt(currentPosition.right)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parseInt(currentPosition.right)}
                    onChange={(e) => updatePosition(selectedLayer, selectedBreakpoint, 'right', e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          {currentLayer.centered && (
            <div className="mb-4 p-4 bg-gray-800 rounded text-center text-sm text-gray-400">
              Esta capa está centrada automáticamente
            </div>
          )}

          {/* Copy Config Button */}
          <button
            onClick={copyConfig}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
          >
            📋 Copiar Configuración
          </button>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Ajusta los valores y copia la configuración para pegarla en el código
          </p>
        </div>
      )}
    </div>
  );
}
