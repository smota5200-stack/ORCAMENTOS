import { useState } from "react";
import { Plus, Trash2, FileText, Download, Building2, Calendar, FileCheck, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type LineItem = {
  id: string;
  quantity: number;
  description: string;
  unitPrice: number;
  warranty: string;
};

type QuoteData = {
  contactName: string;
  currency: string;
  anniversaryDate: string;
  validityDate: string;
  paymentTerms: string;
  notes: string;
  items: LineItem[];
};

export default function QuoteGenerator() {
  const { toast } = useToast();
  const [data, setData] = useState<QuoteData>({
    contactName: "Elaine Cristina",
    currency: "USD",
    anniversaryDate: "2025-02-18",
    validityDate: "2025-02-19",
    paymentTerms: "Pagamento 30/60/90 no boleto Bancário, mediante aprovação de crédito",
    notes: "Faturamento direto pelo nosso distribuidor Pars Valores em dólar. Será convertido em reais, apenas no dia do faturamento de acordo com o dólar e pedido processado junto a Adobe.\n\nÉ importante renovar as licenças antes da data de aniversário, uns 2 dias antes. Se for renovado depois da data de aniversário, será necessário atribuir novamente aos usuários (entra como New) reconexão.",
    items: [
      {
        id: "1",
        quantity: 10,
        description: "Adobe Creative Cloud for Teams - All Apps",
        unitPrice: 899.00,
        warranty: "1 Ano",
      }
    ],
  });

  const addItem = () => {
    setData({
      ...data,
      items: [
        ...data.items,
        {
          id: Math.random().toString(36).substring(7),
          quantity: 1,
          description: "",
          unitPrice: 0,
          warranty: "",
        },
      ],
    });
  };

  const removeItem = (id: string) => {
    setData({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    });
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setData({
      ...data,
      items: data.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleGenerate = () => {
    toast({
      title: "Proposta Gerada com Sucesso!",
      description: "O PDF estaria sendo baixado agora nesta versão completa.",
    });
  };

  const calculateTotal = () => {
    return data.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="w-6 h-6" />
            <span className="font-heading font-semibold text-lg tracking-tight">Proposify</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()} data-testid="button-print">
              <FileText className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button size="sm" onClick={handleGenerate} data-testid="button-generate">
              <Download className="w-4 h-4 mr-2" />
              Gerar PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form / Input */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Nova Proposta</h1>
              <p className="text-sm text-muted-foreground">Preencha os detalhes para gerar o documento automaticamente.</p>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Detalhes do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contato / Empresa</Label>
                  <Input 
                    id="contactName" 
                    value={data.contactName} 
                    onChange={(e) => setData({...data, contactName: e.target.value})}
                    data-testid="input-contact"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="anniversaryDate">Data de Aniversário</Label>
                    <Input 
                      id="anniversaryDate" 
                      type="date"
                      value={data.anniversaryDate} 
                      onChange={(e) => setData({...data, anniversaryDate: e.target.value})}
                      data-testid="input-anniversary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validityDate">Validade da Proposta</Label>
                    <Input 
                      id="validityDate" 
                      type="date"
                      value={data.validityDate} 
                      onChange={(e) => setData({...data, validityDate: e.target.value})}
                      data-testid="input-validity"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <select 
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={data.currency}
                    onChange={(e) => setData({...data, currency: e.target.value})}
                  >
                    <option value="USD">Dólar Americano (USD)</option>
                    <option value="BRL">Real Brasileiro (BRL)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CircleDollarSign className="w-5 h-5 text-primary" />
                  Itens do Orçamento
                </CardTitle>
                <Button variant="outline" size="sm" onClick={addItem} data-testid="button-add-item">
                  <Plus className="w-4 h-4 mr-1" /> Adicionar
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.items.map((item, index) => (
                  <div key={item.id} className="relative p-4 border rounded-lg bg-slate-50/50 space-y-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <div className="pr-8">
                      <Label>Descrição</Label>
                      <Input 
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Ex: Licença Adobe..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Qtd</Label>
                        <Input 
                          type="number" 
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Preço Un.</Label>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Garantia</Label>
                        <Input 
                          value={item.warranty}
                          onChange={(e) => updateItem(item.id, 'warranty', e.target.value)}
                          placeholder="Ex: 1 Ano"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {data.items.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                    Nenhum item adicionado.<br/>Clique em "Adicionar" para começar.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Condições & Observações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Condições de Pagamento</Label>
                  <Input 
                    id="paymentTerms" 
                    value={data.paymentTerms} 
                    onChange={(e) => setData({...data, paymentTerms: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações Importantes</Label>
                  <Textarea 
                    id="notes" 
                    rows={5}
                    value={data.notes} 
                    onChange={(e) => setData({...data, notes: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Preview do Documento</h2>
              <Badge variant="secondary" className="font-normal text-xs">Atualização em tempo real</Badge>
            </div>
            
            <Card className="border-0 shadow-lg overflow-hidden bg-white print:shadow-none print:m-0 print:p-0">
              {/* Document Header */}
              <div className="bg-slate-900 text-white p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-heading text-3xl font-bold mb-1">PROPOSTA COMERCIAL</h2>
                    <p className="text-slate-400 font-medium">Ref: PROP-{new Date().getFullYear()}-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</p>
                  </div>
                  <div className="flex gap-4 items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    {/* Simulated Logos from the original sheet */}
                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-red-600 text-xl shadow-sm">A</div>
                    <div className="w-10 h-10 bg-white rounded flex flex-wrap items-center justify-center p-1.5 shadow-sm">
                      <div className="w-1/2 h-1/2 bg-[#f25022]"></div>
                      <div className="w-1/2 h-1/2 bg-[#7fba00]"></div>
                      <div className="w-1/2 h-1/2 bg-[#00a4ef]"></div>
                      <div className="w-1/2 h-1/2 bg-[#ffb900]"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Preparado para</p>
                    <p className="font-semibold text-lg">{data.contactName || "Nome do Cliente"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm mb-1">Emissão</p>
                    <p className="font-medium">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Items Table */}
                <div className="mb-8 rounded-lg overflow-hidden border">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="w-16 text-center font-semibold">Qtd</TableHead>
                        <TableHead className="font-semibold">Descrição</TableHead>
                        <TableHead className="font-semibold">Garantia</TableHead>
                        <TableHead className="text-right font-semibold">Preço Unit.</TableHead>
                        <TableHead className="text-right font-semibold">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.items.length > 0 ? (
                        data.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                            <TableCell>{item.description || "-"}</TableCell>
                            <TableCell className="text-muted-foreground">{item.warranty || "-"}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right font-medium text-slate-900">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Nenhum item inserido na proposta.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Total Section */}
                <div className="flex justify-end mb-10">
                  <div className="bg-slate-50 rounded-lg p-6 border w-64">
                    <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900">Total Geral</span>
                      <span className="font-heading font-bold text-xl text-primary">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-6 text-sm">
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg border">
                    <div>
                      <p className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" /> Data de Aniversário
                      </p>
                      <p className="text-muted-foreground">{data.anniversaryDate ? new Date(data.anniversaryDate).toLocaleDateString('pt-BR') : '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1 text-destructive">Validade da Proposta</p>
                      <p className="text-muted-foreground">{data.validityDate ? new Date(data.validityDate).toLocaleDateString('pt-BR') : '-'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2 border-b pb-2">Condições de Pagamento</h3>
                    <p className="text-muted-foreground leading-relaxed bg-yellow-50 text-yellow-900 p-3 rounded border border-yellow-200">
                      {data.paymentTerms || "Não especificado."}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2 border-b pb-2">Observações Adicionais</h3>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {data.notes || "Nenhuma observação adicional."}
                    </div>
                  </div>
                </div>
                
                {/* Footer Signature */}
                <div className="mt-16 pt-8 border-t flex justify-between items-end">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Proposify - Soluções em TI</p>
                    <p className="text-xs text-muted-foreground">São Paulo, {new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="text-center w-64">
                    <div className="border-t border-slate-300 mb-2"></div>
                    <p className="text-sm font-medium text-slate-900">Assinatura do Responsável</p>
                  </div>
                </div>

              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}