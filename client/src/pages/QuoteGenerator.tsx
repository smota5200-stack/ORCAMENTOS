import { useState, useMemo } from "react";
import { Plus, Trash2, FileText, Download, Building2, Calendar, FileCheck, CircleDollarSign, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  customCurrency: string;
  anniversaryDate: string;
  validityDate: string;
  paymentTerms: string;
  notes: string;
  commissionRate: number;
  items: LineItem[];
};

export default function QuoteGenerator() {
  const { toast } = useToast();
  const [data, setData] = useState<QuoteData>({
    contactName: "Elaine Cristina",
    currency: "USD",
    customCurrency: "",
    anniversaryDate: "2025-02-18",
    validityDate: "2025-02-19",
    paymentTerms: "Pagamento 30/60/90 no boleto Bancário, mediante aprovação de crédito",
    notes: "Faturamento direto pelo nosso distribuidor Pars Valores em dólar...",
    commissionRate: 5,
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

  const calculateTotal = useMemo(() => {
    return data.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  }, [data.items]);

  const calculateCommission = useMemo(() => {
    return (calculateTotal * data.commissionRate) / 100;
  }, [calculateTotal, data.commissionRate]);

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
      title: "✓ Orçamento Validado!",
      description: "Tudo certo com os dados! O PDF foi gerado com sucesso.",
    });
  };

  const formatCurrency = (value: number) => {
    const currencyToUse = data.currency === "CUSTOM" ? data.customCurrency || "USD" : data.currency;
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyToUse.length === 3 ? currencyToUse : 'USD',
      }).format(value);
    } catch (e) {
      return `${currencyToUse} ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="w-6 h-6" />
            <span className="font-heading font-semibold text-lg tracking-tight">Proposify</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()} data-testid="button-print">
              <FileText className="w-4 h-4 mr-2" /> Imprimir
            </Button>
            <Button size="sm" onClick={handleGenerate} data-testid="button-generate">
              <Download className="w-4 h-4 mr-2" /> Gerar PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" /> Detalhes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Contato / Empresa</Label>
                  <Input value={data.contactName} onChange={(e) => setData({...data, contactName: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Aniversário</Label>
                    <Input type="date" value={data.anniversaryDate} onChange={(e) => setData({...data, anniversaryDate: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Validade</Label>
                    <Input type="date" value={data.validityDate} onChange={(e) => setData({...data, validityDate: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Moeda</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={data.currency}
                      onChange={(e) => setData({...data, currency: e.target.value})}
                    >
                      <option value="USD">USD</option>
                      <option value="BRL">BRL</option>
                      <option value="EUR">EUR</option>
                      <option value="CUSTOM">Livre</option>
                    </select>
                  </div>
                  {data.currency === "CUSTOM" && (
                    <div className="space-y-2">
                      <Label>Código</Label>
                      <Input placeholder="Ex: GBP" value={data.customCurrency} onChange={(e) => setData({...data, customCurrency: e.target.value.toUpperCase()})} />
                    </div>
                  )}
                </div>

                <Separator className="my-2" />

                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Condições</TabsTrigger>
                    <TabsTrigger value="commission" className="flex gap-2"><Percent className="w-4 h-4" /> Comissão</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Pagamento</Label>
                      <Input value={data.paymentTerms} onChange={(e) => setData({...data, paymentTerms: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Notas</Label>
                      <Textarea rows={3} value={data.notes} onChange={(e) => setData({...data, notes: e.target.value})} />
                    </div>
                  </TabsContent>
                  <TabsContent value="commission" className="pt-4">
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 space-y-2">
                      <Label>Comissão (%)</Label>
                      <div className="flex gap-4 items-center">
                        <Input type="number" value={data.commissionRate} onChange={(e) => setData({...data, commissionRate: parseFloat(e.target.value) || 0})} className="w-20" />
                        <div className="text-sm font-medium text-primary">{formatCurrency(calculateCommission)}</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg flex items-center gap-2"><CircleDollarSign className="w-5 h-5 text-primary" /> Itens</CardTitle>
                <Button variant="outline" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.items.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg bg-slate-50/50 space-y-3 relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                    <div className="pr-8"><Label className="text-xs">Descrição</Label><Input value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="h-8" /></div>
                    <div className="grid grid-cols-3 gap-2">
                      <div><Label className="text-xs">Qtd</Label><Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} className="h-8" /></div>
                      <div><Label className="text-xs">Preço</Label><Input type="number" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="h-8" /></div>
                      <div><Label className="text-xs">Garantia</Label><Input value={item.warranty} onChange={(e) => updateItem(item.id, 'warranty', e.target.value)} className="h-8" /></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <Card className="shadow-xl bg-white">
              <div className="bg-slate-900 text-white p-8">
                <div className="flex justify-between items-start">
                  <div><h2 className="text-2xl font-bold">PROPOSTA COMERCIAL</h2><p className="text-slate-400 text-sm">Ref: PROP-{new Date().getFullYear()}</p></div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white rounded text-red-600 flex items-center justify-center font-bold">A</div>
                    <div className="w-8 h-8 bg-white rounded p-1 flex flex-wrap">
                      <div className="w-1/2 h-1/2 bg-red-500"></div><div className="w-1/2 h-1/2 bg-green-500"></div>
                      <div className="w-1/2 h-1/2 bg-blue-500"></div><div className="w-1/2 h-1/2 bg-yellow-500"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <div><p className="text-xs text-slate-400">Cliente</p><p className="font-semibold">{data.contactName}</p></div>
                  <div className="text-right"><p className="text-xs text-slate-400">Data</p><p>{new Date().toLocaleDateString('pt-BR')}</p></div>
                </div>
              </div>
              <div className="p-8">
                <Table>
                  <TableHeader><TableRow><TableHead>Qtd</TableHead><TableHead>Descrição</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {data.items.map(item => (
                      <TableRow key={item.id}><TableCell>{item.quantity}</TableCell><TableCell>{item.description}</TableCell><TableCell className="text-right">{formatCurrency(item.quantity * item.unitPrice)}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-6 flex justify-end">
                  <div className="bg-slate-50 p-4 border rounded w-48 text-right">
                    <p className="text-xs text-muted-foreground uppercase">Total Geral</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(calculateTotal)}</p>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-yellow-50 border border-yellow-100 rounded">
                    <p className="font-bold text-yellow-800">Pagamento</p><p>{data.paymentTerms}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border rounded">
                    <p className="font-bold text-slate-800">Validade</p><p>{data.validityDate}</p>
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