"use client"

import { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Shield,
  Star,
  Share2,
  ExternalLink
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNav from '../components/topNav';

export default function Social() {
  const [copied, setCopied] = useState(false);

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com',
      color: 'text-blue-600'
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: 'https://www.twitter.com',
      color: 'text-black dark:text-white'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com',
      color: 'text-pink-600'
    },
    {
      name: 'Youtube',
      icon: Youtube,
      url: 'https://www.youtube.com',
      color: 'text-red-600'
    }
  ];

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const url = window.location.origin;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TV Max Rio',
          text: 'Confira o app TV Max Rio!',
          url: url
        });
        toast.success('Compartilhado com sucesso!');
      } catch (error) {
        // Usuário cancelou o compartilhamento
      }
    } else {
      // Fallback: copiar para área de transferência
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Link copiado para a área de transferência!');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Erro ao copiar link');
      }
    }
  };

  const handleRateApp = () => {
    // Em produção, você pode redirecionar para a loja de apps
    toast.info('Em breve você poderá avaliar o app na loja!');
  };

  const handlePrivacy = () => {
    // Aqui você pode redirecionar para uma página de privacidade
    toast.info('Política de privacidade em breve!');
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-24 font-[Poppins] relative">
      <TopNav />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Social</h1>
          <p className="text-gray-400">Siga-nos nas redes sociais e entre em contato</p>
        </div>

        {/* Redes Sociais */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Redes Sociais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <button
                  key={social.name}
                  onClick={() => handleSocialClick(social.url)}
                  className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-gray-700 transition-all hover:bg-[#222222] group"
                >
                  <div className={`${social.color} group-hover:scale-110 transition-transform`}>
                    <Icon size={32} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-medium text-white">{social.name}</h3>
                    <p className="text-sm text-gray-400">Siga-nos</p>
                  </div>
                  <ExternalLink size={20} className="text-gray-400 group-hover:text-white" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Suporte */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Suporte</h2>
          <div className="space-y-3">
            <button
              onClick={handlePrivacy}
              className="w-full flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-gray-700 transition-all hover:bg-[#222222] group"
            >
              <Shield size={24} className="text-[#bc0000] group-hover:scale-110 transition-transform" />
              <div className="flex-1 text-left">
                <h3 className="text-lg font-medium text-white">Privacidade</h3>
                <p className="text-sm text-gray-400">Política de privacidade</p>
              </div>
              <ExternalLink size={20} className="text-gray-400 group-hover:text-white" />
            </button>

            <button
              onClick={handleRateApp}
              className="w-full flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-gray-700 transition-all hover:bg-[#222222] group"
            >
              <Star size={24} className="text-yellow-500 group-hover:scale-110 transition-transform" />
              <div className="flex-1 text-left">
                <h3 className="text-lg font-medium text-white">Nos Avalie</h3>
                <p className="text-sm text-gray-400">Avalie o app na loja</p>
              </div>
              <ExternalLink size={20} className="text-gray-400 group-hover:text-white" />
            </button>

            <button
              onClick={handleShare}
              className="w-full flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-gray-700 transition-all hover:bg-[#222222] group"
            >
              <Share2 size={24} className="text-[#bc0000] group-hover:scale-110 transition-transform" />
              <div className="flex-1 text-left">
                <h3 className="text-lg font-medium text-white">Compartilhar App</h3>
                <p className="text-sm text-gray-400">
                  {copied ? 'Link copiado!' : 'Compartilhe com seus amigos'}
                </p>
              </div>
              <Share2 size={20} className="text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </section>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
}

