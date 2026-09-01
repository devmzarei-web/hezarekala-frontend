import { SITE_URL } from "@/lib/env";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "هزاره کالا دانش اروند",
    alternateName: "هزاره کالا",
    description:
      "طراحی، ساخت و تولید پمپ‌های سانتریفیوژ، پیستونی و دنده‌ای برای صنایع نفت، گاز، پتروشیمی و نیروگاهی",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logohezare.png`,
    image: `${SITE_URL}/images/og-image.jpg`,
    foundingDate: "2019-04-10",
    founders: [
      {
        "@type": "Person",
        name: "سیدمحمود دانش پور",
        jobTitle: "مدیرعامل",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "IR",
      addressRegion: "خوزستان",
      addressLocality: "آبادان",
      streetAddress: "شهرک صنعتی آبادان، خیابان اروند۱، کوچه فرعی ۶",
      postalCode: "6315774987",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+98-916-631-0631",
        email: "info@hezarehkala.com",
        contactType: "sales",
        availableLanguage: ["Persian", "English"],
      },
    ],
    sameAs: [],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "پمپ‌های صنعتی",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "پمپ سانتریفیوژ صنعتی",
            description: "پمپ‌های سانتریفیوژ فشار قوی برای صنایع نفت، گاز و پتروشیمی",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "پمپ دنده‌ای صنعتی",
            description: "پمپ‌های دنده‌ای با دقت بالا برای سیالات ویسکوز",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "پمپ پیستونی صنعتی",
            description: "پمپ‌های پیستونی رفت و برگشتی فشار بالا",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}