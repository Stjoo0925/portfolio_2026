'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EditableText } from '@/components/EditableText';
import { useAdmin } from '@/providers/AdminProvider';
import type { Testimonial } from '@/lib/db';

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations('Testimonials');
  const { isEditMode } = useAdmin();

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <EditableText 
            content={t('title')} 
            isEditMode={isEditMode} 
            onSave={(val) => console.log('Save section title:', val)}
          />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ rotateY: 10, translateZ: 20 }}
              style={{ perspective: 1000 }}
            >
              <Card className="glass-dark border-primary/20 hover:border-primary/50 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    {item.avatar_url ? (
                      <img 
                        src={item.avatar_url} 
                        alt={item.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                        {item.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-lg font-semibold">{item.name}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic leading-relaxed">
                    <EditableText 
                      content={item.content} 
                      isEditMode={isEditMode} 
                      onSave={(val) => console.log(`Save quote ${item.id}:`, val)}
                    />
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
