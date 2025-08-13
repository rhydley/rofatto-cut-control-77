import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Target } from "lucide-react";
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
  
  // Cálculos de valor
  const totalDivergenciaValor = data.reduce((acc, item) => acc + item.divergenciaValor, 0);
  const valorSobras = sobras.reduce((acc, item) => acc + item.divergenciaValor, 0);
  const valorFaltas = Math.abs(faltas.reduce((acc, item) => acc + item.divergenciaValor, 0));
  const valorTotal = data.reduce((acc, item) => acc + (item.quantidadeSistema * item.custoKg), 0);
  const percentualDivergencia = ((Math.abs(totalDivergenciaValor) / valorTotal) * 100);

  return (
    <div className="space-y-6">
      {/* Card Principal - Divergência de Valor */}
      <Card className="shadow-lg border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-bold text-primary flex items-center justify-center gap-2">
            <DollarSign className="h-6 w-6" />
            Impacto Financeiro Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`text-4xl font-bold ${totalDivergenciaValor >= 0 ? 'text-success' : 'text-danger'}`}>
              R$ {totalDivergenciaValor > 0 ? '+' : ''}{totalDivergenciaValor.toFixed(2)}
            </div>
            <div className="text-lg text-muted-foreground">
              {percentualDivergencia.toFixed(2)}% do valor total do estoque
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="text-xl font-bold text-success">R$ +{valorSobras.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Valor em Sobras</div>
              </div>
              <div className="text-center p-3 bg-danger/10 rounded-lg border border-danger/20">
                <div className="text-xl font-bold text-danger">R$ -{valorFaltas.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Valor em Faltas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards Secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Valor Total do Estoque */}
        <Card className="shadow-soft hover:shadow-medium transition-shadow border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">R$ {valorTotal.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalProducts} produtos
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
            <div className="text-lg font-bold text-success">
              +{totalSobra.toFixed(1)} kg
            </div>
            <div className="text-sm font-semibold text-success">
              R$ +{valorSobras.toFixed(2)}
            </div>
            <Badge variant="success" className="text-xs mt-1">
              {sobras.length} produtos
            </Badge>
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
            <div className="text-lg font-bold text-danger">
              -{totalFalta.toFixed(1)} kg
            </div>
            <div className="text-sm font-semibold text-danger">
              R$ -{valorFaltas.toFixed(2)}
            </div>
            <Badge variant="danger" className="text-xs mt-1">
              {faltas.length} produtos
            </Badge>
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
            <div className="text-lg font-bold text-warning">
              {desviosGrandes.length}
            </div>
            <div className="text-sm font-semibold text-warning">
              R$ {desviosGrandes.reduce((acc, item) => acc + Math.abs(item.divergenciaValor), 0).toFixed(2)}
            </div>
            <Badge variant="warning" className="text-xs mt-1">
              Requer atenção
            </Badge>
          </CardContent>
        </Card>

        {/* Precisão */}
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Exatos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">
              {exatos.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {((exatos.length / totalProducts) * 100).toFixed(0)}% precisão
            </div>
            <Badge variant="secondary" className="text-xs mt-1">
              Sem divergência
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};