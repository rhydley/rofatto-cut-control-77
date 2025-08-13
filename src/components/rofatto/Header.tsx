import { ShoppingCart, BarChart3 } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-gradient-primary shadow-medium">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <img 
                src="/lovable-uploads/0569056c-e367-4215-b00c-f98eaad57548.png" 
                alt="Rofatto Supermercados" 
                className="h-12 w-auto"
              />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">Controle de Perdas</h1>
              <p className="text-primary-foreground/80 text-lg">
                Carnes Nobres
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <BarChart3 className="h-6 w-6 text-white" />
            <div className="text-white text-right">
              <p className="text-sm text-primary-foreground/80">Sistema de</p>
              <p className="font-semibold">Análise Diária</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};