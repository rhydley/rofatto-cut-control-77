import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FileUploadProps {
  onFilesUploaded: (sistemaFile: File, contagemFile: File) => void;
}

export const FileUpload = ({ onFilesUploaded }: FileUploadProps) => {
  const [sistemaFile, setSistemaFile] = useState<File | null>(null);
  const [contagemFile, setContagemFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.ods', '.xlsx', '.xls'];
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return validExtensions.includes(extension);
  };

  const handleSistemaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setSistemaFile(file);
        setError("");
      } else {
        setError("Formato de arquivo inválido. Use .ods, .xlsx ou .xls");
      }
    }
  };

  const handleContagemFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setContagemFile(file);
        setError("");
      } else {
        setError("Formato de arquivo inválido. Use .ods, .xlsx ou .xls");
      }
    }
  };

  const handleSubmit = () => {
    if (!sistemaFile || !contagemFile) {
      setError("Por favor, selecione ambos os arquivos");
      return;
    }
    
    onFilesUploaded(sistemaFile, contagemFile);
  };

  const canSubmit = sistemaFile && contagemFile && !error;

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Upload className="h-6 w-6 text-primary" />
          Upload dos Arquivos Diários
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sistema File */}
          <div className="space-y-3">
            <Label htmlFor="sistema-file" className="text-sm font-semibold">
              Arquivo do Sistema (.ods)
            </Label>
            <div className="relative">
              <Input
                id="sistema-file"
                type="file"
                accept=".ods,.xlsx,.xls"
                onChange={handleSistemaFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {sistemaFile && (
                <div className="mt-2 flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">{sistemaFile.name}</span>
                  <Badge variant="success">Carregado</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Contagem File */}
          <div className="space-y-3">
            <Label htmlFor="contagem-file" className="text-sm font-semibold">
              Contagem Física (.ods)
            </Label>
            <div className="relative">
              <Input
                id="contagem-file"
                type="file"
                accept=".ods,.xlsx,.xls"
                onChange={handleContagemFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {contagemFile && (
                <div className="mt-2 flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">{contagemFile.name}</span>
                  <Badge variant="success">Carregado</Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger-light border border-danger rounded-md">
            <AlertCircle className="h-4 w-4 text-danger" />
            <span className="text-sm text-danger font-medium">{error}</span>
          </div>
        )}

        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit}
            variant="gradient"
            size="lg"
            className="px-8"
          >
            <Upload className="h-4 w-4 mr-2" />
            Processar Análise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};