import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnalysisData } from "./AnalysisTable";
import { AlertTriangle, Download, Mail, TrendingDown, TrendingUp } from "lucide-react";
import { PrintableReport } from "./PrintableReport";

interface EmailReportProps {
  data: AnalysisData[];
}

export const EmailReport = ({ data }: EmailReportProps) => {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totals = data.reduce((acc, item) => {
    acc.totalSistema += item.quantidadeSistema;
    acc.totalFisico += item.quantidadeFisico;
    acc.totalDiferenca += item.diferenca;
    if (item.diferenca > 0) acc.sobras += item.diferenca;
    if (item.diferenca < 0) acc.faltas += Math.abs(item.diferenca);
    return acc;
  }, {
    totalSistema: 0,
    totalFisico: 0,
    totalDiferenca: 0,
    sobras: 0,
    faltas: 0
  });

  const desviosSignificativos = data.filter(item => Math.abs(item.diferenca) > 1);

  const generateEmailContent = () => {
    const subject = `Relatório de Inventário - ${today}`;
    const body = `
Relatório de Inventário - Picanhas e Filé Mignon
Data: ${today}

RESUMO GERAL:
• Total Sistema: ${totals.totalSistema.toFixed(2)} kg
• Total Físico: ${totals.totalFisico.toFixed(2)} kg
• Diferença Total: ${totals.totalDiferenca > 0 ? '+' : ''}${totals.totalDiferenca.toFixed(2)} kg
• Sobras: ${totals.sobras.toFixed(2)} kg
• Faltas: ${totals.faltas.toFixed(2)} kg

${desviosSignificativos.length > 0 ? `
⚠️ ATENÇÃO - DESVIOS SIGNIFICATIVOS (>1kg):
${desviosSignificativos.map(item => 
  `• ${item.produto} (${item.codigo}): ${item.diferenca > 0 ? '+' : ''}${item.diferenca.toFixed(2)} kg`
).join('\n')}
` : '✅ Todos os itens dentro da margem aceitável (≤1kg)'}

DETALHAMENTO COMPLETO:
${data.sort((a, b) => Math.abs(b.diferenca) - Math.abs(a.diferenca))
  .map(item => 
    `${item.produto} (${item.codigo}): Sistema ${item.quantidadeSistema.toFixed(2)}kg | Físico ${item.quantidadeFisico.toFixed(2)}kg | Diferença ${item.diferenca > 0 ? '+' : ''}${item.diferenca.toFixed(2)}kg`
  ).join('\n')}

---
Relatório gerado automaticamente pelo Sistema de Controle de Perdas
    `.trim();

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handlePrint = () => {
    // Abrir janela de impressão com layout limpo
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div style="max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; color: black; font-family: Arial, sans-serif;">
        <!-- Cabeçalho -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #22c55e; padding-bottom: 20px; margin-bottom: 30px;">
          <div>
            <img src="/lovable-uploads/0569056c-e367-4215-b00c-f98eaad57548.png" alt="Rofatto" style="height: 60px; margin-bottom: 10px;">
            <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #22c55e;">RELATÓRIO DE INVENTÁRIO</h1>
            <p style="font-size: 18px; margin: 0; color: #16a34a;">Carnes Nobres - Picanhas e Filé Mignon</p>
            <p style="font-size: 16px; margin: 5px 0 0 0; font-weight: bold; color: #059669;">LOJA 07</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 18px; font-weight: bold; margin: 0; color: #22c55e;">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
            <p style="font-size: 14px; color: #16a34a; margin: 0;">Controle de Perdas</p>
          </div>
        </div>

          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 30px;">
            <div style="text-align: center; padding: 15px; border: 2px solid #22c55e; border-radius: 8px; background: #f0fdf4;">
              <div style="font-size: 24px; font-weight: bold; color: #22c55e;">${totals.totalSistema.toFixed(1)}</div>
              <div style="font-size: 12px; color: #16a34a; font-weight: 600;">Sistema (kg)</div>
            </div>
            <div style="text-align: center; padding: 15px; border: 2px solid #3b82f6; border-radius: 8px; background: #eff6ff;">
              <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${totals.totalFisico.toFixed(1)}</div>
              <div style="font-size: 12px; color: #2563eb; font-weight: 600;">Físico (kg)</div>
            </div>
            <div style="text-align: center; padding: 15px; border: 2px solid #16a34a; border-radius: 8px; background: #f0fdf4;">
              <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${totals.sobras.toFixed(1)}</div>
              <div style="font-size: 12px; color: #15803d; font-weight: 600;">Sobras (kg)</div>
            </div>
            <div style="text-align: center; padding: 15px; border: 2px solid #dc2626; border-radius: 8px; background: #fef2f2;">
              <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${totals.faltas.toFixed(1)}</div>
              <div style="font-size: 12px; color: #b91c1c; font-weight: 600;">Faltas (kg)</div>
            </div>
            <div style="text-align: center; padding: 15px; border: 2px solid #7c3aed; border-radius: 8px; background: #f5f3ff;">
              <div style="font-size: 18px; font-weight: bold; color: #7c3aed;">R$ ${data.reduce((sum, item) => sum + Math.abs(item.divergenciaValor), 0).toFixed(0)}</div>
              <div style="font-size: 12px; color: #6d28d9; font-weight: 600;">Valor Divergência</div>
            </div>
          </div>

        <!-- Diferença Total -->
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; border: 3px solid ${totals.totalDiferenca >= 0 ? '#16a34a' : '#dc2626'}; border-radius: 10px; background: ${totals.totalDiferenca >= 0 ? '#f0fdf4' : '#fef2f2'};">
          <div style="font-size: 30px; font-weight: bold; color: ${totals.totalDiferenca >= 0 ? '#16a34a' : '#dc2626'};">
            DIFERENÇA TOTAL: ${totals.totalDiferenca > 0 ? '+' : ''}${totals.totalDiferenca.toFixed(2)} kg
          </div>
        </div>

        ${desviosSignificativos.length > 0 ? `
        <!-- Desvios Significativos -->
        <div style="margin-bottom: 30px; padding: 20px; border: 2px solid #f59e0b; border-radius: 10px; background: #fef3c7;">
          <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #d97706;">⚠️ DESVIOS SIGNIFICATIVOS (> 1kg)</h3>
          ${desviosSignificativos.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: 500;">${item.produto} (${item.codigo})</span>
              <span style="font-weight: bold; color: ${item.diferenca > 0 ? '#16a34a' : '#dc2626'};">
                ${item.diferenca > 0 ? '+' : ''}${item.diferenca.toFixed(2)} kg
              </span>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Tabela de Produtos -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr>
              <th style="border: 1px solid #22c55e; padding: 12px 8px; text-align: left; background: #22c55e; color: white; font-weight: bold;">Produto</th>
              <th style="border: 1px solid #22c55e; padding: 12px 8px; text-align: left; background: #22c55e; color: white; font-weight: bold;">Código</th>
              <th style="border: 1px solid #22c55e; padding: 12px 8px; text-align: left; background: #22c55e; color: white; font-weight: bold;">Sistema (kg)</th>
              <th style="border: 1px solid #22c55e; padding: 12px 8px; text-align: left; background: #22c55e; color: white; font-weight: bold;">Físico (kg)</th>
              <th style="border: 1px solid #22c55e; padding: 12px 8px; text-align: left; background: #22c55e; color: white; font-weight: bold;">Custo/kg</th>
              <th style="border: 1px solid #22c55e; padding: 12px 8px; text-align: left; background: #22c55e; color: white; font-weight: bold;">Diferença (kg)</th>
              <th style="border: 1px solid #22c55e; padding: 12px 8px; text-align: left; background: #22c55e; color: white; font-weight: bold;">Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            ${data.sort((a, b) => Math.abs(b.diferenca) - Math.abs(a.diferenca))
              .map(item => `
                <tr>
                  <td style="border: 1px solid #e5e7eb; padding: 12px 8px; font-weight: 500;">${item.produto}</td>
                  <td style="border: 1px solid #e5e7eb; padding: 12px 8px;">${item.codigo}</td>
                  <td style="border: 1px solid #e5e7eb; padding: 12px 8px;">${item.quantidadeSistema.toFixed(2)}</td>
                  <td style="border: 1px solid #e5e7eb; padding: 12px 8px;">${item.quantidadeFisico.toFixed(2)}</td>
                  <td style="border: 1px solid #e5e7eb; padding: 12px 8px; color: #059669; font-weight: bold;">R$ ${item.custoKg.toFixed(2)}</td>
                  <td style="border: 1px solid #e5e7eb; padding: 12px 8px; font-weight: bold; color: ${item.diferenca > 0 ? '#16a34a' : item.diferenca < 0 ? '#dc2626' : 'black'};">
                    ${item.diferenca > 0 ? '+' : ''}${item.diferenca.toFixed(2)}
                  </td>
                  <td style="border: 1px solid #e5e7eb; padding: 12px 8px; font-weight: bold; color: ${item.divergenciaValor > 0 ? '#16a34a' : item.divergenciaValor < 0 ? '#dc2626' : 'black'};">
                    R$ ${item.divergenciaValor > 0 ? '+' : ''}${item.divergenciaValor.toFixed(2)}
                  </td>
                </tr>
              `).join('')}
          </tbody>
        </table>

        <!-- Rodapé -->
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ccc; text-align: center; font-size: 12px; color: #666;">
          <p>Relatório gerado automaticamente pelo Sistema de Controle de Perdas - Rofatto Supermercados</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Relatório de Inventário</title>
            <meta charset="utf-8">
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                @page { margin: 1cm; }
                * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
              }
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Relatório */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            📊 Relatório de Inventário
          </CardTitle>
          <p className="text-lg text-muted-foreground font-medium">
            Picanhas e Filé Mignon - {today}
          </p>
        </CardHeader>
      </Card>

      {/* Resumo Executivo */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            Resumo Executivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totals.totalSistema.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Total Sistema (kg)</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totals.totalFisico.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Total Físico (kg)</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-success">{totals.sobras.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Sobras (kg)</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-danger">{totals.faltas.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Faltas (kg)</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className={`text-3xl font-bold ${totals.totalDiferenca >= 0 ? 'text-success' : 'text-danger'}`}>
              {totals.totalDiferenca > 0 ? '+' : ''}{totals.totalDiferenca.toFixed(2)} kg
            </div>
            <div className="text-lg text-muted-foreground">Diferença Total</div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Desvio */}
      {desviosSignificativos.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Desvios Significativos Detectados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {desviosSignificativos.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div>
                    <div className="font-semibold">{item.produto}</div>
                    <div className="text-sm text-muted-foreground">Código: {item.codigo}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.diferenca > 0 ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-danger" />
                    )}
                    <span className={`font-bold text-lg ${
                      item.diferenca > 0 ? 'text-success' : 'text-danger'
                    }`}>
                      {item.diferenca > 0 ? '+' : ''}{item.diferenca.toFixed(2)} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela Resumida para Email */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detalhamento por Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data
              .sort((a, b) => Math.abs(b.diferenca) - Math.abs(a.diferenca))
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold">{item.produto}</div>
                    <div className="text-sm text-muted-foreground">
                      Sistema: {item.quantidadeSistema.toFixed(2)}kg | Físico: {item.quantidadeFisico.toFixed(2)}kg
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      item.diferenca > 0 ? "success" : 
                      item.diferenca < 0 ? "danger" : 
                      "warning"
                    }>
                      {item.diferenca > 0 ? '+' : ''}{item.diferenca.toFixed(2)} kg
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-4 justify-center">
        <Button onClick={generateEmailContent} className="gap-2">
          <Mail className="h-4 w-4" />
          Enviar por Email
        </Button>
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Download className="h-4 w-4" />
          Imprimir Relatório
        </Button>
      </div>
    </div>
  );
};