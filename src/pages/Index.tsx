import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  type: 'stock' | 'crypto';
}

interface Prediction {
  id: string;
  asset: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  targetPrice: number;
  currentPrice: number;
  reason: string;
  timestamp: string;
}

interface Trade {
  id: string;
  asset: string;
  action: 'buy' | 'sell';
  price: number;
  quantity: number;
  date: string;
  profit: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const mockAssets: Asset[] = [
    { id: '1', name: 'Apple Inc.', symbol: 'AAPL', price: 178.25, change: 2.45, changePercent: 1.39, volume: '52.3M', type: 'stock' },
    { id: '2', name: 'Tesla', symbol: 'TSLA', price: 242.84, change: -5.12, changePercent: -2.07, volume: '98.7M', type: 'stock' },
    { id: '3', name: 'Bitcoin', symbol: 'BTC', price: 43250.00, change: 1250.00, changePercent: 2.98, volume: '$28.5B', type: 'crypto' },
    { id: '4', name: 'Ethereum', symbol: 'ETH', price: 2285.50, change: -45.30, changePercent: -1.94, volume: '$12.8B', type: 'crypto' },
    { id: '5', name: 'Microsoft', symbol: 'MSFT', price: 378.91, change: 4.23, changePercent: 1.13, volume: '24.1M', type: 'stock' },
    { id: '6', name: 'Solana', symbol: 'SOL', price: 98.75, change: 8.45, changePercent: 9.35, volume: '$2.1B', type: 'crypto' },
  ];

  const mockPredictions: Prediction[] = [
    {
      id: '1',
      asset: 'BTC',
      action: 'buy',
      confidence: 87,
      targetPrice: 45000,
      currentPrice: 43250,
      reason: 'Сильный технический паттерн, рост объемов покупок',
      timestamp: '2 часа назад'
    },
    {
      id: '2',
      asset: 'AAPL',
      action: 'hold',
      confidence: 72,
      targetPrice: 185,
      currentPrice: 178.25,
      reason: 'Консолидация перед квартальным отчетом',
      timestamp: '4 часа назад'
    },
    {
      id: '3',
      asset: 'SOL',
      action: 'buy',
      confidence: 91,
      targetPrice: 115,
      currentPrice: 98.75,
      reason: 'Прорыв уровня сопротивления, сильный momentum',
      timestamp: '1 час назад'
    },
    {
      id: '4',
      asset: 'TSLA',
      action: 'sell',
      confidence: 68,
      targetPrice: 230,
      currentPrice: 242.84,
      reason: 'Перекупленность, слабый спрос на поставки',
      timestamp: '6 часов назад'
    },
  ];

  const mockTrades: Trade[] = [
    { id: '1', asset: 'BTC', action: 'buy', price: 41000, quantity: 0.5, date: '2024-01-15', profit: 1125 },
    { id: '2', asset: 'AAPL', action: 'buy', price: 170, quantity: 10, date: '2024-01-10', profit: 82.5 },
    { id: '3', asset: 'ETH', action: 'sell', price: 2400, quantity: 2, date: '2024-01-08', profit: -228.6 },
    { id: '4', asset: 'MSFT', action: 'buy', price: 365, quantity: 5, date: '2024-01-05', profit: 69.55 },
    { id: '5', asset: 'SOL', action: 'buy', price: 85, quantity: 20, date: '2024-01-12', profit: 275 },
  ];

