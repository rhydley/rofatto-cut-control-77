import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

export interface AnalysisData {
  data: string;
  codigo: string;
  produto: string;
  quantidadeSistema: number;
  quantidadeFisico: number;
  quantidadePecas: number;
  diferenca: number;
  custoKg: number;
  divergenciaValor: number;
}

interface AnalysisTableProps {
  data: AnalysisData[];
}

export const AnalysisTable = ({ data }: AnalysisTableProps) => {
  const getVariant = (diferenca: number) => {
    if (diferenca > 0) return "success";
    if (diferenca < 0) return "danger";
    return "warning";
  };

  const getIcon = (diferenca: number) => {
    if (diferenca > 0) return <TrendingUp className="h-4 w-4" />;
    if (diferenca < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  const hasLargeDeviation = data.some(item => Math.abs(item.diferenca) > 1);

  return (
    <div className="space-y-6">
      {hasLargeDeviation && (
        <Card className="border-warning bg-warning-light">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <h3 className="font-semibold text-warning">Atenção: Desvios Detectados</h3>
                <p className="text-sm text-warning/80">
                  Alguns produtos apresentam desvios superiores a 1kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">
              Análise - Picanhas e Filé Mignon
            </CardTitle>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">
              {data[0]?.data}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Produto</TableHead>
                  <TableHead className="font-semibold text-right">Sistema (kg)</TableHead>
                  <TableHead className="font-semibold text-right">Físico (kg)</TableHead>
                  <TableHead className="font-semibold text-right">Peças</TableHead>
                  <TableHead className="font-semibold text-right">Custo/kg</TableHead>
                  <TableHead className="font-semibold text-right">Diferença (kg)</TableHead>
                  <TableHead className="font-semibold text-right">Valor (R$)</TableHead>
                  <TableHead className="font-semibold text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data
                  .sort((a, b) => Math.abs(b.diferenca) - Math.abs(a.diferenca))
                  .map((item, index) => (
                    <TableRow 
                      key={`${item.codigo}-${index}`}
                      className={`
                        ${Math.abs(item.diferenca) > 1 ? 'bg-warning-light/50' : ''}
                        hover:bg-muted/50 transition-colors
                      `}
                    >
                      <TableCell className="font-medium">{item.data}</TableCell>
                      <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.produto}</TableCell>
                      <TableCell className="text-right font-mono">
                        {item.quantidadeSistema.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {item.quantidadeFisico.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {item.quantidadePecas}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        R$ {item.custoKg.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <div className="flex items-center justify-end gap-2">
                          {getIcon(item.diferenca)}
                          <span className={`font-semibold ${
                            item.diferenca > 0 ? 'text-success' : 
                            item.diferenca < 0 ? 'text-danger' : 
                            'text-warning'
                          }`}>
                            {item.diferenca > 0 ? '+' : ''}{item.diferenca.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span className={`font-semibold ${
                          item.divergenciaValor > 0 ? 'text-success' : 
                          item.divergenciaValor < 0 ? 'text-danger' : 
                          'text-warning'
                        }`}>
                          R$ {item.divergenciaValor > 0 ? '+' : ''}{item.divergenciaValor.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getVariant(item.diferenca)} className="font-medium">
                          {item.diferenca > 0 ? 'Sobra' : 
                           item.diferenca < 0 ? 'Falta' : 
                           'Exato'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};