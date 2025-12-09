import json
import urllib.request
import urllib.error
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получает актуальные данные о ценах акций и криптовалюты с публичных API
    Args: event - dict с httpMethod, queryStringParameters (symbols - список тикеров)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с данными о ценах и изменениях
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    symbols_param = params.get('symbols', 'BTC,ETH,SOL,AAPL,TSLA,MSFT')
    symbols = [s.strip() for s in symbols_param.split(',')]
    
    crypto_symbols = [s for s in symbols if s.upper() in ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'AVAX', 'MATIC', 'DOT']]
    stock_symbols = [s for s in symbols if s not in crypto_symbols]
    
    result = []
    
    for symbol in crypto_symbols:
        try:
            url = f'https://api.coingecko.com/api/v3/simple/price?ids={get_coin_id(symbol)}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true'
            
            req = urllib.request.Request(url)
            req.add_header('User-Agent', 'Mozilla/5.0')
            
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode())
                
                coin_id = get_coin_id(symbol)
                if coin_id in data:
                    coin_data = data[coin_id]
                    price = coin_data.get('usd', 0)
                    change_24h = coin_data.get('usd_24h_change', 0)
                    volume = coin_data.get('usd_24h_vol', 0)
                    
                    result.append({
                        'symbol': symbol.upper(),
                        'name': get_crypto_name(symbol),
                        'price': round(price, 2),
                        'change': round(price * change_24h / 100, 2),
                        'changePercent': round(change_24h, 2),
                        'volume': format_volume(volume),
                        'type': 'crypto'
                    })
        except Exception as e:
            result.append({
                'symbol': symbol.upper(),
                'name': get_crypto_name(symbol),
                'price': 0,
                'change': 0,
                'changePercent': 0,
                'volume': 'N/A',
                'type': 'crypto',
                'error': str(e)
            })
    
    for symbol in stock_symbols:
        try:
            url = f'https://query1.finance.yahoo.com/v8/finance/chart/{symbol.upper()}'
            
            req = urllib.request.Request(url)
            req.add_header('User-Agent', 'Mozilla/5.0')
            
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode())
                
                if 'chart' in data and 'result' in data['chart'] and len(data['chart']['result']) > 0:
                    quote = data['chart']['result'][0]
                    meta = quote.get('meta', {})
                    
                    price = meta.get('regularMarketPrice', 0)
                    prev_close = meta.get('previousClose', price)
                    change = price - prev_close
                    change_percent = (change / prev_close * 100) if prev_close else 0
                    
                    result.append({
                        'symbol': symbol.upper(),
                        'name': meta.get('longName', symbol.upper()),
                        'price': round(price, 2),
                        'change': round(change, 2),
                        'changePercent': round(change_percent, 2),
                        'volume': format_volume(meta.get('regularMarketVolume', 0)),
                        'type': 'stock'
                    })
        except Exception as e:
            result.append({
                'symbol': symbol.upper(),
                'name': symbol.upper(),
                'price': 0,
                'change': 0,
                'changePercent': 0,
                'volume': 'N/A',
                'type': 'stock',
                'error': str(e)
            })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'data': result,
            'timestamp': context.request_id
        }),
        'isBase64Encoded': False
    }

def get_coin_id(symbol: str) -> str:
    mapping = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'SOL': 'solana',
        'BNB': 'binancecoin',
        'XRP': 'ripple',
        'ADA': 'cardano',
        'DOGE': 'dogecoin',
        'AVAX': 'avalanche-2',
        'MATIC': 'matic-network',
        'DOT': 'polkadot'
    }
    return mapping.get(symbol.upper(), symbol.lower())

def get_crypto_name(symbol: str) -> str:
    names = {
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum',
        'SOL': 'Solana',
        'BNB': 'Binance Coin',
        'XRP': 'Ripple',
        'ADA': 'Cardano',
        'DOGE': 'Dogecoin',
        'AVAX': 'Avalanche',
        'MATIC': 'Polygon',
        'DOT': 'Polkadot'
    }
    return names.get(symbol.upper(), symbol.upper())

def format_volume(volume: float) -> str:
    if volume >= 1_000_000_000:
        return f'${volume / 1_000_000_000:.1f}B'
    elif volume >= 1_000_000:
        return f'{volume / 1_000_000:.1f}M'
    else:
        return f'{volume:,.0f}'