  const totalProfit = mockTrades.reduce((sum, trade) => sum + trade.profit, 0);
  const successRate = (mockTrades.filter(t => t.profit > 0).length / mockTrades.length * 100).toFixed(1);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-green-500';
      case 'sell': return 'text-red-500';
      case 'hold': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'buy': return 'bg-green-500/20 text-green-500 hover:bg-green-500/30';
      case 'sell': return 'bg-red-500/20 text-red-500 hover:bg-red-500/30';
      case 'hold': return 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="TrendingUp" className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">TradeAI</h1>
                <p className="text-sm text-muted-foreground">Умный анализ рынков</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon name="Settings" size={18} />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Bell" size={18} />
                <Badge className="ml-2 bg-destructive">3</Badge>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="predictions">
              <Icon name="Brain" size={16} className="mr-2" />
              Прогнозы
            </TabsTrigger>
            <TabsTrigger value="history">
              <Icon name="History" size={16} className="mr-2" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Всего активов</p>
                  <Icon name="Briefcase" className="text-primary" size={20} />
                </div>
                <p className="text-3xl font-bold">{mockAssets.length}</p>
                <p className="text-xs text-muted-foreground mt-1">3 акции • 3 крипто</p>
              </Card>

              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Общая прибыль</p>
                  <Icon name="TrendingUp" className="text-green-500" size={20} />
                </div>
                <p className="text-3xl font-bold text-green-500">${totalProfit.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">+12.4% за месяц</p>
              </Card>

              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Успешность</p>
                  <Icon name="Target" className="text-primary" size={20} />
                </div>
                <p className="text-3xl font-bold">{successRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">4 из 5 сделок в плюсе</p>
              </Card>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Активы в портфеле</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Icon name="Filter" size={16} className="mr-2" />
                    Фильтр
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockAssets.map((asset) => (
                  <Card
                    key={asset.id}
                    className="p-5 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{asset.symbol}</h3>
                          <Badge variant="outline" className="text-xs">
                            {asset.type === 'stock' ? '📈' : '₿'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{asset.name}</p>
                      </div>
                      <Icon 
                        name="ChevronRight" 
                        className="text-muted-foreground group-hover:text-primary transition-colors" 
                        size={20} 
                      />
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-2xl font-bold">${asset.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-sm font-medium ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {asset.change >= 0 ? '▲' : '▼'} ${Math.abs(asset.change).toFixed(2)}
                          </span>
                          <span className={`text-sm ${asset.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ({asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%)
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Объем: <span className="text-foreground font-medium">{asset.volume}</span>
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">AI Прогнозы</h2>
                <p className="text-sm text-muted-foreground">Рекомендации основаны на анализе 1000+ факторов</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Обновить
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockPredictions.map((pred) => (
                <Card 
                  key={pred.id} 
                  className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        pred.action === 'buy' ? 'bg-green-500/10' : 
                        pred.action === 'sell' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                      }`}>
                        <span className="text-2xl">
                          {pred.action === 'buy' ? '📈' : pred.action === 'sell' ? '📉' : '⏸️'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{pred.asset}</h3>
                        <p className="text-sm text-muted-foreground">{pred.timestamp}</p>
                      </div>
                    </div>
                    <Badge className={getActionBadge(pred.action)}>
                      {pred.action === 'buy' ? 'ПОКУПАТЬ' : pred.action === 'sell' ? 'ПРОДАВАТЬ' : 'ДЕРЖАТЬ'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Текущая цена</span>
                      <span className="font-bold">${pred.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Целевая цена</span>
                      <span className={`font-bold ${getActionColor(pred.action)}`}>
                        ${pred.targetPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Уверенность AI</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="font-bold text-primary">{pred.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <Icon name="Sparkles" size={14} className="text-primary" />
                      Причина
                    </p>
                    <p className="text-sm">{pred.reason}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Icon name="TrendingUp" className="text-green-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Прибыльные сделки</p>
                    <p className="text-2xl font-bold text-green-500">
                      {mockTrades.filter(t => t.profit > 0).length}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  +${mockTrades.filter(t => t.profit > 0).reduce((s, t) => s + t.profit, 0).toFixed(2)}
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Icon name="TrendingDown" className="text-red-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Убыточные сделки</p>
                    <p className="text-2xl font-bold text-red-500">
                      {mockTrades.filter(t => t.profit < 0).length}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${mockTrades.filter(t => t.profit < 0).reduce((s, t) => s + t.profit, 0).toFixed(2)}
                </p>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold">История сделок</h2>
                <p className="text-sm text-muted-foreground">Последние {mockTrades.length} транзакций</p>
              </div>
              <div className="divide-y divide-border">
                {mockTrades.map((trade) => (
                  <div key={trade.id} className="p-5 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          trade.action === 'buy' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          <Icon 
                            name={trade.action === 'buy' ? 'ArrowUpRight' : 'ArrowDownRight'} 
                            className={trade.action === 'buy' ? 'text-green-500' : 'text-red-500'} 
                            size={20} 
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{trade.asset}</h3>
                            <Badge variant="outline" className={`text-xs ${
                              trade.action === 'buy' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
                            }`}>
                              {trade.action === 'buy' ? 'ПОКУПКА' : 'ПРОДАЖА'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {trade.quantity} × ${trade.price} • {new Date(trade.date).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((trade.profit / (trade.price * trade.quantity)) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;