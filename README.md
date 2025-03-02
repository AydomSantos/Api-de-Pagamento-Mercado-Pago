<h1 class="code-line" data-line-start=1 data-line-end=2 ><a id="API_de_Pagamento_com_Mercado_Pago__1"></a>API de Pagamento com Mercado Pago 💳</h1>
<p class="has-line-data" data-line-start="3" data-line-end="4">Uma aplicação Node.js/Express para processar pagamentos via Mercado Pago, com suporte a checkout transparente e pagamentos via QR Code.</p>
<h2 class="code-line" data-line-start=5 data-line-end=6 ><a id="Prrequisitos__5"></a>Pré-requisitos 📋</h2>
<ul>
<li class="has-line-data" data-line-start="6" data-line-end="7">Node.js v16+</li>
<li class="has-line-data" data-line-start="7" data-line-end="8">Conta no <a href="https://www.mercadopago.com.br/">Mercado Pago</a></li>
<li class="has-line-data" data-line-start="8" data-line-end="9">NPM/Yarn instalado</li>
<li class="has-line-data" data-line-start="9" data-line-end="11">Acesso ao terminal</li>
</ul>
<h2 class="code-line" data-line-start=11 data-line-end=12 ><a id="Configurao__11"></a>Configuração ⚙️</h2>
<ol>
<li class="has-line-data" data-line-start="13" data-line-end="14"><strong>Instalar dependências</strong></li>
</ol>
<pre><code class="has-line-data" data-line-start="15" data-line-end="89" class="language-bash">npm install
Variáveis de Ambiente (.env)

env

MP_ACCESS_TOKEN=SEU_ACCESS_TOKEN_DO_MERCADO_PAGO
PORT=<span class="hljs-number">3333</span>
Estrutura Principal 📂

├── app.js            <span class="hljs-comment"># Ponto de entrada da aplicação</span>
├── package.json      <span class="hljs-comment"># Dependências e scripts</span>
└── .gitignore        <span class="hljs-comment"># Arquivos ignorados pelo Git</span>
Funcionalidades Chave 🔑
Integração com SDK oficial <span class="hljs-keyword">do</span> Mercado Pago

Validação de dados de pagamento

Geração de QR Code e links de pagamento

Tratamento detalhado de erros

Uso da API 🚀
Endpoint Principal


POST /process-payment
Exemplo de Requisição

json

{
  <span class="hljs-string">"paymentMethodId"</span>: <span class="hljs-string">"pix"</span>,
  <span class="hljs-string">"payerEmail"</span>: <span class="hljs-string">"comprador@teste.com"</span>,
  <span class="hljs-string">"amount"</span>: <span class="hljs-number">100.50</span>,
  <span class="hljs-string">"description"</span>: <span class="hljs-string">"Pedido #123"</span>
}
Resposta de Sucesso

json

{
  <span class="hljs-string">"success"</span>: <span class="hljs-literal">true</span>,
  <span class="hljs-string">"payment_id"</span>: <span class="hljs-number">123456789</span>,
  <span class="hljs-string">"status"</span>: <span class="hljs-string">"approved"</span>,
  <span class="hljs-string">"qr_code"</span>: <span class="hljs-string">"base64..."</span>,
  <span class="hljs-string">"ticket_url"</span>: <span class="hljs-string">"https://www.mercadopago.com.br/payment-link"</span>
}
Iniciar Servidor ▶️
bash

npm start
<span class="hljs-comment"># Ou para desenvolvimento</span>
npm run dev
Solução de Problemas 🛠️
Token não carregado: Verifique o arquivo .env e as permissões da conta MP

Dados incompletos: Certifique-se de enviar todos campos obrigatórios

Timeout: Verifique a conexão com a API <span class="hljs-keyword">do</span> Mercado Pago

Dependências Principais 📦
express: Framework web

mercadopago: SDK oficial de integração

cors: Middleware para CORS

dotenv: Gerenciamento de variáveis de ambiente

Licença 📄
MIT License - Livre para uso e modificação

Este README fornece uma visão geral completa com instruções de configuração, exemplos de uso e informações técnicas relevantes.
Você pode personalizar os valores e descrições conforme necessário para seu caso específico.
</code></pre>
