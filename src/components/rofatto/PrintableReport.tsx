import { AnalysisData } from "./AnalysisTable";

interface PrintableReportProps {
  data: AnalysisData[];
}

export const PrintableReport = ({ data }: PrintableReportProps) => {
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
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

  return (
    <div className="print-report">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-report, .print-report * { visibility: visible; }
          .print-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
          .print-header {
            border-bottom: 2px solid #22c55e;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .print-summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .print-summary-item {
            text-align: center;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .print-desvios {
            margin-bottom: 30px;
            padding: 20px;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            background: #fef3c7;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
          }
          .print-table th,
          .print-table td {
            border: 1px solid #e5e7eb;
            padding: 12px 8px;
            text-align: left;
          }
          .print-table th {
            background: #f3f4f6;
            font-weight: bold;
          }
          .print-positive { color: #16a34a; font-weight: bold; }
          .print-negative { color: #dc2626; font-weight: bold; }
          .no-print { display: none !important; }
        }
        
        @media screen {
          .print-report {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
            color: black;
            min-height: 297mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }
      `}</style>

      {/* Cabeçalho */}
      <div className="print-header flex justify-between items-center">
        <div>
          <img 
            src="/lovable-uploads/0569056c-e367-4215-b00c-f98eaad57548.png" 
            alt="Rofatto" 
            className="h-16 w-auto mb-2"
          />
          <h1 className="text-2xl font-bold">RELATÓRIO DE INVENTÁRIO</h1>
          <p className="text-lg">Carnes Nobres - Picanhas e Filé Mignon</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">Data: {today}</p>
          <p className="text-sm text-gray-600">Controle de Perdas</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="print-summary">
        <div className="print-summary-item">
          <div className="text-2xl font-bold">{totals.totalSistema.toFixed(1)}</div>
          <div className="text-sm">Sistema (kg)</div>
        </div>
        <div className="print-summary-item">
          <div className="text-2xl font-bold">{totals.totalFisico.toFixed(1)}</div>
          <div className="text-sm">Físico (kg)</div>
        </div>
        <div className="print-summary-item">
          <div className="text-2xl font-bold print-positive">{totals.sobras.toFixed(1)}</div>
          <div className="text-sm">Sobras (kg)</div>
        </div>
        <div className="print-summary-item">
          <div className="text-2xl font-bold print-negative">{totals.faltas.toFixed(1)}</div>
          <div className="text-sm">Faltas (kg)</div>
        </div>
      </div>

      {/* Diferença Total */}
      <div className="text-center mb-8 p-4 border-2 border-gray-300 rounded-lg">
        <div className={`text-3xl font-bold ${totals.totalDiferenca >= 0 ? 'print-positive' : 'print-negative'}`}>
          DIFERENÇA TOTAL: {totals.totalDiferenca > 0 ? '+' : ''}{totals.totalDiferenca.toFixed(2)} kg
        </div>
      </div>

      {/* Desvios Significativos */}
      {desviosSignificativos.length > 0 && (
        <div className="print-desvios">
          <h3 className="text-lg font-bold mb-4">⚠️ DESVIOS SIGNIFICATIVOS (&gt; 1kg)</h3>
          <div className="space-y-2">
            {desviosSignificativos.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{item.produto} ({item.codigo})</span>
                <span className={`font-bold ${item.diferenca > 0 ? 'print-positive' : 'print-negative'}`}>
                  {item.diferenca > 0 ? '+' : ''}{item.diferenca.toFixed(2)} kg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabela de Produtos */}
      <table className="print-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Código</th>
            <th>Sistema (kg)</th>
            <th>Físico (kg)</th>
            <th>Diferença (kg)</th>
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => Math.abs(b.diferenca) - Math.abs(a.diferenca))
            .map((item, index) => (
              <tr key={index}>
                <td className="font-medium">{item.produto}</td>
                <td>{item.codigo}</td>
                <td>{item.quantidadeSistema.toFixed(2)}</td>
                <td>{item.quantidadeFisico.toFixed(2)}</td>
                <td className={item.diferenca > 0 ? 'print-positive' : item.diferenca < 0 ? 'print-negative' : ''}>
                  {item.diferenca > 0 ? '+' : ''}{item.diferenca.toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Rodapé */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
        <p>Relatório gerado automaticamente pelo Sistema de Controle de Perdas - Rofatto Supermercados</p>
      </div>
    </div>
  );
};