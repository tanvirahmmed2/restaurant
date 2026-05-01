'use client'
import React, { useContext } from 'react'
import { Context } from '../context/Context'

const About = () => {
  const { siteData } = useContext(Context)
  return (
    <section className="w-full bg-white py-24 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className='inline-block w-fit px-4 py-1 bg-gray-100 text-gray-900 text-[10px] font-semibold uppercase tracking-widest rounded-full'>
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
            Crafting Culinary <br />
            <span className="text-gray-400 italic">Excellence Since 2010</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            {siteData?.business_name || "Grand Kitchen"} was born out of a passion for authentic flavors and a commitment to exceptional hospitality.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed font-medium">
              Every great meal begins with a story. Ours started with a simple dream — to create a place where food feels like home, flavors carry memories, and every guest is treated like family.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that great taste comes from honesty. That’s why we carefully select fresh ingredients, balance tradition with creativity, and cook every dish with attention and care. Each recipe reflects our roots, inspired by classic flavors and refined for today’s table.
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Our restaurant is more than just a place to eat — it’s a place to gather, celebrate, and slow down. From quiet dinners to joyful moments shared with friends and family, we’re honored to be part of your everyday memories.
            </p>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Philosophy</p>
              <p className="text-sm font-semibold text-gray-900 italic">"Simplicity is the ultimate sophistication."</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 rounded-xl border border-gray-50 hover:border-gray-200 transition-all group">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-3">Fresh Ingredients</h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">
              We use only the freshest and highest quality ingredients in every dish, sourced daily from local markets.
            </p>
          </div>

          <div className="p-8 bg-gray-50 rounded-xl border border-gray-50 hover:border-gray-200 transition-all group">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-3">Expert Chefs</h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">
              Our culinary team brings passion and years of experience to create unforgettable, high-end flavors.
            </p>
          </div>

          <div className="p-8 bg-gray-50 rounded-xl border border-gray-50 hover:border-gray-200 transition-all group">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-3">Minimalist Vibe</h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">
              A warm, focused, and welcoming space designed for intimate dinners and meaningful celebrations.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default About