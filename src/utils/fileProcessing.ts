import * as XLSX from 'xlsx';
import { AnalysisData } from '@/components/rofatto/AnalysisTable';

export interface SistemaProduct {
  codigo: string;
  nome: string;
  quantidadeEstoque: number;
  custoKg: number;
}

export interface ContagemProduct {
  codigo: string;
  nome: string;
  quantidadePecas: number;
  quantidadeKg: number;
}

export const processFiles = async (
  sistemaFile: File,
  contagemFile: File
): Promise<AnalysisData[]> => {
  try {
    // Processar arquivo do sistema
    const sistemaData = await readExcelFile(sistemaFile);
    const sistemaProducts = processSistemaData(sistemaData);

    // Processar arquivo de contagem
    const contagemData = await readExcelFile(contagemFile);
    const contagemProducts = processContagemData(contagemData);

    // Gerar análise combinada
    return generateAnalysis(sistemaProducts, contagemProducts);
  } catch (error) {
    console.error('Erro ao processar arquivos:', error);
    throw new Error('Erro ao processar os arquivos. Verifique o formato e tente novamente.');
  }
};

const readExcelFile = (file: File): Promise<any[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(jsonData as any[][]);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
    reader.readAsArrayBuffer(file);
  });
};

const processSistemaData = (data: any[][]): SistemaProduct[] => {
  const products: SistemaProduct[] = [];
  
  // Assumindo que a primeira linha contém cabeçalhos
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 6) continue;
    
    const codigo = String(row[0] || '').trim();
    const nome = String(row[1] || '').toLowerCase().trim();
    const quantidade = parseFloat(row[4] || '0'); // Quinta coluna (E - estoque)
    const custo = parseFloat(row[5] || '0'); // Sexta coluna (F - custo)
    
    // Filtrar apenas picanhas e filé mignon, excluindo cordão
    if (nome && (nome.includes('picanha') || nome.includes('filé mignon') || nome.includes('file mignon')) && !nome.includes('cordão')) {
      products.push({
        codigo,
        nome: row[1], // Nome original com capitalização
        quantidadeEstoque: quantidade,
        custoKg: custo
      });
    }
  }
  
  return products;
};

const processContagemData = (data: any[][]): ContagemProduct[] => {
  const products: ContagemProduct[] = [];
  
  if (data.length < 4) return products; // Precisa de pelo menos 4 linhas
  
  console.log('Dados brutos da contagem:', data);
  
  // Linha 1: códigos dos produtos
  const codigos = data[1] || [];
  // Linha 2: nomes dos produtos
  const nomes = data[2] || [];
  
  console.log('Códigos:', codigos);
  console.log('Nomes:', nomes);
  
  // Para cada coluna (produto)
  for (let col = 0; col < nomes.length; col++) {
    const codigo = String(codigos[col] || '').trim();
    const nome = String(nomes[col] || '').trim();
    
    console.log(`Processando coluna ${col}: código="${codigo}", nome="${nome}"`);
    
    if (!codigo || !nome) {
      console.log(`Pulando produto vazio na coluna ${col}`);
      continue;
    }
    
    // Somar todos os valores numéricos dessa coluna a partir da linha 3
    let totalKg = 0;
    let totalPecas = 0;
    
    for (let row = 3; row < data.length; row++) {
      const valor = data[row]?.[col];
      if (valor !== undefined && valor !== null && valor !== '') {
        const numericValue = parseFloat(String(valor));
        if (!isNaN(numericValue) && numericValue > 0) {
          totalKg += numericValue;
          totalPecas += 1;
          console.log(`Valor encontrado na coluna ${col}, linha ${row}: ${numericValue}`);
        }
      }
    }
    
    console.log(`Produto ${codigo}: ${totalPecas} peças, ${totalKg}kg`);
    
    if (totalKg > 0) {
      products.push({
        codigo: String(codigo),
        nome,
        quantidadePecas: totalPecas,
        quantidadeKg: totalKg
      });
    }
  }
  
  console.log('Produtos processados da contagem:', products);
  return products;
};

const generateAnalysis = (
  sistemaProducts: SistemaProduct[],
  contagemProducts: ContagemProduct[]
): AnalysisData[] => {
  const analysis: AnalysisData[] = [];
  const today = new Date().toLocaleDateString('pt-BR');
  
  // Criar um mapa dos produtos do sistema para facilitar a busca
  const sistemaMap = new Map<string, SistemaProduct>();
  sistemaProducts.forEach(product => {
    sistemaMap.set(product.codigo, product);
  });
  
  // Para cada produto da contagem, encontrar o correspondente no sistema
  contagemProducts.forEach(contagemProduct => {
    const sistemaProduct = sistemaMap.get(contagemProduct.codigo);
    
    if (sistemaProduct) {
      const diferenca = contagemProduct.quantidadeKg - sistemaProduct.quantidadeEstoque;
      const divergenciaValor = diferenca * sistemaProduct.custoKg;
      
      analysis.push({
        data: today,
        codigo: contagemProduct.codigo,
        produto: sistemaProduct.nome,
        quantidadeSistema: sistemaProduct.quantidadeEstoque,
        quantidadeFisico: contagemProduct.quantidadeKg,
        quantidadePecas: contagemProduct.quantidadePecas,
        diferenca: diferenca,
        custoKg: sistemaProduct.custoKg,
        divergenciaValor: divergenciaValor
      });
    }
  });
  
  // Também incluir produtos que estão no sistema mas não foram contados
  sistemaProducts.forEach(sistemaProduct => {
    const jaProcessado = analysis.some(item => item.codigo === sistemaProduct.codigo);
    
    if (!jaProcessado) {
      analysis.push({
        data: today,
        codigo: sistemaProduct.codigo,
        produto: sistemaProduct.nome,
        quantidadeSistema: sistemaProduct.quantidadeEstoque,
        quantidadeFisico: 0,
        quantidadePecas: 0,
        diferenca: -sistemaProduct.quantidadeEstoque,
        custoKg: sistemaProduct.custoKg,
        divergenciaValor: -sistemaProduct.quantidadeEstoque * sistemaProduct.custoKg
      });
    }
  });
  
  return analysis;
};