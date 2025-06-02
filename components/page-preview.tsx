"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Menu, Search, User, ShoppingCart, Mail, Star, Shield, CheckCircle, Award } from "lucide-react"

interface PagePreviewProps {
  settings: {
    layout: string
    colorScheme: string
    typography: string
    headerStyle: string
    credibilityElements: string
  }
  isGenerating: boolean
}

export function PagePreview({ settings, isGenerating }: PagePreviewProps) {
  console.log("PagePreview renderizando com configurações:", settings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Log para depuração
    console.log("PagePreview useEffect - settings alteradas:", settings)

    // Simulate loading when settings change
    if (isGenerating) {
      setIsLoading(true)
    } else {
      // Short delay to simulate rendering
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [settings, isGenerating])

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div
            className={`inline-block animate-spin h-12 w-12 border-t-4 border-b-4 ${
              settings.colorScheme === "blue"
                ? "border-blue-500"
                : settings.colorScheme === "purple"
                  ? "border-purple-500"
                  : "border-green-500"
            } rounded-full mb-4`}
          ></div>
          <p
            className={`${
              settings.colorScheme === "blue"
                ? "text-blue-500"
                : settings.colorScheme === "purple"
                  ? "text-purple-500"
                  : "text-green-500"
            } ${
              settings.typography === "classic"
                ? "font-serif"
                : settings.typography === "dynamic"
                  ? "font-mono"
                  : "font-sans"
            } animate-pulse`}
          >
            Gerando visualização...
          </p>
        </div>
      </div>
    )
  }

  // Get font classes based on typography
  const getFontClasses = () => {
    switch (settings.typography) {
      case "classic":
        return {
          heading: "font-serif",
          body: "font-serif",
        }
      case "dynamic":
        return {
          heading: "font-sans font-bold",
          body: "font-mono",
        }
      case "modern":
      default:
        return {
          heading: "font-sans",
          body: "font-sans",
        }
    }
  }

  const fonts = getFontClasses()

  // Render scarcity bar if headerStyle is scarcity
  const renderScarcityBar = () => {
    if (settings.headerStyle !== "scarcity") return null

    return (
      <div
        className={`w-full py-2 px-4 text-center text-white font-bold text-sm ${
          settings.colorScheme === "blue"
            ? "bg-red-600"
            : settings.colorScheme === "purple"
              ? "bg-red-600"
              : "bg-red-600"
        } flex items-center justify-center`}
      >
        <span className="mr-2">🔥</span>
        <span className={`${fonts.body} uppercase tracking-wide`}>
          ESQUENTA BLACK FRIDAY + FRETE GRÁTIS PARA TODO BRASIL
        </span>
        <span className="ml-2">🔥</span>
      </div>
    )
  }

  // Render header based on header style
  const renderHeader = () => {
    // Render the base header
    let baseHeader = null

    switch (settings.headerStyle) {
      case "hero":
        baseHeader = (
          <div
            className={`${
              settings.colorScheme === "blue"
                ? "bg-blue-800"
                : settings.colorScheme === "purple"
                  ? "bg-purple-800"
                  : "bg-green-800"
            } p-12 relative overflow-hidden`}
            style={{
              backgroundImage: "url('/placeholder.svg?height=400&width=1200')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  settings.colorScheme === "blue"
                    ? "linear-gradient(135deg, rgba(30,64,175,0.9) 0%, rgba(37,99,235,0.8) 100%)"
                    : settings.colorScheme === "purple"
                      ? "linear-gradient(135deg, rgba(126,34,206,0.9) 0%, rgba(168,85,247,0.8) 100%)"
                      : "linear-gradient(135deg, rgba(22,163,74,0.9) 0%, rgba(34,197,94,0.8) 100%)",
              }}
            ></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <span className={`text-sm ${fonts.body} text-white font-medium`}>
                  Solução Completa para Seu Negócio
                </span>
              </div>
              <h1 className={`text-4xl ${fonts.heading} font-bold text-white mb-4 drop-shadow-md`}>
                Transforme Seu Negócio com Inteligência Artificial
              </h1>
              <p className={`${fonts.body} text-white/90 mb-8 text-lg max-w-2xl mx-auto`}>
                Descubra como a IA pode revolucionar sua empresa e multiplicar seus resultados com nossa plataforma
                exclusiva
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className={`px-6 py-3 rounded-lg ${
                    settings.colorScheme === "blue"
                      ? "bg-white text-blue-700"
                      : settings.colorScheme === "purple"
                        ? "bg-white text-purple-700"
                        : "bg-white text-green-700"
                  } ${fonts.body} font-bold flex items-center justify-center shadow-lg hover:shadow-xl transition-all`}
                >
                  Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button
                  className={`px-6 py-3 rounded-lg border-2 border-white/70 bg-transparent text-white ${fonts.body} flex items-center justify-center hover:bg-white/10 transition-all`}
                >
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
        )
        break
      case "video":
        baseHeader = (
          <div className="relative h-[500px] overflow-hidden">
            <div
              className={`absolute inset-0 ${
                settings.colorScheme === "blue"
                  ? "bg-blue-900"
                  : settings.colorScheme === "purple"
                    ? "bg-purple-900"
                    : "bg-green-900"
              } flex items-center justify-center`}
            >
              {/* Simulação de vídeo com elementos animados */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${Math.random() * 100 + 50}px`,
                        height: `${Math.random() * 100 + 50}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background:
                          settings.colorScheme === "blue"
                            ? "radial-gradient(circle, rgba(59,130,246,0.7) 0%, rgba(29,78,216,0) 70%)"
                            : settings.colorScheme === "purple"
                              ? "radial-gradient(circle, rgba(168,85,247,0.7) 0%, rgba(126,34,206,0) 70%)"
                              : "radial-gradient(circle, rgba(34,197,94,0.7) 0%, rgba(22,163,74,0) 70%)",
                        animation: `pulse ${Math.random() * 5 + 5}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 cursor-pointer hover:bg-white/30 transition-all z-10">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[24px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-4">
                  <div
                    className={`h-1 w-12 ${
                      settings.colorScheme === "blue"
                        ? "bg-blue-400"
                        : settings.colorScheme === "purple"
                          ? "bg-purple-400"
                          : "bg-green-400"
                    } mr-4`}
                  ></div>
                  <span className={`text-sm ${fonts.body} text-white/80 uppercase tracking-wider font-medium`}>
                    Apresentação Exclusiva
                  </span>
                </div>
                <h1 className={`text-5xl ${fonts.heading} font-bold text-white mb-4 leading-tight`}>
                  Domine o Poder
                  <br />
                  da Inteligência Artificial
                </h1>
                <p className={`${fonts.body} text-white/90 text-xl max-w-2xl`}>
                  Vídeo exclusivo: Como usar ChatGPT para multiplicar sua renda e transformar seu negócio em uma máquina
                  de resultados
                </p>
                <button
                  className={`mt-8 px-8 py-4 rounded-lg ${
                    settings.colorScheme === "blue"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : settings.colorScheme === "purple"
                        ? "bg-purple-500 hover:bg-purple-600"
                        : "bg-green-500 hover:bg-green-600"
                  } text-white ${fonts.body} font-bold text-lg flex items-center`}
                >
                  Assistir Agora <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )
        break
      case "minimal":
      case "scarcity":
      default:
        baseHeader = (
          <div
            className={`${
              settings.colorScheme === "blue" ? "bg-white" : settings.colorScheme === "purple" ? "bg-white" : "bg-white"
            } shadow-sm`}
          >
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-md ${
                      settings.colorScheme === "blue"
                        ? "bg-blue-600"
                        : settings.colorScheme === "purple"
                          ? "bg-purple-600"
                          : "bg-green-600"
                    } flex items-center justify-center text-white font-bold`}
                  >
                    AI
                  </div>
                  <span
                    className={`ml-3 ${fonts.heading} font-bold text-xl ${
                      settings.colorScheme === "blue"
                        ? "text-blue-600"
                        : settings.colorScheme === "purple"
                          ? "text-purple-600"
                          : "text-green-600"
                    }`}
                  >
                    AIRevenue
                  </span>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                  <a
                    href="#"
                    className={`${fonts.body} font-medium ${
                      settings.colorScheme === "blue"
                        ? "text-blue-900"
                        : settings.colorScheme === "purple"
                          ? "text-purple-900"
                          : "text-green-900"
                    }`}
                  >
                    Início
                  </a>
                  <a
                    href="#"
                    className={`${fonts.body} text-gray-600 hover:${
                      settings.colorScheme === "blue"
                        ? "text-blue-600"
                        : settings.colorScheme === "purple"
                          ? "text-purple-600"
                          : "text-green-600"
                    } transition-colors`}
                  >
                    Serviços
                  </a>
                  <a
                    href="#"
                    className={`${fonts.body} text-gray-600 hover:${
                      settings.colorScheme === "blue"
                        ? "text-blue-600"
                        : settings.colorScheme === "purple"
                          ? "text-purple-600"
                          : "text-green-600"
                    } transition-colors`}
                  >
                    Sobre
                  </a>
                  <a
                    href="#"
                    className={`${fonts.body} text-gray-600 hover:${
                      settings.colorScheme === "blue"
                        ? "text-blue-600"
                        : settings.colorScheme === "purple"
                          ? "text-purple-600"
                          : "text-green-600"
                    } transition-colors`}
                  >
                    Contato
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      settings.colorScheme === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : settings.colorScheme === "purple"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-green-600 hover:bg-green-700"
                    } text-white ${fonts.body} font-medium transition-colors`}
                  >
                    Começar
                  </button>
                  <Menu className="md:hidden h-6 w-6 text-gray-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        )
        break
    }

    // Combine scarcity bar with base header if needed
    return (
      <div>
        {renderScarcityBar()}
        {baseHeader}
      </div>
    )
  }

  // Render testimonials section
  const renderTestimonials = () => {
    if (settings.credibilityElements !== "testimonials") return null

    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2
              className={`text-2xl ${fonts.heading} font-bold ${
                settings.colorScheme === "blue"
                  ? "text-blue-600"
                  : settings.colorScheme === "purple"
                    ? "text-purple-600"
                    : "text-green-600"
              } mb-2`}
            >
              O QUE NOSSOS CLIENTES DIZEM
            </h2>
            <p className={`${fonts.body} text-gray-600 max-w-2xl mx-auto`}>
              Veja como nossa solução tem transformado negócios e gerado resultados reais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Carlos Silva",
                company: "Empresa Tech",
                text: "Implementei a solução há apenas 2 meses e já tive um aumento de 43% nas vendas. O suporte é excelente e a plataforma é muito intuitiva.",
                rating: 5,
              },
              {
                name: "Ana Oliveira",
                company: "Marketing Digital",
                text: "Economizei mais de 20 horas por semana automatizando processos com esta ferramenta. O retorno sobre o investimento foi quase imediato.",
                rating: 5,
              },
              {
                name: "Roberto Santos",
                company: "E-commerce",
                text: "A melhor decisão que tomei para o meu negócio. A implementação foi rápida e os resultados superaram todas as minhas expectativas.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? settings.colorScheme === "blue"
                            ? "text-yellow-400"
                            : settings.colorScheme === "purple"
                              ? "text-yellow-400"
                              : "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill={i < testimonial.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className={`${fonts.body} text-gray-700 mb-4`}>"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      settings.colorScheme === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : settings.colorScheme === "purple"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-green-100 text-green-600"
                    } flex items-center justify-center font-bold mr-3`}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`${fonts.body} font-medium text-gray-900`}>{testimonial.name}</p>
                    <p className={`${fonts.body} text-sm text-gray-500`}>{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className={`${fonts.body} text-gray-500 mb-4`}>Junte-se a mais de 10.000 clientes satisfeitos</p>
            <div className="flex flex-wrap justify-center gap-8">
              {["Empresa A", "Empresa B", "Empresa C", "Empresa D", "Empresa E"].map((company, index) => (
                <div
                  key={index}
                  className="h-12 flex items-center justify-center text-gray-400 font-bold text-xl opacity-50"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render products section
  const renderProducts = () => {
    if (settings.credibilityElements !== "products") return null

    return (
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2
              className={`text-2xl ${fonts.heading} font-bold ${
                settings.colorScheme === "blue"
                  ? "text-blue-600"
                  : settings.colorScheme === "purple"
                    ? "text-purple-600"
                    : "text-green-600"
              } mb-2`}
            >
              NOSSOS PRODUTOS EM DESTAQUE
            </h2>
            <p className={`${fonts.body} text-gray-600 max-w-2xl mx-auto`}>
              Soluções completas para impulsionar seu negócio com inteligência artificial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Plano Starter",
                price: "R$ 97/mês",
                description: "Ideal para empreendedores iniciantes que querem automatizar tarefas básicas",
                features: ["Acesso a 50+ templates de IA", "Suporte por email", "Até 100 gerações por mês"],
                popular: false,
              },
              {
                name: "Plano Profissional",
                price: "R$ 197/mês",
                description: "Perfeito para negócios em crescimento que precisam de mais recursos e personalização",
                features: [
                  "Acesso a 200+ templates de IA",
                  "Suporte prioritário",
                  "Até 500 gerações por mês",
                  "Personalização avançada",
                ],
                popular: true,
              },
              {
                name: "Plano Enterprise",
                price: "R$ 497/mês",
                description: "Solução completa para empresas que buscam escalabilidade e recursos ilimitados",
                features: [
                  "Acesso a todos os templates",
                  "Suporte 24/7 dedicado",
                  "Gerações ilimitadas",
                  "API personalizada",
                  "Treinamento exclusivo",
                ],
                popular: false,
              },
            ].map((product, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden border ${
                  product.popular
                    ? settings.colorScheme === "blue"
                      ? "border-blue-500 shadow-lg"
                      : settings.colorScheme === "purple"
                        ? "border-purple-500 shadow-lg"
                        : "border-green-500 shadow-lg"
                    : "border-gray-200"
                } transition-all hover:shadow-xl`}
              >
                {product.popular && (
                  <div
                    className={`py-2 text-center text-white text-sm font-medium ${
                      settings.colorScheme === "blue"
                        ? "bg-blue-600"
                        : settings.colorScheme === "purple"
                          ? "bg-purple-600"
                          : "bg-green-600"
                    }`}
                  >
                    MAIS POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className={`text-xl ${fonts.heading} font-bold text-gray-900 mb-2`}>{product.name}</h3>
                  <p
                    className={`text-3xl font-bold mb-4 ${
                      settings.colorScheme === "blue"
                        ? "text-blue-600"
                        : settings.colorScheme === "purple"
                          ? "text-purple-600"
                          : "text-green-600"
                    }`}
                  >
                    {product.price}
                  </p>
                  <p className={`${fonts.body} text-gray-600 mb-6`}>{product.description}</p>

                  <ul className="space-y-3 mb-6">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle
                          className={`h-5 w-5 ${
                            settings.colorScheme === "blue"
                              ? "text-blue-500"
                              : settings.colorScheme === "purple"
                                ? "text-purple-500"
                                : "text-green-500"
                          } mr-2 flex-shrink-0 mt-0.5`}
                        />
                        <span className={`${fonts.body} text-gray-700`}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg ${
                      product.popular
                        ? settings.colorScheme === "blue"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : settings.colorScheme === "purple"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    } ${fonts.body} font-medium transition-colors`}
                  >
                    Começar Agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render security seals section
  const renderSecuritySeals = () => {
    if (settings.credibilityElements !== "security") return null

    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2
              className={`text-2xl ${fonts.heading} font-bold ${
                settings.colorScheme === "blue"
                  ? "text-blue-600"
                  : settings.colorScheme === "purple"
                    ? "text-purple-600"
                    : "text-green-600"
              } mb-2`}
            >
              COMPRE COM SEGURANÇA
            </h2>
            <p className={`${fonts.body} text-gray-600 max-w-2xl mx-auto`}>
              Sua satisfação e segurança são nossas prioridades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Garantia de 30 Dias",
                description:
                  "Se você não estiver completamente satisfeito com nossos produtos, devolvemos 100% do seu dinheiro.",
                icon: <Award className="h-10 w-10" />,
              },
              {
                title: "Pagamento Seguro",
                description:
                  "Todas as transações são processadas com criptografia de ponta a ponta para proteger seus dados.",
                icon: <Shield className="h-10 w-10" />,
              },
              {
                title: "Suporte Premium",
                description: "Nossa equipe de suporte está disponível para ajudar você em todas as etapas do processo.",
                icon: <User className="h-10 w-10" />,
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    settings.colorScheme === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : settings.colorScheme === "purple"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.icon}
                </div>
                <h3 className={`text-lg ${fonts.heading} font-bold text-gray-900 mb-2`}>{item.title}</h3>
                <p className={`${fonts.body} text-gray-600`}>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h3 className={`text-lg ${fonts.heading} font-bold text-gray-900 mb-2`}>
                  Certificações e Selos de Segurança
                </h3>
                <p className={`${fonts.body} text-gray-600`}>
                  Nosso site utiliza as mais avançadas tecnologias de segurança e é certificado pelas principais
                  autoridades do mercado.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-3 w-24 h-16">
                  <div className="text-gray-500 font-bold text-xs text-center">SSL SECURE</div>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-3 w-24 h-16">
                  <div className="text-gray-500 font-bold text-xs text-center">PCI COMPLIANT</div>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-3 w-24 h-16">
                  <div className="text-gray-500 font-bold text-xs text-center">NORTON SECURE</div>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-3 w-24 h-16">
                  <div className="text-gray-500 font-bold text-xs text-center">TRUSTED SITE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render content based on layout
  const renderContent = () => {
    let content = null

    switch (settings.layout) {
      case "minimal":
        content = (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h2 className={`text-2xl ${fonts.heading} font-bold text-gray-800 mb-4`}>
                Soluções Simples e Eficientes
              </h2>
              <p className={`${fonts.body} text-gray-600 max-w-2xl mx-auto`}>
                Descubra como nossa abordagem minimalista pode trazer resultados extraordinários para o seu negócio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-lg">
                  <div
                    className={`w-12 h-12 rounded-full ${
                      settings.colorScheme === "blue"
                        ? "bg-blue-600"
                        : settings.colorScheme === "purple"
                          ? "bg-purple-600"
                          : "bg-green-600"
                    } flex items-center justify-center text-white mb-4`}
                  >
                    {i === 1 ? (
                      <Search className="h-6 w-6" />
                    ) : i === 2 ? (
                      <User className="h-6 w-6" />
                    ) : (
                      <Mail className="h-6 w-6" />
                    )}
                  </div>
                  <h3 className={`${fonts.heading} font-bold text-gray-800 mb-2`}>Recurso {i}</h3>
                  <p className={`${fonts.body} text-gray-600 text-sm`}>
                    Uma descrição simples e direta do recurso, focando nos benefícios principais.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
        break
      case "bold":
        content = (
          <div className="px-4 py-12">
            <div
              className={`${
                settings.colorScheme === "blue"
                  ? "bg-blue-800"
                  : settings.colorScheme === "purple"
                    ? "bg-purple-800"
                    : "bg-green-800"
              } rounded-2xl p-8 mb-12 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20"></div>

              <div className="relative z-10 max-w-3xl">
                <h2 className={`text-3xl ${fonts.heading} font-bold text-white mb-4`}>Destaque-se da Concorrência</h2>
                <p className={`${fonts.body} text-white/80 mb-6`}>
                  Com nosso design arrojado e estratégias inovadoras, seu negócio será impossível de ignorar.
                </p>
                <button className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded">
                  Explorar Soluções
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-100 rounded-2xl p-8 relative overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${
                    settings.colorScheme === "blue"
                      ? "bg-blue-600"
                      : settings.colorScheme === "purple"
                        ? "bg-purple-600"
                        : "bg-green-600"
                  } opacity-10 rounded-full -mr-16 -mt-16`}
                ></div>
                <h3 className={`text-xl ${fonts.heading} font-bold text-gray-800 mb-3 relative z-10`}>
                  Estratégia Digital
                </h3>
                <p className={`${fonts.body} text-gray-600 relative z-10`}>
                  Desenvolvemos estratégias personalizadas que amplificam sua presença online e maximizam resultados.
                </p>
              </div>

              <div className="bg-gray-900 rounded-2xl p-8 relative overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${
                    settings.colorScheme === "blue"
                      ? "bg-blue-600"
                      : settings.colorScheme === "purple"
                        ? "bg-purple-600"
                        : "bg-green-600"
                  } opacity-20 rounded-full -mr-16 -mt-16`}
                ></div>
                <h3 className={`text-xl ${fonts.heading} font-bold text-white mb-3 relative z-10`}>
                  Automação Inteligente
                </h3>
                <p className={`${fonts.body} text-white/80 relative z-10`}>
                  Automatize processos e multiplique sua produtividade com nossas soluções baseadas em IA.
                </p>
              </div>
            </div>
          </div>
        )
        break
      case "modern":
      default:
        content = (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className={`text-3xl ${fonts.heading} font-bold text-gray-800 mb-4`}>
                  Transforme Ideias em Resultados
                </h2>
                <p className={`${fonts.body} text-gray-600 mb-6`}>
                  Nossa plataforma combina inteligência artificial avançada com estratégias comprovadas para ajudar você
                  a alcançar seus objetivos de negócio.
                </p>
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded ${
                      settings.colorScheme === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : settings.colorScheme === "purple"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-green-600 hover:bg-green-700"
                    } text-white ${fonts.body}`}
                  >
                    Começar Agora
                  </button>
                  <button
                    className={`px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 ${fonts.body}`}
                  >
                    Saiba Mais
                  </button>
                </div>
              </div>
              <div className="relative h-64 md:h-80">
                <div
                  className={`absolute inset-0 rounded-lg bg-gray-200 flex items-center justify-center text-white text-xl font-bold`}
                ></div>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3
                className={`text-xl ${fonts.heading} font-bold ${
                  settings.colorScheme === "blue"
                    ? "text-blue-500"
                    : settings.colorScheme === "purple"
                      ? "text-purple-500"
                      : "text-green-500"
                } mb-2`}
              >
                NOSSOS SERVIÇOS
              </h3>
              <h2 className={`text-3xl ${fonts.heading} font-bold text-gray-800 mb-4`}>
                Soluções Completas para Seu Negócio
              </h2>
              <p className={`${fonts.body} text-gray-600 max-w-2xl mx-auto`}>
                Oferecemos um conjunto abrangente de ferramentas e serviços para impulsionar seu crescimento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div
                    className={`w-12 h-12 rounded-lg ${
                      settings.colorScheme === "blue"
                        ? "bg-blue-600"
                        : settings.colorScheme === "purple"
                          ? "bg-purple-600"
                          : "bg-green-600"
                    } flex items-center justify-center text-white mb-4`}
                  >
                    {i === 1 ? (
                      <Search className="h-6 w-6" />
                    ) : i === 2 ? (
                      <User className="h-6 w-6" />
                    ) : (
                      <ShoppingCart className="h-6 w-6" />
                    )}
                  </div>
                  <h3 className={`${fonts.heading} font-bold text-gray-800 mb-2`}>Serviço {i}</h3>
                  <p className={`${fonts.body} text-gray-600 mb-4`}>
                    Uma descrição detalhada do serviço e como ele pode beneficiar seu negócio de forma concreta.
                  </p>
                  <a
                    href="#"
                    className={`${fonts.body} ${
                      settings.colorScheme === "blue"
                        ? "text-blue-400"
                        : settings.colorScheme === "purple"
                          ? "text-purple-400"
                          : "text-green-400"
                    } font-medium flex items-center`}
                  >
                    Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )
        break
    }

    // Adicionar elementos de credibilidade após o conteúdo principal
    return (
      <>
        {content}
        {renderTestimonials()}
        {renderProducts()}
        {renderSecuritySeals()}
      </>
    )
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-lg">
      {renderHeader()}
      {renderContent()}
    </div>
  )
}
