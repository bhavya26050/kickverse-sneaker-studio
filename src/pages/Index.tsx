
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    text: "I've never owned shoes that feel so uniquely mine. The customization options are incredible and the quality is top-notch!",
    rating: 5,
  },
  {
    name: "Marcus Lee",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    text: "KickVerse takes sneaker shopping to a whole new level. I love how I can design exactly what I want and have it shipped to my door.",
    rating: 5,
  },
  {
    name: "Emma Wilson",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    text: "The attention to detail is incredible. My customized Air Force 1s get compliments everywhere I go!",
    rating: 4,
  },
];

const features = [
  {
    title: "Premium Materials",
    description: "We use only the highest quality materials for durability and comfort.",
    icon: "🌟",
  },
  {
    title: "Endless Customization",
    description: "Create truly unique sneakers with our extensive customization options.",
    icon: "🎨",
  },
  {
    title: "Fast Shipping",
    description: "Your custom sneakers delivered to your doorstep within 7-10 business days.",
    icon: "🚚",
  },
  {
    title: "Satisfaction Guarantee",
    description: "Love your new kicks or we'll make it right with our 30-day guarantee.",
    icon: "💯",
  },
];

const Index = () => {
  // Featured products (first 3 from our products data)
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-kickverse-dark-purple to-kickverse-purple py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-10 -top-10 w-[600px] h-[600px] bg-kickverse-light-purple rounded-full blur-3xl"></div>
          <div className="absolute -left-40 -bottom-40 w-[600px] h-[600px] bg-kickverse-light-purple rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Design Your Perfect <span className="text-kickverse-light-purple">Sneakers</span>
              </h1>
              <p className="text-lg text-gray-200 mb-8 max-w-xl">
                Express your unique style with customized Nike sneakers. Choose your colors, materials, and make them truly yours.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                  <Link to="/customize">Start Customizing</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-indigo-600 border-white hover:bg-white/10">
                  <Link to="/products">Shop Collection</Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <img
                src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5116e545-4d13-42b8-a396-ca05bee7c762/W+NIKE+V2K+RUN.png"
                alt="Custom Nike Sneakers"
                className="w-full h-auto object-contain max-w-lg mx-auto animate-fadeIn transform -rotate-12 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-kickverse-soft-grey">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-kickverse-dark-purple">Featured Sneakers</h2>
            <Button asChild variant="ghost" className="text-kickverse-purple">
              <Link to="/products" className="flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Customization Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0 order-2 md:order-1">
              <h2 className="text-3xl font-bold text-kickverse-dark-purple mb-6">
                Create Your Own Design
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Our customization tools let you choose from a wide range of colors, materials, and patterns. Make your sneakers as unique as you are.
              </p>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <span className="w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-md"></span>
                  <span className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-md"></span>
                  <span className="w-8 h-8 rounded-full bg-green-500 border-2 border-white shadow-md"></span>
                  <span className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-white shadow-md"></span>
                  <span className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white shadow-md"></span>
                  <span className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white shadow-md"></span>
                  <span className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white shadow-md"></span>
                  <span className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-md"></span>
                </div>
              </div>
              <Button asChild className="mt-8 bg-kickverse-purple hover:bg-kickverse-purple/80">
                <Link to="/customize">Start Designing</Link>
              </Button>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <img
                src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5116e545-4d13-42b8-a396-ca05bee7c762/W+NIKE+V2K+RUN.png"
                alt="Sneaker Customization"
                className="w-full h-auto object-contain max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-r from-kickverse-soft-grey to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-kickverse-dark-purple mb-12">
            Why Choose KickVerse
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-kickverse-dark-purple">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-kickverse-dark-purple mb-12">
            What Our Customers Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-kickverse-soft-grey rounded-lg p-6 shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4", 
                            i < testimonial.rating 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-kickverse-purple">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Create Your Dream Sneakers?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of satisfied customers and start your customization journey today.
          </p>
          <Button asChild size="lg" className="bg-white text-kickverse-purple hover:bg-gray-100">
            <Link to="/customize">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
