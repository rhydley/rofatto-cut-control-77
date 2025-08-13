import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { AnalysisData } from "./AnalysisTable";

interface SummaryCardsProps {
  data: AnalysisData[];
}

export const SummaryCards = ({ data }: SummaryCardsProps) => {
  const totalProducts = data.length;
  const sobras = data.filter(item => item.diferenca > 0);
  const faltas = data.filter(item => item.diferenca < 0);
  const exatos = data.filter(item => item.diferenca === 0);
  const desviosGrandes = data.filter(item => Math.abs(item.diferenca) > 1);

  const totalSobra = sobras.reduce((acc, item) => acc + item.diferenca, 0);
  const totalFalta = Math.abs(faltas.reduce((acc, item) => acc + item.diferenca, 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total de Produtos */}
      <Card className="shadow-soft hover:shadow-medium transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Produtos
          </CardTitle>
          <Package className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalProducts}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Picanhas e filé mignon
          </p>
        </CardContent>
      </Card>

      {/* Sobras */}
      <Card className="shadow-soft hover:shadow-success transition-shadow border-success/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Sobras
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            +{totalSobra.toFixed(2)} kg
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="success" className="text-xs">
              {sobras.length} produtos
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Faltas */}
      <Card className="shadow-soft hover:shadow-danger transition-shadow border-danger/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Faltas
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-danger" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-danger">
            -{totalFalta.toFixed(2)} kg
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="danger" className="text-xs">
              {faltas.length} produtos
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      <Card className="shadow-soft hover:shadow-warning transition-shadow border-warning/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Desvios &gt; 1kg
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            {desviosGrandes.length}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="warning" className="text-xs">
              Requer atenção
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};