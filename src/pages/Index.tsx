import { useState } from "react";
import { Header } from "@/components/rofatto/Header";
import { FileUpload } from "@/components/rofatto/FileUpload";
import { SummaryCards } from "@/components/rofatto/SummaryCards";
import { AnalysisTable, AnalysisData } from "@/components/rofatto/AnalysisTable";
import { EmailReport } from "@/components/rofatto/EmailReport";
import { processFiles } from "@/utils/fileProcessing";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFilesUploaded = async (sistemaFile: File, contagemFile: File) => {
    setIsLoading(true);
    try {
      const data = await processFiles(sistemaFile, contagemFile);
      setAnalysisData(data);
      
      toast({
        title: "Análise Concluída",
        description: `${data.length} produtos processados com sucesso`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro no Processamento",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        <FileUpload onFilesUploaded={handleFilesUploaded} />
        
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Processando arquivos...</p>
            </div>
          </div>
        )}
        
        {analysisData.length > 0 && !isLoading && (
          <Tabs defaultValue="analise" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analise">Análise Detalhada</TabsTrigger>
              <TabsTrigger value="relatorio">Relatório para Email</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analise" className="space-y-8">
              <SummaryCards data={analysisData} />
              <AnalysisTable data={analysisData} />
            </TabsContent>
            
            <TabsContent value="relatorio">
              <EmailReport data={analysisData} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
