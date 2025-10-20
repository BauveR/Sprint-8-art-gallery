import Model3D from "../3D/Model3D";

interface Model3DGalleryProps {
  models: {
    path: string;
    name: string;
  }[];
}

export default function Model3DGallery({ models }: Model3DGalleryProps) {
  return (
    <div className="w-full pt-12 pb-1 px-8 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 max-w-5xl mx-auto">
        {models.map((model, index) => (
          <div
            key={index}
            className={`relative w-full h-[35vh] bg-transparent dark:bg-transparent rounded-lg overflow-hidden pt-4 ${
              index > 0 ? 'hidden md:block' : ''
            }`}
          >
            {/* Modelo 3D - Escalado */}
            <Model3D
              modelPath={model.path}
              autoRotate={true}
              rotationSpeed={0.3}
              scale={18}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
