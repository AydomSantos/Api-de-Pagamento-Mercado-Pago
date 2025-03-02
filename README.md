markdown
Copy
# API de Pagamento com Mercado Pago 💳

Uma aplicação Node.js/Express para processar pagamentos via Mercado Pago, com suporte a checkout transparente e pagamentos via QR Code.

## Pré-requisitos 📋
- Node.js v16+
- Conta no [Mercado Pago](https://www.mercadopago.com.br/)
- NPM/Yarn instalado
- Acesso ao terminal

## Configuração ⚙️

1. **Instalar dependências**
```bash
npm install
Variáveis de Ambiente (.env)

env
Copy
MP_ACCESS_TOKEN=SEU_ACCESS_TOKEN_DO_MERCADO_PAGO
PORT=3333
Estrutura Principal 📂
Copy
├── app.js            # Ponto de entrada da aplicação
├── package.json      # Dependências e scripts
└── .gitignore        # Arquivos ignorados pelo Git
Funcionalidades Chave 🔑
Integração com SDK oficial do Mercado Pago

Validação de dados de pagamento

Geração de QR Code e links de pagamento

Tratamento detalhado de erros

Uso da API 🚀
Endpoint Principal

Copy
POST /process-payment
Exemplo de Requisição

json
Copy
{
  "paymentMethodId": "pix",
  "payerEmail": "comprador@teste.com",
  "amount": 100.50,
  "description": "Pedido #123"
}
Resposta de Sucesso

json
Copy
{
  "success": true,
  "payment_id": 123456789,
  "status": "approved",
  "qr_code": "base64...",
  "ticket_url": "https://www.mercadopago.com.br/payment-link"
}
Iniciar Servidor ▶️
bash
Copy
npm start
# Ou para desenvolvimento
npm run dev
Solução de Problemas 🛠️
Token não carregado: Verifique o arquivo .env e as permissões da conta MP

Dados incompletos: Certifique-se de enviar todos campos obrigatórios

Timeout: Verifique a conexão com a API do Mercado Pago

Dependências Principais 📦
express: Framework web

mercadopago: SDK oficial de integração

cors: Middleware para CORS

dotenv: Gerenciamento de variáveis de ambiente

Licença 📄
MIT License - Livre para uso e modificação

Copy

Este README fornece uma visão geral completa com instruções de configuração, exemplos de uso e informações técnicas relevantes. Você pode personalizar os valores e descrições conforme necessário para seu caso específico.