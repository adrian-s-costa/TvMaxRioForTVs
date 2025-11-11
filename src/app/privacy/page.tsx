export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen bg-[#141414] font-[Poppins] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#bc0000] mb-8">
          Política de Privacidade
        </h1>
        
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p className="mb-6">
            A TV Max Rio respeita sua privacidade e se compromete a proteger suas informações pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos seus dados quando você utiliza nosso aplicativo e website.
          </p>
          
          <p className="mb-8 font-semibold">
            Ao usar a TV Max Rio, você concorda com as práticas descritas nesta Política.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#bc0000] mb-4">
              1. Coleta de Informações
            </h2>
            <p className="mb-4">
              Podemos coletar os seguintes tipos de dados:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Informações fornecidas por você:</strong> nome, e-mail, telefone, CPF/CNPJ (quando aplicável), dados de pagamento e preferências de uso.
              </li>
              <li>
                <strong>Informações de uso:</strong> interações com conteúdos, páginas acessadas, tempo de navegação, cliques em anúncios.
              </li>
              <li>
                <strong>Dados do dispositivo:</strong> modelo, sistema operacional, identificadores únicos, endereço IP.
              </li>
              <li>
                <strong>Geolocalização:</strong> coletada somente com sua permissão, para envio de notificações e recomendações segmentadas.
              </li>
              <li>
                <strong>Cookies e tecnologias semelhantes:</strong> para lembrar preferências, medir desempenho e personalizar a experiência.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#bc0000] mb-4">
              2. Como Utilizamos as Informações
            </h2>
            <p className="mb-4">
              Utilizamos seus dados para:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Criar e gerenciar sua conta.</li>
              <li>Personalizar conteúdos, recomendações e anúncios exibidos.</li>
              <li>Oferecer serviços de geolocalização (quando autorizado).</li>
              <li>Garantir segurança, prevenção a fraudes e cumprimento de obrigações legais.</li>
              <li>Melhorar continuamente a experiência do usuário e a performance da plataforma.</li>
              <li>Realizar comunicações de suporte, notificações e atualizações.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#bc0000] mb-4">
              3. Compartilhamento de Dados
            </h2>
            <p className="mb-4 font-semibold">
              A TV Max Rio não vende dados pessoais.
            </p>
            <p className="mb-4">
              Podemos compartilhar informações apenas nos seguintes casos:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Prestadores de serviço:</strong> empresas de hospedagem, pagamentos, CRM e suporte técnico.
              </li>
              <li>
                <strong>Anunciantes e parceiros:</strong> dados de interação (de forma agregada ou segmentada, nunca sensível), para campanhas dentro da TV Max Rio Ads.
              </li>
              <li>
                <strong>Creators e especialistas:</strong> quando necessário para prestação de serviços contratados pelo usuário.
              </li>
              <li>
                <strong>Autoridades legais:</strong> quando houver obrigação legal ou ordem judicial.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#bc0000] mb-4">
              4. Retenção e Segurança
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Seus dados são armazenados em servidores seguros com protocolos de criptografia.</li>
              <li>Mantemos registros de acesso pelo período exigido pela lei (mínimo de 6 meses).</li>
              <li>Dados de cadastro permanecem enquanto sua conta estiver ativa ou conforme obrigações legais.</li>
              <li>Você pode solicitar a exclusão de seus dados a qualquer momento.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#bc0000] mb-4">
              5. Direitos do Usuário
            </h2>
            <p className="mb-4">
              Nos termos da LGPD (Lei nº 13.709/2018), você pode:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
              <li>Acessar, corrigir ou atualizar seus dados pessoais.</li>
              <li>Solicitar a exclusão ou portabilidade dos dados.</li>
              <li>Revogar consentimentos, como o uso de geolocalização ou envio de notificações.</li>
              <li>Restringir o tratamento de dados em determinadas finalidades.</li>
            </ul>
            <p className="mt-6">
              Para exercer seus direitos, entre em contato pelo e-mail: <a href="mailto:privacidade@tvmaxrio.com.br" className="text-[#bc0000] hover:underline font-semibold">privacidade@tvmaxrio.com.br</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

